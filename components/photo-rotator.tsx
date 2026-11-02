"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  photos: string[];
  alt: string;
  sizes: string;
  interval?: number;
  priority?: boolean;
  focus?: string;
  fallback?: ReactNode;
  className?: string;
};

export default function PhotoRotator({
  photos,
  alt,
  sizes,
  interval = 4500,
  priority,
  focus = "50% 30%",
  fallback,
  className = "",
}: Props) {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const indexRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const count = photos.length;

  const go = (next: number) => {
    setPrev(indexRef.current);
    indexRef.current = next;
    setIndex(next);
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (count < 2 || paused || !visible) return;
    const id = window.setInterval(() => go((indexRef.current + 1) % count), interval);
    return () => clearInterval(id);
  }, [count, interval, paused, visible]);

  if (count === 0) return <div className={`rot ${className}`}>{fallback}</div>;

  const next = (index + 1) % count;

  return (
    <div
      ref={rootRef}
      className={`rot ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onClick={() => count > 1 && go((indexRef.current + 1) % count)}
    >
      {photos.map((src, k) => {
        const role = k === index ? "is-active" : k === prev ? "is-prev" : k === next ? "is-next" : null;
        if (!role) return null;
        return (
          <div key={src} className={`rot-layer ${role}`} aria-hidden={k !== index}>
            <Image
              src={src}
              alt={k === index ? alt : ""}
              fill
              sizes={sizes}
              priority={priority && k === 0}
              style={{ objectFit: "cover", objectPosition: focus }}
            />
          </div>
        );
      })}
      <span key={index} className="rot-scan" aria-hidden="true" />
    </div>
  );
}
