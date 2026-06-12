"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  showPercent?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "growth" | "primary" | "tertiary" | "error";
  className?: string;
  label?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showPercent = true,
  size = "sm",
  color = "growth",
  className,
  label,
}: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);

  const heights = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colors = {
    growth: "bg-[hsl(var(--growth))]",
    primary: "bg-[hsl(var(--primary))]",
    tertiary: "bg-[hsl(var(--tertiary))]",
    error: "bg-[hsl(var(--error))]",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-label-md text-[hsl(var(--on-surface-variant))]">{label}</span>}
          {showPercent && (
            <span className="text-label-md text-[hsl(var(--on-surface))] tabular-nums">
              {percent.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className={cn("w-full rounded-full bg-[hsl(var(--muted))] overflow-hidden", heights[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            colors[color]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
