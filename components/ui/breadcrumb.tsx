import Link from "next/link";
import { ChevronRight, LayoutDashboard } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap"
    >
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <LayoutDashboard className="h-3.5 w-3.5" />
        <span className="sr-only">Dashboard</span>
      </Link>

      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="inline-flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            {!isLast && item.href ? (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast ? "text-foreground font-medium truncate max-w-[200px]" : undefined
                }
                title={isLast ? item.label : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
