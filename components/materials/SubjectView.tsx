import Link from "next/link";
import type { Subject } from "@/lib/content/materials";

/** Список всех тем предмета, сгруппированный по разделам и подразделам. */
export function SubjectView({ subject }: { subject: Subject }) {
  return (
    <div className="space-y-12">
      {subject.sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {section.title}
          </h2>
          <div className="mt-5 space-y-7">
            {section.groups.map((group, gi) => (
              <div key={gi}>
                {group.title && (
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                    {group.title}
                  </h3>
                )}
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {group.topics.map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/materials/${subject.key}/${t.slug}`}
                        className="group flex h-full items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm transition-colors hover:border-accent"
                      >
                        <ArrowIcon />
                        <span className="group-hover:text-accent">{t.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0 text-muted transition-colors group-hover:text-accent"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
