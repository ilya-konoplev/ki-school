-- ────────────────────────────────────────────────────────────────────────────
-- ki-school — редактируемый контент (услуги и отзывы) для админки (п.7)
-- Применяется после 0001_init.sql
-- ────────────────────────────────────────────────────────────────────────────

-- Услуги — гибкий список (задел на будущее, см. ТЗ §10).
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null,
  points jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Отзывы (перенос с profi.ru вручную).
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  meta text,
  body text not null,
  rating int check (rating between 1 and 5),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ── RLS: читать может любой, менять — только админ ───────────────────────────
alter table public.services enable row level security;
alter table public.reviews enable row level security;

create policy "services_public_read" on public.services
  for select using (true);
create policy "services_admin_write" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

create policy "reviews_public_read" on public.reviews
  for select using (true);
create policy "reviews_admin_write" on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

-- ── Начальное наполнение из значений по умолчанию ────────────────────────────
insert into public.services (slug, title, summary, points, sort_order) values
  (
    'oge-physics',
    'Подготовка к ОГЭ по физике',
    'Полный разбор всех тем экзамена: от механики до квантовых явлений, с упором на типовые задания и эксперимент.',
    '["Разбор каждого задания ОГЭ по кодификатору","Решение задач и работа с формулами до автоматизма","Подготовка к экспериментальному заданию (задание 17)","Регулярные пробники в формате реального экзамена"]'::jsonb,
    1
  ),
  (
    'oge-math',
    'Подготовка к ОГЭ по математике',
    'Алгебра и геометрия, реальная математика и текстовые задачи — уверенно закрываем и первую, и вторую часть.',
    '["Систематическое прохождение всех разделов программы","Отработка вычислений, уравнений, функций и геометрии","Текстовые задачи и задания с практическим содержанием","Пробные варианты и работа над ошибками"]'::jsonb,
    2
  ),
  (
    'school-grades',
    'Повышение школьной оценки по физике и математике',
    'Помогаю догнать программу, разобраться в сложных темах и подтянуть текущую оценку в школе.',
    '["Объяснение тем, которые «прошли мимо» в школе","Помощь с домашними заданиями и контрольными","Заполнение пробелов и выстраивание системы знаний","Возвращение уверенности на уроках"]'::jsonb,
    3
  );

insert into public.reviews (author, meta, body, rating, sort_order) values
  ('Анна', 'мама ученика, 9 класс', 'Сын занимался физикой перед ОГЭ. За полгода подтянул предмет с тройки до уверенной пятёрки. Илья объясняет спокойно и понятно, ребёнок перестал бояться физики.', 5, 1),
  ('Дмитрий', 'ученик, 9 класс', 'Готовился к ОГЭ по математике. Разобрали все темы по порядку, много решали вариантов. На экзамене не было ни одной неожиданной задачи.', 5, 2),
  ('Марина', 'мама ученицы, 8 класс', 'Обратились, чтобы подтянуть оценку по математике. Дочка стала понимать материал и сама тянуться к занятиям. Очень довольны подходом.', 5, 3);

-- Редактируемые тексты страниц хранятся в site_settings под ключом 'texts'
-- (jsonb-объект). Значения по умолчанию берутся из кода, в БД хранятся только
-- изменённые поля.
