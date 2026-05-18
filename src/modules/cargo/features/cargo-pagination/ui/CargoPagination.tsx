import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { CargoPageParams } from "@/modules/cargo/entities/cargo/model/types";
import type { Dictionary } from "@/shared/config/i18n/types";
import { paramsToRecord } from "@/menu/dispatcher/cargo/model/searchParams";
import { toQueryString } from "@/shared/lib/searchParams";
import { cn } from "@/shared/lib/cn";

export function CargoPagination({ params, totalPages, dictionary }: { params: CargoPageParams; totalPages: number; dictionary: Dictionary }) {
  const base = paramsToRecord(params);
  const page = Math.min(Math.max(params.page, 1), Math.max(totalPages, 1));
  const previousHref = `/dispatcher/cargo${toQueryString(base, { page: Math.max(1, page - 1) })}`;
  const nextHref = `/dispatcher/cargo${toQueryString(base, { page: Math.min(totalPages, page + 1) })}`;

  return (
    <section className="content-card flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <div className="flex items-center justify-center gap-2 sm:justify-start">
        <Link aria-disabled={page <= 1} className={cn("btn-ghost", page <= 1 && "pointer-events-none opacity-45")} href={previousHref}>
          <ChevronLeft className="h-4 w-4" /> {dictionary.previous}
        </Link>
        <div className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-center text-sm font-black text-[var(--text)]">
          {dictionary.currentPage}: {page} / {Math.max(totalPages, 1)}
        </div>
        <Link aria-disabled={page >= totalPages} className={cn("btn-ghost", page >= totalPages && "pointer-events-none opacity-45")} href={nextHref}>
          {dictionary.next} <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <form action="/dispatcher/cargo" className="flex items-center justify-center gap-2 sm:justify-end">
        <input type="hidden" name="page" value="1" />
        <input type="hidden" name="status" value={params.status} />
        <input type="hidden" name="sort" value={params.sort} />
        <input type="hidden" name="lang" value={params.lang} />
        <input type="hidden" name="theme" value={params.theme} />
        <input type="hidden" name="q" value={params.q} />
        <input type="hidden" name="from" value={params.from} />
        <input type="hidden" name="to" value={params.to} />
        <input type="hidden" name="transport" value={params.transport} />
        <input type="hidden" name="minWeight" value={params.minWeight} />
        <input type="hidden" name="maxWeight" value={params.maxWeight} />
        <input type="hidden" name="dateFrom" value={params.dateFrom} />
        <input type="hidden" name="dateTo" value={params.dateTo} />
        <input type="hidden" name="offersOnly" value={params.offersOnly ? "1" : ""} />
        <input type="hidden" name="favorite" value={params.favorite ? "1" : ""} />
        <label className="tiny-label" htmlFor="limit-select">{dictionary.limitLabel}</label>
        <select id="limit-select" className="input-shell h-[42px] w-24" name="limit" defaultValue={String(params.limit)}>
          {[10, 20, 50].map((limit) => <option key={limit} value={limit}>{limit}</option>)}
        </select>
        <button className="btn-primary" type="submit">OK</button>
      </form>
    </section>
  );
}
