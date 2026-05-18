"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  LogOut,
  Menu,
  Palette,
  Phone,
  Search,
  Send,
  Share2,
  SlidersHorizontal,
  Truck,
  UserRound,
  X,
  Box,
  Scale,
  Package,
  ArrowUpRight,
  Globe2,
  MoonStar,
  SunMedium,
  Waves,
  RefreshCw,
  Download,
  ExternalLink
} from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { CargoItem, CargoPageParams, CargoSort, CargoStatus, Language, ThemeName } from "@/modules/cargo/entities/cargo/model/types";
import type { Dictionary } from "@/shared/config/i18n/types";
import { formatDateTime, formatNumber } from "@/shared/lib/format";
import { toQueryString } from "@/shared/lib/searchParams";
import { paramsToRecord } from "../model/searchParams";
import { languages, languageLabels } from "@/shared/config/i18n/server";
import { getThemeLabel, themes } from "@/shared/config/theme";

const navKeys = [
  ["navDashboard", "#"],
  ["navCargo", "/dispatcher/cargo"],
  ["navMyCargo", "#"],
  ["navOffers", "#"],
  ["navTrips", "#"],
  ["navManagers", "#"],
  ["navGps", "#"]
] as const;

const statusOptions: CargoStatus[] = ["SEARCHING_ALL", "NEW", "ACTIVE", "IN_PROCESS", "COMPLETED", "CANCELLED"];
const sortOptions: CargoSort[] = ["created_at:desc", "created_at:asc"];
const transportOptions = ["", "Tentli / Yuk mashinasi", "Ref / Yuk mashinasi", "BOX", "Container", "Truck"];
const flagByLang: Record<Language, string> = { uz: "🇺🇿", ru: "🇷🇺", en: "🇬🇧" };

interface Props {
  params: CargoPageParams;
  items: CargoItem[];
  total: number;
  totalPages: number;
  dictionary: Dictionary;
  error?: string;
}

