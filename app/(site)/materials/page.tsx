import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { subjectList, topicsCount } from "@/lib/content/materials";
import { labs } from "@/lib/content/labs";

export const metadata: Metadata = {
  title: "Материалы",
  description:
    "Темы по физике и математике для подготовки к ОГЭ и виртуальные лабораторные работы.",
};

export default function MaterialsPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Материалы
        </h1>
        <p className="mt-4 text-lg text-muted">
          Конспекты по темам ОГЭ и интерактивные лабораторные работы. Выберите
          предмет.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {subjectList.map((subject) => (
          <Link
            key={subject.key}
            href={`/materials/${subject.key}`}
            className="group flex flex-col rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-accent"
          >
            <h2 className="text-2xl font-semibold tracking-tight group-hover:text-accent">
              {subject.title}
            </h2>
            <p className="mt-3 flex-1 text-muted">{subject.description}</p>
            <p className="mt-5 text-sm font-medium text-accent">
              {topicsCount(subject)} тем
              {subject.key === "physics" && labs.length > 0
                ? ` · ${labs.length} лаб. ${labs.length === 1 ? "работа" : "работы"}`
                : ""}{" "}
              →
            </p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
