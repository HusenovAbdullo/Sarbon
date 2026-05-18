import Link from "next/link";

export default function NotFound() {
  return (
    <main className="theme-root min-h-screen p-4" data-theme="light">
      <section className="mx-auto grid min-h-[calc(100vh-32px)] max-w-xl place-items-center text-center">
        <div className="panel-card p-8">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--muted)]">404</p>
          <h1 className="mt-4 text-3xl font-black text-[var(--text)]">Sahifa topilmadi</h1>
          <Link href="/dispatcher/cargo" className="btn-primary mt-6 inline-flex">
            Cargo sahifasiga qaytish
          </Link>
        </div>
      </section>
    </main>
  );
}
