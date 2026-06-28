import type { Metadata } from "next";
import Link from "next/link";
import { PhysicsTabs } from "@/components/materials/PhysicsTabs";
import { Container } from "@/components/ui/Container";
import { labs } from "@/lib/content/labs";

export const metadata: Metadata = {
  title: "Виртуальные лабораторные работы – Физика",
  description:
    "Интерактивные лабораторные работы по физике, которые открываются прямо на сайте.",
};

export default function LabsPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Физика
        </h1>
        <p className="mt-4 text-lg text-muted">
          Интерактивные лабораторные работы – модели физических явлений, с
          которыми можно поэкспериментировать прямо в браузере.
        </p>
      </div>

      <div className="mt-8">
        <PhysicsTabs active="labs" />
      </div>

      <div className="mt-10">
        {labs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
            <p className="text-lg font-medium">Лабораторные работы готовятся</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Скоро здесь появятся интерактивные модели по физике.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {labs.map((lab) => (
              <Link
                key={lab.slug}
                href={`/materials/physics/labs/${lab.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <FlaskIcon />
                </span>
                <h2 className="mt-4 text-lg font-semibold tracking-tight group-hover:text-accent">
                  {lab.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted">
                  {lab.description}
                </p>
                <span className="mt-4 text-sm font-medium text-accent">
                  Открыть →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

function FlaskIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 3h6M10 3v6L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" />
      <path d="M7.5 14h9" />
    </svg>
  );
}
