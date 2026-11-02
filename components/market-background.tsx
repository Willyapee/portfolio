"use client";

import { useEffect, useRef } from "react";
import { createMarket, type Candle } from "@/lib/market";

const PX = 4;
const STEP = 4;
const MS_PER_CANDLE = 900;

const LIME = "#b8ff2c";
const DOWN = "#8f978c";

export default function MarketBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = createMarket(42, 120);
    let candles: Candle[] = [];
    let volumes: number[] = [];
    let w = 0;
    let h = 0;
    let offset = 0;
    let forming = next();
    let goal = forming.c;
    let target = forming.c;
    let lo = 0;
    let hi = 0;
    let boost = 0;
    let lastScroll = window.scrollY;
    let last = performance.now();
    let acc = 0;
    let raf = 0;

    const resize = () => {
      w = Math.ceil(window.innerWidth / PX);
      h = Math.ceil(window.innerHeight / PX);
      canvas.width = w;
      canvas.height = h;
      const need = Math.ceil(w / STEP) + 3;
      while (candles.length < need) {
        candles.push(next());
        volumes.push(Math.random());
      }
      if (candles.length > need) {
        candles = candles.slice(-need);
        volumes = volumes.slice(-need);
      }
      const r = range();
      lo = r[0];
      hi = r[1];
    };

    const range = (): [number, number] => {
      let mn = Infinity;
      let mx = -Infinity;
      for (const c of candles) {
        mn = Math.min(mn, c.l);
        mx = Math.max(mx, c.h);
      }
      mn = Math.min(mn, forming.l);
      mx = Math.max(mx, forming.h);
      const pad = (mx - mn) * 0.12 + 1;
      return [mn - pad, mx + pad];
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const top = Math.round(h * 0.16);
      const bottom = Math.round(h * 0.78);
      const y = (p: number) => Math.round(bottom - ((p - lo) / (hi - lo)) * (bottom - top));

      ctx.fillStyle = "rgba(242,245,238,0.07)";
      for (let gy = 0; gy < h; gy += 20) for (let gx = 0; gx < w; gx += 2) ctx.fillRect(gx, gy, 1, 1);
      for (let gx = (Math.round(-offset) % 32 + 32) % 32; gx < w; gx += 32)
        for (let gy = 0; gy < h; gy += 2) ctx.fillRect(gx, gy, 1, 1);

      const all = [...candles, forming];
      const startX = w - all.length * STEP - Math.round(offset) + STEP;

      const vBase = h - Math.round(h * 0.06);
      all.forEach((_, i) => {
        const vh = Math.round((volumes[i] ?? 0.5) * h * 0.08) + 1;
        ctx.fillStyle = "rgba(184,255,44,0.14)";
        ctx.fillRect(startX + i * STEP, vBase - vh, 3, vh);
      });

      all.forEach((c, i) => {
        const x = startX + i * STEP;
        if (x < -STEP || x > w) return;
        const up = c.c >= c.o;
        const yo = y(c.o);
        const yc = y(c.c);
        const yh = y(c.h);
        const yl = y(c.l);
        ctx.fillStyle = up ? LIME : DOWN;
        ctx.fillRect(x + 1, yh, 1, yl - yh + 1);
        const bt = Math.min(yo, yc);
        const bh = Math.max(1, Math.abs(yc - yo));
        if (up) ctx.fillRect(x, bt, 3, bh);
        else {
          ctx.fillRect(x, bt, 3, 1);
          ctx.fillRect(x, bt + bh - 1, 3, 1);
          ctx.fillRect(x, bt, 1, bh);
          ctx.fillRect(x + 2, bt, 1, bh);
        }
      });

      ctx.fillStyle = "rgba(242,245,238,0.75)";
      let prev: number | null = null;
      for (let i = 0; i < all.length; i++) {
        const from = Math.max(0, i - 9);
        let s = 0;
        for (let k = from; k <= i; k++) s += all[k].c;
        const my = y(s / (i - from + 1));
        const x = startX + i * STEP + 1;
        if (prev !== null) {
          const a = Math.min(prev, my);
          const b = Math.max(prev, my);
          ctx.fillRect(x - STEP, prev, STEP, 1);
          ctx.fillRect(x, a, 1, b - a + 1);
        }
        prev = my;
      }

      const py = y(forming.c);
      ctx.fillStyle = "rgba(184,255,44,0.55)";
      for (let x = 0; x < w; x += 3) ctx.fillRect(x, py, 2, 1);
      ctx.fillStyle = LIME;
      ctx.fillRect(w - 9, py - 2, 9, 5);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(64, now - last);
      last = now;
      acc += dt;
      if (acc < 33) return;
      const frame = acc;
      acc = 0;

      boost *= 0.92;
      const speed = (STEP / MS_PER_CANDLE) * (1 + boost);
      offset += frame * speed;

      if (Math.random() < 0.25) target = goal + (Math.random() - 0.5) * 1.6;
      forming.c += (target - forming.c) * 0.25;
      forming.h = Math.max(forming.h, forming.c);
      forming.l = Math.min(forming.l, forming.c);

      while (offset >= STEP) {
        offset -= STEP;
        candles.push(forming);
        candles.shift();
        volumes.push(Math.random());
        volumes.shift();
        const n = next();
        const c = forming.c;
        forming = { o: c, h: c, l: c, c };
        goal = c + (n.c - n.o);
        target = goal;
      }

      const [tLo, tHi] = range();
      lo += (tLo - lo) * 0.08;
      hi += (tHi - hi) * 0.08;
      draw();
    };

    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastScroll);
      lastScroll = window.scrollY;
      boost = Math.min(14, boost + dy * 0.04);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    if (!reduceMotion) {
      window.addEventListener("scroll", onScroll, { passive: true });
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="bg-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="bg-chart" />
      <div className="bg-vignette" />
      <div className="bg-scan" />
    </div>
  );
}
