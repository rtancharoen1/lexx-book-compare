import {
  digestRails,
  digestSoWhat,
  getLatestDigest,
  storiesForName as digestStoriesForName,
} from "@/lib/digest";
import type { Rail, RailStory } from "@/lib/types";

export function getRails(): Rail[] {
  return digestRails(getLatestDigest());
}

export function getSoWhat(): string[] {
  return digestSoWhat(getLatestDigest());
}

export function storiesForName(nameId: string, ticker?: string | null): RailStory[] {
  return digestStoriesForName(getLatestDigest(), nameId, ticker ?? null);
}
