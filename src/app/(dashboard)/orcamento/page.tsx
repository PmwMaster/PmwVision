"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  AlertTriangle,
  Lightbulb,
  Utensils,
  Car,
  Gamepad2,
  Home,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const budgetData = {
  limit: 15000,
  spent: 9450.2,
  savings: 1200,
};

const categories = [
  { name: "Alimentação", spent: 2100, limit: 3000, icon: Utensils, color: "primary" as const },
  { name: "Transporte", spent: 650, limit: 1200, icon: Car, color: "primary" as const },
  { name: "Lazer", spent: 1275, limit: 1500, icon: Gamepad2, color: "tertiary" as const },
  { name: "Moradia", spent: 3500, limit: 5000, icon: Home, color: "growth" as const },
  { name: "Assinaturas", spent: 425, limit: 800, icon: CreditCard, color: "primary" as const },
  { name: "Investimentos", spent: 1500, limit: 2500, icon: TrendingUp, color: "growth" as const },
];

export default function BudgetPage() {
  const available = budgetData.limit - budgetData.spent;
  const spentPercent = (budgetData.spent / budgetData.limit) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-label-md text-[hsl(var(--on-surface-variant))] uppercase tracking-wider">
            Controle Financeiro
          </p>
          <h1 className="text-display-lg font-display text-[hsl(var(--on-surface))] mt-1">
            Orçamento Mensal
          </h1>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Jun 2026
            </Button>
          <Button variant="primary" size="sm">
            Ajustar Limite
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))/15] flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <p className="text-label-md text-[hsl(var(--on-surface-variant))]">Limite Mensal</p>
                <p className="text-headline-md font-display text-[hsl(var(--on-surface))]">
                  {formatCurrency(budgetData.limit)}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 rounded-full bg-[hsl(var(--primary))/20]">
                <div className="h-full rounded-full bg-[hsl(var(--primary))] w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--tertiary))/15] flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-[hsl(var(--tertiary))]" />
              </div>
              <div>
                <p className="text-label-md text-[hsl(var(--on-surface-variant))]">Gasto Atual</p>
                <p className="text-headline-md font-display text-[hsl(var(--on-surface))]">
                  {formatCurrency(budgetData.spent)}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 rounded-full bg-[hsl(var(--tertiary))/20]">
                <div className="h-full rounded-full bg-[hsl(var(--tertiary))]" style={{ width: `${spentPercent}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--growth))/15] flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-[hsl(var(--growth-signal))]" />
              </div>
              <div>
                <p className="text-label-md text-[hsl(var(--on-surface-variant))]">Disponível</p>
                <p className="text-headline-md font-display text-[hsl(var(--on-surface))]">
                  {formatCurrency(available)}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 rounded-full bg-[hsl(var(--growth))/20]">
                <div className="h-full rounded-full bg-[hsl(var(--growth))]" style={{ width: `${100 - spentPercent}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(var(--surface-container))]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--growth))/15] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[hsl(var(--growth-signal))]" />
              </div>
              <div>
                <p className="text-label-md text-[hsl(var(--on-surface-variant))]">Economia Mensal</p>
                <div className="flex items-center gap-1">
                  <p className="text-headline-md font-display text-[hsl(var(--on-surface))]">
                    {formatCurrency(budgetData.savings)}
                  </p>
                  <span className="text-label-md text-[hsl(var(--growth-signal))]">+8.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left - Usage Overview */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral do Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60" cy="60" r="54"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60" cy="60" r="54"
                      fill="none"
                      stroke="hsl(var(--tertiary))"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${spentPercent * 3.39} 339`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-headline-lg font-display text-[hsl(var(--on-surface))]">
                      {spentPercent.toFixed(0)}%
                    </span>
                    <span className="text-label-md text-[hsl(var(--on-surface-variant))]">DO LIMITE UTILIZADO</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-4">
                  <div className="text-center">
                    <p className="text-label-md text-[hsl(var(--on-surface-variant))]">Previsão Final</p>
                    <p className="text-headline-md font-display text-[hsl(var(--on-surface))]">R$ 12.8k</p>
                  </div>
                  <div className="text-center">
                    <p className="text-label-md text-[hsl(var(--on-surface-variant))]">Dias Restantes</p>
                    <p className="text-headline-md font-display text-[hsl(var(--on-surface))]">19</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categorias de Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const percent = (cat.spent / cat.limit) * 100;
                  return (
                    <div
                      key={cat.name}
                      className="p-3 rounded-lg border border-[hsl(var(--border-precision))] hover:border-[hsl(var(--primary))/40] transition-all duration-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                          "w-7 h-7 rounded flex items-center justify-center",
                          cat.color === "growth" && "bg-[hsl(var(--growth))/15]",
                          cat.color === "primary" && "bg-[hsl(var(--primary))/15]",
                          cat.color === "tertiary" && "bg-[hsl(var(--tertiary))/15]"
                        )}>
                          <cat.icon className={cn(
                            "w-3.5 h-3.5",
                            cat.color === "growth" && "text-[hsl(var(--growth-signal))]",
                            cat.color === "primary" && "text-[hsl(var(--primary))]",
                            cat.color === "tertiary" && "text-[hsl(var(--tertiary))]"
                          )} />
                        </div>
                        <span className="text-body-sm text-[hsl(var(--on-surface))]">{cat.name}</span>
                        <span className={cn(
                          "ml-auto text-label-md px-1.5 py-0.5 rounded",
                          percent > 80 ? "bg-[hsl(var(--error))/15] text-[hsl(var(--error))]" :
                          percent > 60 ? "bg-[hsl(var(--tertiary))/15] text-[hsl(var(--tertiary))]" :
                          "bg-[hsl(var(--growth))/15] text-[hsl(var(--growth-signal))]"
                        )}>
                          {percent.toFixed(0)}%
                        </span>
                      </div>
                      <ProgressBar value={cat.spent} max={cat.limit} size="sm" color={
                        percent > 80 ? "error" : percent > 60 ? "tertiary" : cat.color === "growth" ? "growth" : "primary"
                      } />
                      <div className="flex justify-between mt-1 text-label-md text-[hsl(var(--muted-foreground))]">
                        <span>{formatCurrency(cat.spent)}</span>
                        <span>{formatCurrency(cat.limit)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right - Insights */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insights & Recomendações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border-l-2 border-[hsl(var(--tertiary))] bg-[hsl(var(--tertiary))/5]">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[hsl(var(--tertiary))] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-body-sm text-[hsl(var(--on-surface))] font-medium">Atenção ao Lazer</p>
                    <p className="text-body-sm text-[hsl(var(--on-surface-variant))]">
                      85% do orçamento de lazer já foi utilizado. Restam apenas R$ 225,00.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border-l-2 border-[hsl(var(--growth))] bg-[hsl(var(--growth))/5]">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-[hsl(var(--growth-signal))] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-body-sm text-[hsl(var(--on-surface))] font-medium">Oportunidade de Economia</p>
                    <p className="text-body-sm text-[hsl(var(--on-surface-variant))]">
                      Economia em moradia pode ser redirecionada para investimentos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[hsl(var(--surface-container))]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body-sm text-[hsl(var(--on-surface))]">Investimentos Planejados</span>
                  <span className="text-body-sm font-medium text-[hsl(var(--on-surface))] tabular-nums">
                    {formatCurrency(2500)}
                  </span>
                </div>
                <Link href="/investimentos">
                  <Button variant="primary" size="sm" className="w-full">
                    Ver Detalhes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
