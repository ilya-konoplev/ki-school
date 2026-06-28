/**
 * Создание пользователя (родителя или администратора) в Supabase.
 *
 * Запуск:
 *   node --env-file=.env.local scripts/create-user.mjs \
 *     --username admin --password "надёжный-пароль" --name "Илья" --admin
 *
 *   node --env-file=.env.local scripts/create-user.mjs \
 *     --username ivanova-anna --password "пароль" --name "Анна Иванова"
 *
 * Флаг --admin делает пользователя администратором.
 */
import { createClient } from "@supabase/supabase-js";

const getArg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
};
const hasFlag = (name) => process.argv.includes(`--${name}`);

const username = getArg("username");
const password = getArg("password");
const fullName = getArg("name") ?? null;
const isAdmin = hasFlag("admin");

if (!username || !password) {
  console.error(
    'Использование: node --env-file=.env.local scripts/create-user.mjs --username ЛОГИН --password ПАРОЛЬ [--name "Имя"] [--admin]',
  );
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error(
    "Не заданы NEXT_PUBLIC_SUPABASE_URL и/или SUPABASE_SERVICE_ROLE_KEY в .env.local",
  );
  process.exit(1);
}

const DOMAIN = "parents.ki-school.local";
const login = username.trim().toLowerCase();
const email = `${login}@${DOMAIN}`;

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { username: login, full_name: fullName, is_admin: isAdmin },
});

if (error) {
  console.error("Ошибка создания пользователя:", error.message);
  process.exit(1);
}

console.log(
  `✓ Создан ${isAdmin ? "администратор" : "родитель"}: «${login}» (id: ${data.user.id})`,
);
