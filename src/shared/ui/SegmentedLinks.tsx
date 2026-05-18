import Link from "next/link";
import { cn } from "@/shared/lib/cn";

export interface SegmentedOption {
  label: string;
  value: string;
  href: string;
}

export function SegmentedLinks({ options, activeValue, label }: { options: SegmentedOption[]; activeValue: string; label: string }) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-[var(--line)] bg-[var(--surface-2)] p-1" aria-label={label}>
      {options.map((option) => (
        <Link
          key={option.value}
          href={option.href}
          className={cn(
            "rounded px-2.5 py-1.5 text-xs font-black transition",
            activeValue === option.value
              ? "bg-[var(--primary)] text-white shadow-soft"
              : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
          )}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}
