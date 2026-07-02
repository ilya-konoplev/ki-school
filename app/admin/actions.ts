"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, usernameToEmail } from "@/lib/auth";
import { createAdminClient, describeSupabaseKey } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/** Результат формы для показа плашки «сохранено / ошибка». */
export type AdminResult = { ok?: boolean; error?: string };

// ── Родители ────────────────────────────────────────────────────────────────

export type CreateParentState = { error?: string };

export async function createParent(
  _prev: CreateParentState,
  formData: FormData,
): Promise<CreateParentState> {
  await requireAdmin();

  const keyKind = describeSupabaseKey(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (keyKind === "missing") {
    return {
      error:
        "Не задан служебный ключ Supabase (SUPABASE_SERVICE_ROLE_KEY). Добавьте его в переменные окружения на Vercel (для Production) и сделайте Redeploy.",
    };
  }
  if (keyKind !== "service_role") {
    return {
      error:
        "В переменную SUPABASE_SERVICE_ROLE_KEY вставлен НЕ тот ключ (похоже, публичный anon). Нужен секретный service_role: Supabase → Project Settings → API → ключ с пометкой «service_role / secret» → Reveal → скопировать целиком. Затем заменить значение на Vercel и сделать Redeploy.",
    };
  }

  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();

  if (!username || !password) {
    return { error: "Логин и пароль обязательны." };
  }
  if (password.length < 6) {
    return { error: "Пароль должен быть не короче 6 символов." };
  }
  if (!/^[a-z0-9_.-]+$/.test(username)) {
    return {
      error: "Логин: только латинские буквы, цифры, точка, дефис, подчёркивание.",
    };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email: usernameToEmail(username),
    password,
    email_confirm: true,
    user_metadata: { username, full_name: fullName || null, is_admin: false },
  });

  if (error) {
    return {
      error: error.message.includes("already")
        ? "Родитель с таким логином уже существует."
        : `Не удалось создать родителя: ${error.message}`,
    };
  }

  revalidatePath("/admin/parents");
  redirect("/admin/parents");
}

export async function deleteParent(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    const admin = createAdminClient();
    // Сначала удаляем аккаунты входа привязанных учеников (если заведены).
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("students")
        .select("auth_user_id")
        .eq("parent_id", id);
      for (const row of data ?? []) {
        if (row.auth_user_id) await admin.auth.admin.deleteUser(row.auth_user_id);
      }
    } catch {
      /* колонки auth_user_id ещё нет — пропускаем */
    }
    await admin.auth.admin.deleteUser(id);
  }
  revalidatePath("/admin/parents");
  redirect("/admin/parents");
}

// ── Ученики ─────────────────────────────────────────────────────────────────

export async function createStudent(formData: FormData): Promise<AdminResult> {
  await requireAdmin();
  const parentId = String(formData.get("parent_id") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const examDate = String(formData.get("exam_date") ?? "").trim();
  if (!parentId || !fullName) return { error: "Укажите имя ученика." };

  const supabase = await createClient();
  const { error } = await supabase.from("students").insert({
    parent_id: parentId,
    full_name: fullName,
    exam_date: examDate || null,
  });
  if (error) return { error: "Не удалось добавить ученика." };

  revalidatePath("/admin/parents");
  return { ok: true };
}

export async function updateStudent(formData: FormData): Promise<AdminResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const examDate = String(formData.get("exam_date") ?? "").trim();
  if (!id || !fullName) return { error: "Укажите имя ученика." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("students")
    .update({ full_name: fullName, exam_date: examDate || null })
    .eq("id", id);
  if (error) return { error: "Не удалось сохранить." };

  revalidatePath(`/admin/students/${id}`);
  revalidatePath("/admin/parents");
  revalidatePath("/cabinet");
  return { ok: true };
}

export async function deleteStudent(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    const supabase = await createClient();
    // Удаляем связанный аккаунт входа ученика (если есть).
    try {
      const { data } = await supabase
        .from("students")
        .select("auth_user_id")
        .eq("id", id)
        .maybeSingle();
      if (data?.auth_user_id) {
        await createAdminClient().auth.admin.deleteUser(data.auth_user_id);
      }
    } catch {
      /* колонки auth_user_id ещё нет — пропускаем */
    }
    await supabase.from("students").delete().eq("id", id);
  }
  revalidatePath("/admin/parents");
  redirect("/admin/parents");
}

// ── Аккаунт ученика (логин/пароль) ──────────────────────────────────────────

