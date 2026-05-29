import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDate(date: string | number | null | undefined): string {
  if (date === null || date === undefined || date === "") return "—";
  try {
    const d = typeof date === "number" ? new Date(date) : parseISO(date);
    if (isNaN(d.getTime())) return "—";
    return format(d, "d MMM yyyy");
  } catch {
    return "—";
  }
}

export function timeAgo(timestampMs: number): string {
  return formatDistanceToNow(new Date(timestampMs), { addSuffix: true });
}

export function todayUTC(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatDateLong(date: string | number | null | undefined): string {
  if (date === null || date === undefined || date === "") return "—";
  try {
    const d = typeof date === "number" ? new Date(date) : parseISO(date);
    if (isNaN(d.getTime())) return "—";
    return format(d, "MMMM d, yyyy");
  } catch {
    return "—";
  }
}

export function relativeDueDate(dueDate: string | null | undefined): string {
  if (!dueDate) return "no due date";
  try {
    const due = parseISO(dueDate);
    if (isNaN(due.getTime())) return "—";
    const now = new Date();
    const isPast = due < now;
    const formatted = format(due, "d MMM yyyy");
    if (isPast) return `${formatted} (overdue)`;
    return `on ${formatted}`;
  } catch {
    return "—";
  }
}
