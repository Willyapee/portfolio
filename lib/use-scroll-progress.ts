"use client";

import { useEffect, useRef, type RefObject } from "react";

type Mode = "pin" | "enter";

export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onChange?: (p: number) => void,
  mode: Mode = "pin",
) {
  const cb = useRef(onChange);
  useEffect(() => {
    cb.current = onChange;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = mode === "enter" ? rect.height : rect.height - vh;
      const raw = mode === "enter" ? vh - rect.top : -rect.top;
      const p = span > 0 ? Math.min(1, Math.max(0, raw / span)) : 0;
      el.style.setProperty("--p", p.toFixed(4));
      cb.current?.(p);
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [ref, mode]);
}
