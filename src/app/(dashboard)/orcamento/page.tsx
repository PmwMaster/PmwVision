"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, formatCurrency } from "@/lib/utils";
import { useBudget } from "@/hooks/use-budget";
import { useTransactions } from "@/hooks/use-transactions";
import { useState } from "react";
import {
  Wallet, TrendingDown, PiggyBank, AlertTriangle, Lightbulb,
  Utensils, Car, Gamepad2, Home, CreditCard, TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const DEFAULT_CATEGORIES = [
  { name: "Alimentação", icon: Utensils, color: "primary" as const },
  { name: "Transporte", icon: Car, color: "primary" as const },
  { name: "Lazer", icon: Gamepad2, color: "tertiary" as const },
  { name: "Moradia", icon: Home, color: "growth" as const },
  { name: "Assinaturas", icon: CreditCard, color: "primary" as const },
  { name: "Investimentos", icon: TrendingUp, color: "growth" as const },
];

const MOCK_LIMIT = 15000;
const MOCK_SAVINGS = 1200;

export default function BudgetPage() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const { data: budget, upsert } = useBudget(currentMonth);
  const { data: transactions } = useTransactions();
  const [editing, setEditing] = useState(false);
  const [limitValue, setLimitValue] = useState("");

  const monthTx = transactions?.filter((tx) =>
    tx.type === "expense" && !tx.deleted_at && tx.date.startsWith(currentMonth)
  ) || [];

  const limit = budget?.limit_amount ? Number(budget.limit_amount) : MOCK_LIMIT;
  const spent = monthTx.reduce((s, tx) => s + Number(tx.amount), 0);
  const available = limit - spent;
  const spentPercent = limit > 0 ? (spent / limit) * 100 : 0;

  // Group expenses by category (match by description)
  const categorySpent = new Map<string, number>();
  monthTx.forEach((tx) => {
    const cat = tx.description || "Outros";
    const match = DEFAULT_CATEGORIES.find((c) => c.name === cat);
    const key = match?.name || "Outros";
    categorySpent.set(key, (categorySpent.get(key) || 0) + Number(tx.amount));
  });

  const handleSaveLimit = async () => {
    try {
      await upsert({ month: currentMonth, limit_amount: Number(limitValue) });
      toast.success("Limite atualizado!");
      setEditing(false);
    } catch {
      toast.error("Erro ao salvar limite");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-label-md text-[hsl(var(--on-surface-variant))] uppercase tracking-wider">Controle Financeiro</p>
          <h1 className="text-display-lg font-display text-[hsl(var(--on-surface))] mt-1">Orçamento Mensal</h1>
        </div>
        <div className="flex gap-2">
          <span className="text-body-sm text-[hsl(var(--on-surface-variant))] self-center">
            {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </span>
          <Button variant="primary" size="sm" onClick={() => { setEditing(true); setLimitValue(String(limit)); }}>
            Ajustar Limite
          </Button>
        </div>
      </div>

      {editing && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="limit">Limite Mensal (R$)</Label>
                <Input id="limit" type="number" value={limitValue} onChange={(e) => setLimitValue(e.target.value)} />
              </div>
              <Button variant="primary" onClick={handleSaveLimit}>Salvar</Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))/15] flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <p className="text-label-md text-[hsl(var(--on-surface-variant))]">Limite Mensal</p>
                <p className="text-headline-md font-display text-[hsl(var(--on-surface))]">{formatCurrency(limit)}</p>
              </div>
            </div>
            <div className="mt-3"><div className="h-1.5 rounded-full bg-[hsl(var(--primary))/20]"><div className="h-full rounded-full bg-[hsl(var(--primary))] w-full" /></div></div>
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
                <p className="text-headline-md font-display text-[hsl(var(--on-surface))]">{formatCurrency(spent)}</p>
              </div>
            </div>
            <div className="mt-3"><div className="h-1.5 rounded-full bg-[hsl(var(--tertiary))/20]"><div className="h-full rounded-full bg-[hsl(var(--tertiary))]" style={{ width: `${Math.min(spentPercent, 100)}%` }} /></div></div>
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
                <p className="text-headline-md font-display text-[hsl(var(--on-surface))]">{formatCurrency(Math.max(available, 0))}</p>
              </div>
            </div>
            <div className="mt-3"><div className="h-1.5 rounded-full bg-[hsl(var(--growth))/20]"><div className="h-full rounded-full bg-[hsl(var(--growth))]" style={{ width: `${Math.max(100 - spentPercent, 0)}%` }} /></div></div>
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
                  <p className="text-headline-md font-display text-[hsl(var(--on-surface))]">{formatCurrency(MOCK_SAVINGS)}</p>
                  <span className="text-label-md text-[hsl(var(--growth-signal))]">+8.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <Card>
            <CardHeader><CardTitle>Visão Geral do Uso</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle cx="60" cy="60" r="54" fill="none" stroke={spentPercent > 80 ? "hsl(var(--error))" : "hsl(var(--tertiary))"} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${Math.min(spentPercent * 3.39, 339)} 339`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-headline-lg font-display text-[hsl(var(--on-surface))]">{Math.min(spentPercent, 100).toFixed(0)}%</span>
                    <span className="text-label-md text-[hsl(var(--on-surface-variant))]">DO LIMITE UTILIZADO</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-4">
                  <div className="text-center">
                    <p className="text-label-md text-[hsl(var(--on-surface-variant))]">Gasto Real</p>
                    <p className="text-headline-md font-display text-[hsl(var(--on-surface))]">{formatCurrency(spent)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-label-md text-[hsl(var(--on-surface-variant))]">Disponível</p>
                    <p className="text-headline-md font-display text-[hsl(var(--on-surface))]">{formatCurrency(Math.max(available, 0))}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader><CardTitle>Categorias de Gastos</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {DEFAULT_CATEGORIES.map((cat) => {
                  const catSpent = categorySpent.get(cat.name) || 0;
                  const catLimit = limit / DEFAULT_CATEGORIES.length;
                  const percent = catLimit > 0 ? (catSpent / catLimit) * 100 : 0;
                  return (
                    <div key={cat.name} className="p-3 rounded-lg border border-[hsl(var(--border-precision))] hover:border-[hsl(var(--primary))/40] transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn("w-7 h-7 rounded flex items-center justify-center",
                          cat.color === "growth" && "bg-[hsl(var(--growth))/15]",
                          cat.color === "primary" && "bg-[hsl(var(--primary))/15]",
                          cat.color === "tertiary" && "bg-[hsl(var(--tertiary))/15]"
                        )}>
                          <cat.icon className={cn("w-3.5 h-3.5",
                            cat.color === "growth" && "text-[hsl(var(--growth-signal))]",
                            cat.color === "primary" && "text-[hsl(var(--primary))]",
                            cat.color === "tertiary" && "text-[hsl(var(--tertiary))]"
                          )} />
                        </div>
                        <span className="text-body-sm text-[hsl(var(--on-surface))]">{cat.name}</span>
                        <span className={cn("ml-auto text-label-md px-1.5 py-0.5 rounded",
                          percent > 80 ? "bg-[hsl(var(--error))/15] text-[hsl(var(--error))]" :
                          percent > 60 ? "bg-[hsl(var(--tertiary))/15] text-[hsl(var(--tertiary))]" :
                          "bg-[hsl(var(--growth))/15] text-[hsl(var(--growth-signal))]"
                        )}>{percent.toFixed(0)}%</span>
                      </div>
                      <ProgressBar value={catSpent} max={catLimit} size="sm" color={percent > 80 ? "error" : percent > 60 ? "tertiary" : "growth"} />
                      <div className="flex justify-between mt-1 text-label-md text-[hsl(var(--muted-foreground))]">
                        <span>{formatCurrency(catSpent)}</span>
                        <span>{formatCurrency(catLimit)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader><CardTitle>Insights & Recomendações</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {spentPercent > 80 && (
                <div className="p-3 rounded-lg border-l-2 border-[hsl(var(--error))] bg-[hsl(var(--error))/5]">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-[hsl(var(--error))] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-body-sm text-[hsl(var(--on-surface))] font-medium">Atenção!</p>
                      <p className="text-body-sm text-[hsl(var(--on-surface-variant))]">Você já utilizou {spentPercent.toFixed(0)}% do seu orçamento este mês.</p>
                    </div>
                  </div>
                </div>
              )}
              {available > limit * 0.3 && (
                <div className="p-3 rounded-lg border-l-2 border-[hsl(var(--growth))] bg-[hsl(var(--growth))/5]">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-[hsl(var(--growth-signal))] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-body-sm text-[hsl(var(--on-surface))] font-medium">Oportunidade</p>
                      <p className="text-body-sm text-[hsl(var(--on-surface-variant))]">Você tem {formatCurrency(available)} disponíveis. Considere investir parte desse valor.</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-3 rounded-lg bg-[hsl(var(--surface-container))]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body-sm text-[hsl(var(--on-surface))]">Investimentos Planejados</span>
                  <span className="text-body-sm font-medium text-[hsl(var(--on-surface))] tabular-nums">{formatCurrency(2500)}</span>
                </div>
                <Link href="/investimentos"><Button variant="primary" size="sm" className="w-full">Ver Detalhes</Button></Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
