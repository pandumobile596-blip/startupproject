export type RentStatus = "paid" | "due_soon" | "late";

/**
 * Basic rent status helper used by the monthly snapshot rollup.
 * - paid: payment has been logged for this period
 * - due_soon: rent due within 5 calendar days, not yet paid
 * - late: past the due day (plus grace period) and not paid
 */
export function getRentStatus({
  dueDay,
  gracePeriodDays = 5,
  currentDate = new Date(),
  paid = false,
}: {
  dueDay: number;
  gracePeriodDays?: number;
  currentDate?: Date;
  paid?: boolean;
}): RentStatus {
  if (paid) return "paid";

  const safeDueDay = Math.min(Math.max(dueDay, 1), 31);
  const dayOfMonth = currentDate.getDate();

  // Past due day + grace period → late
  if (dayOfMonth > safeDueDay + gracePeriodDays) return "late";

  // Within 5 days of due (or overdue within grace) → due soon
  if (dayOfMonth >= safeDueDay - 5) return "due_soon";

  return "due_soon"; // not yet due but treat as upcoming
}

export type DetailedRentStatus = "paid" | "due" | "overdue";

/**
 * Per-lease rent status used by the dashboard rent status table.
 * Uses the lease's own gracePeriodDays for accurate overdue detection.
 */
export function getDetailedRentStatus({
  dueDay,
  gracePeriodDays,
  currentDate = new Date(),
  paid = false,
}: {
  dueDay: number;
  gracePeriodDays: number;
  currentDate?: Date;
  paid?: boolean;
}): DetailedRentStatus {
  if (paid) return "paid";
  const day = currentDate.getDate();
  if (day > Math.min(dueDay, 28) + gracePeriodDays) return "overdue";
  return "due";
}

/** Calculate the dollar amount of the late fee for a given lease. */
export function calcLateFee(
  rentAmount: number,
  lateFeeAmount: number | null,
  lateFeeType: "flat" | "percentage" | null
): number {
  if (!lateFeeAmount || !lateFeeType) return 0;
  if (lateFeeType === "flat") return lateFeeAmount;
  // percentage: fee = rent * rate / 100, rounded to cents
  return Math.round((rentAmount * lateFeeAmount) / 100 * 100) / 100;
}
