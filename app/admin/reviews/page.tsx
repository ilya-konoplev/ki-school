import type { Metadata } from "next";
import { deleteReview, saveReview } from "@/app/admin/actions";
import { ActionForm } from "@/components/admin/ActionForm";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { listReviewsAdmin, type AdminReview } from "@/lib/admin";

export const metadata: Metadata = { title: "Отзывы" };

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:border-accent focus-visible:outline-none";

export default async function AdminReviewsPage() {
  const reviews = await listReviewsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Отзывы
        </h1>
        <p className="mt-2 text-sm text-muted">
          Отзывы со страницы «Отзывы» (перенос с profi.ru вручную).
        </p>
      </div>

      {reviews.map((r) => (
        <div
          key={r.id}
          className="rounded-2xl border border-border bg-surface p-6"
        >
          <ActionForm action={saveReview}>
            <ReviewFields review={r} />
            <div className="mt-4">
              <SubmitButton>Сохранить</SubmitButton>
            </div>
          </ActionForm>
          <form action={deleteReview} className="mt-2">
            <input type="hidden" name="id" value={r.id} />
            <SubmitButton
              danger
              pendingText="Удаляем…"
              className="rounded-lg px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/10"
            >
              Удалить отзыв
            </SubmitButton>
          </form>
        </div>
      ))}

      <div className="rounded-2xl border border-dashed border-border bg-surface p-6">
        <h2 className="mb-3 text-base font-semibold tracking-tight">
          Новый отзыв
        </h2>
        <ActionForm action={saveReview} successText="Отзыв добавлен" resetOnSuccess>
          <ReviewFields />
          <div className="mt-4">
            <SubmitButton pendingText="Добавляем…">Добавить отзыв</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}

/** Поля отзыва (без своей формы — оборачиваются в ActionForm). */
function ReviewFields({ review }: { review?: AdminReview }) {
  return (
    <>
      {review && <input type="hidden" name="id" value={review.id} />}
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs text-muted">Автор</label>
          <input
            name="author"
            defaultValue={review?.author}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">
            Подпись (класс и т.п.)
          </label>
          <input
            name="meta"
            defaultValue={review?.meta ?? ""}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-muted">Оценка 1–5</label>
            <input
              type="number"
              name="rating"
              min={1}
              max={5}
              defaultValue={review?.rating ?? 5}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Порядок</label>
            <input
              type="number"
              name="sort_order"
              defaultValue={review?.sortOrder ?? 0}
              className={inputClass}
            />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <label className="mb-1 block text-xs text-muted">Текст отзыва</label>
        <textarea
          name="body"
          defaultValue={review?.body}
          required
          rows={3}
          className={`${inputClass} resize-y`}
        />
      </div>
    </>
  );
}
