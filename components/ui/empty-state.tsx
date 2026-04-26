import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tip?: string;
  ctaLabel: string;
  ctaHref: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  tip,
  ctaLabel,
  ctaHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-14 px-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>

      <p className="font-semibold text-base mb-1">{title}</p>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-5">
        {description}
      </p>

      {tip && (
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-4 py-3 max-w-sm mb-5 text-left">
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            💡 <span className="font-semibold">Tip:</span> {tip}
          </p>
        </div>
      )}

      <Button asChild size="sm">
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </div>
  );
}
