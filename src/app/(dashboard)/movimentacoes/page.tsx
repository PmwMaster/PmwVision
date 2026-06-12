"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Search, Download, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, Plus, Trash2, Pencil } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { EmptyState } from "@/components/shared/empty-state";
import { toast } from "sonner";
import Link from "next/link";

type FilterType = "all" | "income" | "expense" | "transfer";

export default function TransactionsPage() {
  const { data: transactions, loading, remove } = useTransactions();
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const filtered = transactions
    .filter((tx) => !tx.deleted_at)
    .filter((tx) => {
      if (filter !== "all" && tx.type !== filter) return false;
      if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast.success("Movimentação excluída");
    } catch {
      toast.error("Erro ao excluir");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-label-md text-[hsl(var(--on-surface-variant))] uppercase tracking-wider">Gestão Financeira</p>
          <h1 className="text-display-lg font-display text-[hsl(var(--on-surface))] mt-1">Movimentações</h1>
        </div>
        <Link href="/movimentacoes/nova">
          <Button variant="primary" size="sm"><Plus className="w-4 h-4" />Nova Movimentação</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <Input placeholder="Pesquisar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1">
              {(["all", "income", "expense", "transfer"] as FilterType[]).map((f) => (
                <Button key={f} variant={filter === f ? "default" : "ghost"} size="sm" onClick={() => setFilter(f)} className="text-xs capitalize">
                  {f === "all" ? "Todos" : f === "income" ? "Receitas" : f === "expense" ? "Despesas" : "Transferências"}
                </Button>
              ))}
            </div>
            <Button variant="secondary" size="sm"><Download className="w-4 h-4" />Exportar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Todas as Movimentações</CardTitle>
          <span className="text-body-sm text-[hsl(var(--on-surface-variant))]">{filtered.length} registro(s)</span>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-body-sm text-[hsl(var(--muted-foreground))]">Carregando...</div>
          ) : filtered.length === 0 ? (
            <EmptyState title="Nenhuma movimentação" description="Registre sua primeira receita ou despesa." actionLabel="Nova Movimentação" actionHref="/movimentacoes/nova" />
          ) : (
            <div className="divide-y divide-[hsl(var(--border-precision))]">
              {filtered.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[hsl(var(--surface-container))] transition-colors group">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                    tx.type === "income" ? "bg-[hsl(var(--growth))/15] text-[hsl(var(--growth-signal))]" :
                    tx.type === "expense" ? "bg-[hsl(var(--error))/15] text-[hsl(var(--error))]" :
                    "bg-[hsl(var(--primary))/15] text-[hsl(var(--primary))]"
                  )}>
                    {tx.type === "income" ? <ArrowDownToLine className="w-4 h-4" /> : tx.type === "expense" ? <ArrowUpFromLine className="w-4 h-4" /> : <ArrowLeftRight className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm text-[hsl(var(--on-surface))]">{tx.description}</p>
                    <p className="text-label-md text-[hsl(var(--on-surface-variant))]">{formatDate(tx.date)}</p>
                  </div>
                  <span className={cn("text-body-sm font-medium tabular-nums", tx.type === "income" ? "text-[hsl(var(--growth-signal))]" : tx.type === "expense" ? "text-[hsl(var(--on-surface))]" : "text-[hsl(var(--primary))]")}>
                    {tx.type === "income" ? "+" : tx.type === "expense" ? "-" : ""}{formatCurrency(Number(tx.amount))}
                  </span>
                  <div className="hidden group-hover:flex items-center gap-1 ml-2">
                    <Button variant="ghost" size="icon-sm"><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(tx.id)}><Trash2 className="w-3.5 h-3.5 text-[hsl(var(--error))]" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
