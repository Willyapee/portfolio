"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { skills } from "@/data/profile";
import { useScrollProgress } from "@/lib/use-scroll-progress";

const ROW_START = [0.04, 0.24, 0.44];
const rowStyle = (row: number) => ({ "--start": ROW_START[row] }) as CSSProperties;

export default function Skill() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useScrollProgress(sectionRef);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const head = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.05 });
    head.observe(section);
    const cards = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-in")),
      { threshold: 0.2 },
    );
    section.querySelectorAll(".rise").forEach((el) => cards.observe(el));
    return () => {
      head.disconnect();
      cards.disconnect();
    };
  }, []);

  const rows = [skills.groups.slice(0, 3), skills.groups.slice(3, 6)];

  return (
    <section
      id="skill"
      ref={sectionRef}
      className={`skill ${inView ? "is-in" : ""}`}
      style={{ "--len": 0.2 } as CSSProperties}
    >
      <div className="skill-sticky">
        <div className="skill-inner">
          <p className="sec-kicker rv" style={{ "--rd": "0ms" } as CSSProperties}>
            <span>{"// 02"}</span> {skills.kicker}
          </p>
          <h2 className="sec-title rv" style={{ "--rd": "80ms" } as CSSProperties}>
            <span>{skills.title[0]}</span> <span className="lime">{skills.title[1]}</span>
          </h2>
          <p className="sec-sub rv" style={{ "--rd": "160ms" } as CSSProperties}>
            {skills.subtitle}
          </p>

          <div className="skill-grid">
            {rows.map((row, r) =>
              row.map((group) => (
                <article key={group.title} className="skill-card rise" style={rowStyle(r)}>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              )),
            )}
          </div>

          <div className="skill-extra rise" style={rowStyle(2)}>
            {skills.extras.map((extra) => (
              <div key={extra.title}>
                <h3>{extra.title}</h3>
                <p>{extra.items.join(" / ")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
