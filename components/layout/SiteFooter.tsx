import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Slogan } from "@/components/brand/Slogan";
import { Container } from "@/components/ui/Container";
import { nav, site } from "@/lib/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <Logo size={30} className="text-foreground" />
            <span className="font-serif text-lg font-semibold tracking-tight">
              {site.wordmark}
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted">
            <Slogan />
          </p>
          <p className="mt-1 text-sm text-muted">
            {site.tagline} · {site.author}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Разделы</h3>
          <ul className="mt-3 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Связаться</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <a href={site.contacts.telegram} className="text-sm text-muted transition-colors hover:text-foreground" target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
            </li>
            <li>
              <a href={site.contacts.whatsapp} className="text-sm text-muted transition-colors hover:text-foreground" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={site.contacts.phoneHref} className="text-sm text-muted transition-colors hover:text-foreground">
                {site.contacts.phone}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <span>
            © {year} {site.name} · konoplev ilya — school
          </span>
          <Link href="/login" className="transition-colors hover:text-foreground">
            Вход для родителей
          </Link>
        </Container>
      </div>
    </footer>
  );
}
