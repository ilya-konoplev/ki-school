import type { Metadata } from "next";
import { saveTexts, setPublicExamDate } from "@/app/admin/actions";
import { ActionForm } from "@/components/admin/ActionForm";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { textFields } from "@/lib/content/texts";
import { getPublicExamDate, getTexts } from "@/lib/site-data";

export const metadata: Metadata = { title: "Тексты сайта" };

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:border-accent focus-visible:outline-none";

export default async function AdminTextsPage() {
  const [texts, examDate] = await Promise.all([
    getTexts(),
    getPublicExamDate(),
  ]);

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Тексты сайта
        </h1>
        <p className="mt-2 text-sm text-muted">
          Здесь меняются основные тексты публичных страниц без правки кода.
        </p>
      </div>

      {/* Публичный счётчик */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-base font-semibold tracking-tight">
          Дата экзамена для публичного счётчика
        </h2>
        <p className="mt-1 text-sm text-muted">
          Используется в блоке «До экзамена осталось…» на главной (для гостей).
        </p>
        <ActionForm action={setPublicExamDate} successText="Дата сохранена" className="mt-4">
          <div className="flex flex-wrap items-end gap-3">
            <input
              type="date"
              name="public_exam_date"
              defaultValue={examDate}
              required
              className={`${inputClass} max-w-xs`}
            />
            <SubmitButton>Сохранить дату</SubmitButton>
          </div>
        </ActionForm>
      </section>

      {/* Тексты страниц */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-base font-semibold tracking-tight">
          Тексты страниц
        </h2>
        <ActionForm action={saveTexts} successText="Тексты сохранены" className="mt-4 space-y-4">
          {textFields.map((field) => (
            <div key={field.key}>
              <label
                htmlFor={field.key}
                className="mb-1 block text-sm font-medium"
              >
                {field.label}
              </label>
              {field.multiline ? (
                <textarea
                  id={field.key}
                  name={field.key}
                  defaultValue={texts[field.key]}
                  rows={field.key === "aboutParagraphs" ? 6 : 3}
                  className={`${inputClass} resize-y`}
                />
              ) : (
                <input
                  id={field.key}
                  name={field.key}
                  defaultValue={texts[field.key]}
                  className={inputClass}
                />
              )}
              {field.hint && (
                <p className="mt-1 text-xs text-muted">{field.hint}</p>
              )}
            </div>
          ))}
          <SubmitButton className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover">
            Сохранить тексты
          </SubmitButton>
        </ActionForm>
      </section>
    </div>
  );
}
