import { formatDateLabel } from "@/lib/format";
import type { Rail, RailStory } from "@/lib/types";

function StoryCard({ story }: { story: RailStory }) {
  const date = formatDateLabel(story.date);
  return (
    <a
      href={story.url}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl border border-line bg-white/50 px-3 py-3 no-underline transition-colors hover:bg-white"
    >
      <p className="text-[15px] leading-snug text-ink">{story.title}</p>
      <p className="mt-2 text-xs text-muted">
        {[story.source, story.ticker, date].filter(Boolean).join(" · ")}
      </p>
      {story.why ? (
        <p className="mt-1 text-sm text-ink-soft">{story.why}</p>
      ) : null}
    </a>
  );
}

export function NewsRails({ rails }: { rails: Rail[] }) {
  return (
    <section>
      <h2 className="font-serif text-2xl tracking-tight">Rails</h2>
      <p className="mt-1 text-sm text-muted">
        From Deki’s latest digest. Empty until a story is dropped in.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {rails.map((rail) => (
          <div key={rail.id} className="rounded-2xl border border-line p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {rail.title}
            </h3>
            {rail.stories.length === 0 ? (
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                No stories on this rail.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {rail.stories.map((story) => (
                  <li key={story.url}>
                    <StoryCard story={story} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function RelatedNews({ stories }: { stories: RailStory[] }) {
  return (
    <section>
      <h2 className="font-serif text-2xl tracking-tight">Related</h2>
      {stories.length === 0 ? (
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          No stories on file for this name.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {stories.map((story) => (
            <li key={story.url}>
              <StoryCard story={story} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
