import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

/**
 * Вход по логину: Supabase Auth работает с email, поэтому логин превращается
 * в технический email вида `логин@parents.ki-school.local`. Родитель вводит
 * только логин, преобразование происходит на сервере.
 */
export const PARENT_EMAIL_DOMAIN = "parents.ki-school.local";

export function usernameToEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${PARENT_EMAIL_DOMAIN}`;
}

/** Подключён ли Supabase (заданы ли ключи). До подключения вход отключён. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export type SessionUser = {
  id: string;
  username: string;
  fullName: string | null;
  isAdmin: boolean;
};

/** Текущий вошедший пользователь и его профиль, либо null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) return null;

  return {
    id: user.id,
    username: profile.username,
    fullName: profile.full_name,
    isAdmin: profile.is_admin,
  };
}

/** Требует вошедшего родителя; иначе — на страницу входа. */
export async function requireParent(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

/** Требует вошедшего администратора; иначе — на страницу входа. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || !user.isAdmin) redirect("/login");
  return user;
}
