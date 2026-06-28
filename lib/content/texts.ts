/**
 * Редактируемые тексты сайта. В БД (site_settings, ключ 'texts') хранятся только
 * изменённые поля; всё остальное берётся из этих значений по умолчанию.
 */
import { aboutPage, homePage } from "./pages";
import { site } from "./site";

export type SiteTexts = {
  slogan: string;
  sloganAccentWord: string;
  homeEyebrow: string;
  homeDescription: string;
  aboutLead: string;
  aboutParagraphs: string; // абзацы через пустую строку
  servicesIntro: string;
  contactsIntro: string;
  guestInviteTitle: string;
  guestInviteText: string;
};

export const defaultTexts: SiteTexts = {
  slogan: site.slogan,
  sloganAccentWord: site.sloganAccentWord,
  homeEyebrow: homePage.eyebrow,
  homeDescription: site.description,
  aboutLead: aboutPage.lead,
  aboutParagraphs: aboutPage.paragraphs.join("\n\n"),
  servicesIntro:
    "Готовлю к ОГЭ по физике и математике и помогаю подтянуть школьную оценку. Формат и интенсивность подбираем под цель ученика.",
  contactsIntro:
    "Свяжитесь со мной через Telegram или WhatsApp — отвечаю быстро. Можно также позвонить или заполнить форму ниже.",
  guestInviteTitle: "Хотите видеть прогресс ребёнка?",
  guestInviteText:
    "Войдите по логину и паролю, которые выдал репетитор, — и следите за пройденными темами, ближайшим занятием и комментариями.",
};

/** Подписи полей для формы в админке. */
export const textFields: {
  key: keyof SiteTexts;
  label: string;
  multiline?: boolean;
  hint?: string;
}[] = [
  { key: "slogan", label: "Слоган (hero на главной)" },
  {
    key: "sloganAccentWord",
    label: "Слово в слогане для выделения цветом",
    hint: "Должно встречаться в тексте слогана.",
  },
  { key: "homeEyebrow", label: "Надпись над заголовком (главная)" },
  { key: "homeDescription", label: "Описание под слоганом (главная)", multiline: true },
  { key: "guestInviteTitle", label: "Заголовок блока входа (для гостей)" },
  { key: "guestInviteText", label: "Текст блока входа (для гостей)", multiline: true },
  { key: "aboutLead", label: "«Обо мне» — вступление", multiline: true },
  {
    key: "aboutParagraphs",
    label: "«Обо мне» — абзацы",
    multiline: true,
    hint: "Каждый абзац — с новой строки (через пустую строку).",
  },
  { key: "servicesIntro", label: "«Услуги» — вступление", multiline: true },
  { key: "contactsIntro", label: "«Контакты» — вступление", multiline: true },
];
