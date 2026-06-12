"use client";

import { useState, useEffect, useCallback } from "react";
import type { MonthlyBudget } from "@/types/supabase";

export function useBudget(month?: string) {
  const [data, setData] = useState<MonthlyBudget | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBudget = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (month) params.set("month", month);
      const res = await window.fetch(`/api/budgets?${params}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { fetchBudget(); }, [fetchBudget]);

  const upsert = useCallback(async (input: Partial<MonthlyBudget>) => {
    const res = await window.fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Erro ao salvar orçamento");
    const item = await res.json();
    setData(item);
    return item;
  }, []);

  return { data, loading, upsert, refetch: fetchBudget };
}
