import { Boxes, Eye, Layers3, ListFilter, TableProperties } from "lucide-react";
import type { CargoPageParams } from "@/modules/cargo/entities/cargo/model/types";
import type { Dictionary } from "@/shared/config/i18n/types";
import { formatNumber } from "@/shared/lib/format";

interface CargoStatsProps {
  params: CargoPageParams;
  total: number;
  visible: number;
  totalPages: number;
  dictionary: Dictionary;
}

export function CargoStats({ params, total, visible, totalPages, dictionary }: CargoStatsProps) {
  const cards = [
    { label: dictionary.statsTotal, value: formatNumber(total, params.lang), icon: Boxes },
    { label: dictionary.statsPage, value: `${params.page}/${Math.max(totalPages, 1)}`, icon: TableProperties },
    { label: dictionary.statsLimit, value: String(params.limit), icon: Layers3 },
    { label: dictionary.statsFiltered, value: formatNumber(visible, params.lang), icon: Eye },
    { label: dictionary.statsStatus, value: dictionary.statuses[params.status], icon: ListFilter }
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="panel-solid flex min-h-[82px] items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="text-xs font-black text-[var(--muted)]">{card.label}</p>
              <p className="mt-2 truncate text-2xl font-black tracking-[-0.04em] text-[var(--text)]">{card.value}</p>
            </div>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <Icon className="h-5 w-5" />
            </span>
          </div>
        );
      })}
    </section>
  );
}
