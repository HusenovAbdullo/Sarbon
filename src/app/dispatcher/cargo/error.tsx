"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="theme-root min-h-screen p-4" data-theme="light">
      <section className="mx-auto grid min-h-[calc(100vh-32px)] max-w-3xl place-items-center">
        <div className="panel-card p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-black text-[var(--text)]">Sahifani yuklashda xatolik</h1>
          <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error.message}</p>
          <button className="btn-primary mt-6" onClick={reset}>
            <RotateCcw className="h-4 w-4" /> Qayta urinish
          </button>
        </div>
      </section>
    </main>
  );
}
