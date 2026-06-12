"use client";

import { useState, useEffect, useCallback } from "react";
import type { Profile } from "@/types/supabase";

export function useProfile() {
  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await window.fetch("/api/profile");
      if (res.ok) setData(await res.json());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const update = useCallback(async (input: Partial<Profile>) => {
    const res = await window.fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Erro ao atualizar perfil");
    const updated = await res.json();
    setData(updated);
    return updated;
  }, []);

  return { data, loading, update, refetch: fetchProfile };
}
