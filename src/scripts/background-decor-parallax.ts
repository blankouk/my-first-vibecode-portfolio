let scrollListenerAttached = false;
let rafId = 0;

function applyParallax(): void {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const nodes = document.querySelectorAll<HTMLElement>(".bg-decor [data-parallax]");

  if (reduce.matches) {
    nodes.forEach((n) => {
      n.style.setProperty("--py", "0px");
      n.style.setProperty("--px", "0px");
    });
    return;
  }

  const y = window.scrollY;
  nodes.forEach((n) => {
    const p = parseFloat(n.getAttribute("data-parallax") || "0");
    const ph = parseFloat(n.getAttribute("data-parallax-h") || "0");
    n.style.setProperty("--py", `${y * p}px`);
    n.style.setProperty("--px", `${y * ph}px`);
  });
}

function scheduleParallax(): void {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    applyParallax();
  });
}

/** Call on first load and every `astro:page-load` (decor may persist). */
export function initBackgroundDecorParallax(): void {
  applyParallax();

  if (!scrollListenerAttached) {
    scrollListenerAttached = true;
    window.addEventListener("scroll", scheduleParallax, { passive: true });
    window
      .matchMedia("(prefers-reduced-motion: reduce)")
      .addEventListener("change", applyParallax);
  }
}
