import { PageShell, SiteHeader } from "@/components/SiteChrome";

export default function Loading() {
  return (
    <PageShell>
      <SiteHeader />
      <p className="mt-10 text-sm text-muted">Loading the book…</p>
    </PageShell>
  );
}
