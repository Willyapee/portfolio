"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import PhotoRotator from "@/components/photo-rotator";
import PixelPortrait from "@/components/pixel-portrait";
import SocialIcon from "@/components/social-icon";
import Ticker from "@/components/ticker";
import { profile, socials, type Social } from "@/data/profile";
import { stepValues, steppedPath } from "@/lib/market";
import { useScrollProgress } from "@/lib/use-scroll-progress";

const ORDER = ["$LNKD", "$MAIL", "$WA", "$GH", "$IG", "$CV"];

const SPREAD: Record<string, { x: string; y: string }> = {
  $LNKD: { x: "13%", y: "30%" },
  $WA: { x: "2%", y: "50%" },
  $IG: { x: "13%", y: "70%" },
  $MAIL: { x: "13%", y: "30%" },
  $GH: { x: "2%", y: "50%" },
  $CV: { x: "13%", y: "70%" },
};

const VALUES = stepValues(34);

export default function Hero({ photos }: { photos: string[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<SVGRectElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState({ w: 1000, h: 300 });
  const sizeRef = useRef(size);
  const progressRef = useRef(0);

  const path = useMemo(() => steppedPath(VALUES, size.w, size.h), [size]);

  const paintLine = useCallback((p: number) => {
    progressRef.current = p;
    const { w, h } = sizeRef.current;
    const t = 0.05 + 0.95 * Math.min(1, p / 0.8);
    const x = Math.round(t * w);
    const idx = Math.min(VALUES.length - 1, Math.floor((x / w) * VALUES.length));
    const y = Math.round(VALUES[idx] * h);
    clipRef.current?.setAttribute("width", String(x));
    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
      dotRef.current.classList.toggle("is-flip", x > w - 170);
    }
    if (priceRef.current) priceRef.current.textContent = (80 + (1 - VALUES[idx]) * 64).toFixed(2);
  }, []);

  useScrollProgress(sectionRef, paintLine);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      sizeRef.current = { w, h };
      setSize({ w, h });
      paintLine(progressRef.current);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [paintLine]);

  return (
    <section id="home" ref={sectionRef} className="hero">
      <div className="hero-sticky">
        <div className="hero-chart reveal" ref={chartRef} style={{ "--d": "900ms" } as CSSProperties} aria-hidden="true">
          <svg width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} shapeRendering="crispEdges">
            <defs>
              <clipPath id="line-clip">
                <rect ref={clipRef} x="0" y="-10" width="0" height={size.h + 20} />
              </clipPath>
              <linearGradient id="line-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#b8ff2c" stopOpacity="0.22" />
                <stop offset="1" stopColor="#b8ff2c" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g clipPath="url(#line-clip)">
              <path d={`${path} V${size.h} H0 Z`} fill="url(#line-fill)" />
              <path d={path} className="hero-line" />
            </g>
          </svg>
          <div className="hero-dot" ref={dotRef}>
            <i />
            <span className="hero-price">
              $WAP <span ref={priceRef}>0.00</span>
            </span>
          </div>
        </div>

        <div className="hero-stage">
          <div className="slot-col slot-col-left">
            {socials.filter((s) => s.side === "left").map((s) => (
              <SocialSlot key={s.symbol} social={s} />
            ))}
          </div>

          <div className="hero-center">
            <figure className="frame reveal-frame">
              <h1 className="frame-plaque px">
                {profile.fullName.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h1>
              <div className="frame-photo">
                <PhotoRotator
                  photos={photos}
                  alt={profile.fullName.join(" ")}
                  sizes="(max-width: 860px) 46vw, 300px"
                  priority
                  fallback={<PixelPortrait />}
                />
                <span className="frame-corner tl" />
                <span className="frame-corner tr" />
                <span className="frame-corner bl" />
                <span className="frame-corner br" />
              </div>
              {profile.openToWork && (
                <figcaption className="frame-status">
                  <span className="status-dot" aria-hidden="true" />
                  OPEN TO WORK
                  <span className="status-id">ID·WAP-01</span>
                </figcaption>
              )}
            </figure>

            <p className="hero-role reveal" style={{ "--d": "520ms" } as CSSProperties}>
              <span className="hero-prompt">&gt;</span> {profile.role}
              <span className="hero-cursor" aria-hidden="true" />
            </p>
            <p className="hero-tagline reveal" style={{ "--d": "620ms" } as CSSProperties}>
              {profile.tagline}
            </p>

            <div className="hero-hint reveal" style={{ "--d": "1200ms" } as CSSProperties} aria-hidden="true">
              <span>SCROLL TO TRADE</span>
              <span className="hero-hint-arrow">
                <i>▼</i>
              </span>
            </div>
          </div>

          <div className="slot-col slot-col-right">
            {socials.filter((s) => s.side === "right").map((s) => (
              <SocialSlot key={s.symbol} social={s} />
            ))}
          </div>
        </div>

        <Ticker />
      </div>
    </section>
  );
}

function SocialSlot({ social: s }: { social: Social }) {
  const i = ORDER.indexOf(s.symbol);
  const external = s.href.startsWith("http");
  return (
    <a
      href={s.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`slot slot-${s.side} reveal`}
      style={
        {
          "--start": 0.04 + i * 0.075,
          "--len": 0.16,
          "--d": `${700 + i * 70}ms`,
          "--x": SPREAD[s.symbol]?.x ?? "4%",
          "--y": SPREAD[s.symbol]?.y ?? "50%",
        } as CSSProperties
      }
      aria-label={s.label}
    >
      <span className="slot-fill">
        <span className="slot-icon">
          <SocialIcon name={s.icon} />
        </span>
        <span className="slot-text">
          <b>{s.symbol}</b>
          <span>{s.label}</span>
        </span>
        <span className="slot-quote">
          <em>▲ {s.change}</em>
          <svg viewBox="0 0 24 8" shapeRendering="crispEdges" aria-hidden="true">
            <path d={`M0 ${6 - (i % 2)} H5 V5 H9 V6 H13 V3 H17 V4 H20 V1 H24`} />
          </svg>
        </span>
      </span>
    </a>
  );
}
