"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/shared/kpi-card";
import { DonutChart, AreaEvolutionChart } from "@/components/charts/charts";
import { cn, formatCurrency } from "@/lib/utils";
import { useInvestments } from "@/hooks/use-investments";
import { useBettingInvestments } from "@/hooks/use-betting-investments";
import { useHobbyInvestments } from "@/hooks/use-hobby-investments";
import { TrendingUp, DollarSign, Trophy, Gamepad2, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function InvestmentsPage() {
  const { data: investments, loading: invLoading } = useInvestments();
  const { data: betting, isLoading: betLoading } = useBettingInvestments();
  const { data: hobbies, isLoading: hobLoading } = useHobbyInvestments();
  const [tab, setTab] = useState<"financeiro" | "apostas" | "hobbies">("financeiro");

  const totalInvested = investments?.reduce((s, i) => s + Number(i.amount), 0) || 0;
  const totalHobbyWealth = hobbies?.reduce((s, h) => s + Number(h.amount), 0) || 0;

  // Compute donut chart from real data
  const typeMap = new Map<string, number>();
  investments?.forEach((inv) => {
    const t = inv.type || "Outros";
    typeMap.set(t, (typeMap.get(t) || 0) + Number(inv.amount));
  });
  const donutData = typeMap.size > 0
    ? [...typeMap.entries()].map(([name, value]) => ({ name, value: Math.round(value) }))
    : [{ name: "Ações", value: 40 }, { name: "FIIs", value: 32 }, { name: "Renda Fixa", value: 28 }];

  // Betting stats
  const totalBank = betting?.reduce((s, b) => s + Number(b.current_bank), 0) || 0;
  const totalProfit = betting?.reduce((s, b) => s + Number(b.profit), 0) || 0;
  const totalDeposits = betting?.reduce((s, b) => s + Number(b.deposits), 0) || 0;
  const avgRoi = betting && betting.length > 0
    ? betting.reduce((s, b) => s + Number(b.roi), 0) / betting.length
    : 0;

  const bankEvolution = betting
    ?.filter((b) => !b.deleted_at)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((b) => ({ name: b.date.slice(0, 7), value: Number(b.current_bank) })) || [];

  const tabs = [
    { id: "financeiro" as const, label: "Financeiros", icon: TrendingUp },
    { id: "apostas" as const, label: "Apostas", icon: Trophy },
    { id: "hobbies" as const, label: "Hobbies", icon: Gamepad2 },
  ];

  const colorMap: Record<string, string> = {
    games: "primary", courses: "tertiary", equipment: "growth",
    collectibles: "tertiary", tech: "primary", other: "growth",
  };

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

      {/* Financeiros */}
      {tab === "financeiro" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard title="Total Investido" value={formatCurrency(totalInvested)} loading={invLoading} trend="up" icon={<DollarSign className="w-4 h-4" />} change={null} />
            <KPICard title="Ativos" value={`${investments?.length || 0}`} loading={invLoading} trend="neutral" icon={<TrendingUp className="w-4 h-4" />} change={null} />
            <KPICard title="Rentabilidade Média" value="+18.2%" trend="up" icon={<TrendingUp className="w-4 h-4" />} change={null} />
            <KPICard title="Lucro Acumulado" value="R$ 284.900,00" trend="up" icon={<TrendingUp className="w-4 h-4" />} change={null} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader><CardTitle>Distribuição de Ativos</CardTitle></CardHeader>
              <CardContent>
                <DonutChart data={donutData} />
                <p className="text-center text-label-md text-[hsl(var(--muted-foreground))] mt-2">{investments?.length || 0} ativos</p>
              </CardContent>
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
                  {(!invLoading && investments?.length === 0) && (
                    <div className="py-8 text-center text-body-sm text-[hsl(var(--muted-foreground))]">Nenhum investimento registrado</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Apostas */}
      {tab === "apostas" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard title="Banca Atual" value={formatCurrency(totalBank)} loading={betLoading} trend="up" icon={<DollarSign className="w-4 h-4" />} change={null} />
            <KPICard title="ROI Médio" value={`${avgRoi.toFixed(1)}%`} loading={betLoading} trend="up" icon={<TrendingUp className="w-4 h-4" />} change={null} />
            <KPICard title="Lucro Total" value={formatCurrency(totalProfit)} loading={betLoading} trend="up" icon={<Trophy className="w-4 h-4" />} change={null} />
            <KPICard title="Total Aportes" value={formatCurrency(totalDeposits)} loading={betLoading} trend="up" icon={<TrendingUp className="w-4 h-4" />} change={null} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Evolução da Banca</CardTitle></CardHeader>
              <CardContent>
                {bankEvolution.length > 0 ? (
                  <AreaEvolutionChart data={bankEvolution} height={250} />
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-body-sm text-[hsl(var(--muted-foreground))]">Sem dados de evolução</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Registros</CardTitle></CardHeader>
              <CardContent className="p-0">
                {betting?.filter((b) => !b.deleted_at).map((b) => (
                  <div key={b.id} className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(var(--border-precision))]">
                    <div className={cn("w-2 h-2 rounded-full shrink-0", Number(b.profit) >= 0 ? "bg-[hsl(var(--growth-signal))]" : "bg-[hsl(var(--error))]")} />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm text-[hsl(var(--on-surface))] truncate">{b.notes || "Entrada"}</p>
                      <p className="text-label-md text-[hsl(var(--on-surface-variant))]">Banca: {formatCurrency(Number(b.current_bank))}</p>
                    </div>
                    <span className={cn("text-body-sm font-medium tabular-nums", Number(b.profit) >= 0 ? "text-[hsl(var(--growth-signal))]" : "text-[hsl(var(--error))]")}>
                      {Number(b.profit) >= 0 ? "+" : ""}{formatCurrency(Number(b.profit))}
                    </span>
                  </div>
                ))}
                {(!betLoading && (!betting || betting.length === 0)) && (
                  <div className="py-8 text-center text-body-sm text-[hsl(var(--muted-foreground))]">Nenhum registro de aposta</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Hobbies */}
      {tab === "hobbies" && (
        <div className="space-y-6">
          <p className="text-headline-md font-display text-[hsl(var(--on-surface))]">Lifestyle & Hobbies</p>
          <p className="text-body-sm text-[hsl(var(--on-surface-variant))]">Patrimônio total: {formatCurrency(totalHobbyWealth)}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hobbies?.map((hobby) => {
              const change = hobby.current_value && Number(hobby.amount) > 0
                ? ((Number(hobby.current_value) - Number(hobby.amount)) / Number(hobby.amount)) * 100
                : 0;
              const c = colorMap[hobby.category] || "primary";
              return (
                <Card key={hobby.id} className="overflow-hidden hover:border-[hsl(var(--primary))/40] transition-all">
                  <div className={cn("h-32 flex items-center justify-center",
                    c === "growth" && "bg-[hsl(var(--growth))/10]", c === "primary" && "bg-[hsl(var(--primary))/10]", c === "tertiary" && "bg-[hsl(var(--tertiary))/10]"
                  )}>
                    <Gamepad2 className={cn("w-12 h-12",
                      c === "growth" && "text-[hsl(var(--growth-signal))]", c === "primary" && "text-[hsl(var(--primary))]", c === "tertiary" && "text-[hsl(var(--tertiary))]"
                    )} />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="text-body-lg font-medium text-[hsl(var(--on-surface))]">{hobby.name}</h3>
                      <span className="text-label-md px-1.5 py-0.5 rounded bg-[hsl(var(--surface-container))] text-[hsl(var(--on-surface-variant))]">{hobby.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <div><p className="text-label-md text-[hsl(var(--on-surface-variant))]">Investido</p><p className="text-headline-md font-display">{formatCurrency(Number(hobby.amount))}</p></div>
                      <div className="text-right"><p className="text-label-md text-[hsl(var(--on-surface-variant))]">Valor Atual</p><p className="text-headline-md font-display">{formatCurrency(Number(hobby.current_value || hobby.amount))}</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      {change >= 0 ? <ArrowUpRight className="w-4 h-4 text-[hsl(var(--growth-signal))]" /> : <ArrowDownRight className="w-4 h-4 text-[hsl(var(--error))]" />}
                      <span className={cn("text-body-sm font-medium", change >= 0 ? "text-[hsl(var(--growth-signal))]" : "text-[hsl(var(--error))]")}>{change >= 0 ? "+" : ""}{change.toFixed(1)}%</span>
                    </div>
                    {hobby.notes && <p className="text-body-sm text-[hsl(var(--on-surface-variant))] line-clamp-2">{hobby.notes}</p>}
                  </CardContent>
                </Card>
              );
            })}
            {(!hobLoading && (!hobbies || hobbies.length === 0)) && (
              <div className="col-span-3 py-12 text-center text-body-sm text-[hsl(var(--muted-foreground))]">Nenhum hobby registrado</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
