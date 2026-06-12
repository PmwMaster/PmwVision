"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  ArrowDownUp,
  TrendingUp,
  RefreshCw,
  Target,
  Building2,
  Clock,
  Plus,
  Crown,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orcamento", label: "Orçamento", icon: Wallet },
  { href: "/movimentacoes", label: "Movimentações", icon: ArrowDownUp },
  { href: "/investimentos", label: "Investimentos", icon: TrendingUp },
  { href: "/reinvestimentos", label: "Reinvestimentos", icon: RefreshCw },
  { href: "/metas", label: "Metas", icon: Target },
  { href: "/patrimonio", label: "Patrimônio", icon: Building2 },
  { href: "/historico", label: "Histórico", icon: Clock },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-[hsl(var(--surface))] border-r border-[hsl(var(--border-precision))] transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[280px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-[hsl(var(--border-precision))] shrink-0">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[hsl(var(--primary))] flex items-center justify-center">
              <span className="text-[hsl(var(--primary-foreground))] text-label-md font-bold">P</span>
            </div>
            <span className="text-headline-md text-[hsl(var(--on-surface))] font-display">
              PMW Vision
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="w-8 h-8 rounded bg-[hsl(var(--primary))] flex items-center justify-center">
              <span className="text-[hsl(var(--primary-foreground))] text-label-md font-bold">P</span>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scroll-hide py-2 px-2">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Tooltip key={item.href} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded text-body-sm transition-all duration-150",
                      isActive
                        ? "bg-[hsl(var(--secondary-container))] text-[hsl(var(--secondary-container-foreground))]"
                        : "text-[hsl(var(--on-surface-variant))] hover:bg-[hsl(var(--surface-container))] hover:text-[hsl(var(--on-surface))]"
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-4">
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Link
                href="/movimentacoes/nova"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded text-body-sm transition-all duration-150",
                  "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90"
                )}
              >
                <Plus className="w-5 h-5 shrink-0" />
                {!collapsed && <span>Nova Movimentação</span>}
              </Link>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Nova Movimentação</TooltipContent>
            )}
          </Tooltip>
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[hsl(var(--border-precision))] p-2 shrink-0">
        {!collapsed && (
          <div className="mb-2 px-3 py-2 rounded bg-[hsl(var(--tertiary-container))]/10 border border-[hsl(var(--tertiary))/20]">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-[hsl(var(--tertiary))]" />
              <span className="text-label-md text-[hsl(var(--tertiary))]">Plano Premium</span>
            </div>
          </div>
        )}
        <div className="space-y-0.5">
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Link
                href="/configuracoes"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded text-body-sm transition-all duration-150",
                  "text-[hsl(var(--on-surface-variant))] hover:bg-[hsl(var(--surface-container))] hover:text-[hsl(var(--on-surface))]"
                )}
              >
                <Settings className="w-5 h-5 shrink-0" />
                {!collapsed && <span>Configurações</span>}
              </Link>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Configurações</TooltipContent>}
          </Tooltip>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded text-body-sm transition-all duration-150 mt-1",
            "text-[hsl(var(--on-surface-variant))] hover:bg-[hsl(var(--surface-container))] hover:text-[hsl(var(--on-surface))]"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 shrink-0" />
              <span>Recolher</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
