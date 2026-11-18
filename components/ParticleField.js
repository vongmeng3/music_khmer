"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createParticleField } from "../lib/particle-engine.js";

// The fixed particle background shared by every page. Any element with a
// data-shape attribute ("word", "sphere", "ribbon", "spiral", "frame", "dust")
// asks the particles to take that shape while it sits in the middle of the
// screen. Pages without such sections get quiet dust.
export default function ParticleField() {
  const canvasRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const field = createParticleField(canvasRef.current, { reducedMotion });
    let frame = 0;

    function pickShape() {
      frame = 0;
      const middle = window.innerHeight / 2;
      let shape = "dust";
      let offset = 0;
      for (const section of document.querySelectorAll("[data-shape]")) {
        const box = section.getBoundingClientRect();
        if (box.top <= middle && box.bottom >= middle) {
          shape = section.dataset.shape;
          // Screen-sized sections carry their shape with them as they scroll;
          // tall ones (the reel, the collection) keep it centred.
          offset = box.height <= window.innerHeight * 1.2 ? box.top + box.height / 2 - middle : 0;
        }
      }
      field.setShape(shape, offset);
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(pickShape);
    }

    pickShape();
    // The Khmer word is drawn with the web font, so redraw once it has loaded.
    document.fonts?.load("700 64px Battambang", "តន្ត្រី").then(() => field.rebuild());
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = window.setInterval(pickShape, 600);

    return () => {
      field.destroy();
      cancelAnimationFrame(frame);
      window.clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />;
}
