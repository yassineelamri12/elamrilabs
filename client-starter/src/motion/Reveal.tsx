import type { ReactNode } from 'react'
import { animated, useInView, useReducedMotion } from '@react-spring/web'

/**
 * Fades, lifts and un-blurs its children the first time they scroll into view.
 * Wrap any section (or stagger items with increasing `delay`).
 */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion()
  const [ref, style] = useInView(
    () => ({
      from: { opacity: 0, y: 40, blur: 8 },
      to: { opacity: 1, y: 0, blur: 0 },
      delay,
      config: { tension: 140, friction: 22 },
      immediate: !!reduced,
    }),
    { rootMargin: '0px 0px -10% 0px', once: true },
  )
  return (
    <animated.div
      ref={ref}
      className={className}
      style={{
        opacity: style.opacity,
        transform: style.y.to((y) => `translate3d(0,${y}px,0)`),
        filter: style.blur.to((b) => (b > 0.05 ? `blur(${b}px)` : 'none')),
      }}
    >
      {children}
    </animated.div>
  )
}
