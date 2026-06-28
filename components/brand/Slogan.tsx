import { getTexts } from "@/lib/site-data";

/**
 * Слоган сайта с выделением ключевого слова фирменным цветом.
 * Текст и выделяемое слово редактируются в админке (тексты сайта).
 * Рендерит инлайн-содержимое – вставляется внутрь <h1>, <p> и т.п.
 */
export async function Slogan() {
  const texts = await getTexts();
  const word = texts.sloganAccentWord;
  const parts = word ? texts.slogan.split(word) : [texts.slogan];

  if (parts.length < 2) return <>{texts.slogan}</>;

  const [before, ...rest] = parts;
  return (
    <>
      {before}
      <span className="text-accent">{word}</span>
      {rest.join(word)}
    </>
  );
}
