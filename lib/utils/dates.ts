/** Return the next due date given a payment due day (1–28) */
export function nextDueDate(dueDayOfMonth: number): Date {
  const today = new Date();
  const candidate = new Date(today.getFullYear(), today.getMonth(), dueDayOfMonth);
  if (candidate <= today) {
    candidate.setMonth(candidate.getMonth() + 1);
  }
  return candidate;
}

/** Check if a payment is late given its due date and grace period (days) */
export function isLate(dueDate: Date, gracePeriodDays: number): boolean {
  const graceCutoff = new Date(dueDate);
  graceCutoff.setDate(graceCutoff.getDate() + gracePeriodDays);
  return new Date() > graceCutoff;
}

/** Format a date as "MMM D, YYYY" */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/** Return the current tax year */
export function currentTaxYear(): number {
  return new Date().getFullYear();
}
