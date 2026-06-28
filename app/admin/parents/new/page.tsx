import type { Metadata } from "next";
import Link from "next/link";
import { CreateParentForm } from "@/components/admin/CreateParentForm";

export const metadata: Metadata = { title: "Новый родитель" };

export default function NewParentPage() {
  return (
    <div className="max-w-lg">
      <Link
        href="/admin/parents"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        ← К списку
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
        Новый родитель
      </h1>
      <p className="mt-2 text-sm text-muted">
        Логин и пароль вы передаёте родителю сами. Учеников можно добавить после
        создания профиля.
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <CreateParentForm />
      </div>
    </div>
  );
}
