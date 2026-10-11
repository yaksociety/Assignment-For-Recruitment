/** Formats an ISO date string as e.g. "14 Oct 2026". Returns "" for null. */
export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const PRIORITY_LABELS: Record<number, string> = { 1: "High", 2: "Medium", 3: "Low" };
