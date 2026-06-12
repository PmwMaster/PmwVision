"use client";

import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface KPICardProps {
  title: string;
  value: string;
  change?: number | null;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
  loading?: boolean;
}

export function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend = "neutral",
  className,
  loading = false,
}: KPICardProps) {
  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardContent className="p-4 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-3 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("transition-all duration-200 hover:border-[hsl(var(--primary))/30]", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-label-md text-[hsl(var(--on-surface-variant))] uppercase tracking-wider">
            {title}
          </span>
          {icon && (
            <span className="text-[hsl(var(--on-surface-variant))]">{icon}</span>
          )}
        </div>
        <div className="text-headline-lg-mobile lg:text-headline-lg font-display text-[hsl(var(--on-surface))] tabular-nums">
          {value}
        </div>
        {change !== undefined && change !== null && (
          <div className="flex items-center gap-1 mt-1">
            {trend === "up" ? (
              <TrendingUp className="w-3.5 h-3.5 text-[hsl(var(--growth-signal))]" />
            ) : trend === "down" ? (
              <TrendingDown className="w-3.5 h-3.5 text-[hsl(var(--error))]" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
            )}
            <span
              className={cn(
                "text-label-md",
                trend === "up"
                  ? "text-[hsl(var(--growth-signal))]"
                  : trend === "down"
                  ? "text-[hsl(var(--error))]"
                  : "text-[hsl(var(--muted-foreground))]"
              )}
            >
              {change >= 0 ? "+" : ""}
              {change.toFixed(1)}%
            </span>
            {changeLabel && (
              <span className="text-label-md text-[hsl(var(--muted-foreground))] ml-1">
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
