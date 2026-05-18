import type { CargoListResult, CargoPageParams } from "@/modules/cargo/entities/cargo/model/types";
import { normalizeCargoList } from "@/modules/cargo/entities/cargo/lib/normalizeCargo";
import { buildSarbonCargoUrl, buildSarbonHeaders } from "@/shared/api/sarbon";

export async function getCargoPage(params: CargoPageParams): Promise<CargoListResult> {
  const url = buildSarbonCargoUrl(params);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: buildSarbonHeaders(params.lang),
      cache: "no-store",
      next: { revalidate: 0 }
    });

    const text = await response.text();
    let payload: unknown = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = { message: text };
    }

    if (!response.ok) {
      return {
        items: [],
        total: 0,
        page: params.page,
        limit: params.limit,
        totalPages: 1,
        upstreamStatus: response.status,
        error: `Sarbon API ${response.status}: ${typeof payload === "object" && payload !== null && "message" in payload ? String((payload as { message?: unknown }).message) : response.statusText}`
      };
    }

    return normalizeCargoList(payload, {
      page: params.page,
      limit: params.limit,
      lang: params.lang,
      upstreamStatus: response.status
    });
  } catch (error) {
    return {
      items: [],
      total: 0,
      page: params.page,
      limit: params.limit,
      totalPages: 1,
      error: error instanceof Error ? error.message : "Unknown network error"
    };
  }
}
