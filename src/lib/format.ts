// "IN_PROGRESS" -> "In progress"
export function formatEnum(value: string): string {
  const s = value.replace(/_/g, " ").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Accepts "2026-11-11" or a full ISO timestamp.
export function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  // A date-only string would be read as UTC and could show the previous day, so add a local time.
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// "" or whitespace -> undefined, so optional fields are omitted from the JSON.
export function blankToUndefined(v: string): string | undefined {
  const t = v.trim();
  return t === "" ? undefined : t;
}