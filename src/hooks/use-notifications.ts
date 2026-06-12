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

  const markRead = useCallback(async (id: string) => {
    try {
      const res = await window.fetch(`/api/notifications/${id}`, { method: "PATCH" });
      if (res.ok) {
        setData((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      }
    } catch {
      // silently fail
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      const res = await window.fetch("/api/notifications/mark-all", { method: "PATCH" });
      if (res.ok) {
        setData((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch {
      // silently fail
    }
  }, []);

  const unreadCount = data.filter((n) => !n.read).length;

  return { data, loading, unreadCount, refetch: fetchNotifs, markRead, markAllRead };
}
