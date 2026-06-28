"use client";

import { useActionState } from "react";
import { createParent, type CreateParentState } from "@/app/admin/actions";

const initialState: CreateParentState = {};

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus-visible:border-accent focus-visible:outline-none";

export function CreateParentForm() {
  const [state, action, pending] = useActionState(createParent, initialState);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium">
          Имя родителя
        </label>
        <input
          id="full_name"
          name="full_name"
          placeholder="Например, Мария Иванова"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-medium">
          Логин <span className="text-muted">(латиницей)</span>
        </label>
        <input
          id="username"
          name="username"
          required
          autoComplete="off"
          placeholder="ivanova"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Пароль <span className="text-muted">(минимум 6 символов)</span>
        </label>
        <input
          id="password"
          name="password"
          required
          minLength={6}
          autoComplete="new-password"
          className={fieldClass}
        />
      </div>

      {state.error && (
        <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-6 font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Создаём…" : "Создать родителя"}
      </button>
    </form>
  );
}
