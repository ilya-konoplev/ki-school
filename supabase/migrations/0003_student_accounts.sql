-- ────────────────────────────────────────────────────────────────────────────
-- ki-school — аккаунты учеников (вход ученика по логину/паролю)
-- Применяется после 0001 и 0002.
-- ────────────────────────────────────────────────────────────────────────────

-- Роль профиля: администратор / родитель / ученик.
alter table public.profiles
  add column if not exists role text not null default 'parent';

-- Проставляем роли существующим: админам — 'admin', остальные остаются 'parent'.
update public.profiles set role = 'admin' where is_admin = true;

alter table public.profiles
  drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('admin', 'parent', 'student'));

-- Связь записи ученика с его аккаунтом входа (может быть пустой — ученик без логина).
alter table public.students
  add column if not exists auth_user_id uuid unique
  references auth.users (id) on delete set null;

-- Триггер автосоздания профиля теперь учитывает роль из метаданных.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, is_admin, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', new.email),
    new.raw_user_meta_data ->> 'full_name',
    coalesce((new.raw_user_meta_data ->> 'is_admin')::boolean, false),
    coalesce(new.raw_user_meta_data ->> 'role', 'parent')
  );
  return new;
end;
$$;

-- ── RLS: ученик видит свою запись, прогресс, занятия и комментарии ────────────

drop policy if exists "students_read" on public.students;
create policy "students_read" on public.students
  for select using (
    parent_id = auth.uid() or auth_user_id = auth.uid() or public.is_admin()
  );

drop policy if exists "progress_read" on public.progress;
create policy "progress_read" on public.progress
  for select using (
    public.is_admin() or exists (
      select 1 from public.students s
      where s.id = progress.student_id
        and (s.parent_id = auth.uid() or s.auth_user_id = auth.uid())
    )
  );

drop policy if exists "lessons_read" on public.lessons;
create policy "lessons_read" on public.lessons
  for select using (
    public.is_admin() or exists (
      select 1 from public.students s
      where s.id = lessons.student_id
        and (s.parent_id = auth.uid() or s.auth_user_id = auth.uid())
    )
  );

drop policy if exists "comments_read" on public.comments;
create policy "comments_read" on public.comments
  for select using (
    public.is_admin() or exists (
      select 1 from public.students s
      where s.id = comments.student_id
        and (s.parent_id = auth.uid() or s.auth_user_id = auth.uid())
    )
  );
