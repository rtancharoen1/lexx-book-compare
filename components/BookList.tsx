import Link from "next/link";
import {
  changeTone,
  formatCap,
  formatPct,
  formatPrice,
  whatChangedLine,
} from "@/lib/format";
import type { BookName, Quote } from "@/lib/types";

function kindLabel(name: BookName) {
  if (name.kind === "private") return "Private";
  if (name.kind === "tbd") return "Ticker TBD";
  return name.legalName;
}

export function BookList({
  names,
  quotes,
}: {
  names: BookName[];
  quotes: Record<string, Quote>;
}) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="font-serif text-2xl tracking-tight">The book</h2>
        <p className="hidden text-xs uppercase tracking-[0.14em] text-muted sm:block">
          Last · day · cap
        </p>
      </div>
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-[#f8f3ea]">
        {names.map((name) => {
          const quote = name.ticker ? quotes[name.ticker] ?? null : null;
          const last = formatPrice(quote?.last ?? null, quote?.currency ?? null);
          const day = formatPct(quote?.changePct ?? null);
          const cap = formatCap(
            quote?.marketCapUsd ?? null,
            quote?.marketCapNative ?? null,
            quote?.marketCapCurrency ?? null,
          );
          const tone = changeTone(quote?.changePct ?? null);
          const changed = whatChangedLine(name, quote);
          const toneClass =
            tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-muted";

          return (
            <li key={name.id}>
              <Link
                href={`/name/${name.id}`}
                className="grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 px-4 py-4 no-underline transition-colors hover:bg-white/70 sm:grid-cols-[minmax(0,1.2fr)_7.5rem_5.5rem_6.5rem] sm:items-center sm:px-5"
              >
                <div className="min-w-0">
                  <p className="font-serif text-xl leading-none tracking-tight text-ink">
                    {name.displayName}
                  </p>
                  <p className="mt-1 text-sm text-muted">{kindLabel(name)}</p>
                  <p className="mt-2 text-sm leading-snug text-ink-soft sm:hidden">
                    {changed}
                  </p>
                </div>
                <div className="text-right tabular-nums sm:text-right">
                  <p className="text-base font-medium text-ink">
                    {name.kind === "private"
                      ? "No public price"
                      : name.kind === "tbd"
                        ? "—"
                        : (last ?? "—")}
                  </p>
                  <p className={`text-sm ${toneClass} sm:hidden`}>
                    {name.kind === "public" ? (day ?? "—") : ""}
                  </p>
                </div>
                <p
                  className={`hidden text-right text-sm tabular-nums sm:block ${toneClass}`}
                >
                  {name.kind === "public" ? (day ?? "—") : "—"}
                </p>
                <p className="hidden text-right text-sm tabular-nums text-ink-soft sm:block">
                  {name.kind === "public" ? (cap ?? "—") : "—"}
                </p>
                <p className="col-span-2 hidden text-sm text-ink-soft sm:col-span-4 sm:mt-0 sm:block sm:pt-0">
                  <span className="sr-only">What changed: </span>
                  {changed}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
