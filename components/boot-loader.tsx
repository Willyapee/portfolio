"use client";

import { useEffect, useState } from "react";

const LINES = [
  "CONNECTING TO MARKET FEED",
  "LOADING PIXEL ASSETS",
  "SYNCING PORTFOLIO",
  "OPENING POSITION",
];

const COLS = 12;
const ROWS = 8;
const BLOCKS = 20;

type Phase = "boot" | "exit" | "done";

export default function BootLoader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("boot");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 300 : 1900;
    const start = performance.now();
    let raf = 0;
    let t1: number | undefined;
    let t2: number | undefined;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      setProgress(1);
      t1 = window.setTimeout(() => {
        setPhase("exit");
        document.documentElement.dataset.ready = "true";
        t2 = window.setTimeout(() => setPhase("done"), reduce ? 200 : 1100);
      }, reduce ? 0 : 380);
    };

    const loop = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < 1 ? Math.min(0.99, t * t * (3 - 2 * t) + Math.sin(t * 19) * 0.02) : 1;
      setProgress(eased);
      if (t < 1) raf = requestAnimationFrame(loop);
      else finish();
    };
    raf = requestAnimationFrame(loop);

    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  if (phase === "done") return null;

  const filled = Math.round(progress * BLOCKS);
  const linesShown = Math.min(LINES.length, Math.floor(progress * (LINES.length + 0.6)));

  return (
    <div className={`boot ${phase === "exit" ? "is-exit" : ""}`} role="status" aria-label="Loading">
      <div className="boot-tiles" aria-hidden="true">
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const c = i % COLS;
          const r = Math.floor(i / COLS);
          const dist = Math.abs(c - (COLS - 1) / 2) / COLS + Math.abs(r - (ROWS - 1) / 2) / ROWS;
          const jitter = ((i * 37) % 11) / 11;
          return <span key={i} style={{ transitionDelay: `${Math.round(dist * 520 + jitter * 160)}ms` }} />;
        })}
      </div>

      <div className="boot-content">
        <div className="boot-head">
          <span className="boot-logo">WAP</span>
          <span>TERMINAL v1.0</span>
        </div>

        <ul className="boot-log">
          {LINES.slice(0, linesShown).map((l, i) => (
            <li key={l}>
              <span className="boot-prompt">&gt;</span> {l}
              <span className="boot-dots" />
              <span className={i < linesShown - 1 || progress >= 1 ? "boot-ok" : "boot-wait"}>
                {i < linesShown - 1 || progress >= 1 ? "OK" : "..."}
              </span>
            </li>
          ))}
        </ul>

        <div className="boot-bar" aria-hidden="true">
          {Array.from({ length: BLOCKS }, (_, i) => (
            <i key={i} className={i < filled ? "on" : ""} />
          ))}
        </div>
        <div className="boot-meta">
          <span>{progress >= 1 ? "MARKET OPEN" : "LOADING"}</span>
          <span>{String(Math.round(progress * 100)).padStart(3, "0")}%</span>
        </div>
        <p className="boot-skip">click anywhere to skip</p>
      </div>
    </div>
  );
}
