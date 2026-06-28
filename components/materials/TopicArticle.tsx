import Link from "next/link";
import { Markdown } from "@/components/markdown/Markdown";
import { Container } from "@/components/ui/Container";
import type { Lab } from "@/lib/content/labs";
import type { Subject, Topic } from "@/lib/content/materials";

export function TopicArticle({
  subject,
  topic,
  prev,
  next,
  content,
  labs = [],
}: {
  subject: Subject;
  topic: Topic;
  prev?: Topic;
  next?: Topic;
  content: string | null;
  labs?: Lab[];
}) {
  return (
    <Container className="py-12 sm:py-16">
      <article className="mx-auto max-w-3xl">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link href="/materials" className="hover:text-foreground">
            Материалы
          </Link>
          <span>/</span>
          <Link
            href={`/materials/${subject.key}`}
            className="hover:text-foreground"
          >
            {subject.title}
          </Link>
        </nav>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          {topic.title}
        </h1>

        <div className="mt-8">
          {content ? (
            <Markdown>{content}</Markdown>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
              <p className="text-lg font-medium">Материал готовится</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Скоро здесь появится конспект по теме «{topic.title}». А пока
                можно перейти к другим темам или связаться со мной по вопросам
                занятий.
              </p>
            </div>
          )}
        </div>

        {labs.length > 0 && (
          <div className="mt-8 rounded-2xl border border-accent/30 bg-accent-soft p-5">
            <p className="text-sm font-semibold text-accent">
              Виртуальная лабораторная работа
            </p>
            <ul className="mt-3 space-y-2">
              {labs.map((lab) => (
                <li key={lab.slug}>
                  <Link
                    href={`/materials/physics/labs/${lab.slug}`}
                    className="inline-flex items-center gap-2 font-medium hover:text-accent"
                  >
                    <FlaskIcon />
                    {lab.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <nav className="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/materials/${subject.key}/${prev.slug}`}
              className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent"
            >
              <span className="text-xs text-muted">← Предыдущая тема</span>
              <span className="mt-1 block text-sm font-medium">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/materials/${subject.key}/${next.slug}`}
              className="rounded-xl border border-border bg-surface p-4 text-right transition-colors hover:border-accent"
            >
              <span className="text-xs text-muted">Следующая тема →</span>
              <span className="mt-1 block text-sm font-medium">{next.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </Container>
  );
}

function FlaskIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent"
      aria-hidden="true"
    >
      <path d="M9 3h6M10 3v6L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" />
      <path d="M7.5 14h9" />
    </svg>
  );
}
