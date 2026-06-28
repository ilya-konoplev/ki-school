import Link from "next/link";
import { adminStats } from "@/lib/admin";

export default async function AdminDashboard() {
  const stats = await adminStats();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Панель управления
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Родителей" value={stats.parents} href="/admin/parents" />
        <Stat label="Учеников" value={stats.students} href="/admin/parents" />
        <Stat
          label="Новых заявок"
          value={stats.unreadRequests}
          href="/admin/requests"
          accent={stats.unreadRequests > 0}
        />
      </div>

      <h2 className="mt-10 text-lg font-semibold tracking-tight">Разделы</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SectionCard
          href="/admin/parents"
          title="Родители и ученики"
          text="Создавайте родителей, добавляйте учеников, отмечайте прогресс, занятия и комментарии."
        />
        <SectionCard
          href="/admin/requests"
          title="Заявки"
          text="Сообщения, оставленные через форму на странице «Контакты»."
        />
        <SectionCard
          href="/admin/services"
          title="Услуги"
          text="Список услуг на сайте – добавляйте, редактируйте, удаляйте."
        />
        <SectionCard
          href="/admin/reviews"
          title="Отзывы"
          text="Отзывы учеников и родителей (перенос с profi.ru)."
        />
        <SectionCard
          href="/admin/texts"
          title="Тексты сайта"
          text="Слоган, описания, тексты «Обо мне», «Услуги», «Контакты», дата публичного счётчика."
        />
        <SectionCard
          href="/admin/materials"
          title="Материалы"
          text="Как добавлять конспекты тем и виртуальные лабораторные работы."
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  accent = false,
}: {
  label: string;
  value: number;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-2xl border p-6 transition-colors hover:border-accent ${
        accent ? "border-accent/40 bg-accent-soft" : "border-border bg-surface"
      }`}
    >
      <p className="text-sm text-muted">{label}</p>
      <p
        className={`mt-1 text-3xl font-semibold tracking-tight ${accent ? "text-accent" : ""}`}
      >
        {value}
      </p>
    </Link>
  );
}

function SectionCard({
  href,
  title,
  text,
}: {
  href: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent"
    >
      <h3 className="font-semibold tracking-tight group-hover:text-accent">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted">{text}</p>
    </Link>
  );
}
