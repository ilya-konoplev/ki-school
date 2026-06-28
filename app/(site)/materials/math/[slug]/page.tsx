import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicArticle } from "@/components/materials/TopicArticle";
import { flatTopics, getTopic, subjects } from "@/lib/content/materials";
import { readTopicMarkdown } from "@/lib/markdown";

export function generateStaticParams() {
  return flatTopics(subjects.math).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = getTopic("math", slug);
  return { title: found ? `${found.topic.title} — Математика` : "Тема" };
}

export default async function MathTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = getTopic("math", slug);
  if (!found) notFound();

  const md = await readTopicMarkdown("math", slug);

  return (
    <TopicArticle
      subject={found.subject}
      topic={found.topic}
      prev={found.prev}
      next={found.next}
      content={md?.content ?? null}
    />
  );
}
