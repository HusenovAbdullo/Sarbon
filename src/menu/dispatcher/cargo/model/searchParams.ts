import type { CargoPageParams, CargoSort, CargoStatus, Language, ThemeName } from "@/modules/cargo/entities/cargo/model/types";
import { readSingle, type SearchParamsRecord } from "@/shared/lib/searchParams";

const statuses: CargoStatus[] = ["SEARCHING_ALL", "NEW", "ACTIVE", "IN_PROCESS", "COMPLETED", "CANCELLED"];
const sorts: CargoSort[] = ["created_at:desc", "created_at:asc"];
const langs: Language[] = ["uz", "ru", "en"];
const themes: ThemeName[] = ["light", "dark", "ocean"];
const limits = [10, 20, 50] as const;

function asNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function oneOf<T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T {
  return value && allowed.includes(value as T) ? (value as T) : fallback;
}

export function parseCargoSearchParams(searchParams: SearchParamsRecord): CargoPageParams {
  const limit = oneOf(String(asNumber(readSingle(searchParams, "limit"), 20)), ["10", "20", "50"] as const, "20");
  return {
    page: Math.max(1, asNumber(readSingle(searchParams, "page"), 1)),
    limit: Number(limit) as CargoPageParams["limit"],
    status: oneOf(readSingle(searchParams, "status"), statuses, "SEARCHING_ALL"),
    sort: oneOf(readSingle(searchParams, "sort"), sorts, "created_at:desc"),
    lang: oneOf(readSingle(searchParams, "lang"), langs, "uz"),
    theme: oneOf(readSingle(searchParams, "theme"), themes, "light"),
    q: (readSingle(searchParams, "q") ?? "").trim(),
    from: (readSingle(searchParams, "from") ?? "").trim(),
    to: (readSingle(searchParams, "to") ?? "").trim(),
    transport: (readSingle(searchParams, "transport") ?? "").trim(),
    minWeight: (readSingle(searchParams, "minWeight") ?? "").trim(),
    maxWeight: (readSingle(searchParams, "maxWeight") ?? "").trim(),
    dateFrom: (readSingle(searchParams, "dateFrom") ?? "").trim(),
    dateTo: (readSingle(searchParams, "dateTo") ?? "").trim(),
    offersOnly: readSingle(searchParams, "offersOnly") === "1",
    favorite: readSingle(searchParams, "favorite") === "1"
  };
}

export function paramsToRecord(params: CargoPageParams): Record<string, string> {
  return {
    page: String(params.page),
    limit: String(params.limit),
    status: params.status,
    sort: params.sort,
    lang: params.lang,
    theme: params.theme,
    q: params.q,
    from: params.from,
    to: params.to,
    transport: params.transport,
    minWeight: params.minWeight,
    maxWeight: params.maxWeight,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    offersOnly: params.offersOnly ? "1" : "",
    favorite: params.favorite ? "1" : ""
  };
}
