import { BookList } from "@/components/BookList";
import { FearGreedMeter } from "@/components/FearGreedMeter";
import { NewsRails } from "@/components/NewsRails";
import { PageShell, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { SoWhat } from "@/components/SoWhat";
import { getBook, publicTickers } from "@/lib/book";
import { fetchFearGreed } from "@/lib/fear-greed";
import { getRails, getSoWhat } from "@/lib/rails";
import { fetchQuotes } from "@/lib/quotes";

export const revalidate = 60;

export default async function Home() {
  const names = getBook();
  const [quotes, fearGreed] = await Promise.all([
    fetchQuotes(publicTickers()),
    fetchFearGreed(),
  ]);

  return (
    <PageShell>
      <SiteHeader />
      <main className="mt-8 flex flex-col gap-10">
        <FearGreedMeter data={fearGreed} />
        <BookList names={names} quotes={quotes} />
        <SoWhat lines={getSoWhat()} />
        <NewsRails rails={getRails()} />
      </main>
      <SiteFooter />
    </PageShell>
  );
}
