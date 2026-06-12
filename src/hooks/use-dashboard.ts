"use client";

import { useState, useEffect, useCallback } from "react";

interface DashboardData {
  balance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  netProfit: number;
  totalInvested: number;
  totalReinvested: number;
  totalWealth: number;
  activeGoals: number;
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await window.fetch("/api/dashboard");
      if (res.ok) setData(await res.json());
    } catch {
      // Silently fail - will show mock data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  return { data, loading, refetch: fetchDashboard };
}
