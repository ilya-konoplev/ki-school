"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContact, type ContactState } from "@/app/(site)/contacts/actions";

const initialState: ContactState = { status: "idle" };

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus-visible:border-accent focus-visible:outline-none";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Очистить форму после успешной отправки.
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
          Как вас зовут?
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Имя"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="contact" className="mb-1.5 block text-sm font-medium">
          Как с вами связаться?
        </label>
        <input
          id="contact"
          name="contact"
          type="text"
          required
          placeholder="Телефон, Telegram или e-mail"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Сообщение
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Расскажите о цели занятий, классе ученика, удобном времени…"
          className={`${fieldClass} resize-y`}
        />
      </div>

      {state.status !== "idle" && state.message && (
        <p
          role="status"
          className={`rounded-xl px-4 py-3 text-sm ${
            state.status === "success"
              ? "bg-accent-soft text-accent"
              : "bg-danger/10 text-danger"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Отправка…" : "Отправить сообщение"}
      </button>
    </form>
  );
}
