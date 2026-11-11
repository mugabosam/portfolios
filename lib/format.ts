/** 1 → "001": the three-digit counters used across the site. */
export function pad3(value: number): string {
  return String(value).padStart(3, "0");
}
