/**
 * Структура раздела «Материалы»: темы по физике (Приложение А) и
 * математике (Приложение Б). Каждая тема имеет стабильный slug — по нему
 * ищется markdown-файл с содержимым: content/materials/<subject>/<slug>.md
 * (Илья пишет тему в Obsidian и кладёт файл с таким именем).
 *
 * Иерархия: предмет → раздел (section) → подраздел (group, опционально) → тема.
 */

export type Topic = { slug: string; title: string };
export type Group = { title?: string; topics: Topic[] };
export type Section = { title: string; groups: Group[] };

export type SubjectKey = "physics" | "math";

export type Subject = {
  key: SubjectKey;
  title: string;
  short: string;
  description: string;
  sections: Section[];
};

const physics: Subject = {
  key: "physics",
  title: "Физика",
  short: "Физика",
  description:
    "Все темы ОГЭ по физике — от механики до квантовых явлений, а также экспериментальные задания и виртуальные лабораторные работы.",
  sections: [
    {
      title: "Механические явления",
      groups: [
        {
          title: "Кинематика",
          topics: [
            { slug: "mech-motion", title: "Механическое движение, его относительность" },
            { slug: "uniform-accelerated", title: "Равномерное и равноускоренное движение" },
            { slug: "motion-graphs", title: "Графики зависимости пути, скорости и координаты от времени" },
            { slug: "free-fall", title: "Свободное падение" },
            { slug: "circular-motion", title: "Движение по окружности: скорость, период, частота, центростремительное ускорение" },
          ],
        },
        {
          title: "Динамика",
          topics: [
            { slug: "newton-laws", title: "Законы Ньютона" },
            { slug: "forces", title: "Силы в природе: тяжести, упругости (закон Гука), трения" },
            { slug: "gravitation", title: "Закон всемирного тяготения" },
          ],
        },
        {
          title: "Законы сохранения",
          topics: [
            { slug: "impulse", title: "Импульс тела и закон сохранения импульса" },
            { slug: "work-power", title: "Механическая работа и мощность" },
            { slug: "energy", title: "Кинетическая и потенциальная энергия" },
            { slug: "energy-conservation", title: "Закон сохранения механической энергии" },
          ],
        },
        {
          title: "Статика и гидростатика",
          topics: [
            { slug: "simple-machines", title: "Простые механизмы: рычаг, блоки" },
            { slug: "moment-equilibrium", title: "Момент силы, условие равновесия рычага, КПД механизмов" },
            { slug: "pressure", title: "Давление твёрдых тел, жидкостей и газов" },
            { slug: "pascal-law", title: "Закон Паскаля" },
            { slug: "archimedes-law", title: "Закон Архимеда, условие плавания тел" },
          ],
        },
        {
          title: "Колебания и волны",
          topics: [
            { slug: "mechanical-oscillations", title: "Механические колебания: амплитуда, период, частота" },
            { slug: "mechanical-waves-sound", title: "Механические волны, звук" },
          ],
        },
      ],
    },
    {
      title: "Тепловые явления",
      groups: [
        {
          title: "Молекулярно-кинетическая теория (МКТ)",
          topics: [
            { slug: "matter-structure", title: "Строение вещества, агрегатные состояния" },
            { slug: "diffusion-brownian", title: "Диффузия, броуновское движение" },
            { slug: "thermal-expansion", title: "Тепловое расширение" },
          ],
        },
        {
          title: "Тепловые процессы",
          topics: [
            { slug: "internal-energy", title: "Внутренняя энергия и способы её изменения" },
            { slug: "heat-transfer", title: "Виды теплопередачи: теплопроводность, конвекция, излучение" },
            { slug: "heat-quantity", title: "Расчёт количества теплоты при нагревании, плавлении, парообразовании, сгорании топлива" },
            { slug: "heat-balance", title: "Уравнение теплового баланса" },
          ],
        },
        {
          title: "Тепловые машины",
          topics: [
            { slug: "heat-engines", title: "Принципы работы тепловых двигателей, КПД" },
          ],
        },
      ],
    },
    {
      title: "Электромагнитные явления",
      groups: [
        {
          title: "Электростатика",
          topics: [
            { slug: "electrification", title: "Электризация тел, закон сохранения электрического заряда" },
            { slug: "coulomb-law", title: "Взаимодействие зарядов, закон Кулона" },
            { slug: "electric-field", title: "Электрическое поле" },
            { slug: "conductors-dielectrics", title: "Проводники и диэлектрики" },
          ],
        },
        {
          title: "Постоянный электрический ток",
          topics: [
            { slug: "current-basics", title: "Сила тока, напряжение, сопротивление, удельное сопротивление" },
            { slug: "ohm-law", title: "Закон Ома для участка цепи" },
            { slug: "series-parallel", title: "Последовательное и параллельное соединение проводников" },
            { slug: "electric-power", title: "Работа и мощность электрического тока" },
            { slug: "joule-lenz", title: "Закон Джоуля-Ленца" },
          ],
        },
        {
          title: "Магнитные явления",
          topics: [
            { slug: "magnetic-field", title: "Магнитное поле тока, опыт Эрстеда" },
            { slug: "magnetic-force", title: "Действие магнитного поля на проводник с током" },
            { slug: "electromagnetic-induction", title: "Электромагнитная индукция, опыты Фарадея, правило Ленца" },
          ],
        },
        {
          title: "Оптика",
          topics: [
            { slug: "light-propagation", title: "Прямолинейное распространение света" },
            { slug: "reflection-refraction", title: "Законы отражения и преломления света" },
            { slug: "lenses", title: "Линзы, фокусное расстояние и оптическая сила линзы" },
            { slug: "eye-optics", title: "Глаз как оптическая система" },
          ],
        },
      ],
    },
    {
      title: "Квантовые явления",
      groups: [
        {
          topics: [
            { slug: "radioactivity", title: "Радиоактивность: виды излучений (альфа, бета, гамма)" },
            { slug: "rutherford-atom", title: "Опыты Резерфорда, планетарная модель атома" },
            { slug: "nucleus", title: "Состав атомного ядра: протоны, нейтроны, изотопы" },
            { slug: "nuclear-reactions", title: "Ядерные реакции, законы сохранения зарядового и массового чисел" },
            { slug: "half-life", title: "Период полураспада" },
          ],
        },
      ],
    },
    {
      title: "Экспериментальные задания (задание 17)",
      groups: [
        {
          topics: [
            { slug: "exp-mechanics", title: "Механика: плотность, сила Архимеда, жёсткость пружины, трение, момент силы, КПД" },
            { slug: "exp-electricity", title: "Электричество: сборка цепей, измерение тока, напряжения, сопротивления, ВАХ" },
            { slug: "exp-optics", title: "Оптика: фокусное расстояние и оптическая сила линзы, получение изображений" },
          ],
        },
      ],
    },
  ],
};

