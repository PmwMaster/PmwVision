"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { BettingInvestment } from "@/types/supabase";

export function useBettingInvestments() {
  const qc = useQueryClient();
  const key = ["betting-investments"];

  const query = useQuery({
    queryKey: key,
    queryFn: () => apiClient<BettingInvestment[]>("/api/betting-investments"),
  });

  const create = useMutation({
    mutationFn: (input: Partial<BettingInvestment>) =>
      apiClient<BettingInvestment>("/api/betting-investments", { method: "POST", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...input }: Partial<BettingInvestment> & { id: string }) =>
      apiClient<BettingInvestment>(`/api/betting-investments/${id}`, { method: "PUT", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const remove = useMutation({
    mutationFn: (id: string) =>
      apiClient<void>(`/api/betting-investments/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { ...query, create, update, remove };
}
