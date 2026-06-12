"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { Bell, Target, AlertTriangle, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";

type NotifType = "goal" | "warning" | "suggestion" | "success";

const typeConfig: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
  goal: { icon: Target, color: "text-[hsl(var(--growth-signal))]", bg: "bg-[hsl(var(--growth))/15]" },
  warning: { icon: AlertTriangle, color: "text-[hsl(var(--tertiary))]", bg: "bg-[hsl(var(--tertiary))/15]" },
  suggestion: { icon: TrendingUp, color: "text-[hsl(var(--primary))]", bg: "bg-[hsl(var(--primary))/15]" },
  success: { icon: CheckCircle2, color: "text-[hsl(var(--growth-signal))]", bg: "bg-[hsl(var(--growth))/15]" },
};

export default function NotificationsPage() {
  const { data: notifications, loading } = useNotifications();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-label-md text-[hsl(var(--on-surface-variant))] uppercase tracking-wider">Central de Alertas</p>
          <h1 className="text-display-lg font-display text-[hsl(var(--on-surface))] mt-1">Notificações</h1>
        </div>
        <Button variant="secondary" size="sm">Marcar todas como lidas</Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-body-sm text-[hsl(var(--muted-foreground))]">Carregando...</div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={<Bell className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />} title="Nenhuma notificação" description="Você será notificado sobre metas, orçamento e novidades." />
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const config = typeConfig[notif.type as NotifType] || typeConfig.suggestion;
            const timeAgo = new Date(notif.created_at).toLocaleDateString("pt-BR");
            return (
              <Card key={notif.id} className={cn("hover:border-[hsl(var(--primary))/30] transition-all", !notif.read && "border-l-2 border-l-[hsl(var(--primary))]")}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", config.bg)}>
                      <config.icon className={cn("w-4 h-4", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={cn("text-body-sm font-medium", !notif.read ? "text-[hsl(var(--on-surface))]" : "text-[hsl(var(--on-surface-variant))]")}>{notif.title}</h3>
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] shrink-0" />}
                      </div>
                      <p className="text-body-sm text-[hsl(var(--on-surface-variant))] mt-0.5">{notif.message}</p>
                      <div className="flex items-center gap-1 mt-2 text-label-md text-[hsl(var(--muted-foreground))]">
                        <Clock className="w-3 h-3" />{timeAgo}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
