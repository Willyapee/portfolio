export type Candle = { o: number; h: number; l: number; c: number };

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createMarket(seed = 7, start = 100) {
  const rand = mulberry32(seed);
  let price = start;
  let drift = 0;
  return function next(): Candle {
    drift = drift * 0.9 + (rand() - 0.47) * 0.6;
    const o = price;
    const c = Math.max(5, o + drift + (rand() - 0.5) * 2.2);
    const h = Math.max(o, c) + rand() * 1.4;
    const l = Math.min(o, c) - rand() * 1.4;
    price = c;
    return { o, h, l, c };
  };
}

export function stepValues(points: number, seed = 11) {
  const rand = mulberry32(seed);
  const values: number[] = [];
  let v = 0.78;
  for (let i = 0; i < points; i++) {
    const trend = 0.78 - (i / (points - 1)) * 0.62;
    v += (trend - v) * 0.35 + (rand() - 0.5) * 0.16;
    v = Math.min(0.92, Math.max(0.08, v));
    values.push(v);
  }
  values[points - 1] = 0.1;
  return values;
}

export function steppedPath(values: number[], width: number, height: number) {
  const stepX = width / values.length;
  let d = `M0 ${Math.round(values[0] * height)}`;
  for (let i = 1; i < values.length; i++) {
    d += ` H${Math.round(i * stepX)} V${Math.round(values[i] * height)}`;
  }
  d += ` H${width}`;
  return d;
}

export function trendSeries(end: number, { start, n = 30, seed = 1, floor = 0, ceil = Infinity }: { start: number; n?: number; seed?: number; floor?: number; ceil?: number }): Candle[] {
  const rand = mulberry32(seed);
  const range = Math.max(Math.abs(end - start), 0.5);
  const amp = range * 0.15;
  const clampV = (v: number) => Math.min(ceil, Math.max(floor, v));
  const out: Candle[] = [];
  let prev = start;
  for (let k = 0; k < n; k++) {
    const t = (k + 1) / n;
    const eased = t * t * (3 - 2 * t);
    const target = start + (end - start) * eased + range * 0.14 * Math.sin(t * Math.PI * 2.4) * (1 - t);
    const noise = (rand() - 0.5) * 2 * amp * (1 - t * 0.7);
    const c = k === n - 1 ? end : clampV(target + noise);
    const o = prev;
    const h = clampV(Math.max(o, c) + rand() * amp * 0.9);
    const l = clampV(Math.min(o, c) - rand() * amp * 0.9);
    out.push({ o, h, l, c });
    prev = c;
  }
  return out;
}
