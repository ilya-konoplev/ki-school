"use server";

import { isSupabaseConfigured } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !contact || !message) {
    return { status: "error", message: "Пожалуйста, заполните все поля." };
  }
  if (message.length < 5) {
    return { status: "error", message: "Сообщение слишком короткое." };
  }

  // Сохраняем заявку в Supabase (видна Илье в админке, п.7).
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("contact_requests")
      .insert({ name, contact, message });
    if (error) {
      return {
        status: "error",
        message:
          "Не удалось отправить сообщение. Попробуйте позже или напишите в Telegram.",
      };
    }
  } else {
    // База ещё не подключена — не теряем заявку, пишем в лог сервера.
    console.log("Заявка с формы (БД не подключена):", {
      name,
      contact,
      message,
    });
  }

  return {
    status: "success",
    message:
      "Спасибо! Сообщение получено — я свяжусь с вами в ближайшее время.",
  };
}
