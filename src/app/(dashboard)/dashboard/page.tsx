"use client";

import { useMemo } from "react";
import {
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  PiggyBank,
  Landmark,
  Plus,
  ChevronRight,
  Clock,
} from "lucide-react";
import { KPICard } from "@/components/shared/kpi-card";
import { AreaEvolutionChart, BarComparisonChart } from "@/components/charts/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, getTimeOfDay, daysUntil } from "@/lib/utils";
import { useDashboard } from "@/hooks/use-dashboard";
import { useTransactions } from "@/hooks/use-transactions";
import { useGoals } from "@/hooks/use-goals";
import Link from "next/link";

const MOCK_DASHBOARD = {
  balance: 42850.2,
  monthlyIncome: 15200.0,
  monthlyExpense: 4310.15,
  netProfit: 10889.85,
  totalInvested: 185000.0,
  totalReinvested: 28500.0,
  totalWealth: 254120.4,
  activeGoals: 5,
};

const evolutionData = [
  { name: "Jan", value: 198000 }, { name: "Fev", value: 203000 }, { name: "Mar", value: 212000 },
  { name: "Abr", value: 218000 }, { name: "Mai", value: 231000 }, { name: "Jun", value: 239000 },
  { name: "Jul", value: 243000 }, { name: "Ago", value: 248500 }, { name: "Set", value: 251000 },
  { name: "Out", value: 250000 }, { name: "Nov", value: 252800 }, { name: "Dez", value: 254120 },
];

const comparisonData = [
  { name: "Jan", income: 14200, expense: 4100 }, { name: "Fev", income: 13800, expense: 4300 },
  { name: "Mar", income: 15100, expense: 4200 }, { name: "Abr", income: 14800, expense: 4450 },
  { name: "Mai", income: 15000, expense: 4600 }, { name: "Jun", income: 15200, expense: 4310 },
];

const MOCK_GOALS = [
  { id: "1", name: "MacBook Pro M3 Max", current: 16650, target: 28000, deadline: "2026-09-15", category: "Tech" },
  { id: "2", name: "Porsche 911 Carrera", current: 50400, target: 360000, deadline: "2028-06-01", category: "Mobilidade" },
  { id: "3", name: "Viagem Japão", current: 12000, target: 40000, deadline: "2027-03-20", category: "Viagem" },
];

