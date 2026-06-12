"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const goalSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  target_amount: z.coerce.number().min(0.01, "Valor mínimo: R$ 0,01"),
  current_amount: z.coerce.number().min(0).default(0),
  category: z.string().min(1, "Categoria é obrigatória"),
  deadline: z.string().min(1, "Data é obrigatória"),
  priority: z.enum(["low", "medium", "high"]),
  description: z.string().optional(),
});

type GoalForm = z.infer<typeof goalSchema>;

export default function NewGoalPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<GoalForm>({
    resolver: zodResolver(goalSchema),
    defaultValues: { priority: "medium", current_amount: 0, deadline: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0] },
  });
  const priority = watch("priority");

  const onSubmit = async (data: GoalForm) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao criar meta");
      toast.success("Meta criada com sucesso!");
      router.push("/metas");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao criar meta");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/metas"><Button variant="ghost" size="icon-sm"><ArrowLeft className="w-5 h-5" /></Button></Link>
        <h1 className="text-headline-lg font-display text-[hsl(var(--on-surface))]">Nova Meta</h1>
      </div>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center hover:border-[hsl(var(--primary))/50] transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-[hsl(var(--muted-foreground))] mx-auto mb-2" />
              <p className="text-body-sm text-[hsl(var(--on-surface-variant))]">Clique para adicionar uma imagem</p>
              <p className="text-label-md text-[hsl(var(--muted-foreground))]">PNG, JPG ou WEBP</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Meta</Label>
              <Input id="name" placeholder="Ex: MacBook Pro" {...register("name")} />
              {errors.name && <p className="text-label-md text-[hsl(var(--error))]">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target_amount">Valor Alvo</Label>
                <Input id="target_amount" type="number" step="0.01" placeholder="0,00" {...register("target_amount")} />
                {errors.target_amount && <p className="text-label-md text-[hsl(var(--error))]">{errors.target_amount.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_amount">Valor Atual</Label>
                <Input id="current_amount" type="number" step="0.01" placeholder="0,00" {...register("current_amount")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <select id="category" {...register("category")} className="flex h-10 w-full rounded bg-[hsl(var(--input))] border border-[hsl(var(--border))] px-3 py-2 text-body-sm text-[hsl(var(--on-surface))] focus-visible:outline-none focus-visible:border-[hsl(var(--primary))]">
                <option value="">Selecionar...</option>
                <option value="Imóvel">Imóvel</option><option value="Mobilidade">Mobilidade</option><option value="Tech">Tech</option>
                <option value="Viagem">Viagem</option><option value="Educação">Educação</option><option value="Saúde">Saúde</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Data Limite</Label>
              <Input id="deadline" type="date" {...register("deadline")} />
            </div>
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "medium", "high"] as const).map((p) => (
                  <button key={p} type="button" onClick={() => setValue("priority", p)}
                    className={`px-3 py-2 rounded text-body-sm font-medium transition-all ${priority === p ?
                      (p === "high" ? "bg-[hsl(var(--error))/15] text-[hsl(var(--error))] border border-[hsl(var(--error))/30]" :
                       p === "medium" ? "bg-[hsl(var(--tertiary))/15] text-[hsl(var(--tertiary))] border border-[hsl(var(--tertiary))/30]" :
                       "bg-[hsl(var(--growth))/15] text-[hsl(var(--growth-signal))] border border-[hsl(var(--growth))/30]")
                      : "bg-[hsl(var(--surface-container))] text-[hsl(var(--on-surface-variant))] border border-[hsl(var(--border-precision))]"}`}>
                    {p === "low" ? "Baixa" : p === "medium" ? "Média" : "Alta"}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input id="description" placeholder="Detalhes..." {...register("description")} />
            </div>
            <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}Criar Meta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
