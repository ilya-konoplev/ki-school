import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/(site)/login/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Container } from "@/components/ui/Container";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Админка", template: "%s · Админка ki-school" },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Logo size={30} className="text-foreground" />
            <span className="font-serif text-lg font-semibold tracking-tight">
              Админка
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-foreground sm:block"
            >
              На сайт ↗
            </Link>
            <ThemeToggle />
            <form action={logout}>
              <button
                type="submit"
                className="rounded-xl border border-border px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
              >
                Выйти
              </button>
            </form>
          </div>
        </Container>
        <Container className="pb-3">
          <AdminNav />
        </Container>
      </header>

      <main className="flex-1 py-8">
        <Container>
          <p className="mb-6 text-sm text-muted">
            Здравствуйте, {user.fullName ?? user.username}!
          </p>
          {children}
        </Container>
      </main>
    </div>
  );
}
