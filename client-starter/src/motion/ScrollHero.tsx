import { useEffect, useRef } from 'react'
import { animated, useReducedMotion, useTrail } from '@react-spring/web'
import { useSectionProgress } from './useSectionProgress'
import { SpringButton } from './SpringButton'

type Frames = { count: number; path: (i: number) => string }

export interface ScrollHeroProps {
  eyebrow?: string
  title: string
  highlight: string
  description: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  /** Optional image sequence (e.g. a Higgsfield video split with scripts/extract-frames.sh). */
  frames?: Frames
}

/**
 * Apple-style pinned hero. While you scroll through it, the headline recedes
 * and the background either morphs (gradient orbs in the theme colours) or
 * scrubs through a video frame sequence. All motion is React Spring.
 */
export function ScrollHero({ eyebrow, title, highlight, description, primaryCta, secondaryCta, frames }: ScrollHeroProps) {
  const section = useRef<HTMLElement>(null)
  const progress = useSectionProgress(section)
  const reduced = useReducedMotion()

  // Staggered entrance for the copy
  const lines = [eyebrow, 'title', description, 'ctas'].filter(Boolean)
  const trail = useTrail(lines.length, {
    from: { opacity: 0, y: 24, blur: 8 },
    to: { opacity: 1, y: 0, blur: 0 },
    delay: 150,
    config: { tension: 120, friction: 20 },
    immediate: !!reduced,
  })
  const enter = (i: number) => ({
    opacity: trail[i].opacity,
    transform: trail[i].y.to((y) => `translate3d(0,${y}px,0)`),
    filter: trail[i].blur.to((b) => (b > 0.05 ? `blur(${b}px)` : 'none')),
  })

  return (
    <section ref={section} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        {frames ? <FrameCanvas frames={frames} progress={progress} /> : <Orbs progress={progress} />}

        <animated.div
          className="relative z-10 mx-auto max-w-4xl px-6 text-center"
          style={{
            opacity: progress.to([0, 0.6, 0.9], [1, 1, 0]),
            transform: progress.to((p) => `translate3d(0,${-p * 120}px,0) scale(${1 - p * 0.12})`),
          }}
        >
          {eyebrow && (
            <animated.p style={enter(0)} className="mb-6 inline-flex rounded-full bg-foreground/5 px-4 py-1.5 text-sm font-medium text-muted-foreground ring-1 ring-foreground/10 backdrop-blur">
              {eyebrow}
            </animated.p>
          )}
          <animated.h1 style={enter(eyebrow ? 1 : 0)} className="text-5xl leading-[1.02] font-semibold tracking-[-0.035em] sm:text-7xl md:text-8xl">
            {title}{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{highlight}</span>
          </animated.h1>
          <animated.p style={enter(eyebrow ? 2 : 1)} className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
            {description}
          </animated.p>
          <animated.div style={enter(eyebrow ? 3 : 2)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <SpringButton href={primaryCta.href}>{primaryCta.label}</SpringButton>
            {secondaryCta && <SpringButton href={secondaryCta.href} variant="ghost">{secondaryCta.label}</SpringButton>}
          </animated.div>
        </animated.div>

        <animated.div
          aria-hidden
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.2em] text-muted-foreground uppercase"
          style={{ opacity: progress.to([0, 0.05], [1, 0]) }}
        >
          Scroll
        </animated.div>
      </div>
    </section>
  )
}

/** Three blurred orbs in the theme colours that drift, swell and rotate with scroll. */
function Orbs({ progress }: { progress: ReturnType<typeof useSectionProgress> }) {
  const orb = 'absolute rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen'
  return (
    <animated.div
      aria-hidden
      className="absolute inset-0"
      style={{
        opacity: progress.to([0, 0.55, 0.95], [1, 0.9, 0]),
        transform: progress.to((p) => `rotate(${p * 45}deg) scale(${1 + p * 0.2})`),
      }}
    >
      <animated.div className={`${orb} left-[15%] top-[15%] size-[42vmax] bg-primary/40`}
        style={{ transform: progress.to((p) => `translate3d(${p * 20}vw,${p * 10}vh,0)`) }} />
      <animated.div className={`${orb} right-[10%] top-[25%] size-[36vmax] bg-accent/35`}
        style={{ transform: progress.to((p) => `translate3d(${-p * 25}vw,${p * 5}vh,0)`) }} />
      <animated.div className={`${orb} bottom-[5%] left-[35%] size-[30vmax] bg-secondary/50`}
        style={{ transform: progress.to((p) => `translate3d(0,${-p * 30}vh,0)`) }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_75%)]" />
    </animated.div>
  )
}

/** Draws the frame matching the spring-smoothed scroll progress (cover-fit). */
function FrameCanvas({ frames, progress }: { frames: Frames; progress: ReturnType<typeof useSectionProgress> }) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = canvas.current!
    const ctx = c.getContext('2d')!
    const imgs = Array.from({ length: frames.count }, (_, i) => {
      const img = new Image()
      img.src = frames.path(i)
      img.onload = () => i === 0 && draw(progress.get())
      return img
    })
    let last = -1
    function draw(p: number) {
      const i = Math.round(p * (frames.count - 1))
      const img = imgs[i]
      if (!img?.complete || !img.naturalWidth || (i === last && c.width === c.clientWidth * devicePixelRatio)) return
      last = i
      c.width = c.clientWidth * devicePixelRatio
      c.height = c.clientHeight * devicePixelRatio
      const s = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight)
      const w = img.naturalWidth * s, h = img.naturalHeight * s
      ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h)
    }
    let raf = 0
    const loop = () => { draw(progress.get()); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [frames, progress])

  return <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
}
