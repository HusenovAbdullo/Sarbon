export type Language = "uz" | "ru" | "en";
export type ThemeName = "light" | "dark" | "ocean";
export type CargoStatus = "SEARCHING_ALL" | "NEW" | "ACTIVE" | "IN_PROCESS" | "COMPLETED" | "CANCELLED";
export type CargoSort = "created_at:desc" | "created_at:asc";

export interface CargoItem {
  id: string;
  cargoName: string;
  loadingPoint: string;
  unloadingPoint: string;
  weightText: string;
  volumeText: string;
  priceText: string;
  vehicleText: string;
  status: string;
  createdAt: string;
  contactName: string;
  contactPhone: string;
  distanceText: string;
}

export interface CargoListResult {
  items: CargoItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  upstreamStatus?: number;
  error?: string;
}

export interface CargoPageParams {
  page: number;
  limit: 10 | 20 | 50;
  status: CargoStatus;
  sort: CargoSort;
  lang: Language;
  theme: ThemeName;
  q: string;
  from: string;
  to: string;
  transport: string;
  minWeight: string;
  maxWeight: string;
  dateFrom: string;
  dateTo: string;
  offersOnly: boolean;
  favorite: boolean;
}
