export type SearchValue = string | string[] | undefined;
export type SearchParamsRecord = Record<string, SearchValue>;

export function readSingle(params: SearchParamsRecord, key: string): string | undefined {
  const value = params[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

export function toQueryString(base: SearchParamsRecord, patch: Record<string, string | number | null | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(base).forEach(([key, value]) => {
    const single = Array.isArray(value) ? value[0] : value;
    if (single !== undefined && single !== null && single !== "") query.set(key, single);
  });
  Object.entries(patch).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") query.delete(key);
    else query.set(key, String(value));
  });
  const output = query.toString();
  return output ? `?${output}` : "";
}
