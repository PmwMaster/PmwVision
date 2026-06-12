"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Search, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Clock, FileText, FileSpreadsheet } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";

const typeConfig = {
  income: { icon: ArrowDownToLine, color: "text-[hsl(var(--growth-signal))]", bg: "bg-[hsl(var(--growth))/15]", label: "Receita" },
  expense: { icon: ArrowUpFromLine, color: "text-[hsl(var(--error))]", bg: "bg-[hsl(var(--error))/15]", label: "Despesa" },
  transfer: { icon: TrendingUp, color: "text-[hsl(var(--tertiary))]", bg: "bg-[hsl(var(--tertiary))/15]", label: "Transferência" },
};

type HistoryFilter = "all" | "income" | "expense" | "transfer";

export default function HistoryPage() {
  const { data: transactions, loading } = useTransactions();
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = transactions
    .filter((tx) => !tx.deleted_at)
    .filter((tx) => {
      if (filter !== "all" && tx.type !== filter) return false;
      if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-label-md text-[hsl(var(--on-surface-variant))] uppercase tracking-wider">Todas as Movimentações</p>
          <h1 className="text-display-lg font-display text-[hsl(var(--on-surface))] mt-1">Histórico</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><FileText className="w-4 h-4" />PDF</Button>
          <Button variant="secondary" size="sm"><FileSpreadsheet className="w-4 h-4" />CSV</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <Input placeholder="Pesquisar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1 overflow-x-auto">
              {(["all", "income", "expense", "transfer"] as HistoryFilter[]).map((f) => (
                <Button key={f} variant={filter === f ? "default" : "ghost"} size="sm" onClick={() => setFilter(f)} className="text-xs whitespace-nowrap">
                  {f === "all" ? "Todos" : typeConfig[f]?.label || f}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registros</CardTitle>
          <span className="text-body-sm text-[hsl(var(--on-surface-variant))]">{filtered.length} registro(s)</span>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-body-sm text-[hsl(var(--muted-foreground))]">Carregando...</div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={<Clock className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />} title="Nenhum registro" description="Ajuste os filtros ou a pesquisa." />
          ) : (
            <div className="divide-y divide-[hsl(var(--border-precision))]">
              {filtered.map((tx) => {
                const config = typeConfig[tx.type] || typeConfig.transfer;
                return (
                  <div key={tx.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[hsl(var(--surface-container))] transition-colors">
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", config.bg)}>
                      <config.icon className={cn("w-4 h-4", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-body-sm text-[hsl(var(--on-surface))]">{tx.description}</p>
                        <span className="text-label-md px-1.5 py-0.5 rounded bg-[hsl(var(--surface-container))] text-[hsl(var(--on-surface-variant))]">{config.label}</span>
                      </div>
                      <p className="text-label-md text-[hsl(var(--on-surface-variant))]">{formatDate(tx.date)}</p>
                    </div>
                    <span className={cn("text-body-sm font-medium tabular-nums",
                      tx.type === "income" ? "text-[hsl(var(--growth-signal))]" : tx.type === "expense" ? "text-[hsl(var(--on-surface))]" : "text-[hsl(var(--primary))]")}>
                      {tx.type === "income" ? "+" : tx.type === "expense" ? "-" : ""}{formatCurrency(Number(tx.amount))}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
