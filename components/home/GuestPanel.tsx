import { Button } from "@/components/ui/Button";
import { daysUntil, formatDate, pluralDays } from "@/lib/dates";
import { getPublicExamDate, getTexts } from "@/lib/site-data";

/**
 * Блок на главной для гостей (не вошедших):
 * приглашение войти + публичный счётчик дней до экзамена.
 * Дата экзамена и тексты редактируются в админке.
 */
export async function GuestPanel() {
  const [examDate, texts] = await Promise.all([
    getPublicExamDate(),
    getTexts(),
  ]);
  const days = daysUntil(examDate);

  return (
    <div className="grid items-center gap-6 rounded-3xl border border-border bg-surface p-7 sm:p-9 lg:grid-cols-2">
      <div>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {texts.guestInviteTitle}
        </h2>
        <p className="mt-2 text-muted">{texts.guestInviteText}</p>
        <div className="mt-5">
          <Button href="/login" size="lg">
            Войти в кабинет
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-accent/30 bg-accent-soft p-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
          До экзамена осталось
        </p>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-accent">
          {days > 0 ? days : 0}
        </p>
        <p className="mt-1 text-lg font-medium text-accent">{pluralDays(days)}</p>
        <p className="mt-3 text-sm text-muted">
          Пора сделать правильный выбор! · ОГЭ {formatDate(examDate)}
        </p>
      </div>
    </div>
  );
}
