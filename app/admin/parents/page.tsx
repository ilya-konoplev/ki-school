import type { Metadata } from "next";
import Link from "next/link";
import { createStudent, deleteParent } from "@/app/admin/actions";
import { ActionForm } from "@/components/admin/ActionForm";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { listParents } from "@/lib/admin";
import { formatDate } from "@/lib/dates";

export const metadata: Metadata = { title: "Родители и ученики" };

export default async function AdminParentsPage() {
  const parents = await listParents();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Родители и ученики
        </h1>
        <Link
          href="/admin/parents/new"
          className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          + Создать родителя
        </Link>
      </div>

      {parents.length === 0 ? (
        <p className="mt-8 text-muted">
          Пока нет ни одного родителя. Создайте первого.
        </p>
      ) : (
        <div className="mt-6 space-y-5">
          {parents.map((parent) => (
            <div
              key={parent.id}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    {parent.fullName || parent.username}
                  </h2>
                  <p className="text-sm text-muted">
                    Логин: <span className="font-mono">{parent.username}</span>
                  </p>
                </div>
                <form action={deleteParent}>
                  <input type="hidden" name="id" value={parent.id} />
                  <SubmitButton
                    danger
                    pendingText="Удаляем…"
                    className="rounded-lg px-2.5 py-1.5 text-xs text-danger transition-colors hover:bg-danger/10"
                  >
                    Удалить родителя
                  </SubmitButton>
                </form>
              </div>

              {/* Ученики */}
              <div className="mt-4 space-y-2">
                {parent.students.length === 0 ? (
                  <p className="text-sm text-muted">Учеников пока нет.</p>
                ) : (
                  parent.students.map((s) => (
                    <Link
                      key={s.id}
                      href={`/admin/students/${s.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm transition-colors hover:border-accent"
                    >
                      <span className="font-medium">{s.fullName}</span>
                      <span className="text-muted">
                        {s.examDate ? `ОГЭ: ${formatDate(s.examDate)}` : "дата ОГЭ не задана"}{" "}
                        →
                      </span>
                    </Link>
                  ))
                )}
              </div>

              {/* Добавить ученика */}
              <ActionForm
                action={createStudent}
                resetOnSuccess
                successText="Ученик добавлен"
                className="mt-4 border-t border-border pt-4"
              >
                <div className="flex flex-wrap items-end gap-3">
                  <input type="hidden" name="parent_id" value={parent.id} />
                  <div className="grow">
                    <label className="mb-1 block text-xs text-muted">
                      Имя ученика
                    </label>
                    <input
                      name="full_name"
                      required
                      placeholder="Например, Анна Иванова"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:border-accent focus-visible:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted">
                      Дата ОГЭ (необязательно)
                    </label>
                    <input
                      type="date"
                      name="exam_date"
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:border-accent focus-visible:outline-none"
                    />
                  </div>
                  <SubmitButton
                    pendingText="Добавляем…"
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
                  >
                    + Добавить ученика
                  </SubmitButton>
                </div>
              </ActionForm>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
