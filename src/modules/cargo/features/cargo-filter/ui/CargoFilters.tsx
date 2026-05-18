import { CalendarDays, ChevronDown, Heart, RotateCcw, Search, Truck } from "lucide-react";
import Link from "next/link";
import type { CargoPageParams, CargoSort, CargoStatus } from "@/modules/cargo/entities/cargo/model/types";
import type { Dictionary } from "@/shared/config/i18n/types";

const statusOptions: CargoStatus[] = ["SEARCHING_ALL", "NEW", "ACTIVE", "IN_PROCESS", "COMPLETED", "CANCELLED"];
const sortOptions: CargoSort[] = ["created_at:desc", "created_at:asc"];

export function CargoFilters({ params, dictionary }: { params: CargoPageParams; dictionary: Dictionary }) {
  return (
    <section className="content-card p-5">
      <form action="/dispatcher/cargo" className="grid gap-5">
        <input type="hidden" name="lang" value={params.lang} />
        <input type="hidden" name="theme" value={params.theme} />
        <input type="hidden" name="page" value="1" />
        <input type="hidden" name="limit" value={params.limit} />
        <input type="hidden" name="q" value={params.q} />

        <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_1fr]">
          <label>
            <span className="field-label">{dictionary.originCity}</span>
            <span className="relative block">
              <input className="input-shell pr-10" name="from" defaultValue={params.from} placeholder={dictionary.whereFrom} />
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            </span>
          </label>

          <label>
            <span className="field-label">{dictionary.destinationCity}</span>
            <span className="relative block">
              <input className="input-shell pr-10" name="to" defaultValue={params.to} placeholder={dictionary.whereTo} />
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            </span>
          </label>

          <label>
            <span className="field-label">{dictionary.transportLabel}</span>
            <span className="relative block">
              <Truck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input className="input-shell px-10" name="transport" defaultValue={params.transport} placeholder={dictionary.transportPlaceholder} />
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            </span>
          </label>

          <label>
            <span className="field-label">{dictionary.weightTon}</span>
            <span className="grid grid-cols-2 overflow-hidden rounded-md border border-[var(--line-strong)] bg-[var(--surface)] focus-within:border-[var(--primary)] focus-within:shadow-[0_0_0_3px_var(--primary-soft)]">
              <input className="h-10 min-w-0 border-0 bg-transparent px-3 outline-none" name="minWeight" defaultValue={params.minWeight} placeholder={dictionary.min} />
              <input className="h-10 min-w-0 border-l border-[var(--line-strong)] bg-transparent px-3 outline-none" name="maxWeight" defaultValue={params.maxWeight} placeholder={dictionary.max} />
            </span>
          </label>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_auto] xl:items-end">
          <label>
            <span className="field-label">{dictionary.date}</span>
            <span className="grid grid-cols-[1fr_auto_1fr_auto] items-center overflow-hidden rounded-md border border-[var(--line-strong)] bg-[var(--surface)] px-2 focus-within:border-[var(--primary)] focus-within:shadow-[0_0_0_3px_var(--primary-soft)]">
              <input type="date" className="h-10 min-w-0 border-0 bg-transparent px-2 outline-none" name="dateFrom" defaultValue={params.dateFrom} aria-label={dictionary.start} />
              <span className="px-1 text-[var(--muted)]">→</span>
              <input type="date" className="h-10 min-w-0 border-0 bg-transparent px-2 outline-none" name="dateTo" defaultValue={params.dateTo} aria-label={dictionary.end} />
              <CalendarDays className="h-4 w-4 text-[var(--muted)]" />
            </span>
          </label>

          <label>
            <span className="field-label">{dictionary.status}</span>
            <select className="input-shell" name="status" defaultValue={params.status}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{dictionary.statuses[status]}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="field-label">{dictionary.sort}</span>
            <select className="input-shell" name="sort" defaultValue={params.sort}>
              {sortOptions.map((sort) => (
                <option key={sort} value={sort}>{dictionary.sorts[sort]}</option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] xl:flex xl:items-center xl:justify-end">
            <label className="inline-flex h-10 items-center gap-2 whitespace-nowrap text-sm font-bold text-[var(--muted)]">
              <input type="checkbox" name="offersOnly" value="1" defaultChecked={params.offersOnly} className="h-4 w-4 accent-[var(--primary)]" />
              {dictionary.offersOnly}
            </label>
            <label className="inline-flex h-10 items-center gap-2 whitespace-nowrap text-sm font-bold text-[var(--muted)]">
              <input type="checkbox" name="favorite" value="1" defaultChecked={params.favorite} className="h-4 w-4 accent-[var(--primary)]" />
              <Heart className="h-4 w-4" /> {dictionary.favorite}
            </label>
            <Link href={`/dispatcher/cargo?lang=${params.lang}&theme=${params.theme}`} className="btn-ghost">
              <RotateCcw className="h-4 w-4" /> {dictionary.clear}
            </Link>
            <button className="btn-primary" type="submit">
              <Search className="h-4 w-4" /> {dictionary.filterButton}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
