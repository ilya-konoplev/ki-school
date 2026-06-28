import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase-клиент с сервисным ключом – только для серверных админ-операций
 * (создание родителей и учеников, и т.п.). Обходит RLS, поэтому используется
 * ИСКЛЮЧИТЕЛЬНО на сервере и никогда не попадает в браузер.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
