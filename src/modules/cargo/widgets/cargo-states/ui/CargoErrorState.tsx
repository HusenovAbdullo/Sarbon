import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "@/shared/config/i18n/types";

export function CargoErrorState({ dictionary, message }: { dictionary: Dictionary; message: string }) {
  return (
    <section className="panel-card grid min-h-[260px] place-items-center p-8 text-center">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-red-50 text-red-600">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="mt-5 text-2xl font-black text-[var(--text)]">{dictionary.errorTitle}</h2>
        <p className="mx-auto mt-3 max-w-2xl rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{message}</p>
        <Link href="/dispatcher/cargo" className="btn-primary mt-5">
          <RotateCcw className="h-4 w-4" /> {dictionary.retry}
        </Link>
      </div>
    </section>
  );
}
