"use client";

import { useState, useEffect, useCallback } from "react";
import type { Investment } from "@/types/supabase";

export function useInvestments() {
  const [data, setData] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await window.fetch("/api/investments");
      if (!res.ok) throw new Error("Erro ao carregar investimentos");
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInvestments(); }, [fetchInvestments]);

  const create = useCallback(async (input: Partial<Investment>) => {
    const res = await window.fetch("/api/investments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Erro ao criar");
    const item = await res.json();
    setData((prev) => [item, ...prev]);
    return item;
  }, []);

  const update = useCallback(async (id: string, input: Partial<Investment>) => {
    const res = await window.fetch(`/api/investments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Erro ao atualizar");
    const updated = await res.json();
    setData((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    const res = await window.fetch(`/api/investments/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao excluir");
    setData((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { data, loading, error, refetch: fetchInvestments, create, update, remove };
}
