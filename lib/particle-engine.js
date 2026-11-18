import { SHAPES } from "./particle-shapes.js";

// A plain 2D-canvas particle field. Every particle eases toward its place in
// the current shape; changing the shape makes the cloud flow into a new form.
// No libraries: just arrays of numbers and fillRect.

const TONES = [0.25, 0.45, 0.7, 1];
const FOCAL = 900;

export function createParticleField(canvas, { reducedMotion = false } = {}) {
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, n = 0, dpr = 1;
  let pos, speed, tone, targets = {};
  let shape = "word", time = 0, raf = 0, alpha = 1, shift = 0, shiftGoal = 0;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    const oldW = w, oldH = h;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const count = w < 700 ? 3600 : 7200;
    if (count !== n) {
      n = count;
      pos = new Float32Array(n * 3);
      for (let i = 0; i < pos.length; i++) pos[i] = (Math.random() - 0.5) * Math.max(w, h) * 1.5;
      speed = Float32Array.from({ length: n }, () => 0.025 + Math.random() * 0.05);
      tone = Uint8Array.from({ length: n }, () => Math.floor(Math.random() * TONES.length));
    }
    // Phone address bars change the height while scrolling; ignore small changes.
    if (w !== oldW || Math.abs(h - oldH) > 160) targets = {};
  }

  function target(name) {
    if (!targets[name]) targets[name] = SHAPES[name].build(n, w, h);
    return targets[name];
  }

  function draw() {
    const spec = SHAPES[shape] || SHAPES.dust;
    const goal = target(shape in SHAPES ? shape : "dust");
    time += reducedMotion ? 0 : 1;
    const angle = spec.sway ? Math.sin(time * 0.006) * 0.35 : time * 0.0025;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    alpha += (spec.alpha - alpha) * 0.05;
    shift += (shiftGoal - shift) * 0.12;
    const cx = w / 2, cy = h / 2 + shift;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#F0F2F0";

    for (let t = 0; t < TONES.length; t++) {
      ctx.globalAlpha = TONES[t] * alpha;
      for (let i = 0; i < n; i++) {
        if (tone[i] !== t) continue;
        const k = i * 3;
        let x = goal[k], y = goal[k + 1], z = goal[k + 2];
        if (spec.axis === "y") [x, z] = [x * cos - z * sin, x * sin + z * cos];
        else if (spec.axis === "x") [y, z] = [y * cos - z * sin, y * sin + z * cos];
        else if (spec.axis === "z") [x, y] = [x * cos - y * sin, x * sin + y * cos];
        const e = reducedMotion ? 1 : speed[i];
        pos[k] += (x - pos[k]) * e;
        pos[k + 1] += (y - pos[k + 1]) * e;
        pos[k + 2] += (z - pos[k + 2]) * e;

        const f = FOCAL / (FOCAL + pos[k + 2]);
        if (f <= 0) continue;
        const sx = cx + pos[k] * f, sy = cy + pos[k + 1] * f;
        const dx = sx - mouse.x, dy = sy - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 8100) {
          const push = (1 - Math.sqrt(d2) / 90) * 7;
          pos[k] += (dx / 90) * push;
          pos[k + 1] += (dy / 90) * push;
        }
        const size = f > 1.05 ? 1.6 : 1.1;
        ctx.fillRect(sx, sy, size, size);
      }
    }
    raf = requestAnimationFrame(draw);
  }

  function onMove(event) { mouse.x = event.clientX; mouse.y = event.clientY; }
  function onLeave() { mouse.x = -9999; mouse.y = -9999; }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onMove);
  document.addEventListener("pointerleave", onLeave);
  raf = requestAnimationFrame(draw);

  return {
    // offset: how far the section's middle sits below the screen's middle.
    setShape(next, offset = 0) { shape = next; shiftGoal = offset; },
    rebuild() { targets = {}; },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    },
  };
}
