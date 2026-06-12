"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/shared/progress-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { cn, formatCurrency, daysUntil } from "@/lib/utils";
import { Target, Plus, Home, Car, Laptop, Plane, Clock, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useGoals } from "@/hooks/use-goals";
import Link from "next/link";

const priorityColors = {
  high: "text-[hsl(var(--error))] bg-[hsl(var(--error))/10] border-[hsl(var(--error))/20]",
  medium: "text-[hsl(var(--tertiary))] bg-[hsl(var(--tertiary))/10] border-[hsl(var(--tertiary))/20]",
  low: "text-[hsl(var(--growth-signal))] bg-[hsl(var(--growth))/10] border-[hsl(var(--growth))/20]",
};

const iconMap: Record<string, React.ElementType> = {
  Imóvel: Home, Mobilidade: Car, Tech: Laptop, Viagem: Plane, default: Target,
};

export default function GoalsPage() {
  const { data: goals, loading } = useGoals();
  const activeGoals = goals?.filter((g) => !g.deleted_at) || [];
  const totalAccumulated = activeGoals.reduce((s, g) => s + Number(g.current_amount), 0);
  const totalTarget = activeGoals.reduce((s, g) => s + Number(g.target_amount), 0);
  const overallProgress = totalTarget > 0 ? (totalAccumulated / totalTarget) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-label-md text-[hsl(var(--on-surface-variant))] uppercase tracking-wider">Destino Financeiro</p>
          <h1 className="text-display-lg font-display text-[hsl(var(--on-surface))] mt-1">Metas</h1>
        </div>
        <Link href="/metas/nova"><Button variant="primary" size="sm"><Plus className="w-4 h-4" />Nova Meta</Button></Link>
      </div>

      <Card className="overflow-hidden border-[hsl(var(--growth))/30]">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--growth))" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${overallProgress * 3.39} 339`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-headline-md font-display text-[hsl(var(--on-surface))]">{overallProgress.toFixed(0)}%</span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-label-md text-[hsl(var(--on-surface-variant))] uppercase tracking-wider mb-1">Total Acumulado</p>
              <p className="text-headline-lg font-display text-[hsl(var(--on-surface))]">{formatCurrency(totalAccumulated)}</p>
              <p className="text-body-sm text-[hsl(var(--on-surface-variant))] mt-1">de {formatCurrency(totalTarget)} em {activeGoals.length} metas ativas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="py-12 text-center text-body-sm text-[hsl(var(--muted-foreground))]">Carregando metas...</div>
      ) : activeGoals.length === 0 ? (
        <EmptyState icon={<Target className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />} title="Nenhuma meta ainda" description="Crie metas financeiras e materiais." actionLabel="Criar Primeira Meta" actionHref="/metas/nova" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeGoals.map((goal) => {
            const current = Number(goal.current_amount);
            const target = Number(goal.target_amount);
            const percent = target > 0 ? (current / target) * 100 : 0;
            const remaining = daysUntil(goal.deadline);
            const isCompleted = percent >= 100;
            const isClose = percent >= 80 && percent < 100;
            const Icon = iconMap[goal.category] || iconMap.default;

            return (
              <Card key={goal.id} className="overflow-hidden hover:border-[hsl(var(--primary))/40] transition-all">
                <div className="h-36 bg-[hsl(var(--surface-container))] flex items-center justify-center relative">
                  <Icon className="w-16 h-16 text-[hsl(var(--muted-foreground))]" />
                  <span className={cn("absolute top-2 right-2 px-2 py-0.5 rounded text-label-md border", priorityColors[goal.priority])}>
                    {goal.priority === "high" ? "Alta" : goal.priority === "medium" ? "Média" : "Baixa"}
                  </span>
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-label-md bg-[hsl(var(--surface-container))]/80 text-[hsl(var(--on-surface-variant))]">{goal.category}</span>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-body-lg font-medium text-[hsl(var(--on-surface))]">{goal.name}</h3>
                    <span className={cn("text-headline-md font-display", isCompleted ? "text-[hsl(var(--growth-signal))]" : "text-[hsl(var(--on-surface))]")}>{percent.toFixed(0)}%</span>
                  </div>
                  <ProgressBar value={current} max={target} size="sm" color={isCompleted ? "growth" : isClose ? "primary" : "growth"} showPercent={false} />
                  <div className="flex justify-between items-center">
                    <p className="text-label-md text-[hsl(var(--on-surface-variant))]">{formatCurrency(current)} <span className="text-[hsl(var(--muted-foreground))]">de {formatCurrency(target)}</span></p>
                    <div className="flex items-center gap-1 text-label-md text-[hsl(var(--on-surface-variant))]"><Clock className="w-3 h-3" />{remaining > 0 ? `${remaining} dias` : "Concluída!"}</div>
                  </div>
                  {isCompleted && <div className="flex items-center gap-1.5 text-body-sm text-[hsl(var(--growth-signal))]"><CheckCircle2 className="w-4 h-4" />Meta concluída!</div>}
                  {isClose && <div className="flex items-center gap-1.5 text-body-sm text-[hsl(var(--primary))]"><AlertCircle className="w-4 h-4" />Quase lá! Faltam {formatCurrency(target - current)}</div>}
                  <Button variant="secondary" size="sm" className="w-full">Detalhes <ChevronRight className="w-4 h-4" /></Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
