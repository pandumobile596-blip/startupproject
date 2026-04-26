"use server";

/**
 * Placeholder reminder action.
 * This keeps the dashboard flow actionable until a real integration is added.
 */
export async function sendRentReminder(tenantName: string, amount: number) {
  console.log(`[Reminder] Sent reminder to ${tenantName} for $${amount.toFixed(2)}`);
}
