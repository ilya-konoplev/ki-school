import type { Metadata } from "next";
import { flatTopics, subjects } from "@/lib/content/materials";
import { labs } from "@/lib/content/labs";

export const metadata: Metadata = { title: "Материалы" };

export default function AdminMaterialsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Материалы и лабораторные
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          Конспекты тем и лабораторные добавляются файлами в проект (это надёжнее
          и проще). Подробные шаги – в гайде; ниже краткая памятка и имена
          файлов.
        </p>
      </div>

      {/* Инструкция */}
      <section className="rounded-2xl border border-border bg-surface p-6 text-sm">
        <h2 className="text-base font-semibold tracking-tight">
          Как добавить конспект темы
        </h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-muted">
          <li>Напишите тему в Obsidian и экспортируйте файл <code>.md</code>.</li>
          <li>
            Положите его в папку{" "}
            <code>content/materials/&lt;предмет&gt;/</code> (
            <code>physics</code> или <code>math</code>).
          </li>
          <li>
            Имя файла = slug темы из списка ниже, например{" "}
            <code>ohm-law.md</code>.
          </li>
          <li>Отправьте изменения – после деплоя тема появится на сайте.</li>
        </ol>
        <h2 className="mt-5 text-base font-semibold tracking-tight">
          Как добавить лабораторную
        </h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-muted">
          <li>
            Положите файлы лабы (HTML/CSS/JS) в{" "}
            <code>public/labs/&lt;имя&gt;/</code> с точкой входа{" "}
            <code>index.html</code>.
          </li>
          <li>
            Добавьте запись в <code>lib/content/labs.ts</code> (название,
            описание, путь).
          </li>
        </ol>
      </section>

      {/* Темы по предметам */}
      {[subjects.physics, subjects.math].map((subject) => (
        <section key={subject.key}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              {subject.title}
            </h2>
            <span className="text-sm text-muted">
              {flatTopics(subject).length} тем
            </span>
          </div>
          <div className="mt-3 space-y-4">
            {subject.sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                  {section.title}
                </h3>
                <ul className="mt-2 space-y-1">
                  {section.groups
                    .flatMap((g) => g.topics)
                    .map((t) => (
                      <li
                        key={t.slug}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                      >
                        <span>{t.title}</span>
                        <code className="font-mono text-xs text-accent">
                          {subject.key}/{t.slug}.md
                        </code>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Лабораторные */}
      <section>
        <h2 className="text-lg font-semibold tracking-tight">
          Виртуальные лабораторные
        </h2>
        <ul className="mt-3 space-y-1">
          {labs.map((lab) => (
            <li
              key={lab.slug}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            >
              <span>{lab.title}</span>
              <code className="font-mono text-xs text-accent">{lab.src}</code>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
