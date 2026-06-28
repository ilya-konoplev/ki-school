import Link from "next/link";
import type { Child } from "@/lib/cabinet";

/** Переключатель детей (если у родителя их несколько). */
export function ChildSwitcher({
  students,
  activeId,
}: {
  students: Child[];
  activeId: string;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-border bg-surface p-1">
      {students.map((child) => (
        <Link
          key={child.id}
          href={`/cabinet?child=${child.id}`}
          aria-current={child.id === activeId ? "page" : undefined}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            child.id === activeId
              ? "bg-accent text-accent-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          {child.fullName}
        </Link>
      ))}
    </div>
  );
}
