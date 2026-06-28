import { formatDate } from "@/lib/dates";

type Comment = { id: string; body: string; createdAt: string };

export function CommentsList({ comments }: { comments: Comment[] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="text-lg font-semibold tracking-tight">
        Комментарии репетитора
      </h3>

      {comments.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          Пока нет комментариев. Они появляются примерно раз в месяц.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {comments.map((c) => (
            <li
              key={c.id}
              className="border-l-2 border-accent pl-4"
            >
              <p className="font-mono text-xs text-muted">
                {formatDate(c.createdAt)}
              </p>
              <p className="mt-1 whitespace-pre-line">{c.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
