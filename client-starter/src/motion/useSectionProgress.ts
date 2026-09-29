import { useEffect, type RefObject } from 'react'
import { useSpringValue } from '@react-spring/web'

/**
 * Spring-smoothed scroll progress (0 → 1) through a tall section with a
 * sticky child: 0 when its top reaches the viewport top, 1 when its bottom
 * reaches the viewport bottom. Drive any animated style with it.
 */
export function useSectionProgress(ref: RefObject<HTMLElement | null>) {
  const progress = useSpringValue(0, { config: { tension: 170, friction: 26, clamp: true } })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      progress.start(total <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / total)))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref, progress])

  return progress
}
