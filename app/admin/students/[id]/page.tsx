import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addComment,
  addLesson,
  deleteComment,
  deleteLesson,
  deleteStudent,
  updateStudent,
} from "@/app/admin/actions";
import { ProgressEditor } from "@/components/admin/ProgressEditor";
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
        <form
          action={updateStudent}
          className="mt-4 flex flex-wrap items-end gap-3"
        >
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
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Сохранить
          </button>
        </form>
      </section>

      {/* Занятия */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold tracking-tight">Занятия</h2>
        <p className="mt-1 text-sm text-muted">
          Ближайшее будущее занятие родитель видит как «Следующее занятие».
          Время — по Москве.
        </p>

        <form
          action={addLesson}
          className="mt-4 flex flex-wrap items-end gap-3"
        >
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
          <button
            type="submit"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            + Добавить
          </button>
        </form>

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
                  <button
                    type="submit"
                    className="rounded px-2 py-1 text-xs text-danger transition-colors hover:bg-danger/10"
                  >
                    Удалить
                  </button>
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
        <form action={addComment} className="mt-4 space-y-3">
          <input type="hidden" name="student_id" value={details.id} />
          <textarea
            name="body"
            required
            rows={3}
            placeholder="Как продвигается ученик за прошедший месяц…"
            className={`${inputClass} resize-y`}
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Добавить комментарий
          </button>
        </form>

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
                    <button
                      type="submit"
                      className="rounded px-2 py-0.5 text-xs text-danger transition-colors hover:bg-danger/10"
                    >
                      Удалить
                    </button>
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
          <button
            type="submit"
            className="rounded-lg border border-danger/40 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
          >
            Удалить ученика
          </button>
        </form>
      </section>
    </div>
  );
}
