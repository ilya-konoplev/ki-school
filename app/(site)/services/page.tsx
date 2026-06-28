import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getServices, getTexts } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Подготовка к ОГЭ по физике и математике, повышение школьной оценки.",
};

export default async function ServicesPage() {
  const [services, texts] = await Promise.all([getServices(), getTexts()]);

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Услуги
        </h1>
        <p className="mt-4 text-lg text-muted">{texts.servicesIntro}</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {services.map((s) => (
          <article
            key={s.slug}
            className="flex flex-col rounded-2xl border border-border bg-surface p-7"
          >
            <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
            <p className="mt-3 text-muted">{s.summary}</p>
            <ul className="mt-5 space-y-2.5">
              {s.points.map((point, i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <CheckIcon />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-14 rounded-3xl border border-border bg-accent-soft p-8 text-center sm:p-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          Не уверены, что подойдёт?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Напишите мне — обсудим ситуацию и подберём формат занятий под вашу
          цель.
        </p>
        <div className="mt-6 flex justify-center">
          <Button href="/contacts" size="lg">
            Обсудить занятия
          </Button>
        </div>
      </div>
    </Container>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0 text-accent"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
