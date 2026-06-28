/**
 * Единый источник правды по сайту: бренд, контакты, навигация, дата экзамена.
 * Позже эти значения станут редактируемыми через админку (п.7) и/или БД (п.4).
 * Контакты сейчас – ЗАГЛУШКИ, Илья подставит реальные.
 */
export const site = {
  name: "ki-school",
  wordmark: "ki-school",
  author: "Илья Коноплёв",
  authorShort: "Илья",
  slogan: "Растут не только оценки, но и уверенность",
  // Слово в слогане, которое выделяется фирменным цветом.
  sloganAccentWord: "уверенность",
  tagline: "Репетитор по физике и математике",
  description:
    "Помогаю школьникам разобраться в физике и математике, подготовиться к ОГЭ и перестать бояться этих предметов. Объясняю просто, по делу и до результата.",

  // Публичный счётчик на главной (п.6). Редактируется в админке.
  publicExamDate: "2027-05-31",

  // Контакты Ильи. WhatsApp ищется по тому же номеру телефона.
  contacts: {
    telegram: "https://t.me/ki_school",
    whatsapp: "https://wa.me/79208443706",
    phone: "+7 920 844-37-06",
    phoneHref: "tel:+79208443706",
    email: "",
  },

  // Профиль на profi.ru.
  profiUrl: "https://profi.ru/profile/KonoplevIA5",
};

export type NavItem = { href: string; label: string };

export const nav: NavItem[] = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "Обо мне" },
  { href: "/services", label: "Услуги" },
  { href: "/materials", label: "Материалы" },
  { href: "/reviews", label: "Отзывы" },
  { href: "/contacts", label: "Контакты" },
];