export default function DashboardPage() {
  const greeting = useMemo(() => getTimeOfDay(), []);
  const { data: dashboardData, loading } = useDashboard();
  const { data: transactions, loading: txLoading } = useTransactions();
  const { data: goals, loading: goalsLoading } = useGoals();

  const d = dashboardData || MOCK_DASHBOARD;
  const recentTx = transactions
    ?.filter((tx) => !tx.deleted_at)
    .slice(0, 5) || [];
  const activeGoals = goals?.filter((g) => !g.deleted_at).slice(0, 3).map((g) => ({
    ...g,
    current: Number(g.current_amount),
    target: Number(g.target_amount),
    name: g.name,
    category: g.category,
    deadline: g.deadline,
  })) || MOCK_GOALS;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-label-md text-[hsl(var(--on-surface-variant))] uppercase tracking-wider">
            {greeting}, Cristiano
          </p>
          <h1 className="text-display-lg font-display text-[hsl(var(--on-surface))] mt-1">
            Dashboard
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-body-sm text-[hsl(var(--growth-signal))]">
              {d.monthlyIncome > 0 ? `+${((d.netProfit / d.monthlyIncome) * 100).toFixed(1)}%` : "0%"} este mês
            </span>
            <span className="text-body-sm text-[hsl(var(--on-surface-variant))]">
              Crescimento patrimonial
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/movimentacoes/nova">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4" />
              Nova Movimentação
            </Button>
          </Link>
          <Link href="/investimentos">
            <Button variant="secondary" size="sm">
              Investir
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <KPICard title="Saldo Atual" value={formatCurrency(d.balance)} loading={loading} trend="up" icon={<Landmark className="w-4 h-4" />} change={null} />
        <KPICard title="Receitas do Mês" value={formatCurrency(d.monthlyIncome)} loading={loading} trend="up" icon={<ArrowDownToLine className="w-4 h-4" />} change={null} />
        <KPICard title="Despesas do Mês" value={formatCurrency(d.monthlyExpense)} loading={loading} trend="down" icon={<ArrowUpFromLine className="w-4 h-4" />} change={null} />
        <KPICard title="Total Investido" value={formatCurrency(d.totalInvested)} loading={loading} trend="up" icon={<TrendingUp className="w-4 h-4" />} change={null} />
        <KPICard title="Patrimônio Total" value={formatCurrency(d.totalWealth)} loading={loading} trend="up" icon={<PiggyBank className="w-4 h-4" />} change={null} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Evolução Patrimonial</CardTitle>
                <div className="flex gap-1">
                  {["7D", "30D", "90D", "1A", "Tudo"].map((range) => (
                    <Button key={range} variant="ghost" size="sm" className={cn("text-xs px-2 h-7", range === "1A" && "bg-[hsl(var(--surface-container))] text-[hsl(var(--on-surface))]")}>
                      {range}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AreaEvolutionChart data={evolutionData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Receitas x Despesas</CardTitle></CardHeader>
            <CardContent>
              <BarComparisonChart data={comparisonData} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Últimas Movimentações</CardTitle>
              <Link href="/historico" className="text-label-md text-[hsl(var(--primary))] hover:underline">Ver todas</Link>
            </CardHeader>
            <CardContent className="p-0">
              {txLoading ? (
                <div className="py-8 text-center text-body-sm text-[hsl(var(--muted-foreground))]">Carregando...</div>
              ) : recentTx.length === 0 ? (
                <div className="py-8 text-center text-body-sm text-[hsl(var(--muted-foreground))]">Nenhuma movimentação ainda.</div>
              ) : (
                <div className="divide-y divide-[hsl(var(--border-precision))]">
                  {recentTx.map((tx) => (
                    <div key={tx.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[hsl(var(--surface-container))] transition-colors">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                        tx.type === "income" ? "bg-[hsl(var(--growth))/15] text-[hsl(var(--growth-signal))]" :
                        tx.type === "expense" ? "bg-[hsl(var(--error))/15] text-[hsl(var(--error))]" :
                        "bg-[hsl(var(--primary))/15] text-[hsl(var(--primary))]"
                      )}>
                        {tx.type === "income" ? <ArrowDownToLine className="w-4 h-4" /> :
                         tx.type === "expense" ? <ArrowUpFromLine className="w-4 h-4" /> :
                         <TrendingUp className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm text-[hsl(var(--on-surface))] truncate">{tx.description}</p>
                        <p className="text-label-md text-[hsl(var(--on-surface-variant))]">{tx.date}</p>
                      </div>
                      <span className={cn("text-body-sm font-medium tabular-nums", tx.type === "income" ? "text-[hsl(var(--growth-signal))]" : "text-[hsl(var(--on-surface))]")}>
                        {tx.type === "income" ? "+" : tx.type === "expense" ? "-" : ""}{formatCurrency(Number(tx.amount))}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Próximas Metas</CardTitle>
              <Link href="/metas" className="text-label-md text-[hsl(var(--primary))] hover:underline">Ver todas</Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {goalsLoading ? (
                <div className="py-4 text-center text-body-sm text-[hsl(var(--muted-foreground))]">Carregando...</div>
              ) : (
                activeGoals.map((goal) => {
                  const remaining = daysUntil(goal.deadline);
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-body-sm text-[hsl(var(--on-surface))]">{goal.name}</p>
                          <p className="text-label-md text-[hsl(var(--on-surface-variant))]">{goal.category}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                      </div>
                      <ProgressBar value={goal.current} max={goal.target} size="sm" />
                      <div className="flex justify-between text-label-md text-[hsl(var(--muted-foreground))]">
                        <span>{formatCurrency(goal.current)} de {formatCurrency(goal.target)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{remaining} dias</span>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
