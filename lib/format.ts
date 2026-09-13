import type { BookName, Quote } from "@/lib/types";

export function formatPrice(
  last: number | null,
  currency: string | null,
): string | null {
  if (last == null || !Number.isFinite(last)) return null;
  if (currency === "KRW") {
    return `₩${Math.round(last).toLocaleString("en-US")}`;
  }
  return last.toLocaleString("en-US", {
    style: "currency",
    currency: currency ?? "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPct(changePct: number | null): string | null {
  if (changePct == null || !Number.isFinite(changePct)) return null;
  const sign = changePct > 0 ? "+" : "";
  return `${sign}${changePct.toFixed(2)}%`;
}

export function formatCap(
  usd: number | null,
  native: number | null,
  nativeCurrency: string | null,
): string | null {
  if (usd != null && Number.isFinite(usd)) {
    return compactMoney(usd, "USD");
  }
  if (native != null && Number.isFinite(native) && nativeCurrency) {
    return compactMoney(native, nativeCurrency);
  }
  return null;
}

function compactMoney(value: number, currency: string): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  const symbol = currency === "KRW" ? "₩" : currency === "USD" ? "$" : "";
  const suffix =
    abs >= 1e12 ? [abs / 1e12, "T"] : abs >= 1e9 ? [abs / 1e9, "B"] : abs >= 1e6 ? [abs / 1e6, "M"] : null;
  if (suffix) {
    const [scaled, unit] = suffix as [number, string];
    const digits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
    return `${sign}${symbol}${scaled.toFixed(digits).replace(/\.0$/, "")}${unit}`;
  }
  return `${sign}${symbol}${Math.round(abs).toLocaleString("en-US")}`;
}

export function changeTone(
  changePct: number | null,
): "up" | "down" | "flat" | "none" {
  if (changePct == null || !Number.isFinite(changePct)) return "none";
  if (changePct > 0) return "up";
  if (changePct < 0) return "down";
  return "flat";
}

export function whatChangedLine(name: BookName, quote: Quote | null): string {
  const fromBook = name.whatChanged.trim();
  if (fromBook) return fromBook;
  if (name.kind === "private") return "No public price.";
  if (name.kind === "tbd") return "Ticker not assigned.";
  if (!quote || quote.last == null) return "Quote unavailable.";
  if (quote.changePct == null) return "Last session on file; day change unavailable.";
  const abs = Math.abs(quote.changePct).toFixed(2);
  if (quote.changePct > 0) return `Up ${abs}% on the last session.`;
  if (quote.changePct < 0) return `Down ${abs}% on the last session.`;
  return "Unchanged on the last session.";
}

export function formatDateLabel(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    return null;
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
