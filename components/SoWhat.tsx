export function SoWhat({ lines }: { lines: string[] }) {
  if (lines.length === 0) return null;
  return (
    <section className="rounded-2xl border border-line bg-[#f8f3ea] px-5 py-5">
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        So what
      </h2>
      <ol className="mt-3 space-y-2">
        {lines.map((line) => (
          <li key={line} className="text-sm leading-relaxed text-ink-soft">
            {line}
          </li>
        ))}
      </ol>
    </section>
  );
}
