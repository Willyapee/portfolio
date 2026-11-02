"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { navItems, profile } from "@/data/profile";

function useJakartaClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Navbar() {
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const time = useJakartaClock();

  useEffect(() => {
    const ids = ["home", ...navItems.map((n) => n.id)];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="nav reveal" style={{ "--d": "80ms" } as CSSProperties}>
      <a href="#home" className="nav-name glass px" onClick={() => setOpen(false)}>
        <span className="nav-blink" aria-hidden="true" />
        {profile.shortName}
      </a>

      <nav className={`nav-links glass px ${open ? "is-open" : ""}`} aria-label="Main">
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-list"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "CLOSE" : "MENU"} <span aria-hidden="true">{open ? "▲" : "▼"}</span>
        </button>
        <ul id="nav-list">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={active === item.id ? "is-active" : ""}
                aria-current={active === item.id ? "true" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="nav-clock glass px" aria-label="Jakarta time">
        <span className="nav-live">● LIVE</span>
        <span>JKT {time}</span>
      </div>
    </header>
  );
}
