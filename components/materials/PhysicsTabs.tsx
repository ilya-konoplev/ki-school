import Link from "next/link";

const tabs = [
  { key: "topics", href: "/materials/physics", label: "Темы" },
  { key: "labs", href: "/materials/physics/labs", label: "Виртуальные лабораторные" },
] as const;

/** Переключение между темами и лабораторными работами в разделе «Физика». */
export function PhysicsTabs({ active }: { active: "topics" | "labs" }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-border bg-surface p-1">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          aria-current={active === t.key ? "page" : undefined}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            active === t.key
              ? "bg-accent text-accent-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
