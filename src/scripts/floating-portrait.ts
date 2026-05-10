/** Interaction strength (0.7 = 30% less than previous defaults). */
const EFFECT_SCALE = 0.7;

const maxTiltDeg = 11 * EFFECT_SCALE;
const liftBasePx = 14 * EFFECT_SCALE;
const liftCornerExtraPx = 34 * EFFECT_SCALE;
const shiftMaxPx = 16 * EFFECT_SCALE;
const cornerTiltBoost = 0.45 * EFFECT_SCALE;

function cornerStrength(px: number, py: number): number {
  const d = Math.hypot(px * 2, py * 2);
  return Math.min(1, d);
}

export function initFloatingPortraits(): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const roots = document.querySelectorAll<HTMLElement>("[data-floating-portrait]");
  if (!roots.length) return;

  roots.forEach((root) => {
    if (root.dataset.floatingPortraitBound === "true") return;
    root.dataset.floatingPortraitBound = "true";

    function reset() {
      root.style.setProperty("--tilt-x", "0deg");
      root.style.setProperty("--tilt-y", "0deg");
      root.style.setProperty("--lift", "0px");
      root.style.setProperty("--shift-x", "0px");
      root.style.setProperty("--shift-y", "0px");
    }

    root.addEventListener("mousemove", (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const c = cornerStrength(px, py);
      const tiltMul = 1 + c * cornerTiltBoost;

      const rx = (-py * maxTiltDeg * 2 * tiltMul).toFixed(2);
      const ry = (px * maxTiltDeg * 2 * tiltMul).toFixed(2);
      const lift = (liftBasePx + c * liftCornerExtraPx).toFixed(1);
      const sx = (px * shiftMaxPx * 2).toFixed(1);
      const sy = (py * shiftMaxPx * 2).toFixed(1);

      root.style.setProperty("--tilt-x", `${rx}deg`);
      root.style.setProperty("--tilt-y", `${ry}deg`);
      root.style.setProperty("--lift", `${lift}px`);
      root.style.setProperty("--shift-x", `${sx}px`);
      root.style.setProperty("--shift-y", `${sy}px`);
    });

    root.addEventListener("mouseleave", reset);
  });
}
