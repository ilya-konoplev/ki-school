/**
 * Встраивается в <head> и выполняется ДО гидрации React,
 * чтобы тёмная тема не «мигала» при загрузке.
 * По умолчанию — светлая тема; тёмная включается только если
 * пользователь явно выбрал её ранее (сохранено в localStorage).
 * Системная тема (prefers-color-scheme) намеренно НЕ учитывается.
 */
export const THEME_STORAGE_KEY = "ki-theme";

export function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
