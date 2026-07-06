/** "₹1,250 Cr" — Indian grouping */
export function formatCrore(amountCr: number, decimals = 0): string {
  return `₹${amountCr.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} Cr`;
}

/** "12.4%" */
export function formatPct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** "05 Jul 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
