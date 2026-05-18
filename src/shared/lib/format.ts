import type { Language } from "@/modules/cargo/entities/cargo/model/types";

/**
 * Deterministic formatter.
 * SSR va browser timezone/locale farqi hydration xatosi bermasligi uchun
 * Intl local timezone ishlatilmaydi.
 */
export function formatNumber(value: number, _lang: Language): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatDateTime(value: string, _lang: Language): string {
  if (!value || value === "—") return "—";

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})/);
  if (match) {
    const [, year, month, day, hour, minute] = match;
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }

  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    return `${year}-${month}-${day}`;
  }

  return value;
}

export function cutMiddle(value: string, max = 22): string {
  if (value.length <= max) return value;
  const edge = Math.max(6, Math.floor((max - 3) / 2));
  return `${value.slice(0, edge)}...${value.slice(-edge)}`;
}
