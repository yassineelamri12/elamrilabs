# El Amri Labs

Landing page for **El Amri Labs**, the studio of Yassine El Amri. It covers AI, websites, apps and anything digital.

It's a static site: plain HTML, CSS and JavaScript, with no build step or dependencies.

> Building a site for a **client**? Use [`client-starter/`](client-starter/README.md), the React + Watermelon UI + React Spring template, and follow the playbook in [`.claude/skills/client-website`](.claude/skills/client-website/SKILL.md).

```
index.html              page content + SEO meta / structured data
styles.css              design system, layout, animations
main.js                 scroll-driven hero, reveals, horizontal process, card tilt
assets/favicon.svg
assets/hero/            (optional) video frame sequence for the hero
scripts/extract-frames.sh
```

## Run locally

```bash
npx serve .        # or: python3 -m http.server
```

## What's on the page

1. **Hero:** a pinned, scroll-scrubbed particle animation that morphs from a sphere into a neural network (AI), then a browser window (Web), then a phone (Apps), then a galaxy ("Anything digital.").
2. **Statement:** a word-by-word reveal as you scroll.
3. **Services:** a bento grid with an animated AI chat, a browser mock and a phone mock.
4. **Process:** a pinned horizontal scroll (Discover, Design, Build, Launch).
5. **Stack:** a marquee of technologies.
6. **About:** your principles.
7. **Contact:** a call to action.

The page respects `prefers-reduced-motion`.

## Things to personalise

- **Email:** `yassine@elamrilabs.com`, set in the contact section of `index.html`.
- **Domain:** `https://elamrilabs.com/` appears in the canonical, `og:url` and JSON-LD tags.
- **Social preview image:** add `assets/og.png` (1200×630).

## Replacing the hero with a video (Higgsfield, etc.)

The hero can scrub through a real video frame-by-frame, like Apple product pages:

1. Generate a 5–10 s video with a slow, continuous camera move and no cuts. Example prompt:
   > Cinematic macro shot, pure black background. A glowing glass orb made of fine light particles slowly rotates, then unfolds into a floating translucent browser window, which folds into a sleek smartphone of light, which finally dissolves into a luminous spiral galaxy. Soft violet, blue, green and orange rim light, ultra smooth slow camera push-in, no text, no cuts, 16:9.
2. `./scripts/extract-frames.sh hero.mp4 24 1600` (requires `ffmpeg`).
3. Uncomment the `window.HERO_FRAMES` line at the bottom of `index.html` and set `count` to the number printed by the script.

## Deploy

Any static host works: GitHub Pages (Settings → Pages → deploy from branch), Vercel, Netlify or Cloudflare Pages.
