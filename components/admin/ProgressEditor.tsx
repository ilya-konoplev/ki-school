"use client";

import { useState, useTransition } from "react";
import { toggleProgress } from "@/app/admin/actions";
import type { Section } from "@/lib/content/materials";
import { formatDate } from "@/lib/dates";

export function ProgressEditor({
  studentId,
  subjectKey,
  subjectTitle,
  sections,
  initialCompleted,
}: {
  studentId: string;
  subjectKey: "physics" | "math";
  subjectTitle: string;
  sections: Section[];
  initialCompleted: Record<string, string>;
}) {
  const [completed, setCompleted] =
    useState<Record<string, string>>(initialCompleted);
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [, startTransition] = useTransition();

  const total = sections
    .flatMap((s) => s.groups.flatMap((g) => g.topics))
    .length;
  const done = Object.keys(completed).length;

  function toggle(slug: string, checked: boolean) {
    setCompleted((prev) => {
      const next = { ...prev };
      if (checked) next[slug] = date;
      else delete next[slug];
      return next;
    });
    startTransition(() => {
      void toggleProgress(studentId, subjectKey, slug, checked, date);
    });
  }

  return (
    <details className="rounded-2xl border border-border bg-surface p-6">
      <summary className="flex cursor-pointer items-center justify-between gap-3">
        <span className="text-lg font-semibold tracking-tight">
          {subjectTitle}
        </span>
        <span className="text-sm text-muted">
          {done} из {total} тем
        </span>
      </summary>

      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-background p-3 text-sm">
        <label className="text-muted">Дата отметки:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-border bg-background px-2 py-1"
        />
        <span className="text-xs text-muted">
          Новые отмеченные темы получат эту дату.
        </span>
      </div>

      <div className="mt-4 space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              {section.title}
            </h4>
            <ul className="mt-2 divide-y divide-border">
              {section.groups
                .flatMap((g) => g.topics)
                .map((topic) => {
                  const completedOn = completed[topic.slug];
                  const isDone = Boolean(completedOn);
                  return (
                    <li
                      key={topic.slug}
                      className="flex items-center justify-between gap-3 py-2 text-sm"
                    >
                      <label className="flex flex-1 cursor-pointer items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={(e) => toggle(topic.slug, e.target.checked)}
                          className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
                        />
                        <span className={isDone ? "" : "text-muted"}>
                          {topic.title}
                        </span>
                      </label>
                      {isDone && (
                        <span className="shrink-0 font-mono text-xs text-muted">
                          {formatDate(completedOn)}
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
  );
}
