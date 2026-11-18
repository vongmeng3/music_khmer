"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { entryHref } from "../lib/entry-slugs.js";

// Colours of Khmer silk, used as the mat around each photo.
const FRAMES = ["#8E2C34", "#4E3527", "#2F4A3A", "#B07A2A", "#2C3557", "#5B2B4A"];

// "Some selected entries": while you scroll down, the row of cards slides
// sideways. The section is tall; its inner stage sticks to the screen.
export default function FeaturedReel({ entries }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const picks = entries.slice(0, 6);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const box = section.getBoundingClientRect();
      const travel = box.height - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -box.top / Math.max(1, travel)));
      const distance = track.scrollWidth - window.innerWidth;
      track.style.transform = `translate3d(${-progress * Math.max(0, distance)}px, 0, 0)`;
    }
    function onScroll() { if (!frame) frame = requestAnimationFrame(update); }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [picks.length]);

  if (picks.length === 0) return null;

  return (
    <section ref={sectionRef} className="reel" data-shape="ribbon" style={{ height: `calc(100vh + ${picks.length * 42}vh)` }}>
      <div className="reel-stage">
        <p className="micro-label reel-label">Some selected entries / ការជ្រើសរើស</p>
        <div ref={trackRef} className="reel-track">
          {picks.map((entry, index) => (
            <Link key={entry.id} href={entryHref(entry)} className="reel-card">
              <span className="reel-frame" style={{ backgroundColor: FRAMES[index % FRAMES.length] }}>
                {entry.image
                  ? <img src={entry.image} alt={entry.titleEn} loading="lazy" decoding="async" />
                  : <span className="reel-empty">Update soon</span>}
              </span>
              <span className="reel-caption">
                <span>
                  <span className="khmer-title reel-title-kh">{entry.titleKh}</span>
                  <span className="reel-title-en">{entry.titleEn}</span>
                </span>
                <span className="reel-type">{entry.type === "song" ? "Song" : "Instrument"}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
