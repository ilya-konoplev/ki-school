import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { getLab, labs } from "@/lib/content/labs";

export function generateStaticParams() {
  return labs.map((lab) => ({ slug: lab.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lab = getLab(slug);
  return { title: lab ? `${lab.title} — лабораторная работа` : "Лаборатория" };
}

export default async function LabViewerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) notFound();

  return (
    <Container className="py-12 sm:py-16">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link href="/materials" className="hover:text-foreground">
          Материалы
        </Link>
        <span>/</span>
        <Link href="/materials/physics" className="hover:text-foreground">
          Физика
        </Link>
        <span>/</span>
        <Link href="/materials/physics/labs" className="hover:text-foreground">
          Лабораторные
        </Link>
      </nav>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{lab.title}</h1>
      <p className="mt-3 max-w-2xl text-muted">{lab.description}</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface">
        <iframe
          src={lab.src}
          title={lab.title}
          className="h-[70vh] min-h-[460px] w-full"
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
        />
      </div>

      <div className="mt-6">
        <Link
          href="/materials/physics/labs"
          className="text-sm font-medium text-accent hover:underline"
        >
          ← Ко всем лабораторным
        </Link>
      </div>
    </Container>
  );
}
