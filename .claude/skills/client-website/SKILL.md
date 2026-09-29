---
name: client-website
description: El Amri Labs playbook for building a client website or landing page end to end (direction, palette, sections, motion, launch). Use whenever the task is a new client site, a redesign, a landing page for a client, or choosing tools (Godly, Realtime Colors, Watermelon UI, React Spring, Manus) for client web work.
---

# Building a client website at El Amri Labs

Every client site goes through the same five stages, with one tool per stage. The goal is a site that looks custom and premium, built in days rather than weeks.

## 0. Pick the route

| Client needs | Route |
| --- | --- |
| Marketing / landing site where the look sells the brand (the default) | **Starter route**: `client-starter/` (React + Watermelon UI + React Spring) |
| A working app with logins, a database or an admin panel, needed fast, where polish matters less (booking system, internal dashboard, MVP to test an idea) | **Manus route**: build it in Manus, then restyle or rebuild the public-facing pages with the starter if the brand matters |
| A quick "here's what it could look like" before the client has signed | **Manus** or the starter with sample content; a 1-hour prototype wins the deal |

Manus (manus.im) is an AI agent that builds and hosts backend-powered sites and apps without code, with one-click publishing and built-in analytics/SEO. Use it for speed and backend, not for signature design work. Before using it for a paying client, confirm who owns the account, the hosting costs, and whether the code can be exported. The client should never be locked into a tool they didn't choose.

## 1. Direction: Godly

- Browse https://godly.website with the client's industry and mood in mind. Save 3–5 references.
- Send them to the client: "Which of these feels like you, and why?" Agree on direction before designing.
- Write the answer down in 3 words (e.g. "calm, premium, editorial"). Every later choice has to fit those words.

## 2. Palette and type: Realtime Colors

- Open https://www.realtimecolors.com on the discovery call and pick colours and fonts live with the client.
- Export as CSS, then paste `--text`, `--background`, `--primary`, `--secondary` and `--accent` into `client-starter/src/styles/theme.css` (light in `:root`, dark in `.dark`). Set `--on-primary` so button text is readable.
- Set the fonts in `theme.css` (`--font-heading`, `--font-body`) and load them in `index.html`.
- Never hard-code colours in components. Use tokens (`bg-primary`, `text-muted-foreground`, `bg-card`, `border-border`).

## 3. Content and sections: Watermelon UI

- Copy the starter: `cp -r client-starter ../<client>-website`.
- Put all copy in `src/site.config.ts`. Never ship the sample content: no invented testimonials, stats or client logos. Use real, approved ones, or remove the section.
- To change or add sections, search Watermelon first, before writing a section from scratch:
  - With the Watermelon MCP server (`.mcp.json`), use the `watermelon-ui` skill: `search`, then `get_component` (or `compose_page` for a full page).
  - Otherwise, browse https://ui.watermelon.sh.
  - Install with `npm run add -- <slug>`. The script also installs the block's `ui/` primitives and npm dependencies.
- After installing a block: move its copy into props and `site.config.ts`, and replace hard-coded colours (`neutral-*`, `zinc-*`, `teal-*`, `bg-white`) with tokens. Then check it in light, dark and mobile.

## 4. Motion: React Spring

The starter's motion lives in `src/motion/`. Reuse it rather than adding new animation libraries.

- `ScrollHero`: a pinned hero whose headline recedes as you scroll. It shows theme-coloured orbs by default, or a scroll-scrubbed video frame sequence (`hero.frames`, created with `scripts/extract-frames.sh` from a Higgsfield/Veo clip). Sell the video hero as a premium add-on.
- `Reveal`: wrap each section so it rises and un-blurs into view. Stagger items with `delay` (about 80–100 ms apart).
- `SpringButton`: every call-to-action gets the spring hover lift and the 0.96 press.
- `useSectionProgress(ref)`: spring-smoothed 0→1 progress through any tall section. Use it for pinned or horizontal-scroll storytelling sections.
- Watermelon blocks that already animate with `motion` keep it. Don't rewrite them to React Spring.
- Motion must respect `prefers-reduced-motion` (`useReducedMotion()` → `immediate: true`).
- Apply the `make-interfaces-feel-better` skill during polish: concentric radii, shadows instead of borders, `text-wrap: balance` on headings, tabular numbers, and no `transition: all`.

## 5. Launch checklist

- [ ] `npm run build` and `npm run lint` pass.
- [ ] Search the code for `SAMPLE`, `Lumen`, `example.com` and `Watermelon`: nothing sample is left.
- [ ] `index.html` title, description and `og:` image are set, and a favicon is present.
- [ ] Checked at 390 px and 1440 px wide, in dark mode if used, and with reduced motion turned on.
- [ ] Lighthouse mobile score is 90+ for performance and accessibility.
- [ ] Deployed to Vercel (Vite preset) on the client's domain, with analytics connected.
- [ ] Contact links and forms go to an inbox the client actually reads.
