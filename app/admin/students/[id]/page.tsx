import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addComment,
  addLesson,
  createStudentLogin,
  deleteComment,
  deleteLesson,
  deleteStudent,
  removeStudentLogin,
  resetStudentPassword,
  updateStudent,
} from "@/app/admin/actions";
import { ActionForm } from "@/components/admin/ActionForm";
import { ProgressEditor } from "@/components/admin/ProgressEditor";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { getStudentDetails } from "@/lib/admin";
import { subjects } from "@/lib/content/materials";
import { formatDate, formatDateTime } from "@/lib/dates";

export const metadata: Metadata = { title: "Ученик" };

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:border-accent focus-visible:outline-none";

export default async function StudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const details = await getStudentDetails(id);
  if (!details) notFound();

  const completed: Record<"physics" | "math", Record<string, string>> = {
    physics: {},
    math: {},
  };
  for (const p of details.progress) {
    if (p.subject === "physics" || p.subject === "math") {
      completed[p.subject][p.topicSlug] = p.completedOn;
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/parents"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← Родители и ученики
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {details.fullName}
        </h1>
        {details.parent && (
          <p className="text-sm text-muted">
            Родитель: {details.parent.fullName || details.parent.username} (
            <span className="font-mono">{details.parent.username}</span>)
          </p>
        )}
      </div>

      {/* Данные ученика */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold tracking-tight">Данные ученика</h2>
        <ActionForm action={updateStudent} className="mt-4">
          <div className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={details.id} />
            <div className="grow">
              <label className="mb-1 block text-xs text-muted">Имя</label>
              <input
                name="full_name"
                defaultValue={details.fullName}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Дата ОГЭ</label>
              <input
                type="date"
                name="exam_date"
                defaultValue={details.examDate ?? ""}
                className={inputClass}
              />
            </div>
            <SubmitButton>Сохранить</SubmitButton>
          </div>
        </ActionForm>
      </section>

      {/* Логин ученика */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold tracking-tight">Логин ученика</h2>
        <p className="mt-1 text-sm text-muted">
          Отдельный вход для ученика — после входа он видит свой прогресс. Логин
          и пароль передайте ученику сами.
        </p>

        {details.login ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm">
              Логин:{" "}
              <span className="font-mono font-medium">
                {details.login.username}
              </span>
            </p>
            <ActionForm
              action={resetStudentPassword}
              successText="Пароль изменён"
              resetOnSuccess
            >
              <input type="hidden" name="student_id" value={details.id} />
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="mb-1 block text-xs text-muted">
                    Новый пароль
                  </label>
                  <input
                    name="password"
                    type="text"
                    minLength={6}
                    required
                    placeholder="минимум 6 символов"
                    className={inputClass}
                  />
                </div>
                <SubmitButton pendingText="Меняем…">Сменить пароль</SubmitButton>
              </div>
            </ActionForm>
            <form action={removeStudentLogin}>
              <input type="hidden" name="student_id" value={details.id} />
              <SubmitButton
                danger
                pendingText="Удаляем…"
                className="rounded-lg px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/10"
              >
                Удалить логин ученика
              </SubmitButton>
            </form>
          </div>
        ) : (
          <ActionForm
            action={createStudentLogin}
            successText="Логин создан"
            className="mt-4"
          >
            <input type="hidden" name="student_id" value={details.id} />
            <input type="hidden" name="full_name" value={details.fullName} />
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="mb-1 block text-xs text-muted">
                  Логин (латиницей)
                </label>
                <input
                  name="username"
                  required
                  placeholder="ivanova-anna"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted">Пароль</label>
                <input
                  name="password"
                  type="text"
                  minLength={6}
                  required
                  placeholder="минимум 6 символов"
                  className={inputClass}
                />
              </div>
              <SubmitButton pendingText="Создаём…">Создать логин</SubmitButton>
            </div>
          </ActionForm>
        )}
      </section>

      {/* Занятия */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold tracking-tight">Занятия</h2>
        <p className="mt-1 text-sm text-muted">
          Ближайшее будущее занятие родитель видит как «Следующее занятие».
          Время – по Москве.
        </p>

        <ActionForm
          action={addLesson}
          resetOnSuccess
          successText="Занятие добавлено"
          className="mt-4"
        >
          <div className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="student_id" value={details.id} />
            <div>
              <label className="mb-1 block text-xs text-muted">
                Дата и время (МСК)
              </label>
              <input
                type="datetime-local"
                name="scheduled_at"
                required
                className={inputClass}
              />
            </div>
            <div className="grow">
              <label className="mb-1 block text-xs text-muted">
                Заметка (необязательно)
              </label>
              <input
                name="note"
                placeholder="Например, повторение динамики"
                className={inputClass}
              />
            </div>
            <SubmitButton pendingText="Добавляем…">+ Добавить</SubmitButton>
          </div>
        </ActionForm>

        <ul className="mt-4 divide-y divide-border">
          {details.lessons.length === 0 ? (
            <li className="py-2 text-sm text-muted">Занятий пока нет.</li>
          ) : (
            details.lessons.map((l) => (
              <li
                key={l.id}
                className="flex items-center justify-between gap-3 py-2.5 text-sm"
              >
                <span>
                  <span className="font-medium">
                    {formatDateTime(l.scheduledAt)}
                  </span>
                  {l.note && <span className="text-muted"> · {l.note}</span>}
                </span>
                <form action={deleteLesson}>
                  <input type="hidden" name="id" value={l.id} />
                  <input type="hidden" name="student_id" value={details.id} />
                  <SubmitButton
                    danger
                    pendingText="…"
                    className="rounded px-2 py-1 text-xs text-danger transition-colors hover:bg-danger/10"
                  >
                    Удалить
                  </SubmitButton>
                </form>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Комментарии */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold tracking-tight">
          Комментарии (раз в месяц)
        </h2>
        <ActionForm
          action={addComment}
          resetOnSuccess
          successText="Комментарий добавлен"
          className="mt-4"
        >
          <input type="hidden" name="student_id" value={details.id} />
          <textarea
            name="body"
            required
            rows={3}
            placeholder="Как продвигается ученик за прошедший месяц…"
            className={`${inputClass} resize-y`}
          />
          <div className="mt-3">
            <SubmitButton pendingText="Добавляем…">
              Добавить комментарий
            </SubmitButton>
          </div>
        </ActionForm>

        <ul className="mt-5 space-y-4">
          {details.comments.length === 0 ? (
            <li className="text-sm text-muted">Комментариев пока нет.</li>
          ) : (
            details.comments.map((c) => (
              <li key={c.id} className="border-l-2 border-accent pl-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-xs text-muted">
                    {formatDate(c.createdAt)}
                  </p>
                  <form action={deleteComment}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="student_id" value={details.id} />
                    <SubmitButton
                      danger
                      pendingText="…"
                      className="rounded px-2 py-0.5 text-xs text-danger transition-colors hover:bg-danger/10"
                    >
                      Удалить
                    </SubmitButton>
                  </form>
                </div>
                <p className="mt-1 whitespace-pre-line text-sm">{c.body}</p>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Прогресс по темам */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">
          Прогресс по темам
        </h2>
        <ProgressEditor
          studentId={details.id}
          subjectKey="physics"
          subjectTitle="Физика"
          sections={subjects.physics.sections}
          initialCompleted={completed.physics}
        />
        <ProgressEditor
          studentId={details.id}
          subjectKey="math"
          subjectTitle="Математика"
          sections={subjects.math.sections}
          initialCompleted={completed.math}
        />
      </section>

      {/* Удаление */}
      <section className="rounded-2xl border border-danger/30 bg-surface p-6">
        <h2 className="text-base font-semibold tracking-tight text-danger">
          Удалить ученика
        </h2>
        <p className="mt-1 text-sm text-muted">
          Удалятся прогресс, занятия и комментарии этого ученика. Действие
          необратимо.
        </p>
        <form action={deleteStudent} className="mt-3">
          <input type="hidden" name="id" value={details.id} />
          <SubmitButton
            danger
            pendingText="Удаляем…"
            className="rounded-lg border border-danger/40 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
          >
            Удалить ученика
          </SubmitButton>
        </form>
      </section>
    </div>
  );
}
