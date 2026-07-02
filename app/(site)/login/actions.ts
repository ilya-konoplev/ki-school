"use server";

import { redirect } from "next/navigation";
import {
  homePathForRole,
  isSupabaseConfigured,
  usernameToEmail,
  type Role,
} from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Введите логин и пароль." };
  }
  if (!isSupabaseConfigured()) {
    return {
      error:
        "База данных пока не подключена. Вход заработает после настройки Supabase.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  });

  if (error || !data.user) {
    return { error: "Неверный логин или пароль." };
  }

  // Роль определяет, куда направить после входа. Колонки role может не быть
  // (миграция 0003 не применена) — тогда ориентируемся на is_admin.
  const withRole = await supabase
    .from("profiles")
    .select("is_admin, role")
    .eq("id", data.user.id)
    .maybeSingle();

  let role: Role;
  if (withRole.data) {
    const r = withRole.data.role;
    role =
      r === "admin" || r === "parent" || r === "student"
        ? r
        : withRole.data.is_admin
          ? "admin"
          : "parent";
  } else {
    const { data: p2 } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .maybeSingle();
    role = p2?.is_admin ? "admin" : "parent";
  }

  redirect(homePathForRole(role));
}

export async function logout() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
