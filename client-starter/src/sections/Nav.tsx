import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { SpringButton } from '@/motion/SpringButton'

export function Nav({ brand, links, cta }: {
  brand: string
  links: { label: string; href: string }[]
  cta: { label: string; href: string }
}) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className={cn(
      'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300',
      scrolled && 'bg-background/70 shadow-[0_1px_0_var(--border)] backdrop-blur-xl backdrop-saturate-150',
    )}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <a href="#top" className="text-lg font-semibold tracking-tight">{brand}</a>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          {links.map((l) => <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">{l.label}</a>)}
        </nav>
        <SpringButton href={cta.href} className="h-9 px-4 text-sm">{cta.label}</SpringButton>
      </div>
    </header>
  )
}
