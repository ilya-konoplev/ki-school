import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSessionUser } from "@/lib/auth";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getSessionUser();
  const headerUser = user
    ? { username: user.username, isAdmin: user.isAdmin, role: user.role }
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={headerUser} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
