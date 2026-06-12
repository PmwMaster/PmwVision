"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/shared/kpi-card";
import { AreaEvolutionChart } from "@/components/charts/charts";
import { formatCurrency } from "@/lib/utils";
import { useDashboard } from "@/hooks/use-dashboard";
import { useDashboardEvolution } from "@/hooks/use-dashboard-evolution";
import { Building2, TrendingUp, PiggyBank, DollarSign } from "lucide-react";
import { useState } from "react";

const MOCK_WEALTH = {
  patrimonio: 278000,
  lucroAcumulado: 54120.40,
  crescimento: 13.4,
  rendimento: 28500,
};

export default function WealthPage() {
  const { data: dashboardData, loading } = useDashboard();
  const [range, setRange] = useState("1A");
  const { data: evolutionData, isLoading: evoLoading } = useDashboardEvolution(range);

  const d = dashboardData || {
    totalWealth: MOCK_WEALTH.patrimonio,
    netProfit: MOCK_WEALTH.lucroAcumulado,
    totalInvested: 185000,
    monthlyIncome: 15200,
    monthlyExpense: 4310.15,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <p className="text-label-md text-[hsl(var(--on-surface-variant))] uppercase tracking-wider">Crescimento Patrimonial</p>
        <h1 className="text-display-lg font-display text-[hsl(var(--on-surface))] mt-1">Patrimônio</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard title="Patrimônio Atual" value={formatCurrency(d.totalWealth)} loading={loading} trend="up" icon={<Building2 className="w-4 h-4" />} change={null} />
        <KPICard title="Lucro Acumulado" value={formatCurrency(d.netProfit)} loading={loading} trend="up" icon={<TrendingUp className="w-4 h-4" />} change={null} />
        <KPICard title="Total Investido" value={formatCurrency(d.totalInvested)} loading={loading} trend="up" icon={<PiggyBank className="w-4 h-4" />} change={null} />
        <KPICard title="Receita Mensal" value={formatCurrency(d.monthlyIncome)} loading={loading} trend="up" icon={<DollarSign className="w-4 h-4" />} change={null} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Evolução Patrimonial</CardTitle>
            <div className="flex gap-1">
              {[{ key: "7D", label: "7D" }, { key: "30D", label: "30D" }, { key: "90D", label: "90D" }, { key: "1A", label: "1A" }, { key: "Tudo", label: "Tudo" }].map((r) => (
                <button key={r.key} onClick={() => setRange(r.key)}
                  className={`text-xs px-2 h-7 rounded transition-colors ${range === r.key ? "bg-[hsl(var(--surface-container))] text-[hsl(var(--on-surface))]" : "text-[hsl(var(--on-surface-variant))] hover:text-[hsl(var(--on-surface))]"}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {evoLoading ? (
            <div className="h-[300px] flex items-center justify-center text-body-sm text-[hsl(var(--muted-foreground))]">Carregando...</div>
          ) : (
            <AreaEvolutionChart data={evolutionData || []} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Comparativos por Período</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[hsl(var(--surface-container))]">
              <p className="text-label-md text-[hsl(var(--on-surface-variant))] mb-1">Receita Mensal</p>
              <p className="text-headline-md font-display text-[hsl(var(--growth-signal))]">{formatCurrency(d.monthlyIncome)}</p>
            </div>
            <div className="p-4 rounded-lg bg-[hsl(var(--surface-container))]">
              <p className="text-label-md text-[hsl(var(--on-surface-variant))] mb-1">Despesa Mensal</p>
              <p className="text-headline-md font-display text-[hsl(var(--error))]">{formatCurrency(d.monthlyExpense)}</p>
            </div>
            <div className="p-4 rounded-lg bg-[hsl(var(--surface-container))]">
              <p className="text-label-md text-[hsl(var(--on-surface-variant))] mb-1">Lucro Líquido</p>
              <p className="text-headline-md font-display text-[hsl(var(--growth-signal))]">{formatCurrency(d.netProfit)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