export function DispatcherCargoClientPage({ params, items, total, totalPages, dictionary, error }: Props) {
  const router = useRouter();
  const base = paramsToRecord(params);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [shareItem, setShareItem] = useState<CargoItem | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [form, setForm] = useState(() => ({
    q: params.q,
    from: params.from,
    to: params.to,
    transport: params.transport,
    minWeight: params.minWeight,
    maxWeight: params.maxWeight,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    status: params.status,
    sort: params.sort,
    offersOnly: params.offersOnly,
    favorite: params.favorite,
    limit: params.limit
  }));

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("sarbon-favorite-cargo-ids");
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      if (Array.isArray(parsed)) setFavoriteIds(parsed);
    } catch {
      setFavoriteIds([]);
    }
  }, []);


  const visibleItems = useMemo(() => {
    return filterItemsOnClient(items, form, favoriteIds);
  }, [items, form, favoriteIds]);

  const currentThemeLabel = getThemeLabel(params.theme, dictionary);
  const currentLangFlag = flagByLang[params.lang];

  function updateQuery(patch: Record<string, string | number | undefined>) {
    router.push(`/dispatcher/cargo${toQueryString(base, patch)}`);
  }

  function applyFilters() {
    updateQuery({
      page: 1,
      q: form.q,
      from: form.from,
      to: form.to,
      transport: form.transport,
      minWeight: form.minWeight,
      maxWeight: form.maxWeight,
      dateFrom: form.dateFrom,
      dateTo: form.dateTo,
      status: form.status,
      sort: form.sort,
      offersOnly: form.offersOnly ? "1" : undefined,
      favorite: form.favorite ? "1" : undefined,
      limit: form.limit
    });
  }

  function clearFilters() {
    setForm({
      q: "",
      from: "",
      to: "",
      transport: "",
      minWeight: "",
      maxWeight: "",
      dateFrom: "",
      dateTo: "",
      status: "SEARCHING_ALL",
      sort: "created_at:desc",
      offersOnly: false,
      favorite: false,
      limit: params.limit
    });
    router.push(`/dispatcher/cargo${toQueryString({ lang: params.lang, theme: params.theme }, {})}`);
  }

  function toggleFavorite(id: string) {
    setFavoriteIds((current) => {
      const next = current.includes(id) ? current.filter((value) => value !== id) : [...current, id];
      if (typeof window !== "undefined") window.localStorage.setItem("sarbon-favorite-cargo-ids", JSON.stringify(next));
      return next;
    });
  }

  function goToPage(page: number) {
    updateQuery({ page: Math.max(1, Math.min(totalPages || 1, page)) });
  }

  function refreshTable() {
    const href = `/dispatcher/cargo${toQueryString(base, { refresh: Date.now() })}`;
    router.replace(href);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color:color-mix(in_srgb,var(--surface)_95%,transparent)] backdrop-blur-xl">
        <div className="flex w-full items-center gap-3 px-3 py-2.5 lg:px-6 xl:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-6">
            <button
              type="button"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--primary)] lg:hidden"
              onClick={() => setMobileMenuOpen((value) => !value)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href={`/dispatcher/cargo${toQueryString(base, { page: 1 })}`} className="shrink-0" aria-label="Sarbon">
              
              <Image src="/sarbon-emblem.png" alt="Sarbon" width={48} height={40} className="h-10 w-auto object-contain sm:hidden" priority />
              <Image src="/sarbon-logo.png" alt="Sarbon" width={174} height={46} className="hidden h-10 w-auto object-contain sm:block" priority />
            </Link>
            <nav className="hidden min-w-0 flex-1 items-center gap-0.5 overflow-x-auto whitespace-nowrap text-[13px] font-extrabold text-[var(--primary)] xl:text-[14px] 2xl:text-[15px] lg:flex">
              {navKeys.map(([key, href]) => {
                const active = key === "navCargo";
                const label = String(dictionary[key]);
                return (
                  <Link
                    key={key}
                    href={href === "/dispatcher/cargo" ? `/dispatcher/cargo${toQueryString(base, { page: 1 })}` : href}
                    className={active ? "flex-none whitespace-nowrap rounded-xl bg-[var(--green-soft)] px-3 py-2.5 text-[var(--green)] xl:px-4" : "flex-none whitespace-nowrap rounded-xl px-3 py-2.5 hover:bg-[var(--surface-2)] xl:px-4"}
                  >
                    {label.split(" ").join("\u00A0")}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden items-center gap-1 text-[var(--primary)] md:flex">
            <RoundActionButton label="favorite"><Heart className="h-5 w-5" /></RoundActionButton>
            <RoundActionButton label="notifications"><Bell className="h-5 w-5" /></RoundActionButton>
          </div>

          <div className="flex items-center gap-2">
            <Dropdown open={langOpen} onOpenChange={setLangOpen} trigger={
              <button type="button" className="flex h-11 items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-2 pr-3 text-sm font-extrabold text-[var(--text)]">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--surface)] shadow-sm">{currentLangFlag}</span>
                <span className="hidden sm:block">{languageLabels[params.lang]}</span>
                <ChevronDown className="h-4 w-4 text-[var(--muted)]" />
              </button>
            }>
              <div className="min-w-[180px] p-2">
                <p className="px-2 pb-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--muted)]">{dictionary.language}</p>
                {languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold ${params.lang === lang ? "bg-[var(--primary)] text-white" : "hover:bg-[var(--surface-2)] text-[var(--text)]"}`}
                    onClick={() => updateQuery({ lang, page: 1 })}
                  >
                    <span>{flagByLang[lang]}</span>
                    <span className="flex-1">{languageLabels[lang]}</span>
                  </button>
                ))}
              </div>
            </Dropdown>

            <Dropdown open={themeOpen} onOpenChange={setThemeOpen} trigger={
              <button type="button" className="flex h-11 items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-2 pr-3 text-sm font-extrabold text-[var(--text)]">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--surface)] text-[var(--primary)] shadow-sm">{themeIcon(params.theme)}</span>
                <span className="hidden sm:block">{currentThemeLabel}</span>
                <ChevronDown className="h-4 w-4 text-[var(--muted)]" />
              </button>
            }>
              <div className="min-w-[210px] p-2">
                <p className="px-2 pb-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--muted)]">{dictionary.theme}</p>
                {themes.map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold ${params.theme === theme ? "bg-[var(--primary)] text-white" : "hover:bg-[var(--surface-2)] text-[var(--text)]"}`}
                    onClick={() => updateQuery({ theme })}
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--surface)] text-[var(--primary)]">{themeIcon(theme)}</span>
                    <span>{getThemeLabel(theme, dictionary)}</span>
                  </button>
                ))}
              </div>
            </Dropdown>

            <Dropdown open={profileOpen} onOpenChange={setProfileOpen} trigger={
              <button type="button" className="flex h-11 items-center gap-2 rounded-xl pl-1 pr-2 text-left hover:bg-[var(--surface-2)]">
                <span className="relative grid h-9 w-9 place-items-center rounded-full bg-[var(--surface-3)] text-[var(--muted)]">
                  <UserRound className="h-5 w-5" />
                  <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--surface)] bg-[var(--green)]" />
                </span>
                <span className="hidden sm:block">
                  <span className="block max-w-[120px] truncate text-sm font-black text-[var(--text)]">{dictionary.profileName}</span>
                  <span className="block text-xs font-semibold text-[var(--muted)]">{dictionary.profileRole}</span>
                </span>
                <ChevronDown className="hidden h-4 w-4 text-[var(--muted)] sm:block" />
              </button>
            }>
              <div className="min-w-[180px] p-2">
                <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-[var(--text)] hover:bg-[var(--surface-2)]">
                  <LogOut className="h-4 w-4 text-[var(--danger)]" />
                  <span>{dictionary.logout}</span>
                </button>
              </div>
            </Dropdown>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[var(--line)] bg-[var(--surface)] px-3 pb-4 pt-3 lg:hidden">
            <nav className="grid gap-1">
              {navKeys.map(([key, href]) => {
                const active = key === "navCargo";
                return (
                  <Link
                    key={key}
                    href={href === "/dispatcher/cargo" ? `/dispatcher/cargo${toQueryString(base, { page: 1 })}` : href}
                    className={active ? "rounded-xl bg-[var(--green-soft)] px-4 py-3 font-extrabold text-[var(--green)]" : "rounded-xl px-4 py-3 font-bold text-[var(--primary)] hover:bg-[var(--surface-2)]"}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {String(dictionary[key])}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <main className="flex w-full flex-1 flex-col px-3 py-4 lg:px-6 lg:py-5 xl:px-8">
        <section className="mb-4 rounded-[26px] border border-[var(--line)] bg-[var(--surface-3)] px-4 py-5 lg:px-6 lg:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--muted)]">
                <Home className="h-4 w-4" />
                <span>{dictionary.pageBadge}</span>
              </div>
              <h1 className="text-4xl font-black tracking-[-0.04em] text-[var(--heading)] lg:text-6xl">{dictionary.title}</h1>
              <p className="mt-2 max-w-3xl text-sm font-semibold text-[var(--muted)] lg:text-[19px] lg:leading-8">
                {dictionary.subtitle} <span className="font-black text-[var(--primary)]">{formatNumber(visibleItems.length, params.lang)}/{formatNumber(total, params.lang)}</span>
              </p>
            </div>

            <div className="w-full max-w-[380px]">
              <div className="relative">
                <input
                  className="input-shell h-12 rounded-2xl pr-14 text-[15px]"
                  value={form.q}
                  onChange={(event) => setForm((current) => ({ ...current, q: event.target.value }))}
                  placeholder={dictionary.topSearchPlaceholder}
                />
                <button
                  type="button"
                  onClick={applyFilters}
                  className="absolute right-1.5 top-1.5 grid h-9 w-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--primary)]"
                  aria-label={dictionary.searchButton}
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <button type="button" className="btn-ghost rounded-2xl px-4" onClick={() => setFiltersOpen((value) => !value)}>
              <SlidersHorizontal className="h-4 w-4" /> {filtersOpen ? dictionary.filterClose : dictionary.filterOpen}
            </button>
            <button type="button" className="btn-ghost rounded-2xl px-4" onClick={refreshTable}>
              <RefreshCw className="h-4 w-4" /> {dictionary.refresh}
            </button>
          </div>

          {filtersOpen && (
            <div className="content-card overflow-visible rounded-[22px] p-4 lg:p-5">
              <div className="grid gap-4 xl:grid-cols-4">
                <Field label={dictionary.originCity}>
                  <TextField value={form.from} placeholder={dictionary.whereFrom} onChange={(value) => setForm((current) => ({ ...current, from: value }))} />
                </Field>
                <Field label={dictionary.destinationCity}>
                  <TextField value={form.to} placeholder={dictionary.whereTo} onChange={(value) => setForm((current) => ({ ...current, to: value }))} />
                </Field>
                <Field label={dictionary.transportLabel}>
                  <CustomSelect
                    value={form.transport}
                    placeholder={dictionary.transportPlaceholder}
                    options={transportOptions.map((value) => ({ value, label: value || dictionary.transportPlaceholder, icon: value ? <Truck className="h-4 w-4" /> : undefined }))}
                    onChange={(value) => setForm((current) => ({ ...current, transport: value }))}
                  />
                </Field>
                <Field label={dictionary.weightTon}>
                  <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)]">
                    <input className="h-12 min-w-0 border-0 bg-transparent px-4 outline-none" placeholder={dictionary.min} value={form.minWeight} onChange={(event) => setForm((current) => ({ ...current, minWeight: event.target.value }))} />
                    <input className="h-12 min-w-0 border-l border-[var(--line-strong)] bg-transparent px-4 outline-none" placeholder={dictionary.max} value={form.maxWeight} onChange={(event) => setForm((current) => ({ ...current, maxWeight: event.target.value }))} />
                  </div>
                </Field>
                <Field label={dictionary.date}>
                  <DateRangePicker
                    start={form.dateFrom}
                    end={form.dateTo}
                    onChange={(next) => setForm((current) => ({ ...current, dateFrom: next.start, dateTo: next.end }))}
                  />
                </Field>
                <Field label={dictionary.status}>
                  <CustomSelect
                    value={form.status}
                    options={statusOptions.map((status) => ({ value: status, label: dictionary.statuses[status] }))}
                    onChange={(value) => setForm((current) => ({ ...current, status: value as CargoStatus }))}
                  />
                </Field>
                <Field label={dictionary.sort}>
                  <CustomSelect
                    value={form.sort}
                    options={sortOptions.map((sort) => ({ value: sort, label: dictionary.sorts[sort] }))}
                    onChange={(value) => setForm((current) => ({ ...current, sort: value as CargoSort }))}
                  />
                </Field>
                <div className="flex items-end">
                  <div className="flex w-full flex-wrap items-center gap-2 lg:justify-end">
                    <TogglePill active={form.offersOnly} onClick={() => setForm((current) => ({ ...current, offersOnly: !current.offersOnly }))}>
                      {dictionary.offersOnly}
                    </TogglePill>
                    <TogglePill active={form.favorite} onClick={() => setForm((current) => ({ ...current, favorite: !current.favorite }))} icon={<Heart className={`h-4 w-4 ${form.favorite ? "fill-current" : ""}`} />}>
                      {dictionary.favorite}
                    </TogglePill>
                    <button type="button" className="btn-ghost rounded-2xl px-4" onClick={clearFilters}><RefreshCw className="h-4 w-4" /> {dictionary.clear}</button>
                    <button type="button" className="btn-primary rounded-2xl px-5" onClick={applyFilters}><Search className="h-4 w-4" /> {dictionary.filterButton}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {error ? (
          <div className="content-card rounded-[22px] p-8 text-center">
            <h3 className="text-2xl font-black text-[var(--heading)]">{dictionary.errorTitle}</h3>
            <p className="mt-2 text-sm font-semibold text-[var(--muted)]">{error}</p>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="content-card rounded-[22px] p-8 text-center">
            <h3 className="text-2xl font-black text-[var(--heading)]">{dictionary.emptyTitle}</h3>
            <p className="mt-2 text-sm font-semibold text-[var(--muted)]">{dictionary.emptySubtitle}</p>
          </div>
        ) : (
          <CargoListSection
            items={visibleItems}
            dictionary={dictionary}
            lang={params.lang}
            favoriteIds={favoriteIds}
            onFavoriteToggle={toggleFavorite}
            onShare={(item) => setShareItem(item)}
          />
        )}

        <section className="content-card mt-4 flex flex-col gap-4 rounded-[22px] p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="btn-ghost rounded-2xl px-4" onClick={() => goToPage(params.page - 1)} disabled={params.page <= 1}>
              <ChevronLeft className="h-4 w-4" /> {dictionary.previous}
            </button>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] px-4 py-3 text-sm font-black text-[var(--text)]">
              {dictionary.currentPage}: {params.page} / {Math.max(1, totalPages)}
            </div>
            <button type="button" className="btn-ghost rounded-2xl px-4" onClick={() => goToPage(params.page + 1)} disabled={params.page >= totalPages}>
              {dictionary.next} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <span className="text-sm font-black text-[var(--muted)]">{dictionary.limitLabel}</span>
            <div className="min-w-[120px]">
              <CustomSelect
                value={String(form.limit)}
                options={[10, 20, 50].map((limit) => ({ value: String(limit), label: String(limit) }))}
                onChange={(value) => {
                  setForm((current) => ({ ...current, limit: Number(value) as CargoPageParams["limit"] }));
                  updateQuery({ limit: value, page: 1 });
                }}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer dictionary={dictionary} />
      <ShareCargoModal item={shareItem} onClose={() => setShareItem(null)} dictionary={dictionary} lang={params.lang} theme={params.theme} />
    </div>
  );
}

function CargoListSection({ items, dictionary, lang, favoriteIds, onFavoriteToggle, onShare }: { items: CargoItem[]; dictionary: Dictionary; lang: Language; favoriteIds: string[]; onFavoriteToggle: (id: string) => void; onShare: (item: CargoItem) => void; }) {
  return (
    <section className="content-card overflow-hidden rounded-[24px]">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1180px] border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              <TableHeader>{dictionary.tablePickup}</TableHeader>
              <TableHeader>{dictionary.tableDropoff}</TableHeader>
              <TableHeader>{dictionary.tablePrice}</TableHeader>
              <TableHeader>{dictionary.tableCargo}</TableHeader>
              <TableHeader>{dictionary.tableTransport}</TableHeader>
              <TableHeader>{dictionary.tableCustomer}</TableHeader>
              <TableHeader>{dictionary.tableActions}</TableHeader>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const favorite = favoriteIds.includes(item.id);
              return (
                <tr key={item.id} className="bg-[var(--surface)] transition hover:bg-[var(--surface-2)]">
                  <TableCell><PlaceCell country={dictionary.uzCountry} point={item.loadingPoint} date={formatDateTime(item.createdAt, lang)} /></TableCell>
                  <TableCell><PlaceCell country={dictionary.uzCountry} point={item.unloadingPoint} date={formatDateTime(item.createdAt, lang)} /></TableCell>
                  <TableCell>
                    <div className="grid gap-1">
                      <span className="text-xl font-black text-[var(--primary)]">{formatPrice(item.priceText, dictionary)}</span>
                      <span className="text-sm font-bold text-[var(--text)]">{dictionary.cash}</span>
                    </div>
                  </TableCell>
                  <TableCell><CargoInfo item={item} dictionary={dictionary} /></TableCell>
                  <TableCell><TransportInfo item={item} dictionary={dictionary} /></TableCell>
                  <TableCell><CustomerInfo item={item} /></TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2 text-[var(--primary)]">
                      <button type="button" className={`grid h-10 w-10 place-items-center rounded-full border ${favorite ? "border-pink-200 bg-pink-50 text-pink-500" : "border-transparent hover:bg-[var(--primary-soft)]"}`} onClick={() => onFavoriteToggle(item.id)}>
                        <Heart className={`h-5 w-5 ${favorite ? "fill-current" : ""}`} />
                      </button>
                      <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-transparent hover:bg-[var(--primary-soft)]" onClick={() => onShare(item)}>
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </TableCell>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-3 lg:hidden">
        {items.map((item) => {
          const favorite = favoriteIds.includes(item.id);
          return (
            <article key={item.id} className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-black text-[var(--primary)]">{formatPrice(item.priceText, dictionary)}</p>
                  <p className="text-sm font-bold text-[var(--text)]">{dictionary.cash}</p>
                </div>
                <div className="flex items-center gap-2 text-[var(--primary)]">
                  <button type="button" className={`grid h-10 w-10 place-items-center rounded-full border ${favorite ? "border-pink-200 bg-pink-50 text-pink-500" : "border-[var(--line)] bg-[var(--surface-2)]"}`} onClick={() => onFavoriteToggle(item.id)}>
                    <Heart className={`h-5 w-5 ${favorite ? "fill-current" : ""}`} />
                  </button>
                  <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface-2)]" onClick={() => onShare(item)}>
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                <MiniCard label={dictionary.tablePickup}><PlaceCell country={dictionary.uzCountry} point={item.loadingPoint} date={formatDateTime(item.createdAt, lang)} /></MiniCard>
                <MiniCard label={dictionary.tableDropoff}><PlaceCell country={dictionary.uzCountry} point={item.unloadingPoint} date={formatDateTime(item.createdAt, lang)} /></MiniCard>
                <MiniCard label={dictionary.tableCargo}><CargoInfo item={item} dictionary={dictionary} /></MiniCard>
                <MiniCard label={dictionary.tableTransport}><TransportInfo item={item} dictionary={dictionary} /></MiniCard>
                <MiniCard label={dictionary.tableCustomer}><CustomerInfo item={item} /></MiniCard>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return <th className="border-b border-[var(--line)] bg-[var(--surface-3)] px-5 py-4 text-[12px] font-black uppercase tracking-[0.12em] text-[#71809a]">{children}</th>;
}

function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="border-b border-[var(--line)] px-5 py-5 align-middle">{children}</td>;
}

function PlaceCell({ country, point, date }: { country: string; point: string; date: string }) {
  const code = cityCode(point);
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center gap-2">
        <CountryPill country={country} />
        <b className="text-lg font-black text-[var(--text)]">{code}</b>
      </div>
      <div className="pl-9 text-sm font-semibold text-[var(--muted)]">{date}</div>
    </div>
  );
}

function CountryPill({ country }: { country: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-[4px] text-[10px] font-black uppercase text-[var(--muted)]">
      <span className="grid h-4 w-5 overflow-hidden rounded-[3px] border border-[var(--line)]">
        <span className="bg-sky-400" />
        <span className="bg-white" />
        <span className="bg-[var(--green)]" />
      </span>
      {country}
    </span>
  );
}

function CargoInfo({ item, dictionary }: { item: CargoItem; dictionary: Dictionary }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center gap-3 font-black text-[var(--text)]">
        <span className="flex items-center gap-1.5"><Scale className="h-4 w-4 text-[var(--muted)]" /> {item.weightText}</span>
        <span className="flex items-center gap-1.5"><Box className="h-4 w-4 text-[var(--muted)]" /> {item.volumeText}</span>
      </div>
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
        <Package className="h-4 w-4" />
        <span className="max-w-[220px] truncate">{item.cargoName === "—" ? dictionary.cargoDescription : item.cargoName}</span>
      </div>
    </div>
  );
}

function TransportInfo({ item, dictionary }: { item: CargoItem; dictionary: Dictionary }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center gap-2 font-black text-[var(--text)]">
        <Truck className="h-4 w-4 text-[var(--muted)]" />
        <span className="max-w-[240px] truncate">{item.vehicleText}</span>
      </div>
      <div className="grid gap-1 text-xs font-semibold">
        <span className="flex items-center gap-1 text-[var(--green)]"><ArrowUpRight className="h-3.5 w-3.5" />{dictionary.rowRouteHint}</span>
        <span className="flex items-center gap-1 text-[var(--primary)]"><Send className="h-3.5 w-3.5" />{dictionary.rowRouteHint}</span>
      </div>
    </div>
  );
}

