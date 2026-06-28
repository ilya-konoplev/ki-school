# Supabase – база данных ki-school

## 1. Создать проект

1. Зайдите на [supabase.com](https://supabase.com), создайте проект (бесплатного
   тарифа достаточно).
2. Откройте **Project Settings → API** и скопируйте:
   - `Project URL` → в `.env.local` как `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` ключ → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` ключ (секретный!) → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Применить схему

Откройте **SQL Editor → New query**, вставьте содержимое
[`migrations/0001_init.sql`](migrations/0001_init.sql) и нажмите **Run**.
Затем так же примените [`migrations/0002_admin_content.sql`](migrations/0002_admin_content.sql).

Будут созданы таблицы: `profiles`, `students`, `progress`, `lessons`,
`comments`, `contact_requests`, `site_settings` (0001) и `services`, `reviews`
(0002) с начальным наполнением, политики доступа (RLS), функция проверки админа
и автосоздание профиля при регистрации.

## 3. Создать первого администратора

В терминале, из корня проекта:

```bash
node --env-file=.env.local scripts/create-user.mjs \
  --username admin --password "надёжный-пароль" --name "Илья" --admin
```

Создать родителя (без `--admin`):

```bash
node --env-file=.env.local scripts/create-user.mjs \
  --username ivanova-anna --password "пароль" --name "Анна Иванова"
```

После этого вход на `/login` будет работать. Дальше родителей и учеников
удобнее создавать прямо в админ-панели (`/admin`), скрипт нужен только для
первого администратора.

## Как устроен вход

Вход – по **логину**, не по email. Supabase Auth требует email, поэтому логин
внутри превращается в технический адрес `логин@parents.ki-school.local`
(см. `lib/auth.ts`). Родитель вводит только логин и пароль. Сессия хранится в
защищённых cookie и продлевается автоматически (`middleware.ts`), поэтому
повторно логиниться не нужно.
