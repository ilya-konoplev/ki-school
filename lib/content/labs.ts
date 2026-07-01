/**
 * Виртуальные лабораторные работы (раздел «Физика»).
 * Каждая лаба – самостоятельный HTML/CSS/JS-бандл. Файлы кладутся в
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
      "Меняйте длину нити и наблюдайте, как изменяется период колебаний.",
    src: "/labs/pendulum/index.html",
    topicSlug: "mechanical-oscillations",
  },
  {
  slug: "atom",
  title: "Модель атома Резерфорда",
  description: "Модель атома, разработанная Резерфордом в 1911 году. Так же известна, как планетарная модель",
  src: "/labs/atom/index.html",
  topicSlug: "rutherford-atom",
},
{
  slug: "diffusion",
  title: "Диффузия тел",
  description: "Меняйте количество вещества и интенсивность диффузии",
  src: "/labs/diffusion/index.html",
  topicSlug: "diffusion-brownian",
},
{
  slug: "resistor",
  title: "Резистор",
  description: "Регулируя сопротивление и напряжение мы можем заметить, что нагрев резистора увеличвается.",
  src: "/labs/resistor/index.html",
  topicSlug: "current-basics",
},
];

export function getLab(slug: string): Lab | undefined {
  return labs.find((l) => l.slug === slug);
}
