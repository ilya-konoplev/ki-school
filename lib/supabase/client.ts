import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase-клиент для использования в браузере (клиентские компоненты).
 * Переменные окружения задаются в .env.local (см. .env.local.example).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
