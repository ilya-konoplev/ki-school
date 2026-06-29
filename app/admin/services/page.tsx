import type { Metadata } from "next";
import { deleteService, saveService } from "@/app/admin/actions";
import { ActionForm } from "@/components/admin/ActionForm";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { listServicesAdmin, type AdminService } from "@/lib/admin";

export const metadata: Metadata = { title: "Услуги" };

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:border-accent focus-visible:outline-none";

export default async function AdminServicesPage() {
  const services = await listServicesAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Услуги
        </h1>
        <p className="mt-2 text-sm text-muted">
          Список услуг на странице «Услуги» и в превью на главной. Пункты – по
          одному на строку.
        </p>
      </div>

      {services.map((s) => (
        <div
          key={s.id}
          className="rounded-2xl border border-border bg-surface p-6"
        >
          <ActionForm action={saveService}>
            <ServiceFields service={s} />
            <div className="mt-4">
              <SubmitButton>Сохранить</SubmitButton>
            </div>
          </ActionForm>
          <form action={deleteService} className="mt-2">
            <input type="hidden" name="id" value={s.id} />
            <SubmitButton
              danger
              pendingText="Удаляем…"
              className="rounded-lg px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/10"
            >
              Удалить услугу
            </SubmitButton>
          </form>
        </div>
      ))}

      <div className="rounded-2xl border border-dashed border-border bg-surface p-6">
        <h2 className="mb-3 text-base font-semibold tracking-tight">
          Новая услуга
        </h2>
        <ActionForm action={saveService} successText="Услуга добавлена" resetOnSuccess>
          <ServiceFields />
          <div className="mt-4">
            <SubmitButton pendingText="Добавляем…">Добавить услугу</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </div>
  );
}

/** Поля услуги (без своей формы — оборачиваются в ActionForm). */
function ServiceFields({ service }: { service?: AdminService }) {
  return (
    <>
      {service && <input type="hidden" name="id" value={service.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">Заголовок</label>
          <input
            name="title"
            defaultValue={service?.title}
            required
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-muted">Slug</label>
            <input
              name="slug"
              defaultValue={service?.slug}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Порядок</label>
            <input
              type="number"
              name="sort_order"
              defaultValue={service?.sortOrder ?? 0}
              className={inputClass}
            />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <label className="mb-1 block text-xs text-muted">Краткое описание</label>
        <textarea
          name="summary"
          defaultValue={service?.summary}
          rows={2}
          className={`${inputClass} resize-y`}
        />
      </div>
      <div className="mt-3">
        <label className="mb-1 block text-xs text-muted">
          Пункты (по одному на строку)
        </label>
        <textarea
          name="points"
          defaultValue={service?.points.join("\n")}
          rows={4}
          className={`${inputClass} resize-y`}
        />
      </div>
    </>
  );
}
