import { PackageOpen } from "lucide-react";
import type { Dictionary } from "@/shared/config/i18n/types";

export function CargoEmptyState({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="panel-card grid min-h-[260px] place-items-center p-8 text-center">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[var(--green-soft)] text-[var(--green)]">
          <PackageOpen className="h-8 w-8" />
        </div>
        <h2 className="mt-5 text-2xl font-black text-[var(--text)]">{dictionary.emptyTitle}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">{dictionary.emptySubtitle}</p>
      </div>
    </section>
  );
}
