import { fetchJson, parseNumber } from "@/lib/http";
import type { Quote } from "@/lib/types";

type SparkPayload = Record<
  string,
  {
    symbol?: string;
    close?: Array<number | null>;
    timestamp?: number[];
  }
>;

type ChartPayload = {
  chart?: {
    result?: Array<{
      meta?: {
        currency?: string;
        regularMarketPrice?: number;
        regularMarketTime?: number;
        shortName?: string;
      };
      timestamp?: number[];
      indicators?: { quote?: Array<{ close?: Array<number | null> }> };
    }>;
  };
};

type NasdaqSummary = {
  data?: {
    summaryData?: {
      MarketCap?: { value?: string };
    };
  };
};

type NasdaqInfo = {
  data?: {
    primaryData?: {
      lastSalePrice?: string;
      percentageChange?: string;
      lastTradeTimestamp?: string;
    };
  };
};

type NaverIntegration = {
  totalInfos?: Array<{ code?: string; value?: string }>;
};

const US_TICKERS = new Set([
  "GOOGL",
  "AMZN",
  "META",
  "NBIS",
  "NVDA",
  "MU",
  "SPCX",
]);

function lastTwoCloses(closes: Array<number | null> | undefined): {
  last: number | null;
  previous: number | null;
} {
  const values = (closes ?? []).filter(
    (value): value is number => value != null && Number.isFinite(value),
  );
  if (values.length === 0) return { last: null, previous: null };
  if (values.length === 1) return { last: values[0], previous: null };
  return {
    last: values[values.length - 1],
    previous: values[values.length - 2],
  };
}

function changeFromCloses(last: number | null, previous: number | null) {
  if (last == null || previous == null || previous === 0) return null;
  return ((last - previous) / previous) * 100;
}

function asOfFromUnix(seconds: number | undefined): string | null {
  if (!seconds || !Number.isFinite(seconds)) return null;
  return new Date(seconds * 1000).toISOString();
}

function parseKoreanMarketValue(value: string): number | null {
  const jo = value.match(/([\d,]+)\s*조/);
  const eok = value.match(/([\d,]+)\s*억/);
  if (!jo && !eok) return null;
  const joN = jo ? Number(jo[1].replace(/,/g, "")) : 0;
  const eokN = eok ? Number(eok[1].replace(/,/g, "")) : 0;
  if (!Number.isFinite(joN) || !Number.isFinite(eokN)) return null;
  return joN * 1e12 + eokN * 1e8;
}

async function fetchSpark(tickers: string[]): Promise<SparkPayload | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/spark?symbols=${encodeURIComponent(tickers.join(","))}&range=5d&interval=1d`;
  return fetchJson<SparkPayload>(url);
}

async function fetchChart(ticker: string): Promise<Quote | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=5d`;
  const payload = await fetchJson<ChartPayload>(url);
  const result = payload?.chart?.result?.[0];
  if (!result) return null;
  const closes = result.indicators?.quote?.[0]?.close;
  const fromSeries = lastTwoCloses(closes);
  const last = result.meta?.regularMarketPrice ?? fromSeries.last;
  const previous = fromSeries.previous;
  return {
    last: last ?? null,
    previousClose: previous,
    changePct: changeFromCloses(last ?? null, previous),
    currency: result.meta?.currency ?? null,
    marketCapUsd: null,
    marketCapNative: null,
    marketCapCurrency: null,
    asOf: asOfFromUnix(result.meta?.regularMarketTime),
    source: "Yahoo Finance",
  };
}

async function fetchNasdaqCap(ticker: string): Promise<number | null> {
  const url = `https://api.nasdaq.com/api/quote/${encodeURIComponent(ticker)}/summary?assetclass=stocks`;
  const payload = await fetchJson<NasdaqSummary>(url, {
    Origin: "https://www.nasdaq.com",
    Referer: "https://www.nasdaq.com/",
  });
  return parseNumber(payload?.data?.summaryData?.MarketCap?.value);
}

