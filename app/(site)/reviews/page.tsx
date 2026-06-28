import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/content/site";
import { getReviews } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Отзывы",
  description: "Отзывы учеников и родителей о занятиях по физике и математике.",
};

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <Container className="py-14 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Отзывы
          </h1>
          <p className="mt-4 text-lg text-muted">
            Что говорят ученики и их родители. Больше отзывов – на моём профиле
            profi.ru.
          </p>
        </div>
        <Button
          href={site.profiUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
        >
          Профиль на profi.ru →
        </Button>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {reviews.map((r) => (
          <figure
            key={r.id}
            className="flex flex-col rounded-2xl border border-border bg-surface p-7"
          >
            {typeof r.rating === "number" && (
              <Stars rating={r.rating} />
            )}
            <blockquote className="mt-3 flex-1 text-foreground">
              «{r.text}»
            </blockquote>
            <figcaption className="mt-5 text-sm">
              <span className="font-semibold">{r.author}</span>
              {r.meta && <span className="text-muted"> · {r.meta}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </Container>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Оценка ${rating} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.6"
          className="text-accent"
          aria-hidden="true"
        >
          <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
        </svg>
      ))}
    </div>
  );
}
