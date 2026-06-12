"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[hsl(var(--background-base))]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <TopBar sidebarCollapsed={sidebarCollapsed} />
      <main
        className={cn(
          "pt-16 pb-8 transition-all duration-300",
          sidebarCollapsed ? "ml-[68px]" : "ml-[280px]"
        )}
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-[1440px] mx-auto">
          {children}
        </div>
      </main>

      {/* Atmospheric background effects (dark mode only) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[60%] h-[60%] rounded-full bg-[hsl(var(--primary))/0.04] blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[hsl(var(--growth))/0.03] blur-[100px]" />
      </div>
    </div>
  );
}
