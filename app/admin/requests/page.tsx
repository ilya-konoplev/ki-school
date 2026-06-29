import type { Metadata } from "next";
import { deleteRequest, setRequestRead } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { listRequests } from "@/lib/admin";
import { formatDateTime } from "@/lib/dates";

export const metadata: Metadata = { title: "Заявки" };

export default async function AdminRequestsPage() {
  const requests = await listRequests();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Заявки с сайта
      </h1>
      <p className="mt-2 text-sm text-muted">
        Сообщения, оставленные через форму на странице «Контакты».
      </p>

      {requests.length === 0 ? (
        <p className="mt-8 text-muted">Заявок пока нет.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {requests.map((r) => (
            <div
              key={r.id}
              className={`rounded-2xl border p-5 ${
                r.isRead
                  ? "border-border bg-surface"
                  : "border-accent/40 bg-accent-soft"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {r.name}
                    {!r.isRead && (
                      <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                        новая
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted">{r.contact}</p>
                </div>
                <p className="font-mono text-xs text-muted">
                  {formatDateTime(r.createdAt)}
                </p>
              </div>

              <p className="mt-3 whitespace-pre-line text-sm">{r.message}</p>

              <div className="mt-4 flex gap-2">
                <form action={setRequestRead}>
                  <input type="hidden" name="id" value={r.id} />
                  <input
                    type="hidden"
                    name="is_read"
                    value={r.isRead ? "false" : "true"}
                  />
                  <SubmitButton
                    pendingText="…"
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
                  >
                    {r.isRead ? "Отметить непрочитанной" : "Отметить прочитанной"}
                  </SubmitButton>
                </form>
                <form action={deleteRequest}>
                  <input type="hidden" name="id" value={r.id} />
                  <SubmitButton
                    danger
                    pendingText="…"
                    className="rounded-lg px-3 py-1.5 text-xs text-danger transition-colors hover:bg-danger/10"
                  >
                    Удалить
                  </SubmitButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
