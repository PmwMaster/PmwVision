import { cn } from "@/lib/utils";
import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-[hsl(var(--surface-container))] flex items-center justify-center mb-4">
        {icon || <PackageOpen className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />}
      </div>
      <h3 className="text-headline-md text-[hsl(var(--on-surface))] mb-2">{title}</h3>
      <p className="text-body-sm text-[hsl(var(--on-surface-variant))] max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && (actionHref ? (
        <Link href={actionHref}>
          <Button variant="primary" size="sm">{actionLabel}</Button>
        </Link>
      ) : (
        <Button variant="primary" size="sm" onClick={onAction}>{actionLabel}</Button>
      ))}
    </div>
  );
}
