import fs from "node:fs";
import path from "node:path";

const IMAGE = /\.(jpe?g|png|webp|avif)$/i;

export function findPhotos(folder: string): string[] {
  const dir = path.join(process.cwd(), "public", folder);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/${folder}/${encodeURIComponent(f)}`);
  } catch {
    return [];
  }
}
