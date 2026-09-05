import type { ReactNode } from "react";
import Link from "next/link";

export function SiteHeader({ kicker }: { kicker?: string }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
      <div>
        <Link href="/" className="block no-underline">
          <p className="font-serif text-3xl leading-none tracking-tight text-ink">
            Lexx
          </p>
        </Link>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          {kicker ?? "A personal book for studying businesses. Rungroj Tancharoen."}
        </p>
      </div>
      <nav className="text-sm text-muted">
        <Link href="/" className="underline-offset-4 hover:text-ink hover:underline">
          The book
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line pt-5 text-sm leading-relaxed text-muted">
      <p>Not investment advice.</p>
      <p className="mt-2 max-w-2xl">
        Numbers on this site come from live public APIs at request time. If a
        fetch fails, the field is left empty — nothing is invented.
      </p>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {children}
    </div>
  );
}
