import type { Metadata } from "next";
import { CabinetDashboard } from "@/components/cabinet/CabinetDashboard";
import { Container } from "@/components/ui/Container";
import { requireStudent } from "@/lib/auth";
import { getStudentDashboardForUser } from "@/lib/student";

export const metadata: Metadata = { title: "Мой прогресс" };

export default async function StudentPage() {
  const user = await requireStudent();
  const dashboard = await getStudentDashboardForUser(user.id);

  return (
    <Container className="py-14 sm:py-20">
      <p className="text-sm text-muted">
        Здравствуйте{user.fullName ? `, ${user.fullName}` : ""}!
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
        Мой прогресс
      </h1>

      <div className="mt-8">
        {dashboard ? (
          <CabinetDashboard dashboard={dashboard} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
            <p className="text-lg font-medium">Профиль ещё не настроен</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Аккаунт не привязан к ученику. Обратитесь к репетитору.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
