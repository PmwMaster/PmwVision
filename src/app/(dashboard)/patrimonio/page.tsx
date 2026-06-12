"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/shared/kpi-card";
import { AreaEvolutionChart } from "@/components/charts/charts";
import { Building2, TrendingUp, PiggyBank, DollarSign } from "lucide-react";

const evolutionData = [
  { name: "Jan", value: 215000 }, { name: "Fev", value: 223000 }, { name: "Mar", value: 230000 },
  { name: "Abr", value: 235000 }, { name: "Mai", value: 242000 }, { name: "Jun", value: 248000 },
  { name: "Jul", value: 252000 }, { name: "Ago", value: 258000 }, { name: "Set", value: 260000 },
  { name: "Out", value: 265000 }, { name: "Nov", value: 270000 }, { name: "Dez", value: 278000 },
];

const yearlyData = [
  { name: "2023", value: 150000 },
  { name: "2024", value: 210000 },
  { name: "2025", value: 245000 },
  { name: "2026", value: 278000 },
];

export default function WealthPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <p className="text-label-md text-[hsl(var(--on-surface-variant))] uppercase tracking-wider">
          Crescimento Patrimonial
        </p>
        <h1 className="text-display-lg font-display text-[hsl(var(--on-surface))] mt-1">
          Patrimônio
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard title="Patrimônio Atual" value="R$ 278.000,00" change={12.8} trend="up" icon={<Building2 className="w-4 h-4" />} />
        <KPICard title="Lucro Acumulado" value="R$ 54.120,40" change={15.2} trend="up" icon={<TrendingUp className="w-4 h-4" />} />
        <KPICard title="Crescimento Anual" value="+13.4%" trend="up" icon={<PiggyBank className="w-4 h-4" />} change={null} />
        <KPICard title="Rendimento Total" value="R$ 28.500,00" changeLabel="este ano" trend="up" icon={<DollarSign className="w-4 h-4" />} change={null} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Crescimento Mensal (2026)</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaEvolutionChart data={evolutionData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crescimento Anual</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaEvolutionChart data={yearlyData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparativos por Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[hsl(var(--surface-container))]">
              <p className="text-label-md text-[hsl(var(--on-surface-variant))] mb-1">Último Mês</p>
              <p className="text-headline-md font-display text-[hsl(var(--growth-signal))]">+2.9%</p>
              <p className="text-body-sm text-[hsl(var(--on-surface-variant))] mt-1">+R$ 8.000,00</p>
            </div>
            <div className="p-4 rounded-lg bg-[hsl(var(--surface-container))]">
              <p className="text-label-md text-[hsl(var(--on-surface-variant))] mb-1">Último Trimestre</p>
              <p className="text-headline-md font-display text-[hsl(var(--growth-signal))]">+6.7%</p>
              <p className="text-body-sm text-[hsl(var(--on-surface-variant))] mt-1">+R$ 18.000,00</p>
            </div>
            <div className="p-4 rounded-lg bg-[hsl(var(--surface-container))]">
              <p className="text-label-md text-[hsl(var(--on-surface-variant))] mb-1">Último Ano</p>
              <p className="text-headline-md font-display text-[hsl(var(--growth-signal))]">+13.4%</p>
              <p className="text-body-sm text-[hsl(var(--on-surface-variant))] mt-1">+R$ 33.000,00</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
