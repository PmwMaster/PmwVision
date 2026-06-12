"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { HobbyInvestment } from "@/types/supabase";

export function useHobbyInvestments() {
  const qc = useQueryClient();
  const key = ["hobby-investments"];

  const query = useQuery({
    queryKey: key,
    queryFn: () => apiClient<HobbyInvestment[]>("/api/hobby-investments"),
  });

  const create = useMutation({
    mutationFn: (input: Partial<HobbyInvestment>) =>
      apiClient<HobbyInvestment>("/api/hobby-investments", { method: "POST", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...input }: Partial<HobbyInvestment> & { id: string }) =>
      apiClient<HobbyInvestment>(`/api/hobby-investments/${id}`, { method: "PUT", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const remove = useMutation({
    mutationFn: (id: string) =>
      apiClient<void>(`/api/hobby-investments/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { ...query, create, update, remove };
}
