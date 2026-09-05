import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RelatedNews } from "@/components/NewsRails";
import { PageShell, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { getBook, getName } from "@/lib/book";
import {
  changeTone,
  formatCap,
  formatPct,
  formatPrice,
  whatChangedLine,
} from "@/lib/format";
import { storiesForName } from "@/lib/rails";
import { fetchQuote } from "@/lib/quotes";

export const revalidate = 60;

export function generateStaticParams() {
  return getBook().map((name) => ({ slug: name.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = getName(slug);
  if (!name) return { title: "Not in the book" };
  return {
    title: `${name.displayName} — Lexx`,
    description: `Study note for ${name.displayName}. Not investment advice.`,
  };
}

export default async function NamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = getName(slug);
  if (!name) notFound();

  const quote = name.ticker ? await fetchQuote(name.ticker) : null;
  const last = formatPrice(quote?.last ?? null, quote?.currency ?? null);
  const day = formatPct(quote?.changePct ?? null);
  const cap = formatCap(
    quote?.marketCapUsd ?? null,
    quote?.marketCapNative ?? null,
    quote?.marketCapCurrency ?? null,
  );
  const tone = changeTone(quote?.changePct ?? null);
  const toneClass =
    tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-muted";
  const changed = whatChangedLine(name, quote);
  const thesis = name.thesis.trim();
  const context = name.context.trim();
  const related = storiesForName(name.id, name.ticker);

  return (
    <PageShell>
      <SiteHeader kicker="One name. Read it slowly." />
      <main className="mt-8">
        <p className="text-sm">
          <Link href="/" className="text-muted underline-offset-4 hover:text-ink hover:underline">
            ← The book
          </Link>
        </p>

        <header className="mt-6 border-b border-line pb-6">
          <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
            {name.displayName}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {name.kind === "tbd"
              ? "Ticker not assigned"
              : name.kind === "private"
                ? "Private · no public price"
                : name.legalName}
          </p>
        </header>

        <section className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Last</p>
            <p className="mt-1 font-serif text-3xl tabular-nums">
              {name.kind === "private"
                ? "No public price"
                : name.kind === "tbd"
                  ? "—"
                  : (last ?? "—")}
            </p>
            {name.kind === "public" ? (
              <p className={`mt-1 text-sm tabular-nums ${toneClass}`}>
                {day ?? "Day change unavailable"}
              </p>
            ) : null}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              Market cap
            </p>
            <p className="mt-1 font-serif text-3xl tabular-nums">
              {name.kind === "public" ? (cap ?? "—") : "—"}
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl tracking-tight">What changed</h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">
            {changed}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl tracking-tight">Why it matters</h2>
          {thesis ? (
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">
              {thesis}
            </p>
          ) : (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              No thesis written yet.
            </p>
          )}
        </section>

        {context ? (
          <section className="mt-10">
            <h2 className="font-serif text-2xl tracking-tight">Context</h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">
              {context}
            </p>
          </section>
        ) : null}

        <div className="mt-10">
          <RelatedNews stories={related} />
        </div>
      </main>
      <SiteFooter />
    </PageShell>
  );
}
