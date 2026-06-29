"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

/**
 * Встроенное окно лабораторной (iframe) с синхронизацией темы сайта.
 * Лаба — отдельный документ и не видит класс .dark сайта, поэтому тему
 * передаём ей двумя способами:
 *   1) начально — через ?theme=light|dark в адресе (без мигания);
 *   2) при переключении — через postMessage({ type: "theme", value }) без
 *      перезагрузки (состояние лабы сохраняется).
 */
export function LabFrame({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const { theme } = useTheme();
  const [frameSrc, setFrameSrc] = useState<string | null>(null);

  // Адрес с реальной темой выставляем после монтирования (чтобы не было
  // расхождения при гидрации и сразу была правильная тема).
  useEffect(() => {
    const dark = document.documentElement.classList.contains("dark");
    const sep = src.includes("?") ? "&" : "?";
    setFrameSrc(`${src}${sep}theme=${dark ? "dark" : "light"}`);
  }, [src]);

  // При переключении темы — сообщаем лабе (без перезагрузки).
  useEffect(() => {
    ref.current?.contentWindow?.postMessage({ type: "theme", value: theme }, "*");
  }, [theme]);

  const notify = () => {
    ref.current?.contentWindow?.postMessage({ type: "theme", value: theme }, "*");
  };

  if (!frameSrc) {
    return (
      <div className="h-[70vh] min-h-[460px] w-full animate-pulse bg-surface-2" />
    );
  }

  return (
    <iframe
      ref={ref}
      src={frameSrc}
      title={title}
      onLoad={notify}
      className="h-[70vh] min-h-[460px] w-full"
      sandbox="allow-scripts allow-same-origin"
      loading="lazy"
    />
  );
}
