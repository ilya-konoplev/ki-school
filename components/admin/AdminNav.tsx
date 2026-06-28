"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Дашборд", exact: true },
  { href: "/admin/parents", label: "Родители и ученики" },
  { href: "/admin/requests", label: "Заявки" },
  { href: "/admin/services", label: "Услуги" },
  { href: "/admin/reviews", label: "Отзывы" },
  { href: "/admin/texts", label: "Тексты сайта" },
  { href: "/admin/materials", label: "Материалы" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1">
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
