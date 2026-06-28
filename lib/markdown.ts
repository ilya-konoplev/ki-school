import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Содержимое тем хранится в markdown-файлах, которые Илья экспортирует из
 * Obsidian и кладёт сюда: content/materials/<subject>/<slug>.md
 * Файлы читаются на этапе сборки (страницы статические).
 */
const CONTENT_DIR = path.join(process.cwd(), "content", "materials");

export type TopicContent = {
  content: string;
  title?: string;
};

/** Возвращает содержимое темы или null, если файл ещё не добавлен. */
export async function readTopicMarkdown(
  subject: string,
  slug: string,
): Promise<TopicContent | null> {
  const file = path.join(CONTENT_DIR, subject, `${slug}.md`);
  try {
    const raw = await fs.readFile(file, "utf8");
    const { content, data } = matter(raw);
    return {
      content,
      title: typeof data.title === "string" ? data.title : undefined,
    };
  } catch {
    return null;
  }
}
