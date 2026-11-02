import type { ReactNode } from "react";

const MAP = [
  "....................",
  ".......hhhhhh.......",
  ".....hhhhhhhhhh.....",
  "....hhhhhhhhhhhh....",
  "....hhhhhhhhhhhh....",
  "....hhsssssssshh....",
  "....hssssssssssh....",
  "....ssssssssssss....",
  "....sseesssseess....",
  "....ssssssssssss....",
  "....ssssssssssss....",
  ".....sssmmmmsss.....",
  ".....ssssssssss.....",
  "......ssssssss......",
  "........ssss........",
  "........ssss........",
  "....cccckkkkcccc....",
  "..cccccckkkkcccccc..",
  ".cccccccckkcccccccc.",
  "cccccccccccccclllccc",
  "cccccccccccccclllccc",
  "cccccccccccccccccccc",
  "cccccccccccccccccccc",
  "cccccccccccccccccccc",
];

const COLORS: Record<string, string> = {
  h: "#1c201b",
  s: "#cfd5c9",
  e: "#0b0d0a",
  m: "#8f978c",
  c: "#2c3329",
  k: "#f2f5ee",
  l: "#b8ff2c",
};

export default function PixelPortrait() {
  const rects: ReactNode[] = [];
  MAP.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const fill = COLORS[ch];
      if (fill) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={fill} />);
    });
  });
  return (
    <svg
      className="portrait-svg"
      viewBox="0 0 20 24"
      preserveAspectRatio="xMidYMax meet"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Pixel avatar placeholder"
    >
      {rects}
    </svg>
  );
}
