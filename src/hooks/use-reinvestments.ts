"use client";

import { useState, useEffect, useCallback } from "react";
import type { Reinvestment } from "@/types/supabase";

export function useReinvestments() {
  const [data, setData] = useState<Reinvestment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const res = await window.fetch("/api/reinvestments");
      if (res.ok) setData(await res.json());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const create = useCallback(async (input: Partial<Reinvestment>) => {
    const res = await window.fetch("/api/reinvestments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Erro ao criar");
    const item = await res.json();
    setData((prev) => [item, ...prev]);
    return item;
  }, []);

  return { data, loading, refetch: fetchAll, create };
}
