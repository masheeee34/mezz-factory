import type { Floquage } from "@/lib/types";

/**
 * Canvas compositing for the jersey textures.
 *
 * The whole "personnalisable" floquage system lives here: we draw the jersey
 * photo onto an offscreen canvas, then paint the customer's name + number on
 * top. The canvas is fed to a THREE.CanvasTexture, so it updates live in 3D.
 *
 * When you get a real .glb model + a flat UV texture, keep these draw helpers
 * and point them at the flat back texture instead of the photo — nothing else
 * in the viewer needs to change.
 */

/** Fade the rectangular photo edges to transparent so it melts into the scene. */
function applyEdgeVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-in";
  const g = ctx.createRadialGradient(
    w / 2,
    h / 2,
    Math.min(w, h) * 0.2,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.62,
  );
  g.addColorStop(0, "rgba(0,0,0,1)");
  g.addColorStop(0.82, "rgba(0,0,0,1)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/** Dark, feathered patch that hides the baked-in "MEZZ' / 190" on the photo. */
function maskFloquageZone(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  const cx = w * 0.5;
  const cy = h * 0.33;
  const r = w * 0.46;
  const g = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
  g.addColorStop(0, "rgba(9,9,11,0.92)");
  g.addColorStop(0.55, "rgba(9,9,11,0.82)");
  g.addColorStop(1, "rgba(9,9,11,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, h * 0.08, w, h * 0.5);
  ctx.restore();
}

const FONT_STACK = `"Road Rage", "Anton", Impact, sans-serif`;

function drawFloquage(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  floquage: Floquage,
) {
  const name = (floquage.name || "").trim();
  const number = (floquage.number || "").trim();

  ctx.save();
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0,0,0,0.65)";
  ctx.shadowBlur = h * 0.012;
  ctx.shadowOffsetY = h * 0.004;

  // Name
  if (name) {
    const size = h * 0.072;
    ctx.font = `${size}px ${FONT_STACK}`;
    ctx.letterSpacing = `${size * 0.06}px`;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#e3e3e5";
    ctx.fillText(name, w * 0.5, h * 0.205);

    // Red brush underline, like the original.
    ctx.shadowBlur = 0;
    const uw = Math.min(w * 0.46, name.length * size * 0.5);
    const grad = ctx.createLinearGradient(w * 0.5 - uw / 2, 0, w * 0.5 + uw / 2, 0);
    grad.addColorStop(0, "rgba(225,29,42,0)");
    grad.addColorStop(0.5, "#e11d2a");
    grad.addColorStop(1, "rgba(225,29,42,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(w * 0.5 - uw / 2, h * 0.225, uw, h * 0.008);
  }

  // Number
  if (number) {
    ctx.shadowBlur = h * 0.014;
    const size = h * 0.23;
    ctx.font = `${size}px ${FONT_STACK}`;
    ctx.letterSpacing = `${size * 0.02}px`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#c9c9cc";
    ctx.fillText(number, w * 0.5, h * 0.37);
  }

  ctx.restore();
}

/** Draw the front of the jersey (no floquage). */
export function paintFront(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  applyEdgeVignette(ctx, canvas.width, canvas.height);
}

/** Draw the back of the jersey with the live floquage on top. */
export function paintBack(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  floquage: Floquage,
) {
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  maskFloquageZone(ctx, canvas.width, canvas.height);
  drawFloquage(ctx, canvas.width, canvas.height, floquage);
  applyEdgeVignette(ctx, canvas.width, canvas.height);
}

/**
 * Floquage rendered on a TRANSPARENT canvas (name + number only).
 * Used as a Decal projected onto the 3D model — works on any mesh, no UVs
 * needed, and is reused as-is when the real jersey .glb arrives.
 */
export function paintFloquageDecal(
  canvas: HTMLCanvasElement,
  floquage: Floquage,
) {
  const W = 600;
  const H = 820;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);

  const name = (floquage.name || "").trim();
  const number = (floquage.number || "").trim();

  ctx.textAlign = "center";
  ctx.lineJoin = "round";

  // Name
  if (name) {
    const size = H * 0.13;
    ctx.font = `${size}px ${FONT_STACK}`;
    ctx.letterSpacing = `${size * 0.05}px`;
    ctx.textBaseline = "alphabetic";
    ctx.lineWidth = size * 0.06;
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.strokeText(name, W * 0.5, H * 0.22);
    ctx.fillStyle = "#ededee";
    ctx.fillText(name, W * 0.5, H * 0.22);

    // red underline
    const uw = Math.min(W * 0.7, name.length * size * 0.5);
    ctx.fillStyle = "#e11d2a";
    ctx.fillRect(W * 0.5 - uw / 2, H * 0.245, uw, H * 0.012);
  }

  // Number
  if (number) {
    const size = H * 0.34;
    ctx.font = `${size}px ${FONT_STACK}`;
    ctx.letterSpacing = `${size * 0.02}px`;
    ctx.textBaseline = "middle";
    ctx.lineWidth = size * 0.04;
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.strokeText(number, W * 0.5, H * 0.58);
    ctx.fillStyle = "#d4d4d6";
    ctx.fillText(number, W * 0.5, H * 0.58);
  }
}

/** Ensure the brush font is loaded before we draw text into the canvas. */
export async function ensureFontsReady(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  try {
    await Promise.all([
      document.fonts.load(`64px "Anton"`),
      document.fonts.load(`64px "Road Rage"`),
    ]);
    await document.fonts.ready;
  } catch {
    /* font not available — fallback stack handles it */
  }
}
