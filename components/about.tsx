"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import CandleChart from "@/components/candle-chart";
import PhotoRotator from "@/components/photo-rotator";
import SocialIcon from "@/components/social-icon";
import { about, stats } from "@/data/profile";
import { trendSeries } from "@/lib/market";
import { useScrollProgress } from "@/lib/use-scroll-progress";

const METRICS = [
  { key: "ipk", symbol: "$IPK", name: "GPA", decimals: 2 },
  { key: "organization", symbol: "$ORG", name: "Organizations", decimals: 0 },
  { key: "project", symbol: "$PROJ", name: "Projects", decimals: 0 },
  { key: "competition", symbol: "$COMP", name: "Competitions", decimals: 0 },
] as const;

const CANDLES = 20;
const DESKTOP = { start: 0.06, seg: 0.22 };
const MOBILE = { start: 0.04, seg: 0.23 };
const DRAW = 0.7;

function withLink(text: string, href: string): ReactNode[] {
  return text.split(/(\[[^\]]+\])/).map((part, i) => {
    const m = part.match(/^\[(.+)\]$/);
    if (!m) return part;
    return (
      <a key={i} href={href} target="_blank" rel="noreferrer" className="about-link">
        <SocialIcon name="steam" /> {m[1]}
      </a>
    );
  });
}

export default function About({ photos }: { photos: string[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [metric, setMetric] = useState(0);
  const [shown, setShown] = useState(0);
  const [inView, setInView] = useState(false);
  const desktopRef = useRef(true);

  const series = useMemo(
    () =>
      METRICS.map((m, i) =>
        m.key === "ipk"
          ? trendSeries(stats.ipk, { start: Math.max(2, stats.ipk - 0.9), ceil: 4, n: CANDLES, seed: 11 })
          : trendSeries(stats[m.key], { start: 0, n: CANDLES, seed: 20 + i * 7 }),
      ),
    [],
  );

  const apply = (p: number, cfg: { start: number; seg: number }) => {
    const seg = Math.max(0, (p - cfg.start) / cfg.seg);
    const m = Math.min(METRICS.length - 1, Math.floor(seg));
    const local = seg >= METRICS.length ? 1 : Math.min(1, (seg - m) / DRAW);
    setMetric(m);
    setShown(Math.round(local * CANDLES * 4) / 4);
  };

  useScrollProgress(sectionRef, (p) => desktopRef.current && apply(p, DESKTOP));
  useScrollProgress(trackRef, (p) => !desktopRef.current && apply(p, MOBILE));

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const update = () => {
      desktopRef.current = !mq.matches;
      window.dispatchEvent(new Event("scroll"));
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const selectMetric = (m: number) => {
    const el = desktopRef.current ? sectionRef.current : trackRef.current;
    const cfg = desktopRef.current ? DESKTOP : MOBILE;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + total * (cfg.start + (m + DRAW) * cfg.seg + 0.01), behavior: "smooth" });
  };

  const active = METRICS[metric];
  const data = series[metric];
  const lastIdx = Math.max(0, Math.ceil(shown) - 1);
  const lastC = data[lastIdx];
  const current = shown > 0 ? lastC.o + (lastC.c - lastC.o) * Math.min(1, shown - lastIdx) : data[0].o;
  const done = shown >= CANDLES;

  return (
    <section id="about" ref={sectionRef} className={`about ${inView ? "is-in" : ""}`}>
      <div className="about-sticky">
        <div className="about-grid">
          <div className="about-copy">
            <p className="about-kicker rv" style={{ "--rd": "0ms" } as CSSProperties}>
              <span>{"// 01"}</span> {about.kicker}
            </p>
            <h2 className="about-title rv" style={{ "--rd": "80ms" } as CSSProperties}>
              <span>{about.title[0]}</span> <span className="lime">{about.title[1]}</span>
            </h2>
            <p className="about-sub rv" style={{ "--rd": "160ms" } as CSSProperties}>
              {about.subtitle}
            </p>
            {about.paragraphs.map((text, i) => (
              <p
                key={i}
                className="about-p rv"
                style={{ "--s": [0, 0.24, 0.48][i] ?? 0.6, "--rd": `${240 + i * 80}ms` } as CSSProperties}
              >
                {withLink(text, about.steamUrl)}
              </p>
            ))}
          </div>

          <div className="about-side">
            <div className="about-gallery px rv" style={{ "--rd": "200ms" } as CSSProperties}>
              <div className="panel-bar">
                <span>GALLERY.LOG</span>
                <span className="panel-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <div className="about-photo">
                <PhotoRotator
                  photos={photos}
                  alt="Photo of Will"
                  sizes="(max-width: 860px) 92vw, 440px"
                  interval={3800}
                  focus="50% 40%"
                  fallback={
                    <div className="gallery-empty">
                      <span>NO SIGNAL</span>
                      <small>add photos to /public/about/</small>
                    </div>
                  }
                />
              </div>
            </div>

            <div className="chart-track" ref={trackRef}>
              <div className="about-chart px rv" style={{ "--rd": "320ms" } as CSSProperties}>
                <div className="chart-tabs" role="tablist" aria-label="Stats">
                  {METRICS.map((m, i) => (
                    <button
                      key={m.key}
                      role="tab"
                      aria-selected={metric === i}
                      className={`chart-tab ${metric === i ? "is-active" : ""}`}
                      onClick={() => selectMetric(i)}
                    >
                      <b>{m.symbol}</b>
                      <span>{stats[m.key].toFixed(m.decimals)}</span>
                    </button>
                  ))}
                </div>

                <div className="chart-head">
                  <div>
                    <p className="chart-symbol">
                      {active.symbol} <span>· {active.name}</span>
                    </p>
                    <p className={`chart-value ${done ? "is-done" : ""}`}>{current.toFixed(active.decimals)}</p>
                  </div>
                  <p className="chart-meta">
                    TF 1W
                    <br />
                    <span className="lime">● LIVE</span>
                  </p>
                </div>

                <CandleChart data={data} shown={shown} decimals={active.decimals} seed={metric + 3} />

                <div className="chart-progress" aria-hidden="true">
                  {METRICS.map((m, i) => (
                    <i key={m.key} className={i < metric || (i === metric && done) ? "done" : i === metric ? "now" : ""} />
                  ))}
                  <span>SCROLL ▼</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
