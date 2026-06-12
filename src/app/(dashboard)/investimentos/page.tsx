"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/shared/kpi-card";
import { DonutChart, AreaEvolutionChart } from "@/components/charts/charts";
import { cn, formatCurrency } from "@/lib/utils";
import { useInvestments } from "@/hooks/use-investments";
import { TrendingUp, DollarSign, Trophy, Gamepad2, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState } from "react";

const donutData = [{ name: "Ações", value: 40 }, { name: "FIIs", value: 32 }, { name: "Renda Fixa", value: 28 }];
const bankEvolution = [{ name: "Jan", value: 28000 }, { name: "Fev", value: 31000 }, { name: "Mar", value: 34000 }, { name: "Abr", value: 36500 }, { name: "Mai", value: 38500 }, { name: "Jun", value: 42100 }];

export default function InvestmentsPage() {
  const { data: investments, loading } = useInvestments();
  const [tab, setTab] = useState<"financeiro" | "apostas" | "hobbies">("financeiro");

  const totalInvested = investments?.reduce((s, i) => s + Number(i.amount), 0) || 0;
  const tabs = [
    { id: "financeiro" as const, label: "Financeiros", icon: TrendingUp },
    { id: "apostas" as const, label: "Apostas", icon: Trophy },
    { id: "hobbies" as const, label: "Hobbies", icon: Gamepad2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-label-md text-[hsl(var(--on-surface-variant))] uppercase tracking-wider">Gestão de Portfólio</p>
          <h1 className="text-display-lg font-display text-[hsl(var(--on-surface))] mt-1">Investimentos</h1>
        </div>
        <Button variant="primary" size="sm"><Plus className="w-4 h-4" />Novo Investimento</Button>
      </div>

      <div className="flex gap-0.5 p-1 rounded-lg bg-[hsl(var(--surface-container))] w-fit">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn("flex items-center gap-2 px-4 py-2 rounded text-body-sm font-medium transition-all",
            tab === t.id ? "bg-[hsl(var(--surface))] text-[hsl(var(--on-surface))] shadow-sm" : "text-[hsl(var(--on-surface-variant))] hover:text-[hsl(var(--on-surface))]")}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {tab === "financeiro" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard title="Total Investido" value={formatCurrency(totalInvested)} loading={loading} trend="up" icon={<DollarSign className="w-4 h-4" />} change={null} />
            <KPICard title="Ativos" value={`${investments?.length || 0}`} loading={loading} trend="neutral" icon={<TrendingUp className="w-4 h-4" />} change={null} />
            <KPICard title="Rentabilidade Média" value="+18.2%" trend="up" icon={<TrendingUp className="w-4 h-4" />} change={null} />
            <KPICard title="Lucro Acumulado" value="R$ 284.900,00" trend="up" icon={<TrendingUp className="w-4 h-4" />} change={null} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader><CardTitle>Distribuição de Ativos</CardTitle></CardHeader>
              <CardContent><DonutChart data={donutData} /><p className="text-center text-label-md text-[hsl(var(--muted-foreground))] mt-2">{investments?.length || 0} ativos</p></CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Seus Investimentos</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[hsl(var(--border-precision))]">
                        <th className="text-left px-4 py-3 text-label-md text-[hsl(var(--on-surface-variant))]">Nome</th>
                        <th className="text-right px-4 py-3 text-label-md text-[hsl(var(--on-surface-variant))]">Valor</th>
                        <th className="text-right px-4 py-3 text-label-md text-[hsl(var(--on-surface-variant))]">Tipo</th>
                        <th className="text-right px-4 py-3 text-label-md text-[hsl(var(--on-surface-variant))]">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[hsl(var(--border-precision))]">
                      {investments?.filter((i) => !i.deleted_at).map((inv) => (
                        <tr key={inv.id} className="hover:bg-[hsl(var(--surface-container))] transition-colors">
                          <td className="px-4 py-3 text-body-sm text-[hsl(var(--on-surface))] font-medium">{inv.name}</td>
                          <td className="px-4 py-3 text-body-sm text-[hsl(var(--on-surface))] text-right tabular-nums">{formatCurrency(Number(inv.amount))}</td>
                          <td className="px-4 py-3 text-body-sm text-[hsl(var(--on-surface-variant))] text-right">{inv.type}</td>
                          <td className="px-4 py-3 text-body-sm text-[hsl(var(--on-surface-variant))] text-right">{inv.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(!loading && investments?.length === 0) && (
                    <div className="py-8 text-center text-body-sm text-[hsl(var(--muted-foreground))]">Nenhum investimento registrado</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {tab === "apostas" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard title="Banca Atual" value="R$ 42.100,00" trend="up" icon={<DollarSign className="w-4 h-4" />} change={null} />
            <KPICard title="ROI" value="+8.4%" trend="up" icon={<TrendingUp className="w-4 h-4" />} change={null} />
            <KPICard title="Lucro Acumulado" value="R$ 11.400,00" trend="up" icon={<Trophy className="w-4 h-4" />} change={null} />
            <KPICard title="Win Rate" value="54.2%" trend="up" icon={<TrendingUp className="w-4 h-4" />} change={null} />
          </div>
          <Card>
            <CardHeader><CardTitle>Evolução da Banca</CardTitle></CardHeader>
            <CardContent><AreaEvolutionChart data={bankEvolution} height={250} /></CardContent>
          </Card>
        </div>
      )}

      {tab === "hobbies" && (
        <div className="space-y-6">
          <p className="text-headline-md font-display text-[hsl(var(--on-surface))]">Lifestyle & Hobbies</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[{ name: "Gaming & Hardware", invested: 24500, current: 20800, change: -15, icon: Gamepad2 },
              { name: "Fotografia", invested: 42000, current: 38500, change: -8.3, icon: TrendingUp },
              { name: "Colecionáveis", invested: 82000, current: 187000, change: 128, icon: Trophy }].map((h) => (
              <Card key={h.name} className="overflow-hidden hover:border-[hsl(var(--primary))/40] transition-all">
                <div className="h-32 bg-[hsl(var(--surface-container))] flex items-center justify-center">
                  <h.icon className="w-12 h-12 text-[hsl(var(--muted-foreground))]" />
                </div>
                <CardContent className="p-4 space-y-3">
                  <h3 className="text-body-lg font-medium text-[hsl(var(--on-surface))]">{h.name}</h3>
                  <div className="flex justify-between">
                    <div><p className="text-label-md text-[hsl(var(--on-surface-variant))]">Investido</p><p className="text-headline-md font-display">{formatCurrency(h.invested)}</p></div>
                    <div className="text-right"><p className="text-label-md text-[hsl(var(--on-surface-variant))]">Valor Atual</p><p className="text-headline-md font-display">{formatCurrency(h.current)}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    {h.change >= 0 ? <ArrowUpRight className="w-4 h-4 text-[hsl(var(--growth-signal))]" /> : <ArrowDownRight className="w-4 h-4 text-[hsl(var(--error))]" />}
                    <span className={cn("text-body-sm font-medium", h.change >= 0 ? "text-[hsl(var(--growth-signal))]" : "text-[hsl(var(--error))]")}>{h.change >= 0 ? "+" : ""}{h.change}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
