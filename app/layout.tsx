import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Silkscreen, VT323 } from "next/font/google";
import "./globals.css";

const pixel = Silkscreen({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-pixel" });
const terminal = VT323({ subsets: ["latin"], weight: "400", variable: "--font-terminal" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "William Asabha Purnamadjaja — Full Stack Developer",
  description: "A person who loves making websites, software, and automation.",
};

export const viewport: Viewport = {
  themeColor: "#050605",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${pixel.variable} ${terminal.variable} ${mono.variable}`}
    >
      <body>
        <noscript>
          <style>{`.boot{display:none!important}.reveal,.reveal-frame{opacity:1!important;transform:none!important;clip-path:none!important}body{overflow:auto!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
