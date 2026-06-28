"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/(site)/login/actions";

const initialState: LoginState = {};

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus-visible:border-accent focus-visible:outline-none";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-medium">
          Логин
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          autoCapitalize="none"
          placeholder="Логин, который выдал репетитор"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Пароль"
          className={fieldClass}
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent px-6 font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Вход…" : "Войти"}
      </button>
    </form>
  );
}
