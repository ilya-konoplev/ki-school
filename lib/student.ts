import "server-only";
import { getDashboard, type Dashboard } from "./cabinet";
import { createClient } from "./supabase/server";

/**
 * Находит запись ученика, привязанную к аккаунту (auth_user_id), и возвращает
 * его дашборд. Обёрнуто в try/catch на случай, если миграция 0003 (колонка
 * auth_user_id) ещё не применена.
 */
export async function getStudentDashboardForUser(
  userId: string,
): Promise<Dashboard | null> {
  const supabase = await createClient();

  let studentId: string | null = null;
  try {
    const { data } = await supabase
      .from("students")
      .select("id")
      .eq("auth_user_id", userId)
      .maybeSingle();
    studentId = data?.id ?? null;
  } catch {
    return null;
  }

  if (!studentId) return null;
  return getDashboard(studentId);
}
