import Image from "next/image";
import type { Dictionary } from "@/shared/config/i18n/types";

export function AppFooter({ dictionary }: { dictionary: Dictionary }) {
  return (
    <footer className="mt-4 border-t border-[var(--line)] bg-[var(--surface)] px-9 py-8 text-[var(--muted)]">
      <div className="grid gap-8 md:grid-cols-3">
        <FooterGroup title={dictionary.footerUseful} links={[dictionary.footerDistance, dictionary.footerVersions]} />
        <FooterGroup title={dictionary.footerContactsRates} links={[dictionary.footerAbout, dictionary.footerContacts]} />
        <FooterGroup title={dictionary.footerInfo} links={[dictionary.footerPrivacy, dictionary.footerSitemap]} />
      </div>

      <div className="mt-8 border-t border-[var(--line)] pt-5">
        <p className="mb-3 text-sm font-semibold">{dictionary.footerMobile}</p>
        <div className="flex flex-wrap gap-3">
          <StoreBadge title="Download on the" brand="App Store" />
          <StoreBadge title="GET IT ON" brand="Google Play" />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
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
    <span className="inline-grid min-w-[128px] rounded-md bg-black px-4 py-2 text-white shadow-soft">
      <small className="text-[9px] font-bold uppercase leading-none opacity-80">{title}</small>
      <b className="text-sm leading-tight">{brand}</b>
    </span>
  );
}
