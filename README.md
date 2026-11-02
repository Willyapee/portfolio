# William Asabha Purnamadjaja — Portfolio

My personal portfolio website, built around a **pixel art × trading terminal** theme: black, white, and lime, with candlestick charts, tickers, and 8-bit borders everywhere.

## Highlights

- **Boot sequence**: a terminal-style loading screen that dissolves into pixel blocks before the site appears.
- **Live market background**: an animated candlestick chart drawn at low resolution on a canvas, blurred behind the content. It speeds up when you scroll.
- **Scroll-driven hero**: a stepped price line draws itself from left to right, and social links slide out from behind empty pixel borders as you scroll.
- **Interactive About section**: the section pins in place while scrolling plays through candlestick charts for GPA, organizations, projects, and competitions, ending on the real numbers.
- **Auto photo gallery**: drop images into `public/me/` or `public/about/` and they rotate in a loop with a pixel-wipe transition, no code changes needed.
- **Responsive and accessible**: a mobile layout with its own sticky chart, and reduced-motion support.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- React 19 + TypeScript
- Tailwind CSS 4 + custom CSS
- [react-icons](https://react-icons.github.io/react-icons/)
- No animation library: scroll effects use a small custom hook and CSS variables

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/          layout, page, and global styles
components/   UI sections (hero, about, navbar, charts, …)
data/         all text, links, and stats shown on the site
lib/          helpers: chart data, scroll progress, photo loader
public/me/    photos for the hero frame
public/about/ photos for the About gallery
```

## Customizing

All content lives in `data/profile.ts`: name, tagline, social links, About text, and the stats shown on the charts.
