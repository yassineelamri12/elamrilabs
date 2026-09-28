/* ==========================================================================
   El Amri Labs — interactions
   - Scroll-scrubbed hero (procedural particle morph, or an image sequence
     when window.HERO_FRAMES is defined)
   - Word-by-word statement reveal
   - Pinned horizontal process track
   - Reveal-on-scroll, card spotlight/tilt, nav state
   ========================================================================== */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  /** Progress (0..1) of scrolling through a tall section with a sticky child. */
  function sectionProgress(el) {
    const r = el.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total <= 0 ? 0 : clamp(-r.top / total);
  }

  // ------------------------------------------------------------------------
  // Nav + footer year
  // ------------------------------------------------------------------------
  const nav = document.getElementById('nav');
  document.getElementById('year').textContent = new Date().getFullYear();

  // ------------------------------------------------------------------------
  // HERO
  // ------------------------------------------------------------------------
  const hero = document.getElementById('hero');
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  const scenes = [...hero.querySelectorAll('.hero__scene')];
  const heroProgressEl = document.getElementById('heroProgress');
  const scrollHint = hero.querySelector('.hero__scroll');

  let W = 0, H = 0, DPR = 1;
  function resizeCanvas() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function updateScenes(p) {
    for (const s of scenes) {
      const from = parseFloat(s.dataset.from), to = parseFloat(s.dataset.to);
      s.classList.toggle('is-active', p >= from && p < to);
      s.classList.toggle('is-past', p >= to);
    }
    heroProgressEl.style.transform = `scaleY(${p})`;
    scrollHint.style.opacity = p > 0.02 ? 0 : 1;
  }

  // ---------- Mode A: image sequence (e.g. a Higgsfield video split into frames)
  function startFrameSequence(cfg) {
    const frames = new Array(cfg.count);
    let lastDrawn = -1;
    for (let i = 0; i < cfg.count; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = cfg.path(i);
      img.onload = () => { if (lastDrawn === -1 || i === lastDrawn) draw(true); };
      frames[i] = img;
    }
    function nearestLoaded(i) {
      for (let d = 0; d < cfg.count; d++) {
        if (frames[i - d] && frames[i - d].complete && frames[i - d].naturalWidth) return frames[i - d];
        if (frames[i + d] && frames[i + d].complete && frames[i + d].naturalWidth) return frames[i + d];
      }
      return null;
    }
    function draw(force) {
      const p = sectionProgress(hero);
      updateScenes(p);
      const idx = Math.round(p * (cfg.count - 1));
      if (idx === lastDrawn && !force) return;
      const img = nearestLoaded(idx);
      if (!img) return;
      lastDrawn = idx;
      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
    }
    resizeCanvas();
    window.addEventListener('resize', () => { resizeCanvas(); draw(true); });
    window.addEventListener('scroll', () => requestAnimationFrame(() => draw(false)), { passive: true });
    draw(true);
  }

  // ---------- Mode B: procedural particle morph
  function startParticles() {
    const isSmall = Math.min(window.innerWidth, window.innerHeight) < 700;
    const N = isSmall ? 1400 : 2600;
    const rand = mulberry32(7);
    const VIOLET = [167, 139, 250], BLUE = [96, 165, 250], GREEN = [52, 211, 153],
          CYAN = [34, 211, 238], ORANGE = [251, 146, 60], PINK = [244, 114, 182],
          AMBER = [251, 191, 36], WHITE = [235, 235, 245];

    // Each shape: Float32Array xyz (N*3), Float32Array rgb (N*3), spin (1 = rotates in 3D, 0 = faces camera)
    const shapes = [
      makeSphere(), makeNetwork(), makeBrowser(), makePhone(), makeGalaxy(),
    ];
    // Scroll timeline: [start, end] of each morph from shape i to shape i+1
    const morphs = [[0.16, 0.24], [0.40, 0.48], [0.62, 0.70], [0.82, 0.90]];
    const delay = new Float32Array(N).map(() => rand() * 0.35);
    const size = new Float32Array(N).map(() => 0.6 + rand() * 1.2);
    const scatter = new Float32Array(N * 3).map(() => (rand() - 0.5) * 9);

    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
    const tmpA = new Float32Array(N * 3), tmpB = new Float32Array(N * 3);
    let mouseX = 0, mouseY = 0, tiltX = 0, tiltY = 0;
    let smoothP = sectionProgress(hero);
    const t0 = performance.now();
    let running = true;

    window.addEventListener('pointermove', e => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running) requestAnimationFrame(frame);
    }).observe(hero);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    requestAnimationFrame(frame);

    function transform(shape, out, time, p) {
      const src = shape.xyz;
      const ang = shape.spin * (time * 0.12 + p * Math.PI * 1.5);
      const ca = Math.cos(ang), sa = Math.sin(ang);
      const tilt = shape.tilt || 0, ct = Math.cos(tilt), st = Math.sin(tilt);
      for (let i = 0; i < N * 3; i += 3) {
        let x = src[i], y = src[i + 1], z = src[i + 2];
        // tilt around X, then spin around Y
        const y1 = y * ct - z * st, z1 = y * st + z * ct;
        out[i] = x * ca + z1 * sa;
        out[i + 1] = y1;
        out[i + 2] = -x * sa + z1 * ca;
      }
    }

    function frame(now) {
      if (!running) return;
      const time = (now - t0) / 1000;
      const target = sectionProgress(hero);
      smoothP += (target - smoothP) * (reduceMotion ? 1 : 0.12);
      const p = smoothP;
      updateScenes(target);

      // Which shapes are we between?
      let a = 0, b = 0, t = 0;
      for (let i = 0; i < morphs.length; i++) {
        const [s, e] = morphs[i];
        if (p >= e) { a = b = i + 1; t = 0; }
        else if (p > s) { a = i; b = i + 1; t = (p - s) / (e - s); break; }
        else break;
      }
      transform(shapes[a], tmpA, time, p);
      if (b !== a) transform(shapes[b], tmpB, time, p);

      const intro = reduceMotion ? 1 : easeInOut(clamp(time / 2.2));
      const ca = shapes[a].rgb, cb = shapes[b].rgb;
      for (let i = 0, k = 0; i < N; i++, k += 3) {
        const ti = b === a ? 0 : easeInOut(clamp((t - delay[i]) / 0.65));
        for (let c = 0; c < 3; c++) {
          let v = b === a ? tmpA[k + c] : lerp(tmpA[k + c], tmpB[k + c], ti);
          // gentle "explode" in the middle of a morph
          if (b !== a) v *= 1 + Math.sin(ti * Math.PI) * 0.35;
          pos[k + c] = lerp(scatter[k + c], v, intro);
          col[k + c] = b === a ? ca[k + c] : lerp(ca[k + c], cb[k + c], ti);
        }
      }

      // Parallax tilt
      tiltX += (mouseY * 0.25 - tiltX) * 0.05;
      tiltY += (mouseX * 0.35 - tiltY) * 0.05;
      const cx = Math.cos(tiltX), sx = Math.sin(tiltX), cy = Math.cos(tiltY), sy = Math.sin(tiltY);

      // Final stage: zoom the galaxy slightly as you reach the end
      const zoom = 1 + clamp((p - 0.9) / 0.1) * 0.25;
      const tb = b === a ? 0 : easeInOut(clamp(t));
      const S = Math.min(W, H) * (W < 700 ? 0.36 : 0.3) * zoom * lerp(shapes[a].scale, shapes[b].scale, tb);
      const lift = lerp(shapes[a].lift, shapes[b].lift, tb) * Math.min(W, H) * (W < 700 ? 0.36 : 0.3);
      const F = 4;
      const ox = W / 2, oy = H / 2 - lift;

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      // Dim the particles while text is on screen so copy stays readable
      const textDim = 0.55 + 0.45 * sceneGap(p);

      for (let i = 0, k = 0; i < N; i++, k += 3) {
        let x = pos[k], y = pos[k + 1], z = pos[k + 2];
        const y1 = y * cx - z * sx; let z1 = y * sx + z * cx;
        const x2 = x * cy + z1 * sy; z1 = -x * sy + z1 * cy;
        const persp = F / (F + z1);
        const px = ox + x2 * S * persp, py = oy + y1 * S * persp;
        if (px < -10 || px > W + 10 || py < -10 || py > H + 10) continue;
        const depth = clamp((z1 + 2) / 4);
        const alpha = (0.25 + 0.75 * (1 - depth)) * textDim * (0.85 + 0.15 * Math.sin(time * 2 + i));
        const r = size[i] * persp * (W < 700 ? 1.1 : 1.35);
        ctx.fillStyle = `rgba(${col[k] | 0},${col[k + 1] | 0},${col[k + 2] | 0},${alpha.toFixed(3)})`;
        ctx.fillRect(px - r / 2, py - r / 2, r, r);
      }
      requestAnimationFrame(frame);
    }

    // 1 when no text is centered, lower when a scene's text is fully visible
    function sceneGap(p) {
      for (const s of scenes) {
        const from = +s.dataset.from, to = +s.dataset.to;
        if (p >= from && p < to) return from === 0 ? 0.6 : 0.35;
      }
      return 1;
    }

    // ----- Shape builders -------------------------------------------------
    function shape(fn, spin, tilt, scale = 1, lift = 0) {
      const xyz = new Float32Array(N * 3), rgb = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const [x, y, z, r, g, b] = fn(i);
        xyz.set([x, y, z], i * 3); rgb.set([r, g, b], i * 3);
      }
      return { xyz, rgb, spin, tilt, scale, lift };
    }
    function mix(c1, c2, t) { return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)]; }

    function makeSphere() {
      const golden = Math.PI * (3 - Math.sqrt(5));
      return shape(i => {
        const y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = golden * i;
        const R = 1.25 + (rand() - 0.5) * 0.04;
        const c = mix(mix(VIOLET, BLUE, (y + 1) / 2), WHITE, rand() * 0.3);
        return [Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R, ...c];
      }, 1, 0.3);
    }

    function makeNetwork() {
      const nodes = [];
      for (let i = 0; i < 26; i++) {
        const u = rand() * 2 - 1, th = rand() * Math.PI * 2, r = 0.55 + rand() * 0.9, s = Math.sqrt(1 - u * u);
        nodes.push([Math.cos(th) * s * r * 1.3, u * r, Math.sin(th) * s * r]);
      }
      const edges = [];
      nodes.forEach((n, i) => {
        nodes.map((m, j) => [j, Math.hypot(n[0] - m[0], n[1] - m[1], n[2] - m[2])])
          .filter(([j]) => j !== i).sort((p, q) => p[1] - q[1]).slice(0, 3)
          .forEach(([j]) => edges.push([i, j]));
      });
      return shape(i => {
        if (i % 3 === 0) { // node cluster
          const n = nodes[i % nodes.length], s = 0.06;
          const c = mix(VIOLET, WHITE, 0.35);
          return [n[0] + (rand() - 0.5) * s, n[1] + (rand() - 0.5) * s, n[2] + (rand() - 0.5) * s, ...c];
        }
        const [ia, ib] = edges[i % edges.length], t = rand(), A = nodes[ia], B = nodes[ib];
        const c = mix(VIOLET, BLUE, t);
        return [lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t), ...c.map(v => v * 0.8)];
      }, 1, 0.2);
    }

    // Helpers for flat shapes: sample a point on a rectangle outline or inside it
    function onRect(x, y, w, h) {
      const per = 2 * (w + h), d = rand() * per;
      if (d < w) return [x + d, y];
      if (d < w + h) return [x + w, y + (d - w)];
      if (d < 2 * w + h) return [x + w - (d - w - h), y + h];
      return [x, y + h - (d - 2 * w - h)];
    }
    function inRect(x, y, w, h) { return [x + rand() * w, y + rand() * h]; }

    function makeBrowser() {
      const W2 = 2.8, H2 = 1.75, x0 = -W2 / 2, y0 = -H2 / 2;
      return shape(i => {
        const r = rand();
        let pt, c;
        if (r < 0.26) { pt = onRect(x0, y0, W2, H2); c = mix(GREEN, CYAN, rand()); }
        else if (r < 0.31) { pt = [x0 + rand() * W2, y0 + 0.2]; c = mix(GREEN, CYAN, 0.5); }
        else if (r < 0.34) { const k = (i % 3); pt = [x0 + 0.12 + k * 0.1 + (rand() - .5) * .03, y0 + 0.1 + (rand() - .5) * .03]; c = [ORANGE, AMBER, GREEN][k]; }
        else if (r < 0.52) { pt = inRect(x0 + 0.25, y0 + 0.38, 1.3, 0.14); c = mix(GREEN, WHITE, 0.4); }       // title
        else if (r < 0.62) { pt = inRect(x0 + 0.25, y0 + 0.62, 1.8 * rand(), 0.02); c = mix(WHITE, CYAN, .3).map(v => v * .6); } // text
        else if (r < 0.66) { pt = inRect(x0 + 0.25, y0 + 0.72, 1.2, 0.02); c = mix(WHITE, CYAN, .3).map(v => v * .6); }
        else { const k = i % 3, cw = (W2 - 0.5 - 0.3) / 3; pt = onRect(x0 + 0.25 + k * (cw + 0.15), y0 + 0.92, cw, 0.6); c = mix(CYAN, GREEN, k / 2); }
        return [pt[0], pt[1], (rand() - 0.5) * 0.04, ...c];
      }, 0, 0, 0.92, 0.42);
    }

    function makePhone() {
      const w = 1.05, h = 2.1, x0 = -w / 2, y0 = -h / 2, rr = 0.2;
      return shape(i => {
        const r = rand();
        let pt, c;
        if (r < 0.34) { // rounded outline
          const per = 2 * (w + h - 4 * rr) + 2 * Math.PI * rr, d = rand() * per;
          pt = roundedRectPoint(x0, y0, w, h, rr, d);
          c = mix(ORANGE, PINK, (pt[1] - y0) / h);
        } else if (r < 0.38) { pt = inRect(-0.14, y0 + 0.08, 0.28, 0.05); c = WHITE.map(v => v * .5); } // island
        else { // app icon grid 4x5
          const k = i % 20, cx = k % 4, cy = (k / 4) | 0, s = 0.17, gap = (w - 0.16 - 4 * s) / 3;
          const ix = x0 + 0.08 + cx * (s + gap), iy = y0 + 0.32 + cy * (s + 0.13);
          pt = rand() < 0.6 ? onRect(ix, iy, s, s) : inRect(ix, iy, s, s);
          c = mix(mix(ORANGE, PINK, k / 19), mix(AMBER, VIOLET, cx / 3), 0.35);
        }
        return [pt[0], pt[1], (rand() - 0.5) * 0.04, ...c];
      }, 0, 0, 0.8, 0.42);
    }
    function roundedRectPoint(x, y, w, h, r, d) {
      const segs = [w - 2 * r, Math.PI * r / 2, h - 2 * r, Math.PI * r / 2, w - 2 * r, Math.PI * r / 2, h - 2 * r, Math.PI * r / 2];
      let i = 0; while (d > segs[i] && i < 7) { d -= segs[i]; i++; }
      const a = d / r;
      switch (i) {
        case 0: return [x + r + d, y];
        case 1: return [x + w - r + Math.sin(a) * r, y + r - Math.cos(a) * r];
        case 2: return [x + w, y + r + d];
        case 3: return [x + w - r + Math.cos(a) * r, y + h - r + Math.sin(a) * r];
        case 4: return [x + w - r - d, y + h];
        case 5: return [x + r - Math.sin(a) * r, y + h - r + Math.cos(a) * r];
        case 6: return [x, y + h - r - d];
        default: return [x + r - Math.cos(a) * r, y + r - Math.sin(a) * r];
      }
    }

    function makeGalaxy() {
      const palette = [VIOLET, BLUE, GREEN, AMBER, PINK];
      return shape(i => {
        const arm = i % 4, t = Math.pow(rand(), 0.7), R = 0.12 + t * 2.1;
        const th = arm * (Math.PI / 2) + t * 4.2 + (rand() - 0.5) * 0.5 * (1 - t * 0.5);
        const spread = 0.12 * (1 - t) + 0.05;
        const c = mix(mix(WHITE, palette[(t * 4.99) | 0], clamp(t * 1.8)), palette[arm], 0.2);
        return [Math.cos(th) * R + (rand() - .5) * spread, (rand() - 0.5) * spread * 0.8, Math.sin(th) * R + (rand() - .5) * spread, ...c];
      }, 1, 1.05);
    }
  }

  // Deterministic PRNG so the shapes are identical every visit
  function mulberry32(a) {
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }

  if (window.HERO_FRAMES && window.HERO_FRAMES.count) startFrameSequence(window.HERO_FRAMES);
  else startParticles();

  // ------------------------------------------------------------------------
  // Statement: split into words, light them up as you scroll
  // ------------------------------------------------------------------------
  const statement = document.getElementById('statement');
  const stText = statement.querySelector('[data-words]');
  stText.innerHTML = stText.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span> `).join('');
  const words = [...stText.querySelectorAll('.w')];

  // ------------------------------------------------------------------------
  // Process: pinned horizontal track
  // ------------------------------------------------------------------------
  const process = document.getElementById('process');
  const track = document.getElementById('processTrack');
  const processBar = document.getElementById('processBar');

  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 10);

    const sp = sectionProgress(statement);
    const lit = Math.floor(clamp(sp * 1.25) * words.length);
    words.forEach((w, i) => w.classList.toggle('is-on', i < lit));

    const pp = sectionProgress(process);
    const max = track.scrollWidth - window.innerWidth;
    track.style.transform = `translate3d(${-max * easeInOut(pp)}px,0,0)`;
    processBar.style.transform = `scaleX(${pp})`;
  }
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // ------------------------------------------------------------------------
  // Reveal on scroll (with small stagger for siblings)
  // ------------------------------------------------------------------------
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.setProperty('--d', `${Math.min(sibs.indexOf(el), 5) * 0.08}s`);
    io.observe(el);
  });

  // ------------------------------------------------------------------------
  // Card spotlight + subtle 3D tilt
  // ------------------------------------------------------------------------
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        card.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * 3}deg) rotateY(${(x - 0.5) * 3}deg)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
})();
