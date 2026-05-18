import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronDown, Heart, Home, Palette, Search, Settings2, UserRound } from "lucide-react";
import type { CargoPageParams } from "@/modules/cargo/entities/cargo/model/types";
import type { Dictionary } from "@/shared/config/i18n/types";
import { languages, languageLabels } from "@/shared/config/i18n/server";
import { themes, getThemeLabel } from "@/shared/config/theme";
import { toQueryString } from "@/shared/lib/searchParams";
import { paramsToRecord } from "../model/searchParams";
import { SegmentedLinks } from "@/shared/ui/SegmentedLinks";

const navKeys = [
  ["navDashboard", "#"],
  ["navCargo", "/dispatcher/cargo"],
  ["navMyCargo", "#"],
  ["navOffers", "#"],
  ["navTrips", "#"],
  ["navManagers", "#"],
  ["navGps", "#"]
] as const;

interface CargoHeaderProps {
  params: CargoPageParams;
  dictionary: Dictionary;
  total: number;
  visible: number;
}

export function CargoHeader({ params, dictionary, total, visible }: CargoHeaderProps) {
  const base = paramsToRecord(params);

  return (
    <>
      <header className="app-navbar">
        <div className="flex min-w-0 flex-1 items-center gap-7">
          <Link href={`/dispatcher/cargo${toQueryString(base, { page: 1 })}`} className="shrink-0" aria-label="Sarbon">
            <Image src="/sarbon-logo.png" alt="Sarbon" width={156} height={42} priority className="h-10 w-auto object-contain" />
          </Link>
          <nav className="hidden min-w-0 items-center gap-1 overflow-x-auto text-sm font-black text-[var(--primary)] lg:flex">
            {navKeys.map(([key, href]) => {
              const active = key === "navCargo";
              const label = String(dictionary[key]);
              return (
                <Link
                  key={key}
                  href={href === "/dispatcher/cargo" ? `/dispatcher/cargo${toQueryString(base, { page: 1 })}` : href}
                  className={active ? "rounded-md bg-[var(--green-soft)] px-3 py-2 text-[var(--green)]" : "rounded-md px-3 py-2 hover:bg-[var(--surface-2)]"}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <IconButton label="Favorite"><Heart className="h-5 w-5" /></IconButton>
          <IconButton label="Notifications"><Bell className="h-5 w-5" /></IconButton>
          <div className="hidden items-center gap-2 rounded-md bg-[var(--surface-2)] px-2 py-1 md:flex">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-xs shadow-sm">🇺🇿</span>
            <SegmentedLinks
              label={dictionary.language}
              activeValue={params.lang}
              options={languages.map((lang) => ({ label: languageLabels[lang], value: lang, href: `/dispatcher/cargo${toQueryString(base, { lang, page: 1 })}` }))}
            />
            <ChevronDown className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Palette className="h-4 w-4 text-[var(--muted)]" />
            <SegmentedLinks
              label={dictionary.theme}
              activeValue={params.theme}
              options={themes.map((theme) => ({ label: getThemeLabel(theme, dictionary), value: theme, href: `/dispatcher/cargo${toQueryString(base, { theme })}` }))}
            />
          </div>
          <div className="hidden items-center gap-2 border-l border-[var(--line)] pl-3 sm:flex">
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-[var(--surface-3)]">
              <UserRound className="h-5 w-5 text-[var(--muted)]" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--surface)] bg-[var(--green)]" />
            </span>
            <span className="leading-4">
              <b className="block text-sm text-[var(--text)]">{dictionary.profileName}</b>
              <small className="text-xs font-semibold text-[var(--muted)]">{dictionary.profileRole}</small>
            </span>
          </div>
          <IconButton label="Settings"><Settings2 className="h-5 w-5" /></IconButton>
        </div>
      </header>

      <section className="app-page pb-0">
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
              <Home className="h-4 w-4" />
              <span>{dictionary.pageBadge}</span>
            </div>
            <h1 className="text-3xl font-black tracking-[-0.03em] text-[var(--heading)] md:text-4xl">{dictionary.title}</h1>
            <p className="mt-2 text-sm font-semibold text-[var(--muted)]">
              {dictionary.subtitle} <span className="font-black text-[var(--primary)]">{visible}/{total}</span>
            </p>
          </div>

          <form action="/dispatcher/cargo" className="w-full md:w-[330px]">
            <input type="hidden" name="page" value="1" />
            <input type="hidden" name="limit" value={params.limit} />
            <input type="hidden" name="status" value={params.status} />
            <input type="hidden" name="sort" value={params.sort} />
            <input type="hidden" name="lang" value={params.lang} />
            <input type="hidden" name="theme" value={params.theme} />
            <input type="hidden" name="from" value={params.from} />
            <input type="hidden" name="to" value={params.to} />
            <input type="hidden" name="transport" value={params.transport} />
            <input type="hidden" name="minWeight" value={params.minWeight} />
            <input type="hidden" name="maxWeight" value={params.maxWeight} />
            <input type="hidden" name="dateFrom" value={params.dateFrom} />
            <input type="hidden" name="dateTo" value={params.dateTo} />
            <label className="relative block">
              <span className="sr-only">{dictionary.search}</span>
              <input className="input-shell pr-12" name="q" defaultValue={params.q} placeholder={dictionary.topSearchPlaceholder} />
              <button className="absolute right-0 top-0 grid h-10 w-12 place-items-center rounded-r-md border-l border-[var(--line)] text-[var(--muted)] hover:text-[var(--primary)]" type="submit" aria-label={dictionary.searchButton}>
                <Search className="h-5 w-5" />
              </button>
            </label>
          </form>
        </div>
      </section>
    </>
  );
}

function IconButton({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button type="button" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full text-[var(--primary)] transition hover:bg-[var(--primary-soft)]">
      {children}
    </button>
  );
}
