"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const transactionSchema = z.object({
  amount: z.coerce.number().min(0.01, "Valor mínimo: R$ 0,01"),
  type: z.enum(["income", "expense", "transfer"]),
  category: z.string().min(1, "Categoria é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
});

type TransactionForm = z.infer<typeof transactionSchema>;

export default function NewTransactionPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<"income" | "expense" | "transfer">("expense");
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: "expense", date: new Date().toISOString().split("T")[0] },
  });

  const onSubmit = async (data: TransactionForm) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao registrar");
      toast.success("Movimentação registrada com sucesso!");
      router.push("/movimentacoes");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao registrar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/movimentacoes"><Button variant="ghost" size="icon-sm"><ArrowLeft className="w-5 h-5" /></Button></Link>
        <h1 className="text-headline-lg font-display text-[hsl(var(--on-surface))]">Nova Movimentação</h1>
      </div>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["expense", "income", "transfer"] as const).map((t) => (
                  <button key={t} type="button" onClick={() => { setType(t); setValue("type", t); }}
                    className={`px-3 py-2 rounded text-body-sm font-medium transition-all ${
                      type === t ? t === "income" ? "bg-[hsl(var(--growth))/20] text-[hsl(var(--growth-signal))] border border-[hsl(var(--growth))/30]" :
                      t === "expense" ? "bg-[hsl(var(--error))/20] text-[hsl(var(--error))] border border-[hsl(var(--error))/30]" :
                      "bg-[hsl(var(--primary))/20] text-[hsl(var(--primary))] border border-[hsl(var(--primary))/30]"
                      : "bg-[hsl(var(--surface-container))] text-[hsl(var(--on-surface-variant))] border border-[hsl(var(--border-precision))]"
                    }`}>
                    {t === "income" ? "Receita" : t === "expense" ? "Despesa" : "Transferência"}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input id="amount" type="number" step="0.01" placeholder="0,00" {...register("amount")} />
              {errors.amount && <p className="text-label-md text-[hsl(var(--error))]">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <select id="category" {...register("category")} className="flex h-10 w-full rounded bg-[hsl(var(--input))] border border-[hsl(var(--border))] px-3 py-2 text-body-sm text-[hsl(var(--on-surface))] focus-visible:outline-none focus-visible:border-[hsl(var(--primary))]">
                <option value="">Selecionar...</option>
                {type === "income" && (<><option value="Salário">Salário</option><option value="Freelance">Freelance</option><option value="Investimentos">Investimentos</option><option value="Outros">Outros</option></>)}
                {type === "expense" && (<><option value="Alimentação">Alimentação</option><option value="Transporte">Transporte</option><option value="Moradia">Moradia</option><option value="Lazer">Lazer</option><option value="Assinaturas">Assinaturas</option><option value="Saúde">Saúde</option><option value="Educação">Educação</option><option value="Outros">Outros</option></>)}
                {type === "transfer" && (<><option value="Transferência">Transferência</option></>)}
              </select>
              {errors.category && <p className="text-label-md text-[hsl(var(--error))]">{errors.category.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && <p className="text-label-md text-[hsl(var(--error))]">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" placeholder="Ex: Supermercado Extra" {...register("description")} />
              {errors.description && <p className="text-label-md text-[hsl(var(--error))]">{errors.description.message}</p>}
            </div>
            <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}Registrar Movimentação
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
