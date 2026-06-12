"use client";

import { useQuery } from "@tanstack/react-query";

export function useDashboardEvolution(range: string) {
  return useQuery({
    queryKey: ["dashboard", "evolution", range],
    queryFn: async () => {
      const res = await window.fetch(
        `/api/dashboard/evolution?range=${range}`
      );
      if (!res.ok) throw new Error("Erro ao carregar evolução");
      return res.json();
    },
  });
}

export function useDashboardIncomeExpense(range: string) {
  return useQuery({
    queryKey: ["dashboard", "income-expense", range],
    queryFn: async () => {
      const res = await window.fetch(
        `/api/dashboard/income-vs-expense?range=${range}`
      );
      if (!res.ok) throw new Error("Erro ao carregar income/expense");
      return res.json();
    },
  });
}
