import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { aboutPage } from "@/lib/content/pages";
import { getTexts } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Обо мне",
  description: aboutPage.lead,
};

export default async function AboutPage() {
  const texts = await getTexts();
  const paragraphs = texts.aboutParagraphs.split(/\n{2,}/).filter(Boolean);

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {aboutPage.title}
        </h1>
        <p className="mt-5 text-xl leading-relaxed text-foreground">
          {texts.aboutLead}
        </p>
        <div className="mt-6 space-y-4 text-lg text-muted">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">
          {aboutPage.approachTitle}
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {aboutPage.approach.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft font-mono text-sm font-semibold text-accent">
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 flex flex-wrap gap-3">
        <Button href="/services" size="lg">
          Чем я могу помочь
        </Button>
        <Button href="/contacts" variant="secondary" size="lg">
          Связаться со мной
        </Button>
      </div>
    </Container>
  );
}
