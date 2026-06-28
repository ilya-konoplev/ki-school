import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/content/site";
import { getTexts } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Свяжитесь со мной через Telegram, WhatsApp или телефон.",
};

export default async function ContactsPage() {
  const texts = await getTexts();

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Контакты
        </h1>
        <p className="mt-4 text-lg text-muted">{texts.contactsIntro}</p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {/* Способы связи */}
        <div className="space-y-3">
          <ContactLink
            href={site.contacts.telegram}
            label="Telegram"
            value="Написать в Telegram"
            external
            icon={<TelegramIcon />}
          />
          <ContactLink
            href={site.contacts.whatsapp}
            label="WhatsApp"
            value="Написать в WhatsApp"
            external
            icon={<WhatsAppIcon />}
          />
          <ContactLink
            href={site.contacts.phoneHref}
            label="Телефон"
            value={site.contacts.phone}
            icon={<PhoneIcon />}
          />
        </div>

        {/* Форма обратной связи */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight">
            Написать сообщение
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Заполните форму — я свяжусь с вами удобным способом.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </Container>
  );
}

function ContactLink({
  href,
  label,
  value,
  icon,
  external = false,
}: {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
        {icon}
      </span>
      <span>
        <span className="block text-xs uppercase tracking-wide text-muted">
          {label}
        </span>
        <span className="block font-medium text-foreground">{value}</span>
      </span>
    </a>
  );
}

function TelegramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.94 4.3 18.7 19.6c-.24 1.08-.88 1.35-1.78.84l-4.9-3.62-2.37 2.28c-.26.26-.48.48-.98.48l.35-4.98 9.06-8.19c.4-.35-.08-.55-.6-.2L4.67 13.4l-4.83-1.5c-1.05-.33-1.07-1.05.22-1.55L20.6 2.78c.87-.32 1.64.2 1.34 1.52Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.45 1.33 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm5.83 14.13c-.25.7-1.44 1.33-1.99 1.37-.53.04-1.02.24-3.42-.71-2.88-1.14-4.7-4.1-4.84-4.29-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.42-.07.65.5.25.6.84 2.08.91 2.23.07.15.12.32.02.51-.1.19-.15.32-.29.49-.14.17-.3.39-.43.52-.14.14-.29.3-.13.58.16.29.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.69-.8.87-1.08.18-.28.36-.23.6-.14.25.09 1.59.75 1.86.89.28.14.46.21.53.32.07.12.07.66-.18 1.36Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
