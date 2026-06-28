import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicArticle } from "@/components/materials/TopicArticle";
import { labs } from "@/lib/content/labs";
import { flatTopics, getTopic, subjects } from "@/lib/content/materials";
import { readTopicMarkdown } from "@/lib/markdown";

export function generateStaticParams() {
  return flatTopics(subjects.physics).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = getTopic("physics", slug);
  return { title: found ? `${found.topic.title} – Физика` : "Тема" };
}

export default async function PhysicsTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = getTopic("physics", slug);
  if (!found) notFound();

  const md = await readTopicMarkdown("physics", slug);
  const relatedLabs = labs.filter((lab) => lab.topicSlug === slug);

  return (
    <TopicArticle
      subject={found.subject}
      topic={found.topic}
      prev={found.prev}
      next={found.next}
      content={md?.content ?? null}
      labs={relatedLabs}
    />
  );
}