async function fetchNasdaqPrice(ticker: string): Promise<Partial<Quote> | null> {
  const url = `https://api.nasdaq.com/api/quote/${encodeURIComponent(ticker)}/info?assetclass=stocks`;
  const payload = await fetchJson<NasdaqInfo>(url, {
    Origin: "https://www.nasdaq.com",
    Referer: "https://www.nasdaq.com/",
  });
  const primary = payload?.data?.primaryData;
  if (!primary) return null;
  return {
    last: parseNumber(primary.lastSalePrice),
    changePct: parseNumber(primary.percentageChange),
    asOf: primary.lastTradeTimestamp ?? null,
    currency: "USD",
    source: "Nasdaq",
  };
}

async function fetchKrwPerUsd(): Promise<number | null> {
  const url =
    "https://query1.finance.yahoo.com/v8/finance/chart/KRW=X?interval=1d&range=1d";
  const payload = await fetchJson<ChartPayload>(url);
  const price = payload?.chart?.result?.[0]?.meta?.regularMarketPrice;
  return price && Number.isFinite(price) && price > 0 ? price : null;
}

async function fetchHynixCapKrw(): Promise<number | null> {
  const payload = await fetchJson<NaverIntegration>(
    "https://m.stock.naver.com/api/stock/000660/integration",
  );
  const raw = payload?.totalInfos?.find((info) => info.code === "marketValue")
    ?.value;
  if (!raw) return null;
  return parseKoreanMarketValue(raw);
}

export async function fetchQuotes(
  tickers: string[],
): Promise<Record<string, Quote>> {
  const quotes: Record<string, Quote> = {};
  if (tickers.length === 0) return quotes;

  const spark = await fetchSpark(tickers.filter((ticker) => ticker !== "KRW=X"));

  await Promise.all(
    tickers.map(async (ticker) => {
      const sparkRow = spark?.[ticker];
      const fromSpark = lastTwoCloses(sparkRow?.close);
      let quote: Quote = {
        last: fromSpark.last,
        previousClose: fromSpark.previous,
        changePct: changeFromCloses(fromSpark.last, fromSpark.previous),
        currency: ticker.endsWith(".KS") ? "KRW" : "USD",
        marketCapUsd: null,
        marketCapNative: null,
        marketCapCurrency: null,
        asOf: asOfFromUnix(sparkRow?.timestamp?.at(-1)),
        source: fromSpark.last != null ? "Yahoo Finance" : null,
      };

      if (quote.last == null) {
        const chart = await fetchChart(ticker);
        if (chart) quote = { ...quote, ...chart };
      }

      if (quote.last == null && US_TICKERS.has(ticker)) {
        const nasdaq = await fetchNasdaqPrice(ticker);
        if (nasdaq?.last != null) {
          quote = {
            ...quote,
            last: nasdaq.last ?? quote.last,
            changePct: nasdaq.changePct ?? quote.changePct,
            currency: nasdaq.currency ?? quote.currency,
            asOf: nasdaq.asOf ?? quote.asOf,
            source: nasdaq.source ?? quote.source,
          };
        }
      }

      if (US_TICKERS.has(ticker)) {
        const cap = await fetchNasdaqCap(ticker);
        if (cap != null) {
          quote.marketCapUsd = cap;
          quote.marketCapNative = cap;
          quote.marketCapCurrency = "USD";
          quote.source = quote.source
            ? `${quote.source}; Nasdaq cap`
            : "Nasdaq";
        }
      }

      quotes[ticker] = quote;
    }),
  );

  if (tickers.includes("000660.KS")) {
    const [krwCap, fx] = await Promise.all([
      fetchHynixCapKrw(),
      fetchKrwPerUsd(),
    ]);
    const current = quotes["000660.KS"] ?? {
      last: null,
      previousClose: null,
      changePct: null,
      currency: "KRW",
      marketCapUsd: null,
      marketCapNative: null,
      marketCapCurrency: null,
      asOf: null,
      source: null,
    };
    if (krwCap != null) {
      current.marketCapNative = krwCap;
      current.marketCapCurrency = "KRW";
      if (fx != null) current.marketCapUsd = krwCap / fx;
      current.source = current.source
        ? `${current.source}; Naver cap`
        : "Naver Finance";
    }
    quotes["000660.KS"] = current;
  }

  return quotes;
}

export async function fetchQuote(ticker: string): Promise<Quote | null> {
  const all = await fetchQuotes([ticker]);
  return all[ticker] ?? null;
}