function CustomerInfo({ item }: { item: CargoItem }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-300 text-sm font-black text-white">{initials(item.contactName)}</span>
      <div className="min-w-0">
        <p className="max-w-[190px] truncate font-black text-[var(--text)]">{item.contactName}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-[var(--muted)]"><Phone className="h-3.5 w-3.5" />{item.contactPhone}</p>
      </div>
    </div>
  );
}

function MiniCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-3.5">
      <p className="mb-2 text-[11px] font-black uppercase tracking-[0.08em] text-[var(--muted)]">{label}</p>
      {children}
    </div>
  );
}

function ShareCargoModal({ item, onClose, dictionary, lang, theme }: { item: CargoItem | null; onClose: () => void; dictionary: Dictionary; lang: Language; theme: ThemeName }) {
  const previewUrl = useMemo(() => item ? svgToDataUrl(buildShareSvg(item, dictionary, lang, theme)) : "", [item, dictionary, lang, theme]);
  if (!item) return null;
  const cargo = item;

  async function shareCard() {
    try {
      const file = await svgDataUrlToPngFile(previewUrl, `sarbon-cargo-${cargo.id}.png`);
      if (navigator.share && file) {
        await navigator.share({
          title: cargo.cargoName,
          text: `${cargo.loadingPoint} → ${cargo.unloadingPoint}`,
          files: [file]
        });
      } else {
        await downloadCard();
      }
    } catch {
      await downloadCard();
    }
  }

  async function downloadCard() {
    const file = await svgDataUrlToPngFile(previewUrl, `sarbon-cargo-${cargo.id}.png`);
    if (!file) return;
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.name;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-2xl lg:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black text-[var(--heading)]">{dictionary.cargoPreviewTitle}</h3>
            <p className="text-sm font-semibold text-[var(--muted)]">{dictionary.cargoPreviewText}</p>
          </div>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] text-[var(--muted)] hover:text-[var(--primary)]" onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--surface-3)] p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Cargo preview" className="h-auto w-full rounded-[18px] border border-[var(--line)] bg-white" />
          </div>
          <div className="grid content-start gap-3">
            <button type="button" className="btn-primary rounded-2xl px-5" onClick={shareCard}><ExternalLink className="h-4 w-4" /> {dictionary.shareAction}</button>
            <button type="button" className="btn-ghost rounded-2xl px-5" onClick={downloadCard}><Download className="h-4 w-4" /> {dictionary.downloadAction}</button>
            <button type="button" className="btn-ghost rounded-2xl px-5" onClick={onClose}><X className="h-4 w-4" /> {dictionary.close}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer({ dictionary }: { dictionary: Dictionary }) {
  return (
    <footer className="mt-4 border-t border-[var(--line)] bg-[var(--surface)] px-4 py-8 text-[var(--muted)] lg:px-8">
      <div className="grid w-full gap-8 md:grid-cols-3">
        <FooterGroup title={dictionary.footerUseful} links={[dictionary.footerDistance, dictionary.footerVersions]} />
        <FooterGroup title={dictionary.footerContactsRates} links={[dictionary.footerAbout, dictionary.footerContacts]} />
        <FooterGroup title={dictionary.footerInfo} links={[dictionary.footerPrivacy, dictionary.footerSitemap]} />
      </div>
      <div className="mt-8 w-full border-t border-[var(--line)] pt-5">
        <p className="mb-3 text-sm font-semibold">{dictionary.footerMobile}</p>
        <div className="flex flex-wrap gap-3">
          <StoreBadge title="Download on the" brand="App Store" />
          <StoreBadge title="GET IT ON" brand="Google Play" />
        </div>
      </div>
      <div className="mt-6 flex w-full flex-col gap-4 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Image src="/sarbon-logo.png" alt="Sarbon" width={118} height={32} className="h-8 w-auto object-contain" />
        <p className="text-sm font-semibold">{dictionary.copyright}</p>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-black text-[var(--muted)]">{title}</h3>
      <div className="grid gap-3 text-base font-medium text-[var(--text)]">
        {links.map((link) => <a key={link} href="#" className="hover:text-[var(--primary)]">{link}</a>)}
      </div>
    </div>
  );
}

function StoreBadge({ title, brand }: { title: string; brand: string }) {
  return (
    <span className="inline-grid min-w-[128px] rounded-md bg-black px-4 py-2 text-white shadow-sm">
      <small className="text-[9px] font-bold uppercase leading-none opacity-80">{title}</small>
      <b className="text-sm leading-tight">{brand}</b>
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-[var(--text)]">{label}</span>
      {children}
    </label>
  );
}

function TextField({ value, placeholder, onChange }: { value: string; placeholder: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <input className="input-shell h-12 rounded-2xl pr-11 text-[15px]" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
    </div>
  );
}

function useOutsideClose(ref: React.RefObject<HTMLElement>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!ref.current?.contains(target)) onClose();
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, open, onClose]);
}

