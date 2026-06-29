"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { AdminResult } from "@/app/admin/actions";

/**
 * Форма админки с обратной связью: показывает плашку «Сохранено» или ошибку
 * после отправки. Внутрь кладутся поля и <SubmitButton> (он сам покажет
 * состояние «Сохраняем…»). Действие должно возвращать AdminResult.
 */
export function ActionForm({
  action,
  children,
  className = "",
  successText = "Сохранено",
  resetOnSuccess = false,
}: {
  action: (formData: FormData) => Promise<AdminResult>;
  children: React.ReactNode;
  className?: string;
  successText?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction] = useActionState<AdminResult, FormData>(
    async (_prev, formData) => action(formData),
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state?.ok || state?.error) {
      setVisible(true);
      if (state.ok && resetOnSuccess) formRef.current?.reset();
      const t = setTimeout(() => setVisible(false), 3500);
      return () => clearTimeout(t);
    }
  }, [state, resetOnSuccess]);

  return (
    <form ref={formRef} action={formAction} className={className}>
      {children}
      {visible && (state?.ok || state?.error) && (
        <p
          role="status"
          className={`mt-3 rounded-lg px-3 py-2 text-sm ${
            state.ok
              ? "bg-accent-soft text-accent"
              : "bg-danger/10 text-danger"
          }`}
        >
          {state.ok ? `✓ ${successText}` : state.error}
        </p>
      )}
    </form>
  );
}
