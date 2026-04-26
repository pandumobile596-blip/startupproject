"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Building2, Users, FileText,
  CreditCard, Receipt, BarChart3, MessageSquare, LogOut, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/tenants", label: "Tenants", icon: Users },
  { href: "/leases", label: "Leases", icon: FileText },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
];

export function MobileNav({ userEmail }: { userEmail: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <>
      {/* Top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <span className="text-sm font-semibold">Landlord Ledger</span>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} className="p-1 rounded-md hover:bg-accent">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="lg:hidden absolute top-[49px] left-0 right-0 z-50 bg-card border-b border-border shadow-lg">
          <nav className="px-3 py-3 space-y-0.5">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{userEmail}</p>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