function CustomSelect({ value, options, onChange, placeholder }: { value: string; options: { value: string; label: string; icon?: React.ReactNode }[]; onChange: (value: string) => void; placeholder?: string; }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useOutsideClose(wrapperRef, open, () => setOpen(false));

  return (
    <div ref={wrapperRef} className="relative">
      <button type="button" className="flex h-12 w-full items-center justify-between gap-2 rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] px-4 text-left text-[15px] font-semibold text-[var(--text)]" onClick={() => setOpen((state) => !state)}>
        <span className="flex min-w-0 items-center gap-2">
          {selected?.icon ? <span className="text-[var(--muted)]">{selected.icon}</span> : null}
          <span className={`${selected ? "text-[var(--text)]" : "text-[var(--muted)]"} truncate`}>{selected?.label || placeholder || "Select"}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[var(--muted)] transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-xl">
          <div className="max-h-64 overflow-y-auto p-2">
            {options.map((option) => {
              const active = option.value === value;
              return (
                <button
                  key={`${option.value}-${option.label}`}
                  type="button"
                  onClick={() => { onChange(option.value); setOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold ${active ? "bg-[var(--primary)] text-white" : "text-[var(--text)] hover:bg-[var(--surface-2)]"}`}
                >
                  {option.icon ? <span>{option.icon}</span> : null}
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Dropdown({ open, onOpenChange, trigger, children }: { open: boolean; onOpenChange: (value: boolean) => void; trigger: React.ReactNode; children: React.ReactNode; }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideClose(wrapperRef, open, () => onOpenChange(false));

  return (
    <div ref={wrapperRef} className="relative">
      <div onClick={() => onOpenChange(!open)}>{trigger}</div>
      {open ? <div className="absolute right-0 top-[calc(100%+10px)] z-40 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-xl">{children}</div> : null}
    </div>
  );
}

function TogglePill({ active, onClick, children, icon }: { active: boolean; onClick: () => void; children: React.ReactNode; icon?: React.ReactNode; }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex h-12 items-center gap-2 rounded-2xl border px-4 text-sm font-black transition ${active ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]" : "border-[var(--line-strong)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-2)]"}`}>
      {icon}
      {children}
    </button>
  );
}

function RoundActionButton({ children, label }: { children: React.ReactNode; label: string }) {
  return <button type="button" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full hover:bg-[var(--primary-soft)]">{children}</button>;
}

function DateRangePicker({ start, end, onChange }: { start: string; end: string; onChange: (range: { start: string; end: string }) => void; }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [month, setMonth] = useState(() => {
    const base = start ? new Date(start) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const locale = "ru-RU";
  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;
  const days = buildCalendarDays(month);
  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month);
  const weekDays = getWeekdays(locale);

  useOutsideClose(wrapperRef, open, () => setOpen(false));

  function selectDay(day: Date) {
    const iso = toIsoDate(day);
    if (!start || (start && end)) {
      onChange({ start: iso, end: "" });
      return;
    }
    const startTime = new Date(start).getTime();
    const clicked = day.getTime();
    if (clicked < startTime) {
      onChange({ start: iso, end: start });
    } else {
      onChange({ start, end: iso });
      setOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button type="button" className="flex h-12 w-full items-center gap-2 rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] px-4 text-left text-[15px] font-semibold text-[var(--text)]" onClick={() => setOpen((state) => !state)}>
        <span className="truncate">{start ? formatHumanDate(start) : "ДД.ММ.ГГГГ"}</span>
        <CalendarDays className="h-4 w-4 text-[var(--muted)]" />
        <span className="text-[var(--muted)]">→</span>
        <span className="truncate">{end ? formatHumanDate(end) : "ДД.ММ.ГГГГ"}</span>
        <CalendarDays className="ml-auto h-4 w-4 text-[var(--muted)]" />
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-[320px] rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <button type="button" className="grid h-9 w-9 place-items-center rounded-full hover:bg-[var(--surface-2)]" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft className="h-5 w-5" /></button>
            <p className="font-black capitalize text-[var(--text)]">{monthLabel}</p>
            <button type="button" className="grid h-9 w-9 place-items-center rounded-full hover:bg-[var(--surface-2)]" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-black uppercase text-[var(--muted)]">
            {weekDays.map((day) => <div key={day} className="py-2">{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const iso = toIsoDate(day.date);
              const isSelected = iso === start || iso === end;
              const inRange = startDate && endDate && day.date.getTime() > startDate.getTime() && day.date.getTime() < endDate.getTime();
              return (
                <button
                  key={iso}
                  type="button"
                  className={`grid h-10 place-items-center rounded-xl text-sm font-bold ${day.inCurrentMonth ? "" : "opacity-35"} ${isSelected ? "bg-[var(--primary)] text-white" : inRange ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "hover:bg-[var(--surface-2)]"}`}
                  onClick={() => selectDay(day.date)}
                >
                  {day.date.getDate()}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between text-sm font-bold text-[var(--primary)]">
            <button type="button" onClick={() => onChange({ start: "", end: "" })}>Удалить</button>
            <button type="button" onClick={() => onChange({ start: toIsoDate(new Date()), end: toIsoDate(new Date()) })}>Сегодня</button>
          </div>
        </div>
      )}
    </div>
  );
}

function buildCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - startWeekday);
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return { date, inCurrentMonth: date.getMonth() === month.getMonth() };
  });
}

function getWeekdays(locale: string) {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const monday = new Date(2026, 4, 18);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return formatter.format(date).slice(0, 2);
  });
}

function themeIcon(theme: ThemeName) {
  if (theme === "dark") return <MoonStar className="h-4 w-4" />;
  if (theme === "ocean") return <Waves className="h-4 w-4" />;
  return <SunMedium className="h-4 w-4" />;
}

function cityCode(point: string): string {
  if (!point || point === "—" || point === "-") return "—";
  const cleaned = point.replace(/[^\p{L}\s]/gu, " ").trim();
  const first = cleaned.split(/\s+/)[0] || point;
  return first.slice(0, 3).toLocaleUpperCase();
}

function initials(name: string): string {
  if (!name || name === "—") return "NC";
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "NC";
}

function formatPrice(value: string, dictionary: Dictionary): string {
  if (!value || value === "—" || value === "-") return dictionary.negotiable;
  return value;
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatHumanDate(value: string) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}.${month}.${year}`;
}


type CargoClientFilterForm = {
  q: string;
  from: string;
  to: string;
  transport: string;
  minWeight: string;
  maxWeight: string;
  dateFrom: string;
  dateTo: string;
  status: CargoStatus;
  sort: CargoSort;
  offersOnly: boolean;
  favorite: boolean;
  limit: CargoPageParams["limit"];
};

function filterItemsOnClient(items: CargoItem[], form: CargoClientFilterForm, favoriteIds: string[]): CargoItem[] {
  const q = form.q.trim().toLowerCase();
  const from = form.from.trim().toLowerCase();
  const to = form.to.trim().toLowerCase();
  const transport = form.transport.trim().toLowerCase();
  const minWeight = extractNumber(form.minWeight);
  const maxWeight = extractNumber(form.maxWeight);

  return items.filter((item) => {
    const searchable = [item.id, item.cargoName, item.loadingPoint, item.unloadingPoint, item.contactName, item.contactPhone, item.status, item.vehicleText]
      .join(" ")
      .toLowerCase();
    const itemWeight = extractNumber(item.weightText);
    const itemStatus = item.status.toUpperCase();

    const matchesQ = !q || searchable.includes(q);
    const matchesFrom = !from || item.loadingPoint.toLowerCase().includes(from);
    const matchesTo = !to || item.unloadingPoint.toLowerCase().includes(to);
    const matchesTransport = !transport || item.vehicleText.toLowerCase().includes(transport);
    const matchesStatus = form.status === "SEARCHING_ALL" || itemStatus === form.status;
    const matchesMin = minWeight === undefined || itemWeight === undefined || itemWeight >= minWeight;
    const matchesMax = maxWeight === undefined || itemWeight === undefined || itemWeight <= maxWeight;
    const matchesDate = dateInRange(item.createdAt, form.dateFrom, form.dateTo);
    const matchesFavorite = !form.favorite || favoriteIds.includes(item.id);

    return matchesQ && matchesFrom && matchesTo && matchesTransport && matchesStatus && matchesMin && matchesMax && matchesDate && matchesFavorite;
  });
}

function extractNumber(value: string): number | undefined {
  const match = value.replace(/,/g, ".").match(/\d+(?:\.\d+)?/);
  if (!match) return undefined;
  const number = Number(match[0]);
  return Number.isFinite(number) ? number : undefined;
}

function dateInRange(value: string, from: string, to: string): boolean {
  if (!from && !to) return true;
  const time = new Date(value).getTime();
  if (!Number.isFinite(time)) return true;
  const fromTime = from ? new Date(`${from}T00:00:00`).getTime() : undefined;
  const toTime = to ? new Date(`${to}T23:59:59`).getTime() : undefined;
  if (fromTime !== undefined && time < fromTime) return false;
  if (toTime !== undefined && time > toTime) return false;
  return true;
}

function buildShareSvg(item: CargoItem, dictionary: Dictionary, lang: Language, theme: ThemeName) {
  const palette = theme === "dark"
    ? { bg: "#0f172a", card: "#111827", soft: "#1f2937", text: "#e5ecf7", muted: "#9fb0c7", primary: "#60a5fa", green: "#34d399" }
    : theme === "ocean"
    ? { bg: "#e9f9ff", card: "#ffffff", soft: "#eef8fc", text: "#123040", muted: "#5c7685", primary: "#0891b2", green: "#10b981" }
    : { bg: "#eef1f7", card: "#ffffff", soft: "#f4f7fb", text: "#172033", muted: "#6b7b93", primary: "#0b4aa2", green: "#20bf63" };
  const created = escapeXml(formatDateTime(item.createdAt, lang));
  const cargo = escapeXml(item.cargoName === "—" ? dictionary.cargoDescription : item.cargoName);
  const price = escapeXml(formatPrice(item.priceText, dictionary));
  const vehicle = escapeXml(item.vehicleText);
  const from = escapeXml(item.loadingPoint);
  const to = escapeXml(item.unloadingPoint);
  const contact = escapeXml(item.contactName);
  const phone = escapeXml(item.contactPhone);
  const weight = escapeXml(item.weightText);
  const volume = escapeXml(item.volumeText);
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" rx="0" fill="${palette.bg}" />
    <rect x="36" y="36" width="1128" height="558" rx="28" fill="${palette.card}" />
    <rect x="36" y="36" width="1128" height="110" rx="28" fill="${palette.soft}" />
    <text x="70" y="98" font-family="Inter, Arial, sans-serif" font-size="52" font-weight="800" fill="${palette.primary}">Sarbon</text>
    <text x="70" y="130" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="600" fill="${palette.muted}">${escapeXml(dictionary.title)}</text>
    <rect x="800" y="60" width="320" height="58" rx="18" fill="${palette.card}" stroke="${palette.primary}" stroke-opacity="0.18" />
    <text x="835" y="97" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="800" fill="${palette.primary}">${price}</text>
    <text x="70" y="205" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" fill="${palette.muted}">Yuk</text>
    <text x="70" y="245" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="800" fill="${palette.text}">${cargo}</text>
    <text x="70" y="305" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" fill="${palette.muted}">Yo'nalish</text>
    <text x="70" y="345" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" fill="${palette.text}">${from}</text>
    <text x="70" y="382" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="${palette.primary}">→ ${to}</text>
    <rect x="70" y="430" width="300" height="110" rx="24" fill="${palette.soft}" />
    <text x="98" y="472" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" fill="${palette.muted}">Vazn / Hajm</text>
    <text x="98" y="515" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" fill="${palette.text}">${weight} / ${volume}</text>
    <rect x="395" y="430" width="300" height="110" rx="24" fill="${palette.soft}" />
    <text x="423" y="472" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" fill="${palette.muted}">Transport</text>
    <text x="423" y="515" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800" fill="${palette.text}">${vehicle}</text>
    <rect x="720" y="205" width="370" height="220" rx="28" fill="${palette.soft}" />
    <text x="752" y="248" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" fill="${palette.muted}">Buyurtmachi</text>
    <text x="752" y="300" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="800" fill="${palette.text}">${contact}</text>
    <text x="752" y="344" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" fill="${palette.primary}">${phone}</text>
    <text x="752" y="388" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" fill="${palette.muted}">${created}</text>
    <rect x="720" y="460" width="370" height="80" rx="24" fill="${palette.green}" fill-opacity="0.14" />
    <text x="752" y="508" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800" fill="${palette.green}">${escapeXml(item.status)}</text>
  </svg>`;
}

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&apos;");
}

function svgToDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function svgDataUrlToPngFile(dataUrl: string, fileName: string): Promise<File | null> {
  const image = new window.Image();
  image.crossOrigin = "anonymous";
  const loaded = new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Image load failed"));
  });
  image.src = dataUrl;
  await loaded;
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 1));
  if (!blob) return null;
  return new File([blob], fileName, { type: "image/png" });
}
