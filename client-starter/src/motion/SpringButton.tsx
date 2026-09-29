import type { ReactNode } from 'react'
import { animated, to, useSpring } from '@react-spring/web'
import { cn } from '@/lib/utils'

/** Link styled as a button with a springy hover lift and a 0.96 press. */
export function SpringButton({ href, children, variant = 'primary', className }: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
  className?: string
}) {
  const [style, api] = useSpring(() => ({ scale: 1, y: 0, config: { tension: 400, friction: 22 } }))
  return (
    <animated.a
      href={href}
      onPointerEnter={() => api.start({ y: -2 })}
      onPointerLeave={() => api.start({ y: 0, scale: 1 })}
      onPointerDown={() => api.start({ scale: 0.96 })}
      onPointerUp={() => api.start({ scale: 1 })}
      style={{ transform: to([style.y, style.scale], (y, s) => `translate3d(0,${y}px,0) scale(${s})`) }}
      className={cn(
        'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium',
        variant === 'primary'
          ? 'bg-primary text-primary-foreground shadow-[0_8px_30px_-8px_var(--primary)]'
          : 'bg-foreground/5 text-foreground ring-1 ring-foreground/10 backdrop-blur hover:bg-foreground/10',
        className,
      )}
    >
      {children}
    </animated.a>
  )
}

