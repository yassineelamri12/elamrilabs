# El Amri Labs — client website starter

The starting point for every client landing page. Copy this folder, fill in two files, and you have a themed, animated, responsive site.

**Stack:** React 19, Vite, TypeScript, Tailwind CSS 4, [Watermelon UI](https://ui.watermelon.sh) sections, and [React Spring](https://www.react-spring.dev) animations.

```bash
cp -r client-starter ../acme-website && cd ../acme-website
npm install
npm run dev
```

## New client in 4 steps

| Step | Tool | What you do |
| --- | --- | --- |
| 1. Direction | [Godly](https://godly.website) | Pick 3–5 reference sites with the client. Note what they like (layout, mood, motion). |
| 2. Colours and fonts | [Realtime Colors](https://www.realtimecolors.com) | Choose the palette and fonts live with the client. Export as CSS and paste into **`src/styles/theme.css`**. Load the fonts in `index.html`. |
| 3. Content | — | Replace everything in **`src/site.config.ts`**: brand, copy, services, pricing, FAQ, contact. |
| 4. Sections | [Watermelon UI](https://ui.watermelon.sh) | Swap or add sections: `npm run add -- <slug>` (e.g. `npm run add -- pricing-3 faq-4`), then place them in `src/App.tsx`. |

Then `npm run build` and deploy the folder to Vercel (framework preset: Vite).

## What's inside

```
src/
  site.config.ts          ← all client copy (one file)
  styles/theme.css        ← all client colours/fonts (paste from Realtime Colors)
  index.css               ← maps the 5 palette colours to every token Watermelon uses
  App.tsx                 ← page order: which sections appear
  motion/                 ← React Spring
    ScrollHero.tsx        ← pinned Apple-style hero (gradient orbs, or a scrubbed video)
    Reveal.tsx            ← fade/lift/unblur on scroll-in; wrap any section
    SpringButton.tsx      ← springy hover + 0.96 press
    useSectionProgress.ts ← spring-smoothed scroll progress for any tall section
  sections/Nav.tsx        ← glass navigation bar
  components/
    watermelon-ui/        ← Watermelon blocks (feature-1, stats-3, testimonials-2,
                            pricing-1, faq-1, cta-1, footer-17), wired to site.config
    ui/                   ← shadcn primitives the blocks use
scripts/
  add-block.mjs           ← `npm run add -- <slug>`: installs any Watermelon block
  extract-frames.sh       ← turns a hero video into a scroll-scrubbed frame sequence
```

### Colours

Realtime Colors gives five colours: `--text`, `--background`, `--primary`, `--secondary` and `--accent`. `src/index.css` derives everything else from them (card, muted, border, muted text and so on), so pasting a new palette re-skins every section at once. Add `class="dark"` to `<html>` to use the dark palette.

### Adding Watermelon sections

Browse at https://ui.watermelon.sh. The slug is the last part of a block's URL.

```bash
npm run add -- hero-17 testimonials-4
```

New blocks arrive with Watermelon's sample copy. Either edit the text in the component, or give it props and feed it from `site.config.ts`, like the included blocks. Some blocks hard-code their own colours (e.g. `bg-neutral-50`, `text-teal-600`); swap those for theme tokens (`bg-card`, `text-primary`) so the client palette applies.

With Claude Code, the `watermelon-ui` skill and the Watermelon MCP server (configured in the repo root) can search the catalogue and pick blocks for you.

### Premium hero: scroll-scrubbed video

1. Generate a 5–10 s continuous shot (Higgsfield, Veo, etc.) with a slow camera move and no cuts.
2. `./scripts/extract-frames.sh hero.mp4 24 1600` (needs ffmpeg). Frames land in `public/hero/`.
3. In `site.config.ts` set:
   ```ts
   frames: { count: 120, path: (i) => `/hero/frame_${String(i + 1).padStart(4, '0')}.webp` },
   ```

## Before you ship

- [ ] No sample content left: search for `SAMPLE`, `Lumen`, `example.com`.
- [ ] Testimonials and stats are real and approved by the client (or the sections are removed).
- [ ] `index.html` title, description and `og:` tags match `site.seo`.
- [ ] Checked on a phone, in dark mode (if used), and with "reduce motion" turned on.
- [ ] `npm run build` passes, and Lighthouse scores 90+ on mobile.

## Credits

Section components come from [Watermelon UI](https://github.com/WatermelonCorp/watermelon-platform) (MIT).
