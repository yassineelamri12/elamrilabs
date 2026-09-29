/*
 * CLIENT CONTENT: everything a visitor reads lives here.
 * Duplicate the starter, then replace every value below with the client's own
 * copy. Sections with an empty list (e.g. testimonials: []) are hidden.
 *
 * Everything below is SAMPLE content for a fictional business ("Lumen").
 * Never ship made-up testimonials or stats: use the client's real ones.
 */
import type { IconType } from 'react-icons'
import { HiLightBulb, HiShieldCheck, HiSupport, HiDatabase, HiSwitchHorizontal } from 'react-icons/hi'
import { FaBolt, FaRocket, FaStar } from 'react-icons/fa'

export const site = {
  brand: 'Lumen',
  url: 'https://example.com',
  seo: {
    title: 'Lumen — Design studio for modern brands',
    description: 'Lumen helps growing brands look and feel world-class online.',
  },

  nav: [
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
  navCta: { label: 'Book a call', href: '#contact' },

  hero: {
    eyebrow: 'Now booking for next quarter',
    title: 'Websites that',
    highlight: 'win customers.',
    description: 'Strategy, design and engineering for brands that want to stand out, not blend in.',
    primaryCta: { label: 'Book a free call', href: '#contact' },
    secondaryCta: { label: 'See pricing', href: '#pricing' },
    /** Optional scroll-scrubbed video frames (see README). Leave undefined for the gradient hero. */
    frames: undefined as undefined | { count: number; path: (i: number) => string },
  },

  services: {
    title: 'Everything you need to grow online',
    items: [
      { icon: HiLightBulb, color: 'text-orange-500', title: 'Brand strategy', text: 'Positioning and messaging that makes the right customers say "that\'s for me".', tag: 'Workshop included' },
      { icon: HiDatabase, color: 'text-purple-500', title: 'Web design', text: 'Custom, conversion-focused designs, never a template.', tag: 'Figma prototypes' },
      { icon: HiSwitchHorizontal, color: 'text-pink-500', title: 'Development', text: 'Fast, accessible sites your team can edit themselves.', tag: 'CMS ready' },
      { icon: HiSupport, color: 'text-blue-500', title: 'Ongoing support', text: 'Updates, fixes and improvements after launch.', tag: 'Monthly plans' },
    ] as { icon: IconType; color: string; title: string; text: string; tag: string }[],
    highlight: {
      icon: HiShieldCheck as IconType,
      color: 'text-green-500',
      title: 'Built to perform',
      text: 'Every site ships with the fundamentals done right, so it ranks, loads and converts.',
      rows: [
        { label: 'Lighthouse score', value: '95+' },
        { label: 'Mobile-first', value: 'Always' },
        { label: 'SEO setup', value: 'Included' },
      ],
      tag: 'Checked before launch',
    },
  },

  stats: {
    title: 'Results that',
    highlight: 'speak for themselves',
    description: 'SAMPLE numbers. Replace with the client\'s real results or delete this section.',
    metrics: [
      { icon: FaRocket, color: 'text-blue-500', value: '40+', label: 'sites launched' },
      { icon: FaBolt, color: 'text-amber-500', value: '2 wks', label: 'average build' },
      { icon: FaStar, color: 'text-yellow-500', value: '5.0', label: 'client rating' },
    ] as { icon: IconType; color: string; value: string; label: string }[],
  },

  testimonials: {
    title: 'What clients say',
    description: 'SAMPLE quotes. Replace with real reviews (with permission) or set items to [].',
    items: [
      { text: 'Our new site paid for itself in the first month.', name: 'Client Name', role: 'Founder, Company' },
      { text: 'They understood our brand better than we did.', name: 'Client Name', role: 'Marketing Lead, Company' },
      { text: 'Fast, clear, and the result looks incredible.', name: 'Client Name', role: 'CEO, Company' },
    ] as { text: string; name: string; role?: string; avatar?: string }[],
  },

  pricing: [
    { id: 'starter', title: 'Starter', description: 'A one-page site to get you online fast.', price: '€1,500', features: [{ text: 'One-page website' }, { text: 'Mobile-first design' }, { text: 'Basic SEO' }], buttonText: 'Get started' },
    { id: 'growth', title: 'Growth', description: 'A full website built to convert.', price: '€4,000', features: [{ text: 'Up to 6 pages' }, { text: 'Custom animations' }, { text: 'CMS + analytics' }], buttonText: 'Get started', isPopular: true },
    { id: 'custom', title: 'Custom', description: 'Web apps, AI features, integrations.', price: 'Let\'s talk', features: [{ text: 'Anything you need' }, { text: 'Dedicated support' }, { text: 'Fixed-scope quote' }], buttonText: 'Book a call' },
  ],

  faq: {
    title: 'Questions, answered',
    items: [
      { id: '1', question: 'How long does a website take?', answer: 'Most sites launch in 2–4 weeks, depending on size and how quickly content is ready.' },
      { id: '2', question: 'Can I edit the site myself?', answer: 'Yes. We set up an editor so you can change text and images without touching code.' },
      { id: '3', question: 'Do you offer support after launch?', answer: 'Yes, monthly support plans cover updates, fixes and small improvements.' },
    ],
  },

  cta: {
    title: 'Ready to start?',
    description: 'Tell us about your project and get a proposal within 48 hours.',
    button: { label: 'Email us', href: 'mailto:hello@example.com' },
  },

  footer: {
    tagline: 'Let\'s build something great.',
    columns: [
      { title: 'Menu', links: [{ label: 'Services', href: '#services' }, { label: 'Pricing', href: '#pricing' }, { label: 'FAQ', href: '#faq' }] },
      { title: 'Contact', links: [{ label: 'hello@example.com', href: 'mailto:hello@example.com' }, { label: 'Instagram', href: '#' }, { label: 'LinkedIn', href: '#' }] },
    ],
    legal: '© 2026 Lumen. All rights reserved.',
  },
}
