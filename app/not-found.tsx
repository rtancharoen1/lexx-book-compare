import Link from "next/link";
import { PageShell, SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function NotFound() {
  return (
    <PageShell>
      <SiteHeader />
      <main className="mt-10">
        <h1 className="font-serif text-3xl tracking-tight">Not in the book</h1>
        <p className="mt-3 text-sm text-ink-soft">
          That name is not on this watchlist.
        </p>
        <p className="mt-6">
          <Link href="/" className="text-sm underline underline-offset-4">
            Back to the book
          </Link>
        </p>
      </main>
      <SiteFooter />
    </PageShell>
  );
}
