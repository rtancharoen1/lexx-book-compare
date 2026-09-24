import { formatDateLabel } from "@/lib/format";
import type { FearGreed } from "@/lib/types";

const WIDTH = 360;
const HEIGHT = 210;
const CX = 180;
const CY = 168;
const RADIUS = 132;

function polar(angleDeg: number, radius = RADIUS) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(rad),
    y: CY - radius * Math.sin(rad),
  };
}

function arcPath(fromValue: number, toValue: number, radius = RADIUS) {
  const start = polar(180 - (fromValue / 100) * 180, radius);
  const end = polar(180 - (toValue / 100) * 180, radius);
  const large = toValue - fromValue > 50 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
}

export function FearGreedMeter({ data }: { data: FearGreed | null }) {
  const available = data != null && Number.isFinite(data.value);
  const value = available ? Math.min(100, Math.max(0, data.value)) : null;
  const needle = value != null ? polar(180 - (value / 100) * 180, RADIUS - 8) : null;
  const asOf = formatDateLabel(data?.asOf ?? null);

  return (
    <section
      aria-label="Fear and Greed meter"
      className="rounded-[28px] border border-line bg-paper-2/70 px-4 pb-5 pt-6 sm:px-8"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">
          Fear &amp; Greed
        </h2>
        {data?.source ? (
          <p className="text-xs text-muted">{data.source}</p>
        ) : null}
      </div>

      <div className="mx-auto mt-2 w-full max-w-md">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={
            available
              ? `Fear and Greed ${Math.round(data.value)}, ${data.label}`
              : "Fear and Greed unavailable"
          }
          className="h-auto w-full"
        >
          <defs>
            <linearGradient id="fg-band" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#31406f" />
              <stop offset="50%" stopColor="#c4a35a" />
              <stop offset="100%" stopColor="#b4532a" />
            </linearGradient>
          </defs>
          <path
            d={arcPath(0, 100)}
            fill="none"
            stroke={available ? "url(#fg-band)" : "#c9c0b2"}
            strokeWidth="18"
            strokeLinecap="round"
          />
          {[0, 25, 50, 75, 100].map((tick) => {
            const inner = polar(180 - (tick / 100) * 180, RADIUS - 26);
            const outer = polar(180 - (tick / 100) * 180, RADIUS + 2);
            return (
              <line
                key={tick}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="#8a8174"
                strokeWidth="1.25"
              />
            );
          })}
          {needle ? (
            <>
              <line
                x1={CX}
                y1={CY}
                x2={needle.x}
                y2={needle.y}
                stroke="#1c1814"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx={CX} cy={CY} r="5.5" fill="#1c1814" />
            </>
          ) : null}
          <text
            x={CX}
            y={available ? 118 : 124}
            textAnchor="middle"
            fill="#1c1814"
            fontFamily="var(--font-newsreader), Georgia, serif"
            fontSize={available && !Number.isInteger(data.value) ? 40 : available ? 52 : 28}
            fontWeight={500}
          >
            {available
              ? Number.isInteger(data.value)
                ? data.value
                : data.value.toFixed(2)
              : "—"}
          </text>
          <text
            x={CX}
            y={available ? 144 : 150}
            textAnchor="middle"
            fill="#4a433a"
            fontFamily="var(--font-geist-sans), system-ui, sans-serif"
            fontSize="14"
          >
            {available ? data.label : "Unavailable"}
          </text>
          <text x="28" y="198" fill="#7a7268" fontSize="11">
            Extreme fear
          </text>
          <text x="332" y="198" fill="#7a7268" fontSize="11" textAnchor="end">
            Extreme greed
          </text>
        </svg>
      </div>

      {available ? (
        <div className="mx-auto max-w-md space-y-1 text-center text-sm text-muted">
          {data.read ? <p>{data.read}</p> : null}
          {data.source ? <p>{data.source}</p> : null}
          {asOf && !data.read ? <p>As of {asOf}</p> : null}
        </div>
      ) : (
        <p className="text-center text-sm text-muted">
          No Fear &amp; Greed reading in the latest digest. No substitute
          value is shown.
        </p>
      )}
    </section>
  );
}
