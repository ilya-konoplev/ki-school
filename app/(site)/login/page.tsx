import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Вход для родителей",
  description: "Вход в личный кабинет для родителей учеников.",
};

export default function LoginPage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-md">
        <div className="flex flex-col items-center text-center">
          <Logo size={44} className="text-foreground" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Вход для родителей
          </h1>
          <p className="mt-2 text-sm text-muted">
            Войдите по логину и паролю, которые выдал репетитор, чтобы видеть
            прогресс ребёнка.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <LoginForm />
        </div>

        <p className="mt-5 text-center text-sm text-muted">
          Нет доступа?{" "}
          <a href="/contacts" className="text-accent hover:underline">
            Свяжитесь со мной
          </a>
        </p>
      </div>
    </Container>
  );
}
