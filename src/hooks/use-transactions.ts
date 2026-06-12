"use client";

import { useState, useEffect, useCallback } from "react";
import type { Transaction } from "@/types/supabase";

export function useTransactions() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await window.fetch("/api/transactions");
      if (!res.ok) throw new Error("Erro ao carregar transações");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const create = useCallback(async (input: Partial<Transaction>) => {
    const res = await window.fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Erro ao criar");
    const newTx = await res.json();
    setData((prev) => [newTx, ...prev]);
    return newTx;
  }, []);

  const update = useCallback(async (id: string, input: Partial<Transaction>) => {
    const res = await window.fetch(`/api/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Erro ao atualizar");
    const updated = await res.json();
    setData((prev) => prev.map((tx) => (tx.id === id ? updated : tx)));
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    const res = await window.fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao excluir");
    setData((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  return { data, loading, error, refetch: fetchTransactions, create, update, remove };
}
