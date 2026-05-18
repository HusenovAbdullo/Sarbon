import type { CargoItem, CargoListResult } from "../model/types";

type AnyRecord = Record<string, unknown>;

const arrayPaths = [
  "items", "data.items", "data.data", "data.cargos", "data.list", "data.rows", "data.results",
  "result.items", "result.data", "payload.items", "payload.data", "cargos", "rows", "results", "data"
];
const totalPaths = [
  "total", "count", "total_count", "totalCount", "data.total", "data.count", "data.total_count", "data.totalCount",
  "data.meta.total", "data.pagination.total", "result.total", "result.count", "meta.total", "pagination.total"
];
const totalPagesPaths = [
  "totalPages", "total_pages", "data.totalPages", "data.total_pages", "data.meta.totalPages", "data.pagination.totalPages", "pagination.totalPages"
];

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getByPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!isRecord(current)) return undefined;
    return current[key];
  }, source);
}

function firstValue(source: unknown, paths: string[]): unknown {
  for (const path of paths) {
    const value = getByPath(source, path);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function asString(value: unknown, fallback = "—"): string {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

function asNumber(value: unknown): number | undefined {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function resolveArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  for (const path of arrayPaths) {
    const value = getByPath(payload, path);
    if (Array.isArray(value)) return value;
  }
  return [];
}

function nameByLanguage(value: unknown, language: string): string | undefined {
  if (!isRecord(value)) return undefined;
  return asString(value[`name_${language}`], "") || asString(value.name, "") || asString(value.name_uz, "") || asString(value.name_ru, "") || asString(value.name_en, "") || undefined;
}

function normalizePoint(raw: AnyRecord, prefix: "loading" | "unloading", lang: string): string {
  const direct = firstValue(raw, [
    `${prefix}Point`, `${prefix}_point`, `${prefix}Address`, `${prefix}_address`,
    prefix === "loading" ? "from" : "to"
  ]);
  if (direct) return asString(direct);

  const nested = firstValue(raw, [
    `${prefix}_point_data`, `${prefix}PointData`, `${prefix}_location`, `${prefix}Location`
  ]);
  const nestedName = nameByLanguage(nested, lang);
  if (nestedName) return nestedName;

  const region = firstValue(raw, [`${prefix}_region.name_${lang}`, `${prefix}_region.name`, `${prefix}Region.name`]);
  const district = firstValue(raw, [`${prefix}_district.name_${lang}`, `${prefix}_district.name`, `${prefix}District.name`]);
  return [region, district].filter(Boolean).map(String).join(", ") || "—";
}

function normalizeCargoName(raw: AnyRecord, lang: string): string {
  const direct = firstValue(raw, ["cargoName", "cargo_name", "name", "title", "productName", "product_name"]);
  if (direct) return asString(direct);
  const cargoType = firstValue(raw, ["cargo_type", "cargoType", "cargo.type", "type"]);
  const cargoTypeName = nameByLanguage(cargoType, lang);
  if (cargoTypeName) return cargoTypeName;
  return "—";
}

function normalizeItem(item: unknown, lang: string): CargoItem {
  const raw = isRecord(item) ? item : {};
  const id = asString(firstValue(raw, ["id", "cargoId", "cargo_id", "uuid", "guid"]), cryptoSafeId(raw));
  return {
    id,
    cargoName: normalizeCargoName(raw, lang),
    loadingPoint: normalizePoint(raw, "loading", lang),
    unloadingPoint: normalizePoint(raw, "unloading", lang),
    weightText: asString(firstValue(raw, ["weightText", "weight_text", "weight", "cargo_weight", "raw.weight"])),
    volumeText: asString(firstValue(raw, ["volumeText", "volume_text", "volume", "capacity", "raw.volume"])),
    priceText: asString(firstValue(raw, ["priceText", "price_text", "price", "amount", "cost"])),
    vehicleText: asString(firstValue(raw, ["vehicleText", "vehicle_text", "vehicle", "transport", "car_type", "bodyType"])),
    status: asString(firstValue(raw, ["status", "state", "cargo_status", "statusName"])),
    createdAt: asString(firstValue(raw, ["createdAt", "created_at", "date", "createdDate", "created_date"])),
    contactName: asString(firstValue(raw, ["contactName", "contact_name", "clientName", "client_name", "customerName", "customer_name", "contact.name"])),
    contactPhone: asString(firstValue(raw, ["contactPhone", "contact_phone", "phone", "phoneNumber", "phone_number", "contact.phone"])),
    distanceText: asString(firstValue(raw, ["distanceText", "distance_text", "distance", "routeDistance"]))
  };
}

function cryptoSafeId(raw: AnyRecord): string {
  const seed = JSON.stringify(raw).slice(0, 80);
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return `cargo-${hash || Date.now()}`;
}

export function normalizeCargoList(payload: unknown, options: { page: number; limit: number; lang: string; upstreamStatus?: number }): CargoListResult {
  const rawItems = resolveArray(payload);
  const items = rawItems.map((item) => normalizeItem(item, options.lang));
  const total = asNumber(firstValue(payload, totalPaths)) ?? items.length;
  const explicitTotalPages = asNumber(firstValue(payload, totalPagesPaths));
  const totalPages = explicitTotalPages ?? Math.max(1, Math.ceil(total / options.limit));
  return {
    items,
    total,
    page: options.page,
    limit: options.limit,
    totalPages,
    upstreamStatus: options.upstreamStatus
  };
}
