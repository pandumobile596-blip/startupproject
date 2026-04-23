/** Format a number (in dollars) as a USD string: formatUSD(1234.5) → "$1,234.50" */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/** Convert a dollar string to cents for Stripe: "12.50" → 1250 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/** Convert Stripe cents to dollars: 1250 → 12.5 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}
