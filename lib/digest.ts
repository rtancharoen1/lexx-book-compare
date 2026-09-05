import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { FearGreed, Rail, RailId, RailStory } from "@/lib/types";

export type DigestStory = {
  headline?: string;
  title?: string;
  why?: string;
  source?: string;
  url?: string;
  ticker?: string;
  names?: string[];
};

export type Digest = {
  date?: string;
  asOfIct?: string;
  fearGreed?: {
    value?: number;
    label?: string;
    source?: string;
    read?: string;
  };
  nbis?: DigestStory[];
  aiInfra?: DigestStory[];
  macro?: DigestStory[];
  soWhat?: string[];
};

const RAIL_META: { id: RailId; title: string; key: keyof Digest }[] = [
  { id: "nbis", title: "NBIS", key: "nbis" },
  { id: "ai-infra", title: "AI infrastructure", key: "aiInfra" },
  { id: "macro", title: "Macro", key: "macro" },
];

function digestDir() {
  return join(process.cwd(), "data", "digests");
}

export function getLatestDigest(): Digest | null {
  try {
    const files = readdirSync(digestDir())
      .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name))
      .sort();
    const latest = files.at(-1);
    if (!latest) return null;
    const raw = readFileSync(join(digestDir(), latest), "utf8");
    return JSON.parse(raw) as Digest;
  } catch {
    return null;
  }
}

export function digestFearGreed(digest: Digest | null): FearGreed | null {
  const row = digest?.fearGreed;
  if (!row || typeof row.value !== "number" || !Number.isFinite(row.value)) {
    return null;
  }
  return {
    value: row.value,
    label: row.label?.trim() || "Fear & Greed",
    asOf: digest?.asOfIct ?? digest?.date ?? null,
    source: row.source?.trim() || "Deki daily digest",
    read: row.read?.trim() || null,
  };
}

function toStory(row: DigestStory): RailStory | null {
  const title = (row.headline ?? row.title ?? "").trim();
  const url = (row.url ?? "").trim();
  if (!title || !url) return null;
  const names = [
    ...(Array.isArray(row.names) ? row.names : []),
    ...(row.ticker ? [row.ticker.toLowerCase()] : []),
  ];
  return {
    title,
    url,
    source: (row.source ?? "").trim(),
    date: "",
    why: (row.why ?? "").trim(),
    names: names.length ? names : undefined,
    ticker: row.ticker?.trim() || undefined,
  };
}

export function digestRails(digest: Digest | null): Rail[] {
  return RAIL_META.map((rail) => ({
    id: rail.id,
    title: rail.title,
    stories: Array.isArray(digest?.[rail.key])
      ? (digest?.[rail.key] as DigestStory[]).map(toStory).filter((s): s is RailStory => s != null)
      : [],
  }));
}

export function digestSoWhat(digest: Digest | null): string[] {
  if (!digest?.soWhat) return [];
  return digest.soWhat
    .filter((line): line is string => typeof line === "string")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export function storiesForName(
  digest: Digest | null,
  nameId: string,
  ticker: string | null,
): RailStory[] {
  const rails = digestRails(digest);
  const seen = new Set<string>();
  const collected: RailStory[] = [];
  const aliases = [nameId, ticker?.toLowerCase() ?? ""].filter(Boolean);

  for (const rail of rails) {
    for (const story of rail.stories) {
      const tagged = story.names?.some((name) => aliases.includes(name.toLowerCase()));
      const tickerMatch =
        story.ticker &&
        (story.ticker.toLowerCase() === nameId ||
          story.ticker.toLowerCase() === ticker?.toLowerCase());
      const nbisDefault = nameId === "nbis" && rail.id === "nbis";
      if (!tagged && !tickerMatch && !nbisDefault) continue;
      if (seen.has(story.url)) continue;
      seen.add(story.url);
      collected.push(story);
    }
  }

  return collected;
}
