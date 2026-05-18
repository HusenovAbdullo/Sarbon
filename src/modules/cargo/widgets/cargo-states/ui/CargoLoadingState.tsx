import { Loader2 } from "lucide-react";
import type { Dictionary } from "@/shared/config/i18n/types";

export function CargoLoadingState({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="content-card w-full p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <Loader2 className="h-6 w-6 animate-spin" />
        </span>
        <div>
          <h2 className="text-xl font-black text-[var(--text)]">{dictionary.loadingTitle}</h2>
          <p className="text-sm text-[var(--muted)]">{dictionary.loadingSubtitle}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="grid grid-cols-1 gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-3 md:grid-cols-[1.3fr_1.2fr_.9fr_.8fr_.9fr]">
            <span className="skeleton-line h-5 rounded-xl" />
            <span className="skeleton-line h-5 rounded-xl" />
            <span className="skeleton-line h-5 rounded-xl" />
            <span className="skeleton-line h-5 rounded-xl" />
            <span className="skeleton-line h-5 rounded-xl" />
          </div>
        ))}
      </div>
    </section>
  );
}
