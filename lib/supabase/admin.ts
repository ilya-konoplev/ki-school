import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase-клиент с сервисным ключом – только для серверных админ-операций
 * (создание родителей и учеников, и т.п.). Обходит RLS, поэтому используется
 * ИСКЛЮЧИТЕЛЬНО на сервере и никогда не попадает в браузер.
 */
export function createAdminClient() {
  // .trim() — на случай, если в переменную окружения попал лишний пробел/перенос.
  return createClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim(),
    (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim(),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

/**
 * Определяет тип ключа Supabase, чтобы подсказать, если вставлен не тот.
 * Возвращает роль из JWT ('anon' | 'service_role') или тип нового ключа.
 */
export function describeSupabaseKey(key: string | undefined): string {
  const k = (key ?? "").trim();
  if (!k) return "missing";
  if (k.startsWith("sb_secret_")) return "service_role";
  if (k.startsWith("sb_publishable_")) return "anon";
  const parts = k.split(".");
  if (parts.length === 3) {
    try {
      const json = Buffer.from(
        parts[1].replace(/-/g, "+").replace(/_/g, "/"),
        "base64",
      ).toString("utf8");
      return JSON.parse(json).role ?? "unknown";
    } catch {
      return "unknown";
    }
  }
  return "unknown";
}
