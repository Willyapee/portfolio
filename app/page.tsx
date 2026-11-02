import About from "@/components/about";
import BootLoader from "@/components/boot-loader";
import Hero from "@/components/hero";
import MarketBackground from "@/components/market-background";
import Navbar from "@/components/navbar";
import SectionPlaceholder from "@/components/section-placeholder";
import { navItems } from "@/data/profile";
import { findPhotos } from "@/lib/photos";

export default function Home() {
  const heroPhotos = findPhotos("me");
  const aboutPhotos = findPhotos("about");

  return (
    <>
      <BootLoader />
      <MarketBackground />
      <Navbar />
      <main>
        <Hero photos={heroPhotos} />
        <About photos={aboutPhotos} />
        {navItems.slice(1).map((item, i) => (
          <SectionPlaceholder key={item.id} id={item.id} index={i + 2} title={item.label} />
        ))}
      </main>
    </>
  );
}
