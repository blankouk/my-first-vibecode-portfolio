# AGENTS.md — Portfolio site context

This file documents how this project is built, configured, and deployed so humans and coding agents can work on it without rediscovering setup details.

## Project

Personal portfolio for **Artem Belozertsev** (finance & mathematics student). Static Astro site: Home, About, Projects, shared layout, newsletter **UI only** (no backend). Target deployment: **Vercel** (static output).

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | **Astro 6** (`astro` in `dependencies`) |
| Styling | **Tailwind CSS v4** via **`@tailwindcss/postcss`** (not `@tailwindcss/vite`) |
| Language | **TypeScript** |
| Bundler | **Vite 7** — pinned with npm **`overrides`** (see below) |

### Why PostCSS for Tailwind (not the Vite plugin)

Astro 6 uses tooling where **`@tailwindcss/vite` can fail at build time** with errors like `Missing field tsconfigPaths on BindingViteResolvePluginConfig.resolveOptions` when processing `src/styles/global.css`. The supported approach here is:

- `postcss.config.mjs` → `@tailwindcss/postcss`
- Global styles: `src/styles/global.css` with `@import "tailwindcss";` and design tokens

Do **not** re-add `@tailwindcss/vite` to `astro.config.mjs` unless you verify compatibility with the current Astro release.

### Why `overrides` for Vite

`npm` may resolve **Vite 8** as a transitive dependency. **Astro 6 expects Vite 7.** `package.json` includes:

```json
"overrides": {
  "vite": "^7.3.0"
}
```

Keep this unless Astro’s docs explicitly support Vite 8 for your version.

## Repository layout

```
src/
  layouts/Layout.astro    # Shell: head, Navbar, main, Footer
  pages/
    index.astro           # Home
    about.astro
    projects.astro
  components/
    Navbar.astro          # Mobile menu uses a small inline script
    Footer.astro
    ProjectCard.astro
    NewsletterForm.astro
  styles/global.css       # Tailwind + cyberpunk theme utilities
public/
  favicon.svg
postcss.config.mjs
astro.config.mjs
```

## Commands

From the project root:

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies. Prefer a normal terminal; **sandboxed** installs can hit `EPERM` / corrupted tarballs on some systems. |
| `npm run dev` | Dev server. Default port **4321**; if busy, Astro uses the next port (**4322**, etc.). Use the **Local** URL printed in the terminal. |
| `npm run build` | Static build → **`dist/`** |
| `npm run preview` | Serve `dist/` locally after build |

## Astro config: `site` URL

`astro.config.mjs` intentionally **does not** set `site` until a real production URL exists.

- **Wrong:** `site: "https://example.vercel.app"` — breaks canonical URLs and confuses debugging.
- **Right:** After Vercel (or another host) assigns a URL, set:

  ```js
  export default defineConfig({
    site: "https://your-project.vercel.app",
  });
  ```

Local dev works **without** `site`.

## Deployment (Vercel)

- **Output:** static — build command `npm run build`, output directory **`dist`**.
- **Framework preset:** Astro (if Vercel offers it).
- No server-side code; newsletter form is `action="#"`, `method="post"` until wired to a provider or API.

## Design system (summary)

Single source of truth: **`src/styles/global.css`**.

- **Background:** ~`#080810`; **surfaces:** ~`#0f0f1a`
- **Primary accent:** cyan `#00f0ff`; **secondary (sparing):** violet `#9b5de5`
- **Fonts:** **Orbitron** (display, 24px+), **Space Grotesk** (body) — loaded in `Layout.astro` with `preconnect` and `display=swap`
- Cards: thin cyan border `rgba(0, 240, 255, 0.15)`, glow shadows, `transition-interactive` (200ms ease)
- Buttons: **solid cyan** or **ghost** (border + text) — no gradient buttons per brief

Content is largely **`[PLACEHOLDER]`** until replaced.

## Agent / contributor guidelines

- Keep changes **scoped** to the task; match existing patterns in components and CSS.
- Preserve **accessibility:** one `<h1>` per page, labels on inputs, focus styles, semantic landmarks.
- **Do not** introduce React or other UI frameworks unless the project owner asks — Astro components only; Navbar uses minimal client JS for the mobile menu.
- After dependency upgrades, run **`npm run build`** and fix Tailwind/Astro integration if the build fails (prefer PostCSS Tailwind path documented above).

## Troubleshooting

| Issue | What to check |
| --- | --- |
| `npm install` fails with `EPERM` / tar errors | Full-permissions terminal; delete `node_modules` and lockfile, reinstall; avoid sandbox that blocks writes under `node_modules`. |
| Dev URL does not load | Confirm you use the **exact** port from the CLI (4321 vs 4322). Another process may hold 4321. |
| Build fails on `global.css` / Tailwind | Ensure `@tailwindcss/postcss` + `postcss.config.mjs`; do not rely on `@tailwindcss/vite` without verifying Astro compatibility. |
| Astro warns about Vite version | Confirm `overrides.vite` is present and `npm list vite` shows Vite 7.x under `astro`. |
