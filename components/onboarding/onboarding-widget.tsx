"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  FileText,
  CreditCard,
  CheckCircle,
  Circle,
  ChevronRight,
  X,
  PartyPopper,
} from "lucide-react";

export type OnboardingStepStatus = {
  hasProperty: boolean;
  hasUnit: boolean;
  hasTenant: boolean;
  hasLease: boolean;
  hasPayment: boolean;
};

const STEPS = [
  {
    id: "property" as const,
    label: "Add your first property",
    Icon: Building2,
    todoHref: "/properties/new",
    doneHref: "/properties",
  },
  {
    id: "unit" as const,
    label: "Add a unit to that property",
    Icon: Building2,
    todoHref: "/properties",
    doneHref: "/properties",
  },
  {
    id: "tenant" as const,
    label: "Add your first tenant",
    Icon: Users,
    todoHref: "/tenants/new",
    doneHref: "/tenants",
  },
  {
    id: "lease" as const,
    label: "Create a lease",
    Icon: FileText,
    todoHref: "/leases/new",
    doneHref: "/leases",
  },
  {
    id: "payment" as const,
    label: "Log your first payment",
    Icon: CreditCard,
    todoHref: "/payments/new",
    doneHref: "/payments",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export function OnboardingWidget({
  userId,
  stepStatus,
}: {
  userId: string;
  stepStatus: OnboardingStepStatus;
}) {
  const welcomeKey = `ll_welcome_${userId}`;
  const checklistKey = `ll_checklist_hidden_${userId}`;

  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [checklistHidden, setChecklistHidden] = useState(false);

  const completed: Record<StepId, boolean> = {
    property: stepStatus.hasProperty,
    unit: stepStatus.hasUnit,
    tenant: stepStatus.hasTenant,
    lease: stepStatus.hasLease,
    payment: stepStatus.hasPayment,
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const allDone = completedCount === STEPS.length;
  const progressPct = Math.round((completedCount / STEPS.length) * 100);

  useEffect(() => {
    setMounted(true);
    // Show welcome modal only on first visit and if not finished
    if (!localStorage.getItem(welcomeKey) && !allDone) {
      setShowModal(true);
    }
    if (localStorage.getItem(checklistKey)) {
      setChecklistHidden(true);
    }
  }, [welcomeKey, checklistKey, allDone]);

  function handleLetGo() {
    localStorage.setItem(welcomeKey, "1");
    setShowModal(false);
  }

  function handleDismissChecklist() {
    localStorage.setItem(checklistKey, "1");
    setChecklistHidden(true);
  }

  // Avoid layout flash while reading localStorage
  if (!mounted) return null;
  // Nothing to show
  if (checklistHidden && !showModal) return null;

  return (
    <>
      {/* ── Welcome Modal ──────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            // Allow clicking backdrop to dismiss
            if (e.target === e.currentTarget) handleLetGo();
          }}
        >
          <div className="relative bg-card border border-border rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            {/* Close button */}
            <button
              onClick={handleLetGo}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center space-y-5">
              <div className="text-5xl select-none">🎉</div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold leading-tight">
                  Welcome to Landlord Ledger!
                  <br />
                  Let&apos;s get you set up
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  It takes less than 5 minutes to add your first property and
                  tenant.
                </p>
              </div>
              <button
                onClick={handleLetGo}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Let&apos;s Go →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Onboarding Checklist Card ──────────────────────────── */}
      {!checklistHidden && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-5 pb-3">
            <div>
              {allDone ? (
                <p className="font-semibold text-sm flex items-center gap-1.5">
                  <PartyPopper className="h-4 w-4 text-amber-500" />
                  You&apos;re all set!
                </p>
              ) : (
                <p className="font-semibold text-sm">Get started checklist</p>
              )}
              <p className="text-xs text-muted-foreground mt-0.5">
                {allDone
                  ? "Your account is fully configured. Enjoy Landlord Ledger!"
                  : `${completedCount} of ${STEPS.length} steps completed`}
              </p>
            </div>
            <button
              onClick={handleDismissChecklist}
              className="text-muted-foreground hover:text-foreground transition-colors -mt-0.5 -mr-0.5 p-1.5 rounded-lg hover:bg-muted"
              title="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                {progressPct}%
              </span>
            </div>
          </div>

          {/* Steps list */}
          <div className="px-3 pb-3 space-y-0.5">
            {STEPS.map(({ id, label, todoHref, doneHref }) => {
              const done = completed[id];
              return (
                <Link
                  key={id}
                  href={done ? doneHref : todoHref}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group ${
                    done
                      ? "text-muted-foreground cursor-default"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {done ? (
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
                  )}
                  <span className={done ? "line-through" : ""}>{label}</span>
                  {!done && (
                    <ChevronRight className="h-3.5 w-3.5 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
