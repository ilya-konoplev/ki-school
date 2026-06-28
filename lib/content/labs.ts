/**
 * Виртуальные лабораторные работы (раздел «Физика»).
 * Каждая лаба — самостоятельный HTML/CSS/JS-бандл. Файлы кладутся в
 * public/labs/<slug>/ (точка входа index.html), либо src указывает на внешний URL.
 * Лаба открывается во встроенном окне (iframe) на странице сайта.
 */
export type Lab = {
  slug: string;
  title: string;
  description: string;
  src: string; // путь вида /labs/<slug>/index.html или внешний URL
  topicSlug?: string; // необязательная привязка к теме физики
};

export const labs: Lab[] = [
  {
    slug: "pendulum",
    title: "Математический маятник",
    description:
      "Интерактивная модель: меняйте длину нити и наблюдайте, как изменяется период колебаний.",
    src: "/labs/pendulum/index.html",
    topicSlug: "mechanical-oscillations",
  },
];

export function getLab(slug: string): Lab | undefined {
  return labs.find((l) => l.slug === slug);
}
