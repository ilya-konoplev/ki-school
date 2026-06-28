import Link from "next/link";
import { LogoHero } from "@/components/brand/LogoHero";
import { Slogan } from "@/components/brand/Slogan";
import { GuestPanel } from "@/components/home/GuestPanel";
import { ParentPanel } from "@/components/home/ParentPanel";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getSessionUser } from "@/lib/auth";
import { getChildrenSummary } from "@/lib/cabinet";
import { homePage } from "@/lib/content/pages";
import { site } from "@/lib/content/site";
import { getServices, getTexts } from "@/lib/site-data";

export default async function Home() {
  const user = await getSessionUser();
  const [texts, servicesList] = await Promise.all([getTexts(), getServices()]);
  const students =
    user && !user.isAdmin ? await getChildrenSummary(user.id) : [];

  return (
    <>
      {/* ─────────────────────────  Hero  ───────────────────────── */}
      <section className="relative overflow-hidden">
        <Container className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:py-28">
          <div>
            <p
              className="animate-fade-up font-mono text-xs uppercase tracking-[0.18em] text-accent"
              style={{ animationDelay: "0.05s" }}
            >
              {texts.homeEyebrow}
            </p>
            <h1
              className="animate-fade-up mt-5 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
              style={{ animationDelay: "0.15s" }}
            >
              <Slogan />
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-xl text-lg text-muted"
              style={{ animationDelay: "0.25s" }}
            >
              {texts.homeDescription}
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "0.35s" }}
            >
              <Button href="/services" size="lg">
                Посмотреть услуги
              </Button>
              <Button href="/contacts" variant="secondary" size="lg">
                Связаться со мной
              </Button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <LogoHero size={280} className="w-full max-w-[280px]" />
          </div>
        </Container>

      </section>

      {/* ─────────────────────────  Состояние входа  ───────────────────────── */}
      <section className="pb-6 sm:pb-10">
        <Container>
          {user ? (
            user.isAdmin ? (
              <AdminBlock />
            ) : (
              <ParentPanel students={students} />
            )
          ) : (
            <GuestPanel />
          )}
        </Container>
      </section>

      {/* ─────────────────────────  Услуги (превью)  ───────────────────────── */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {homePage.servicesTitle}
              </h2>
              <p className="mt-2 max-w-xl text-muted">
                {homePage.servicesSubtitle}
              </p>
            </div>
            <Link
              href="/services"
              className="text-sm font-medium text-accent hover:underline"
            >
              Все услуги →
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {servicesList.map((s) => (
              <Link
                key={s.slug}
                href="/services"
                className="group rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent"
              >
                <h3 className="text-lg font-semibold tracking-tight group-hover:text-accent">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{s.summary}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ─────────────────────────  Тизер «Обо мне»  ───────────────────────── */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="rounded-3xl border border-border bg-surface p-8 sm:p-12">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              {homePage.aboutTeaserTitle}
            </p>
            <p className="mt-4 max-w-3xl text-xl leading-relaxed sm:text-2xl">
              {texts.aboutLead}
            </p>
            <div className="mt-6">
              <Button href="/about" variant="secondary">
                Подробнее обо мне
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────  Финальный CTA  ───────────────────────── */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="rounded-3xl border border-border bg-accent-soft p-8 text-center sm:p-14">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {homePage.ctaTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">{homePage.ctaText}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button href={site.contacts.telegram} target="_blank" rel="noopener noreferrer" size="lg">
                Написать в Telegram
              </Button>
              <Button href="/contacts" variant="secondary" size="lg">
                Все способы связи
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function AdminBlock() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-surface p-7 sm:p-9">
      <div>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Вы вошли как администратор
        </h2>
        <p className="mt-2 text-muted">
          Управляйте родителями, прогрессом, материалами и заявками в
          админ-панели.
        </p>
      </div>
      <Button href="/admin" size="lg">
        Перейти в админку
      </Button>
    </div>
  );
}
