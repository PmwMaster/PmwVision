"use client";

import { useState, useEffect, useCallback } from "react";
import type { Notification } from "@/types/supabase";

export function useNotifications() {
  const [data, setData] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await window.fetch("/api/notifications");
      if (res.ok) setData(await res.json());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

  const unreadCount = data.filter((n) => !n.read).length;

  return { data, loading, unreadCount, refetch: fetchNotifs };
}
