import type { CargoItem, CargoPageParams } from "../model/types";

function includes(value: string, query: string): boolean {
  return value.toLocaleLowerCase().includes(query.toLocaleLowerCase());
}

function extractNumber(value: string): number | undefined {
  const normalized = value.replace(/,/g, ".").match(/\d+(?:\.\d+)?/);
  if (!normalized) return undefined;
  const number = Number(normalized[0]);
  return Number.isFinite(number) ? number : undefined;
}

function dateInRange(value: string, from: string, to: string): boolean {
  if (!from && !to) return true;
  const time = new Date(value).getTime();
  if (!Number.isFinite(time)) return true;
  const fromTime = from ? new Date(`${from}T00:00:00`).getTime() : undefined;
  const toTime = to ? new Date(`${to}T23:59:59`).getTime() : undefined;
  if (fromTime && time < fromTime) return false;
  if (toTime && time > toTime) return false;
  return true;
}

export function filterCargoItems(
  items: CargoItem[],
  params: Pick<CargoPageParams, "q" | "from" | "to" | "transport" | "minWeight" | "maxWeight" | "dateFrom" | "dateTo">
): CargoItem[] {
  const q = params.q.trim();
  const from = params.from.trim();
  const to = params.to.trim();
  const transport = params.transport.trim();
  const minWeight = extractNumber(params.minWeight);
  const maxWeight = extractNumber(params.maxWeight);

  if (!q && !from && !to && !transport && !minWeight && !maxWeight && !params.dateFrom && !params.dateTo) return items;

  return items.filter((item) => {
    const searchable = [item.id, item.cargoName, item.loadingPoint, item.unloadingPoint, item.contactName, item.contactPhone, item.status, item.vehicleText].join(" ");
    const weight = extractNumber(item.weightText);
    const matchesQ = !q || includes(searchable, q);
    const matchesFrom = !from || includes(item.loadingPoint, from);
    const matchesTo = !to || includes(item.unloadingPoint, to);
    const matchesTransport = !transport || includes(item.vehicleText, transport);
    const matchesMin = minWeight === undefined || weight === undefined || weight >= minWeight;
    const matchesMax = maxWeight === undefined || weight === undefined || weight <= maxWeight;
    const matchesDate = dateInRange(item.createdAt, params.dateFrom, params.dateTo);
    return matchesQ && matchesFrom && matchesTo && matchesTransport && matchesMin && matchesMax && matchesDate;
  });
}
