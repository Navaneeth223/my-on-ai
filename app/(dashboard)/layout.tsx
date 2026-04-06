import { getServerSession } from "next-auth/next";
import type { ReactNode } from "react";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { authOptions } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await getServerSession(authOptions);
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
