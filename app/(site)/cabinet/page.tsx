import type { Metadata } from "next";
import { CabinetDashboard } from "@/components/cabinet/CabinetDashboard";
import { ChildSwitcher } from "@/components/cabinet/ChildSwitcher";
import { Container } from "@/components/ui/Container";
import { requireParent } from "@/lib/auth";
import { getChildren, getDashboard } from "@/lib/cabinet";

export const metadata: Metadata = {
  title: "Личный кабинет",
};

export default async function CabinetPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const user = await requireParent();
  const { child } = await searchParams;

  const children = await getChildren(user.id);

  if (children.length === 0) {
    return (
      <Container className="py-14 sm:py-20">
        <h1 className="text-3xl font-semibold tracking-tight">Личный кабинет</h1>
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-lg font-medium">Пока нет привязанных учеников</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Как только репетитор добавит ученика к вашему профилю, здесь появится
            его прогресс. Если это ошибка — напишите мне.
          </p>
        </div>
      </Container>
    );
  }

  const activeId =
    child && children.some((c) => c.id === child) ? child : children[0].id;
  const dashboard = await getDashboard(activeId);
  const activeChild = children.find((c) => c.id === activeId);

  return (
    <Container className="py-14 sm:py-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            Здравствуйте{user.fullName ? `, ${user.fullName}` : ""}!
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            {children.length > 1
              ? "Прогресс детей"
              : `Прогресс · ${activeChild?.fullName ?? ""}`}
          </h1>
        </div>
      </div>

      {children.length > 1 && (
        <div className="mt-6">
          <ChildSwitcher students={children} activeId={activeId} />
        </div>
      )}

      <div className="mt-8">
        {dashboard ? (
          <CabinetDashboard dashboard={dashboard} />
        ) : (
          <p className="text-muted">Не удалось загрузить данные ученика.</p>
        )}
      </div>
    </Container>
  );
}
