"use client";

import { useState, useEffect, useCallback } from "react";
import type { Goal } from "@/types/supabase";

export function useGoals() {
  const [data, setData] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await window.fetch("/api/goals");
      if (!res.ok) throw new Error("Erro ao carregar metas");
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const create = useCallback(async (input: Partial<Goal>) => {
    const res = await window.fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Erro ao criar meta");
    const item = await res.json();
    setData((prev) => [item, ...prev]);
    return item;
  }, []);

  const update = useCallback(async (id: string, input: Partial<Goal>) => {
    const res = await window.fetch(`/api/goals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Erro ao atualizar meta");
    const updated = await res.json();
    setData((prev) => prev.map((g) => (g.id === id ? updated : g)));
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    const res = await window.fetch(`/api/goals/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao excluir meta");
    setData((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return { data, loading, error, refetch: fetchGoals, create, update, remove };
}
