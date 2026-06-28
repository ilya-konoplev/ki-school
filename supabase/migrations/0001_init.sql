-- ────────────────────────────────────────────────────────────────────────────
-- ki-school – начальная схема базы данных
-- Применяется в Supabase: SQL Editor → New query → вставить → Run
-- (или через Supabase CLI: supabase db push)
-- ────────────────────────────────────────────────────────────────────────────

-- ── Таблицы ──────────────────────────────────────────────────────────────────

-- Профили пользователей (родители и админы), 1:1 с auth.users.
-- Вход по логину: username хранится здесь, в auth.users почта техническая.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Ученики (дети). Привязаны к родителю.
create table public.students (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles (id) on delete cascade,
  full_name text not null,
  exam_date date,                       -- дата ОГЭ конкретного ученика (для счётчика)
  created_at timestamptz not null default now()
);

-- Прогресс по темам. Каталог тем – в коде (lib/content/materials.ts),
-- здесь хранится ссылка на тему по предмету и slug.
create table public.progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  subject text not null check (subject in ('physics', 'math')),
  topic_slug text not null,
  completed_on date not null default current_date,
  created_at timestamptz not null default now(),
  unique (student_id, subject, topic_slug)
);

-- Занятия (расписание/история). Ближайшее будущее = «следующее занятие».
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  scheduled_at timestamptz not null,
  note text,
  created_at timestamptz not null default now()
);

-- Ежемесячные комментарии репетитора по ученику.
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- Заявки с формы «Контакты».
create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Гибкие настройки сайта: дата публичного счётчика, редактируемые тексты и т.п.
create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Значение по умолчанию для публичного счётчика на главной (п.6).
insert into public.site_settings (key, value) values
  ('public_exam_date', '"2027-05-31"'::jsonb)
on conflict (key) do nothing;

-- ── Индексы ──────────────────────────────────────────────────────────────────
create index students_parent_id_idx on public.students (parent_id);
create index progress_student_id_idx on public.progress (student_id);
create index lessons_student_id_idx on public.lessons (student_id);
create index comments_student_id_idx on public.comments (student_id);

-- ── Функции и триггеры ───────────────────────────────────────────────────────

-- Проверка прав администратора. SECURITY DEFINER, чтобы не было рекурсии RLS.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- Автосоздание профиля при создании пользователя (метаданные приходят из admin API).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', new.email),
    new.raw_user_meta_data ->> 'full_name',
    coalesce((new.raw_user_meta_data ->> 'is_admin')::boolean, false)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.progress enable row level security;
alter table public.lessons enable row level security;
alter table public.comments enable row level security;
alter table public.contact_requests enable row level security;
alter table public.site_settings enable row level security;

-- profiles: пользователь видит свой профиль; админ – все; пишет только админ.
create policy "profiles_read" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_admin_write" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- students: родитель видит своих детей; админ – всё.
create policy "students_read" on public.students
  for select using (parent_id = auth.uid() or public.is_admin());
create policy "students_admin_write" on public.students
  for all using (public.is_admin()) with check (public.is_admin());

-- progress: родитель видит прогресс своих детей; пишет админ.
create policy "progress_read" on public.progress
  for select using (
    public.is_admin() or exists (
      select 1 from public.students s
      where s.id = progress.student_id and s.parent_id = auth.uid()
    )
  );
create policy "progress_admin_write" on public.progress
  for all using (public.is_admin()) with check (public.is_admin());

-- lessons: родитель видит занятия своих детей; пишет админ.
create policy "lessons_read" on public.lessons
  for select using (
    public.is_admin() or exists (
      select 1 from public.students s
      where s.id = lessons.student_id and s.parent_id = auth.uid()
    )
  );
create policy "lessons_admin_write" on public.lessons
  for all using (public.is_admin()) with check (public.is_admin());

-- comments: родитель видит комментарии по своим детям; пишет админ.
create policy "comments_read" on public.comments
  for select using (
    public.is_admin() or exists (
      select 1 from public.students s
      where s.id = comments.student_id and s.parent_id = auth.uid()
    )
  );
create policy "comments_admin_write" on public.comments
  for all using (public.is_admin()) with check (public.is_admin());

-- contact_requests: оставить заявку может любой; читает/меняет только админ.
create policy "contact_insert_any" on public.contact_requests
  for insert with check (true);
create policy "contact_admin_read" on public.contact_requests
  for select using (public.is_admin());
create policy "contact_admin_update" on public.contact_requests
  for update using (public.is_admin()) with check (public.is_admin());
create policy "contact_admin_delete" on public.contact_requests
  for delete using (public.is_admin());

-- site_settings: читать может любой (публичный счётчик); менять – админ.
create policy "settings_public_read" on public.site_settings
  for select using (true);
create policy "settings_admin_write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());
