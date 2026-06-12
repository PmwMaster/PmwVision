"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/shared/kpi-card";
import { AreaEvolutionChart } from "@/components/charts/charts";
import { EmptyState } from "@/components/shared/empty-state";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useReinvestments } from "@/hooks/use-reinvestments";
import { RefreshCw, Plus, TrendingUp, Percent } from "lucide-react";

const reinvestEvolution = [
  { name: "Jan", value: 1500 }, { name: "Fev", value: 2200 }, { name: "Mar", value: 1800 },
  { name: "Abr", value: 2500 }, { name: "Mai", value: 3000 }, { name: "Jun", value: 2850 },
];

export default function ReinvestmentsPage() {
  const { data: reinvestments, loading } = useReinvestments();
  const total = reinvestments?.reduce((s, r) => s + Number(r.amount), 0) || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-label-md text-[hsl(var(--on-surface-variant))] uppercase tracking-wider">Crescimento Composto</p>
          <h1 className="text-display-lg font-display text-[hsl(var(--on-surface))] mt-1">Reinvestimentos</h1>
        </div>
        <Button variant="primary" size="sm"><Plus className="w-4 h-4" />Novo Reinvestimento</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <KPICard title="Total Reinvestido" value={formatCurrency(total)} loading={loading} trend="up" icon={<RefreshCw className="w-4 h-4" />} change={null} />
        <KPICard title="Registros" value={`${reinvestments?.length || 0}`} loading={loading} trend="neutral" icon={<Percent className="w-4 h-4" />} change={null} />
        <KPICard title="Crescimento Mensal" value="+R$ 2.850,00" trend="up" icon={<TrendingUp className="w-4 h-4" />} change={null} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Evolução dos Reinvestimentos</CardTitle></CardHeader>
          <CardContent><AreaEvolutionChart data={reinvestEvolution} height={250} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Sugestão</CardTitle></CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-[hsl(var(--growth))/5] border border-[hsl(var(--growth))/20]">
              <RefreshCw className="w-8 h-8 text-[hsl(var(--growth-signal))] mb-2" />
              <p className="text-body-sm text-[hsl(var(--on-surface))] font-medium mb-1">Aporte Sugerido</p>
              <p className="text-body-sm text-[hsl(var(--on-surface-variant))] mb-3">Sugerimos reinvestir pelo menos 40% do lucro.</p>
              <Button variant="growth" size="sm" className="w-full">Reinvestir Agora</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Histórico de Reinvestimentos</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-8 text-center text-body-sm text-[hsl(var(--muted-foreground))]">Carregando...</div>
          ) : !reinvestments || reinvestments.filter((r) => !r.deleted_at).length === 0 ? (
            <EmptyState title="Nenhum reinvestimento" description="Registre seus reinvestimentos." actionLabel="Registrar Reinvestimento" />
          ) : (
            <div className="divide-y divide-[hsl(var(--border-precision))]">
              {reinvestments.filter((r) => !r.deleted_at).map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-9 h-9 rounded-lg bg-[hsl(var(--growth))/15] flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-[hsl(var(--growth-signal))]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-body-sm text-[hsl(var(--on-surface))]">{r.source}</p>
                    <p className="text-label-md text-[hsl(var(--on-surface-variant))]">{formatDate(r.date)}</p>
                  </div>
                  <span className="text-body-sm font-medium text-[hsl(var(--growth-signal))] tabular-nums">+{formatCurrency(Number(r.amount))}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
