"use client";

import { useFormStatus } from "react-dom";

/** Кнопка отправки формы с состоянием «в процессе» (использует контекст формы). */
export function SubmitButton({
  children,
  pendingText = "Сохраняем…",
  className,
  danger = false,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  danger?: boolean;
}) {
  const { pending } = useFormStatus();

  const base = danger
    ? "rounded-lg px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/10"
    : "rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover";

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className ?? base} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
