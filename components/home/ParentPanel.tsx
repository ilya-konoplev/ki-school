import Link from "next/link";
import { ProgressBar } from "@/components/cabinet/ProgressBar";
import type { ChildSummary } from "@/lib/cabinet";

/**
 * Блок на главной для вошедших родителей: краткий прогресс по каждому ребёнку
 * со ссылкой на полный личный кабинет.
 */
export function ParentPanel({ students }: { students: ChildSummary[] }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-7 sm:p-9">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
        Прогресс {students.length > 1 ? "ваших детей" : "вашего ребёнка"}
      </h2>

      {students.length === 0 ? (
        <p className="mt-3 text-muted">
          Пока нет привязанных учеников. Как только репетитор добавит ученика,
          здесь появится его прогресс.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {students.map((child) => (
            <div
              key={child.id}
              className="rounded-2xl border border-border bg-background p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold tracking-tight">
                  {child.fullName}
                </h3>
                <Link
                  href={`/cabinet?child=${child.id}`}
                  className="shrink-0 text-sm font-medium text-accent hover:underline"
                >
                  Все темы и даты →
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {child.subjects.map((s) => (
                  <div key={s.key}>
                    <div className="flex items-center justify-between text-sm">
                      <span>{s.title}</span>
                      <span className="text-muted">
                        {s.done}/{s.total} · {s.percent}%
                      </span>
                    </div>
                    <ProgressBar percent={s.percent} className="mt-1.5" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
