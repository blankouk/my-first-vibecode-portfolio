import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// After your first Vercel deploy, set this to your real URL, e.g.:
// site: "https://your-project.vercel.app"
// Canonical URLs and RSS need `site`; local `npm run dev` works without it.
export default defineConfig({
  adapter: cloudflare()
});