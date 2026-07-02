import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

/**
 * Вход по логину: Supabase Auth работает с email, поэтому логин превращается
 * в технический email вида `логин@parents.ki-school.local`. Пользователь
 * (родитель или ученик) вводит только логин, преобразование — на сервере.
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

export type Role = "admin" | "parent" | "student";

export type SessionUser = {
  id: string;
  username: string;
  fullName: string | null;
  isAdmin: boolean;
  role: Role;
};

function normalizeRole(role: unknown, isAdmin: boolean): Role {
  if (role === "admin" || role === "parent" || role === "student") return role;
  return isAdmin ? "admin" : "parent";
}

/** Текущий вошедший пользователь и его профиль, либо null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Сначала пытаемся прочитать роль; если колонки ещё нет (миграция 0003 не
  // применена) — читаем без неё и выводим роль из is_admin.
  const withRole = await supabase
    .from("profiles")
    .select("username, full_name, is_admin, role")
    .eq("id", user.id)
    .maybeSingle();

  if (withRole.data) {
    const p = withRole.data;
    return {
      id: user.id,
      username: p.username,
      fullName: p.full_name,
      isAdmin: p.is_admin,
      role: normalizeRole(p.role, p.is_admin),
    };
  }

  const { data: p2 } = await supabase
    .from("profiles")
    .select("username, full_name, is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!p2) return null;

  return {
    id: user.id,
    username: p2.username,
    fullName: p2.full_name,
    isAdmin: p2.is_admin,
    role: p2.is_admin ? "admin" : "parent",
  };
}

/** Домашний маршрут пользователя по его роли. */
export function homePathForRole(role: Role): string {
  if (role === "admin") return "/admin";
  if (role === "student") return "/student";
  return "/cabinet";
}

/** Требует вошедшего родителя; ученика уводит в его кабинет, гостя – на вход. */
export async function requireParent(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role === "student") redirect("/student");
  return user;
}

/** Требует вошедшего ученика; иначе – в его домашний раздел или на вход. */
export async function requireStudent(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect(homePathForRole(user.role));
  return user;
}

/** Требует вошедшего администратора; иначе – на страницу входа. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || !user.isAdmin) redirect("/login");
  return user;
}
