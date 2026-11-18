// Target positions for the particle field, one shape per home-page section.
// Each builder returns a Float32Array of n points as [x, y, z] triples, in
// pixels, centred on the middle of the viewport.

const TAU = Math.PI * 2;

function fill(n, point) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const [x, y, z] = point(i);
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

// Roughly normal noise, for soft edges.
function spread(size) {
  return (Math.random() + Math.random() + Math.random() - 1.5) * size;
}

// The Khmer word drawn with the Battambang font, then sampled pixel by pixel.
// Falls back to a sphere if the font has not drawn anything yet.
export function word(n, w, h, text = "តន្ត្រី") {
  const cw = Math.min(w, 1400);
  // Tall enough for Khmer subscripts (coeng) stacked under the letters.
  const ch = Math.round(Math.max(cw * 0.6, h * 0.7));
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  let size = Math.min(h * 0.4, ch * 0.45);
  ctx.font = `700 ${size}px Battambang`;
  const measured = ctx.measureText(text).width;
  if (measured > cw * 0.84) size *= (cw * 0.84) / measured;
  ctx.font = `700 ${size}px Battambang`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(text, cw / 2, ch / 2);

  const data = ctx.getImageData(0, 0, cw, ch).data;
  const points = [];
  for (let y = 0; y < ch; y += 2) {
    for (let x = 0; x < cw; x += 2) {
      if (data[(y * cw + x) * 4 + 3] > 140) points.push(x - cw / 2, y - ch / 2);
    }
  }
  if (points.length === 0) return sphere(n, w, h);
  return fill(n, () => {
    const k = Math.floor(Math.random() * (points.length / 2)) * 2;
    return [points[k] + spread(2), points[k + 1] + spread(2), spread(40)];
  });
}

// A drum skin or gong seen in 3D: points on the surface of a sphere.
export function sphere(n, w, h) {
  const r = Math.min(w, h) * 0.36;
  return fill(n, () => {
    const u = Math.random() * 2 - 1;
    const a = Math.random() * TAU;
    const s = Math.sqrt(1 - u * u);
    const k = r + spread(4);
    return [k * s * Math.cos(a), k * u, k * s * Math.sin(a)];
  });
}

// Two sound waves twisting around each other across the whole screen.
export function ribbon(n, w, h) {
  const amp = Math.min(h * 0.2, 180);
  return fill(n, (i) => {
    const t = Math.random() * 2 - 1;
    const phase = (i % 2) * Math.PI + t * 3.4;
    const loose = 4 + Math.abs(t) * 26;
    return [t * w * 0.62, Math.sin(phase) * amp + spread(loose), Math.cos(phase) * amp + spread(loose)];
  });
}

// A spinning record / galaxy: three loose arms around a bright centre.
export function spiral(n, w, h) {
  const radius = Math.min(w, h) * 0.42;
  return fill(n, (i) => {
    if (i % 14 === 0) return [spread(10), spread(10), 0];
    const d = Math.sqrt(Math.random());
    const a = d * TAU * 1.25 + (i % 3) * (TAU / 3) + spread(0.7);
    const r = d * radius;
    return [Math.cos(a) * r, Math.sin(a) * r, spread(12)];
  });
}

// A hand-drawn chalk frame around the contribute call to action.
export function frame(n, w) {
  const fw = Math.min(620, w * 0.86);
  const fh = w < 700 ? 240 : 200;
  return fill(n, () => {
    const p = Math.random() * 2 * (fw + fh);
    const edge = spread(16);
    if (p < fw) return [p - fw / 2, -fh / 2 + edge, 0];
    if (p < fw + fh) return [fw / 2 + edge, p - fw - fh / 2, 0];
    if (p < 2 * fw + fh) return [p - fw - fh - fw / 2, fh / 2 + edge, 0];
    return [-fw / 2 + edge, p - 2 * fw - fh - fh / 2, 0];
  });
}

// Quiet dust behind reading areas, so text stays easy to read.
export function dust(n, w, h) {
  return fill(n, () => [(Math.random() - 0.5) * w * 1.2, (Math.random() - 0.5) * h * 1.2, (Math.random() - 0.5) * 600]);
}

// How each shape moves: which axis it turns on, and how bright it is.
export const SHAPES = {
  word: { build: word, axis: "y", sway: true, alpha: 1 },
  sphere: { build: sphere, axis: "y", alpha: 1 },
  ribbon: { build: ribbon, axis: "x", alpha: 0.9 },
  spiral: { build: spiral, axis: "z", alpha: 1 },
  frame: { build: frame, axis: null, alpha: 1 },
  dust: { build: dust, axis: "y", alpha: 0.32 },
};
