# El Amri Labs

This repo holds two things:

- **The studio site** (repo root: `index.html`, `styles.css`, `main.js`): a static site with no build step, deployed to elamrilabs.com via Vercel. `.vercelignore` keeps everything else out of the deployment.
- **`client-starter/`**: the template for client websites (React + Vite + Tailwind 4 + Watermelon UI + React Spring).

## Client websites

For any client site or landing page, follow the `client-website` skill (`.claude/skills/client-website/SKILL.md`). In short:
Godly (direction) → Realtime Colors (palette → `src/styles/theme.css`) → `src/site.config.ts` (content) → Watermelon UI sections (`npm run add -- <slug>`) → React Spring motion (`src/motion/`) → launch checklist.

- Search Watermelon UI (the `watermelon-ui` skill / MCP server in `.mcp.json`) before writing a section from scratch.
- Polish with the `make-interfaces-feel-better` skill.
- Never ship sample testimonials, stats or logos.

## Checks

In `client-starter/`: `npm run build` and `npm run lint`.
