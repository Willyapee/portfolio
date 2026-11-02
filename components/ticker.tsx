import { ticker } from "@/data/profile";
import type { CSSProperties } from "react";
import { mulberry32 } from "@/lib/market";

export default function Ticker() {
  const rand = mulberry32(5);
  const items = ticker.map((name) => {
    const up = rand() > 0.22;
    return { name, up, change: (rand() * 6 + 0.2).toFixed(2) };
  });
  const row = (key: string) => (
    <div className="ticker-row" key={key} aria-hidden={key === "b"}>
      {items.map((t) => (
        <span key={t.name} className="ticker-item">
          <b>{t.name}</b>
          <em className={t.up ? "up" : "down"}>
            {t.up ? "▲" : "▼"} {t.change}%
          </em>
        </span>
      ))}
    </div>
  );
  return (
    <div className="ticker reveal" style={{ "--d": "1000ms" } as CSSProperties}>
      <div className="ticker-track">{[row("a"), row("b")]}</div>
    </div>
  );
}
