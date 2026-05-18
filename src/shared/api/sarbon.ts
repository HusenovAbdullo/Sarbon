import type { CargoPageParams } from "@/modules/cargo/entities/cargo/model/types";

export function buildSarbonCargoUrl(params: Pick<CargoPageParams, "page" | "limit" | "sort" | "status">): string {
  const baseUrl = process.env.SARBON_API_BASE_URL || "https://api.sarbon.me";
  const url = new URL("/v1/dispatchers/cargo/all", baseUrl);
  url.searchParams.set("limit", String(params.limit));
  url.searchParams.set("page", String(params.page));
  url.searchParams.set("sort", params.sort);
  url.searchParams.set("status", params.status);
  return url.toString();
}

export function buildSarbonHeaders(language: string): HeadersInit {
  const clientToken = process.env.SARBON_CLIENT_TOKEN;
  const userToken = process.env.SARBON_USER_TOKEN;

  if (!clientToken || !userToken) {
    throw new Error("SARBON_CLIENT_TOKEN yoki SARBON_USER_TOKEN .env.local ichida topilmadi.");
  }

  return {
    accept: "application/json, text/plain, */*",
    "X-Device-Type": "web",
    "X-Language": language,
    "X-Client-Token": clientToken,
    "X-User-Token": userToken
  };
}
