import { digestFearGreed, getLatestDigest } from "@/lib/digest";
import type { FearGreed } from "@/lib/types";

/** Digest only. Never fetch a live CNN score that could contradict Deki. */
export async function fetchFearGreed(): Promise<FearGreed | null> {
  return digestFearGreed(getLatestDigest());
}
