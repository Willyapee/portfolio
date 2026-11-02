import { mulberry32, type Candle } from "@/lib/market";

type Props = {
  data: Candle[];
  shown: number;
  decimals: number;
  seed?: number;
};

const W = 520;
const H = 230;
const X0 = 4;
const X1 = 446;
const Y0 = 14;
const Y1 = 192;
const V0 = 200;
const V1 = 226;

export default function CandleChart({ data, shown, decimals, seed = 3 }: Props) {
  const n = Math.max(1, data.length);
  const lo = Math.min(...data.map((d) => d.l));
  const hi = Math.max(...data.map((d) => d.h));
  const pad = (hi - lo) * 0.06 || 1;
  const y = (v: number) => Math.round(Y1 - ((v - (lo - pad)) / (hi + pad - (lo - pad))) * (Y1 - Y0));

  const slot = (X1 - X0) / n;
  const bodyW = Math.max(4, Math.floor(slot * 0.58 / 2) * 2);
  const xOf = (k: number) => Math.round(X0 + slot * k + (slot - bodyW) / 2);

  const rand = mulberry32(seed);
  const volumes = data.map(() => 0.25 + rand() * 0.75);

  const items = data
    .map((d, k) => {
      const f = Math.max(0, Math.min(1, shown - k));
      const c = d.o + (d.c - d.o) * f;
      return { ...d, k, f, cNow: c, hNow: Math.max(d.o, c, f > 0.5 ? d.h : c), lNow: Math.min(d.o, c, f > 0.5 ? d.l : c) };
    })
    .filter((d) => d.f > 0);
  const last = items[items.length - 1];

  let ma = "";
  items.forEach((d, i) => {
    const from = Math.max(0, i - 4);
    let s = 0;
    for (let j = from; j <= i; j++) s += items[j].cNow;
    const px = xOf(d.k) + bodyW / 2;
    const py = y(s / (i - from + 1));
    ma += i === 0 ? `M${px} ${py}` : ` L${px} ${py}`;
  });

  return (
    <svg className="candle-svg" viewBox={`0 0 ${W} ${H}`} shapeRendering="crispEdges" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => {
        const gy = Math.round(Y0 + ((Y1 - Y0) * i) / 3);
        return <line key={i} x1={X0} x2={X1} y1={gy} y2={gy} className="cc-grid" />;
      })}
      <line x1={X1 + 4} x2={X1 + 4} y1={Y0 - 6} y2={V1} className="cc-axis-line" />

      {items.map((d) => {
        const x = xOf(d.k);
        const up = d.cNow >= d.o;
        const top = Math.min(y(d.o), y(d.cNow));
        const bh = Math.max(3, Math.abs(y(d.cNow) - y(d.o)));
        const wx = x + Math.floor(bodyW / 2) - 1;
        const vh = Math.round(volumes[d.k] * (V1 - V0) * d.f);
        return (
          <g key={d.k} className={up ? "cc-up" : "cc-down"}>
            <rect x={x} y={V1 - vh} width={bodyW} height={vh} className="cc-vol" />
            <rect x={wx} y={y(d.hNow)} width={2} height={Math.max(2, y(d.lNow) - y(d.hNow))} className="cc-wick" />
            <rect x={x} y={top} width={bodyW} height={bh} className="cc-body" />
          </g>
        );
      })}

      {ma && <path d={ma} className="cc-ma" shapeRendering="auto" />}

      {last && (
        <g>
          <line x1={X0} x2={X1} y1={y(last.cNow)} y2={y(last.cNow)} className="cc-last" />
          <rect x={X1 + 6} y={y(last.cNow) - 11} width={W - X1 - 6} height={22} className="cc-tag" />
          <text x={X1 + 12} y={y(last.cNow) + 5} className="cc-tag-text">
            {last.cNow.toFixed(decimals)}
          </text>
        </g>
      )}
    </svg>
  );
}
