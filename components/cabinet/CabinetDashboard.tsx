import type { Dashboard } from "@/lib/cabinet";
import { daysUntil, formatDate, formatDateTime, pluralDays } from "@/lib/dates";
import { AddToCalendarButton } from "./AddToCalendarButton";
import { CommentsList } from "./CommentsList";
import { SubjectProgressCard } from "./SubjectProgressCard";

export function CabinetDashboard({ dashboard }: { dashboard: Dashboard }) {
  const { student, nextLesson, subjects, comments } = dashboard;
  const examDays = student.examDate ? daysUntil(student.examDate) : null;

  return (
    <div className="space-y-8">
      {/* Верхние карточки: ближайшее занятие и счётчик до ОГЭ */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-muted">Следующее занятие</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight">
            {nextLesson ? formatDateTime(nextLesson.scheduledAt) : "Не назначено"}
          </p>
          {nextLesson?.note && (
            <p className="mt-1 text-sm text-muted">{nextLesson.note}</p>
          )}
          {nextLesson && (
            <div className="mt-4">
              <AddToCalendarButton
                title="Занятие с репетитором · ki-school"
                startISO={nextLesson.scheduledAt}
                durationMinutes={60}
                description={nextLesson.note ?? undefined}
              />
            </div>
          )}
        </div>
        <StatCard
          label="До экзамена (ОГЭ)"
          value={
            examDays !== null
              ? examDays > 0
                ? `${examDays} ${pluralDays(examDays)}`
                : "Уже скоро"
              : "Дата не задана"
          }
          hint={student.examDate ? formatDate(student.examDate) : undefined}
          accent
        />
      </div>

      {/* Прогресс по предметам */}
      <div className="grid gap-4 lg:grid-cols-2">
        {subjects.map((s) => (
          <SubjectProgressCard key={s.key} data={s} />
        ))}
      </div>

      {/* Комментарии репетитора */}
      <CommentsList comments={comments} />
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        accent ? "border-accent/30 bg-accent-soft" : "border-border bg-surface"
      }`}
    >
      <p className="text-sm text-muted">{label}</p>
      <p
        className={`mt-1.5 text-2xl font-semibold tracking-tight ${
          accent ? "text-accent" : ""
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
}
