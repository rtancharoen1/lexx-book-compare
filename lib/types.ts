export type NameKind = "public" | "private" | "tbd";

export type BookName = {
  id: string;
  displayName: string;
  legalName: string;
  ticker: string | null;
  kind: NameKind;
  thesis: string;
  whatChanged: string;
  context: string;
};

export type Quote = {
  last: number | null;
  previousClose: number | null;
  changePct: number | null;
  currency: string | null;
  marketCapUsd: number | null;
  marketCapNative: number | null;
  marketCapCurrency: string | null;
  asOf: string | null;
  source: string | null;
};

export type FearGreed = {
  value: number;
  label: string;
  asOf: string | null;
  source: string;
  read?: string | null;
};

export type RailStory = {
  title: string;
  url: string;
  source: string;
  date: string;
  why: string;
  names?: string[];
  ticker?: string;
};

export type RailId = "nbis" | "ai-infra" | "macro";

export type Rail = {
  id: RailId;
  title: string;
  stories: RailStory[];
};
