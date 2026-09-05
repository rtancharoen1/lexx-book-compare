import bookData from "@/data/book.json";
import type { BookName } from "@/lib/types";

const names = bookData.names as BookName[];

export function getBook(): BookName[] {
  return names;
}

export function getName(id: string): BookName | undefined {
  return names.find((name) => name.id === id);
}

export function publicTickers(): string[] {
  return names
    .filter((name) => name.kind === "public" && name.ticker)
    .map((name) => name.ticker as string);
}