export async function createStudentLogin(
  formData: FormData,
): Promise<AdminResult> {
  await requireAdmin();
  if (describeSupabaseKey(process.env.SUPABASE_SERVICE_ROLE_KEY) !== "service_role") {
    return {
      error:
        "Нужен секретный service_role ключ Supabase (проверьте переменную SUPABASE_SERVICE_ROLE_KEY на Vercel).",
    };
  }
  const studentId = String(formData.get("student_id") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!studentId) return { error: "Не указан ученик." };
  if (!username || !password) return { error: "Логин и пароль обязательны." };
  if (password.length < 6) return { error: "Пароль не короче 6 символов." };
  if (!/^[a-z0-9_.-]+$/.test(username)) {
    return {
      error: "Логин: латиница, цифры, точка, дефис, подчёркивание.",
    };
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email: usernameToEmail(username),
    password,
    email_confirm: true,
    user_metadata: {
      username,
      full_name: fullName || null,
      is_admin: false,
      role: "student",
    },
  });
  if (error || !data.user) {
    return {
      error: error?.message.includes("already")
        ? "Такой логин уже занят."
        : `Не удалось создать логин: ${error?.message ?? "ошибка"}`,
    };
  }

  const supabase = await createClient();
  const { error: linkErr } = await supabase
    .from("students")
    .update({ auth_user_id: data.user.id })
    .eq("id", studentId);
  if (linkErr) {
    await admin.auth.admin.deleteUser(data.user.id); // откат
    return { error: "Не удалось привязать логин к ученику." };
  }

  revalidatePath(`/admin/students/${studentId}`);
  return { ok: true };
}

export async function resetStudentPassword(
  formData: FormData,
): Promise<AdminResult> {
  await requireAdmin();
  if (describeSupabaseKey(process.env.SUPABASE_SERVICE_ROLE_KEY) !== "service_role") {
    return { error: "Нужен секретный service_role ключ Supabase." };
  }
  const studentId = String(formData.get("student_id") ?? "");
  const password = String(formData.get("password") ?? "");
  if (password.length < 6) return { error: "Пароль не короче 6 символов." };

  const supabase = await createClient();
  const { data } = await supabase
    .from("students")
    .select("auth_user_id")
    .eq("id", studentId)
    .maybeSingle();
  const authId = data?.auth_user_id;
  if (!authId) return { error: "У ученика нет логина." };

  const { error } = await createAdminClient().auth.admin.updateUserById(authId, {
    password,
  });
  if (error) return { error: "Не удалось сменить пароль." };

  revalidatePath(`/admin/students/${studentId}`);
  return { ok: true };
}

export async function removeStudentLogin(formData: FormData) {
  await requireAdmin();
  const studentId = String(formData.get("student_id") ?? "");
  const supabase = await createClient();
  const { data } = await supabase
    .from("students")
    .select("auth_user_id")
    .eq("id", studentId)
    .maybeSingle();
  if (data?.auth_user_id) {
    // FK on delete set null очистит students.auth_user_id.
    await createAdminClient().auth.admin.deleteUser(data.auth_user_id);
  }
  revalidatePath(`/admin/students/${studentId}`);
}

// ── Прогресс (отметка тем) ────────────────────────────────────────────────────

export async function toggleProgress(
  studentId: string,
  subject: string,
  topicSlug: string,
  completed: boolean,
  date: string,
) {
  await requireAdmin();
  const supabase = await createClient();

  if (completed) {
    await supabase.from("progress").upsert(
      {
        student_id: studentId,
        subject,
        topic_slug: topicSlug,
        completed_on: date || new Date().toISOString().slice(0, 10),
      },
      { onConflict: "student_id,subject,topic_slug" },
    );
  } else {
    await supabase
      .from("progress")
      .delete()
      .eq("student_id", studentId)
      .eq("subject", subject)
      .eq("topic_slug", topicSlug);
  }
  revalidatePath(`/admin/students/${studentId}`);
  revalidatePath("/cabinet");
  revalidatePath("/");
}

// ── Занятия ───────────────────────────────────────────────────────────────────

export async function addLesson(formData: FormData): Promise<AdminResult> {
  await requireAdmin();
  const studentId = String(formData.get("student_id") ?? "");
  const local = String(formData.get("scheduled_at") ?? ""); // YYYY-MM-DDTHH:mm
  const note = String(formData.get("note") ?? "").trim();
  if (!studentId || !local) return { error: "Укажите дату и время." };

  // Время вводится по Москве – фиксируем смещение +03:00.
  const isoMoscow = `${local}:00+03:00`;

  const supabase = await createClient();
  const { error } = await supabase.from("lessons").insert({
    student_id: studentId,
    scheduled_at: new Date(isoMoscow).toISOString(),
    note: note || null,
  });
  if (error) return { error: "Не удалось добавить занятие." };

  revalidatePath(`/admin/students/${studentId}`);
  revalidatePath("/cabinet");
  return { ok: true };
}

