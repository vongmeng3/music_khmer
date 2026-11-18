"use client";

import CollectionBrowser from "../components/CollectionBrowser.js";
import FeaturedReel from "../components/FeaturedReel.js";
import HomeAbout from "../components/HomeAbout.js";
import HomeHero from "../components/HomeHero.js";
import HomeOutro from "../components/HomeOutro.js";
import HomeSource from "../components/HomeSource.js";
import { usePublishedEntries } from "../lib/use-published-entries.js";

// The home page is a scroll story. Each section names a particle shape
// (data-shape); components/ParticleField.js morphs the background to match.
export default function Home() {
  const { entries, isLoading, error } = usePublishedEntries();

  return (
    <main className="home">
      <HomeHero />
      <HomeAbout />
      <HomeSource />
      <FeaturedReel entries={entries} />
      <CollectionBrowser entries={entries} isLoading={isLoading} error={error} />
      <HomeOutro />
    </main>
  );
}