const math: Subject = {
  key: "math",
  title: "Математика",
  short: "Математика",
  description:
    "Все темы ОГЭ по математике: числа и вычисления, алгебра, уравнения, функции, геометрия, вероятность и статистика.",
  sections: [
    {
      title: "1. Числа и вычисления",
      groups: [
        {
          topics: [
            { slug: "natural-integers", title: "1.1 Натуральные и целые числа. Признаки делимости" },
            { slug: "fractions-percents", title: "1.2 Обыкновенные и десятичные дроби, проценты, периодические дроби" },
            { slug: "rational-numbers", title: "1.3 Рациональные числа и операции с ними" },
            { slug: "real-numbers", title: "1.4 Действительные числа и операции с ними" },
            { slug: "approximations", title: "1.5 Приближённые вычисления, округление, прикидка и оценка" },
          ],
        },
      ],
    },
    {
      title: "2. Алгебраические выражения",
      groups: [
        {
          topics: [
            { slug: "literal-expressions", title: "2.1 Буквенные выражения (выражения с переменными)" },
            { slug: "powers", title: "2.2 Степень с целым и рациональным показателем. Свойства степени" },
            { slug: "polynomials", title: "2.3 Многочлены" },
            { slug: "algebraic-fractions", title: "2.4 Алгебраическая дробь" },
            { slug: "radicals", title: "2.5 Арифметический корень натуральной степени" },
          ],
        },
      ],
    },
    {
      title: "3. Уравнения и неравенства",
      groups: [
        {
          topics: [
            { slug: "equations", title: "3.1 Целые и дробно-рациональные уравнения. Системы и совокупности" },
            { slug: "inequalities", title: "3.2 Целые и дробно-рациональные неравенства. Системы и совокупности" },
            { slug: "word-problems", title: "3.3 Решение текстовых задач" },
          ],
        },
      ],
    },
    {
      title: "4. Числовые последовательности",
      groups: [
        {
          topics: [
            { slug: "sequences", title: "4.1 Последовательности, способы задания" },
            { slug: "progressions", title: "4.2 Арифметическая и геометрическая прогрессии. Сложные проценты" },
          ],
        },
      ],
    },
    {
      title: "5. Функции",
      groups: [
        {
          topics: [
            { slug: "functions", title: "5.1 Функция, способы задания, график; область определения, нули, монотонность, экстремумы" },
          ],
        },
      ],
    },
    {
      title: "6. Координаты",
      groups: [
        {
          topics: [
            { slug: "number-line", title: "6.1 Координатная прямая" },
            { slug: "cartesian-coordinates", title: "6.2 Декартовы координаты на плоскости" },
          ],
        },
      ],
    },
    {
      title: "7. Геометрия",
      groups: [
        {
          topics: [
            { slug: "geometric-figures", title: "7.1 Геометрические фигуры и их свойства" },
            { slug: "triangle", title: "7.2 Треугольник" },
            { slug: "polygons", title: "7.3 Многоугольники" },
            { slug: "circle", title: "7.4 Окружность и круг" },
            { slug: "geometric-measurement", title: "7.5 Измерение геометрических величин" },
            { slug: "vectors", title: "7.6 Векторы на плоскости" },
          ],
        },
      ],
    },
    {
      title: "8. Вероятность и статистика",
      groups: [
        {
          topics: [
            { slug: "descriptive-statistics", title: "8.1 Описательная статистика" },
            { slug: "probability", title: "8.2 Вероятность" },
            { slug: "combinatorics", title: "8.3 Комбинаторика" },
            { slug: "sets", title: "8.4 Множества" },
            { slug: "graphs", title: "8.5 Графы" },
          ],
        },
      ],
    },
  ],
};

export const subjects: Record<SubjectKey, Subject> = { physics, math };

export const subjectList: Subject[] = [physics, math];

export function getSubject(key: string): Subject | undefined {
  return key === "physics" || key === "math" ? subjects[key] : undefined;
}

/** Плоский список всех тем предмета (в порядке программы). */
export function flatTopics(subject: Subject): Topic[] {
  return subject.sections.flatMap((s) => s.groups.flatMap((g) => g.topics));
}

export function getTopic(
  subjectKey: SubjectKey,
  slug: string,
): { subject: Subject; topic: Topic; prev?: Topic; next?: Topic } | undefined {
  const subject = subjects[subjectKey];
  const all = flatTopics(subject);
  const idx = all.findIndex((t) => t.slug === slug);
  if (idx === -1) return undefined;
  return {
    subject,
    topic: all[idx],
    prev: all[idx - 1],
    next: all[idx + 1],
  };
}

/** Количество тем в предмете — для прогресс-баров (п.5). */
export function topicsCount(subject: Subject): number {
  return flatTopics(subject).length;
}
