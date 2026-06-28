import { subjects } from "@/lib/content/materials";
import type { SubjectProgress } from "@/lib/cabinet";
import { formatDate } from "@/lib/dates";
import { ProgressBar } from "./ProgressBar";

export function SubjectProgressCard({ data }: { data: SubjectProgress }) {
  const subject = subjects[data.key];

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-end justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight">{data.title}</h3>
        <span className="shrink-0 text-sm text-muted">
          {data.done} из {data.total} тем
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <ProgressBar percent={data.percent} />
        <span className="w-12 shrink-0 text-right font-mono text-sm font-semibold text-accent">
          {data.percent}%
        </span>
      </div>

      <details className="group mt-4">
        <summary className="cursor-pointer list-none text-sm font-medium text-accent hover:underline">
          <span className="group-open:hidden">Показать все темы</span>
          <span className="hidden group-open:inline">Скрыть темы</span>
        </summary>

        <div className="mt-4 space-y-5">
          {subject.sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                {section.title}
              </h4>
              <ul className="mt-2 divide-y divide-border">
                {section.groups
                  .flatMap((g) => g.topics)
                  .map((topic) => {
                    const date = data.completed[topic.slug];
                    const done = Boolean(date);
                    return (
                      <li
                        key={topic.slug}
                        className="flex items-center justify-between gap-3 py-2 text-sm"
                      >
                        <span className="flex items-start gap-2">
                          <StatusIcon done={done} />
                          <span className={done ? "" : "text-muted"}>
                            {topic.title}
                          </span>
                        </span>
                        {done && (
                          <span className="shrink-0 font-mono text-xs text-muted">
                            {formatDate(date)}
                          </span>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

function StatusIcon({ done }: { done: boolean }) {
  if (done) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 shrink-0 text-accent"
        aria-label="пройдено"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }
  return (
    <span
      className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-border"
      aria-label="не пройдено"
    />
  );
}