export async function deleteLesson(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const studentId = String(formData.get("student_id") ?? "");
  if (id) {
    const supabase = await createClient();
    await supabase.from("lessons").delete().eq("id", id);
  }
  revalidatePath(`/admin/students/${studentId}`);
  revalidatePath("/cabinet");
}

// ── Комментарии ────────────────────────────────────────────────────────────────

export async function addComment(formData: FormData): Promise<AdminResult> {
  await requireAdmin();
  const studentId = String(formData.get("student_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!studentId || !body) return { error: "Введите текст комментария." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .insert({ student_id: studentId, body });
  if (error) return { error: "Не удалось добавить комментарий." };

  revalidatePath(`/admin/students/${studentId}`);
  revalidatePath("/cabinet");
  return { ok: true };
}

export async function deleteComment(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const studentId = String(formData.get("student_id") ?? "");
  if (id) {
    const supabase = await createClient();
    await supabase.from("comments").delete().eq("id", id);
  }
  revalidatePath(`/admin/students/${studentId}`);
  revalidatePath("/cabinet");
}

// ── Заявки с формы контактов ──────────────────────────────────────────────────

export async function setRequestRead(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const isRead = String(formData.get("is_read") ?? "") === "true";
  if (id) {
    const supabase = await createClient();
    await supabase
      .from("contact_requests")
      .update({ is_read: isRead })
      .eq("id", id);
  }
  revalidatePath("/admin/requests");
}

export async function deleteRequest(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    const supabase = await createClient();
    await supabase.from("contact_requests").delete().eq("id", id);
  }
  revalidatePath("/admin/requests");
}

// ── Настройки и тексты ─────────────────────────────────────────────────────────

export async function setPublicExamDate(
  formData: FormData,
): Promise<AdminResult> {
  await requireAdmin();
  const date = String(formData.get("public_exam_date") ?? "").trim();
  if (!date) return { error: "Укажите дату." };

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").upsert({
    key: "public_exam_date",
    value: date,
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: "Не удалось сохранить дату." };

  revalidatePath("/", "layout");
  return { ok: true };
}

const TEXT_KEYS = [
  "slogan",
  "sloganAccentWord",
  "homeEyebrow",
  "homeDescription",
  "aboutLead",
  "aboutParagraphs",
  "servicesIntro",
  "contactsIntro",
  "guestInviteTitle",
  "guestInviteText",
] as const;

export async function saveTexts(formData: FormData): Promise<AdminResult> {
  await requireAdmin();
  const value: Record<string, string> = {};
  for (const key of TEXT_KEYS) {
    const v = formData.get(key);
    if (typeof v === "string") value[key] = v;
  }
  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").upsert({
    key: "texts",
    value,
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: "Не удалось сохранить тексты." };

  revalidatePath("/", "layout");
  return { ok: true };
}

// ── Услуги ─────────────────────────────────────────────────────────────────────

function parsePoints(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function saveService(formData: FormData): Promise<AdminResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const points = parsePoints(String(formData.get("points") ?? ""));
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;
  if (!slug || !title) return { error: "Заполните заголовок и slug." };

  const supabase = await createClient();
  const row = { slug, title, summary, points, sort_order: sortOrder };
  const { error } = id
    ? await supabase.from("services").update(row).eq("id", id)
    : await supabase.from("services").insert(row);
  if (error) return { error: "Не удалось сохранить услугу." };

  revalidatePath("/", "layout");
  revalidatePath("/admin/services");
  return { ok: true };
}

export async function deleteService(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    const supabase = await createClient();
    await supabase.from("services").delete().eq("id", id);
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/services");
}

// ── Отзывы ─────────────────────────────────────────────────────────────────────

export async function saveReview(formData: FormData): Promise<AdminResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const author = String(formData.get("author") ?? "").trim();
  const meta = String(formData.get("meta") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const ratingRaw = String(formData.get("rating") ?? "").trim();
  const rating = ratingRaw ? Number(ratingRaw) : null;
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;
  if (!author || !body) return { error: "Заполните автора и текст." };

  const supabase = await createClient();
  const row = {
    author,
    meta: meta || null,
    body,
    rating,
    sort_order: sortOrder,
  };
  const { error } = id
    ? await supabase.from("reviews").update(row).eq("id", id)
    : await supabase.from("reviews").insert(row);
  if (error) return { error: "Не удалось сохранить отзыв." };

  revalidatePath("/", "layout");
  revalidatePath("/admin/reviews");
  return { ok: true };
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    const supabase = await createClient();
    await supabase.from("reviews").delete().eq("id", id);
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/reviews");
}
