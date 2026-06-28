"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/app/(site)/login/actions";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { nav, site } from "@/lib/content/site";

export type HeaderUser = { username: string; isAdmin: boolean } | null;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function SiteHeader({ user }: { user: HeaderUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Закрывать мобильное меню при смене страницы.
  useEffect(() => setOpen(false), [pathname]);

  const dashboardHref = user?.isAdmin ? "/admin" : "/cabinet";
  const dashboardLabel = user?.isAdmin ? "Админка" : "Кабинет";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label={site.name}>
          <Logo size={32} className="text-foreground" />
          <span className="font-serif text-lg font-semibold tracking-tight">
            {site.wordmark}
          </span>
        </Link>

        {/* Десктоп-навигация */}
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive(pathname, item.href)
                  ? "text-accent"
                  : "text-muted hover:bg-surface hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-2 sm:flex">
            {user ? (
              <>
                <Button href={dashboardHref} variant="secondary" size="md">
                  {dashboardLabel}
                </Button>
                <form action={logout}>
                  <button
                    type="submit"
                    className="rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    Выйти
                  </button>
                </form>
              </>
            ) : (
              <Button href="/login" variant="secondary" size="md">
                Войти
              </Button>
            )}
          </div>
          {/* Бургер для мобильных */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-surface-2 md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </Container>

      {/* Мобильное меню */}
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2.5 text-base transition-colors ${
                  isActive(pathname, item.href)
                    ? "bg-accent-soft text-accent"
                    : "text-foreground hover:bg-surface"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="mt-1 rounded-lg border border-border px-3 py-2.5 text-center text-base font-medium text-foreground hover:bg-surface"
                >
                  {dashboardLabel}
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full rounded-lg px-3 py-2.5 text-center text-base text-muted hover:bg-surface hover:text-foreground"
                  >
                    Выйти
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="mt-1 rounded-lg border border-border px-3 py-2.5 text-center text-base font-medium text-foreground hover:bg-surface"
              >
                Войти
              </Link>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
