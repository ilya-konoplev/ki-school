import Link from "next/link";
import { Markdown } from "@/components/markdown/Markdown";
import { Container } from "@/components/ui/Container";
import type { Subject, Topic } from "@/lib/content/materials";

export function TopicArticle({
  subject,
  topic,
  prev,
  next,
  content,
}: {
  subject: Subject;
  topic: Topic;
  prev?: Topic;
  next?: Topic;
  content: string | null;
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
