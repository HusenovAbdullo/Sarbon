import type { ReactNode } from "react";
import { ArrowUpRight, Box, CalendarDays, Heart, Package, Phone, Scale, Send, Share2, Truck } from "lucide-react";
import type { CargoItem, Language } from "@/modules/cargo/entities/cargo/model/types";
import type { Dictionary } from "@/shared/config/i18n/types";
import { formatDateTime } from "@/shared/lib/format";

export function CargoTable({ items, dictionary, lang }: { items: CargoItem[]; dictionary: Dictionary; lang: Language }) {
  return (
    <section className="content-card overflow-hidden">
      <div className="hidden overflow-x-auto scrollbar-soft lg:block">
        <table className="w-full min-w-[1240px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr>
              <Th>{dictionary.tablePickup}</Th>
              <Th>{dictionary.tableDropoff}</Th>
              <Th>{dictionary.tablePrice}</Th>
              <Th>{dictionary.tableCargo}</Th>
              <Th>{dictionary.tableTransport}</Th>
              <Th>{dictionary.tableCustomer}</Th>
              <Th>{dictionary.tableActions}</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="group bg-[var(--surface)] transition hover:bg-[var(--surface-2)]">
                <Td>
                  <PlaceCell country={dictionary.uzCountry} point={item.loadingPoint} date={formatDateTime(item.createdAt, lang)} />
                </Td>
                <Td>
                  <PlaceCell country={dictionary.uzCountry} point={item.unloadingPoint} date={formatDateTime(item.createdAt, lang)} />
                </Td>
                <Td>
                  <div className="grid gap-1">
                    <span className="font-black text-[var(--primary)]">{formatPrice(item.priceText, dictionary)}</span>
                    <span className="text-xs font-bold text-[var(--text)]">{dictionary.cash}</span>
                  </div>
                </Td>
                <Td>
                  <CargoInfo item={item} dictionary={dictionary} />
                </Td>
                <Td>
                  <TransportInfo item={item} dictionary={dictionary} />
                </Td>
                <Td>
                  <CustomerInfo item={item} />
                </Td>
                <Td>
                  <div className="flex items-center justify-center gap-2 text-[var(--primary)]">
                    <button className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-[var(--primary-soft)]" type="button" aria-label="favorite">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-[var(--primary-soft)]" type="button" aria-label="share">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-3 lg:hidden">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <CargoInfo item={item} dictionary={dictionary} />
              <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-black uppercase text-[var(--primary)]">{item.status}</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniBlock label={dictionary.tablePickup}><PlaceCell country={dictionary.uzCountry} point={item.loadingPoint} date={formatDateTime(item.createdAt, lang)} /></MiniBlock>
              <MiniBlock label={dictionary.tableDropoff}><PlaceCell country={dictionary.uzCountry} point={item.unloadingPoint} date={formatDateTime(item.createdAt, lang)} /></MiniBlock>
              <MiniBlock label={dictionary.tableTransport}><TransportInfo item={item} dictionary={dictionary} /></MiniBlock>
              <MiniBlock label={dictionary.tableCustomer}><CustomerInfo item={item} /></MiniBlock>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-[var(--surface-2)] p-3">
              <span className="font-black text-[var(--primary)]">{formatPrice(item.priceText, dictionary)}</span>
              <div className="flex gap-2 text-[var(--primary)]"><Heart className="h-5 w-5" /><Share2 className="h-5 w-5" /></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Th({ children }: { children: ReactNode }) {
  return <th className="table-th first:pl-5 last:pr-5">{children}</th>;
}

function Td({ children }: { children: ReactNode }) {
  return <td className="table-td first:pl-5 last:pr-5">{children}</td>;
}

function PlaceCell({ country, point, date }: { country: string; point: string; date: string }) {
  const code = cityCode(point);
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center gap-2">
        <CountryPill country={country} />
        <b className="text-base font-black text-[var(--text)]">{code}</b>
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
      <div className="flex items-center gap-2 font-black text-[var(--text)]">
        <Scale className="h-4 w-4 text-[var(--muted)]" />
        <span>{item.weightText}</span>
        <Box className="ml-1 h-4 w-4 text-[var(--muted)]" />
        <span>{item.volumeText}</span>
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
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
        <span className="max-w-[260px] truncate">{item.vehicleText}</span>
      </div>
      <div className="grid gap-1 text-xs font-semibold text-[var(--muted)]">
        <span className="flex items-center gap-1 text-[var(--green)]"><ArrowUpRight className="h-3.5 w-3.5" />{dictionary.rowRouteHint}</span>
        <span className="flex items-center gap-1 text-[var(--primary)]"><Send className="h-3.5 w-3.5" />{dictionary.rowRouteHint}</span>
      </div>
    </div>
  );
}

function CustomerInfo({ item }: { item: CargoItem }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-300 text-xs font-black text-white">{initials(item.contactName)}</span>
      <div className="min-w-0">
        <p className="max-w-[190px] truncate font-black text-[var(--text)]">{item.contactName}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-[var(--muted)]"><Phone className="h-3.5 w-3.5" />{item.contactPhone}</p>
      </div>
    </div>
  );
}

function MiniBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-3">
      <p className="mb-2 text-[11px] font-black uppercase text-[var(--muted)]">{label}</p>
      {children}
    </div>
  );
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
