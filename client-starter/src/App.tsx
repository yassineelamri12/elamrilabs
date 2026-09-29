import { site } from '@/site.config'
import { Nav } from '@/sections/Nav'
import { ScrollHero } from '@/motion/ScrollHero'
import { Reveal } from '@/motion/Reveal'
// Sections from Watermelon UI (npm run add -- <slug> to add more)
import Features1 from '@/components/watermelon-ui/feature-1'
import Stats3 from '@/components/watermelon-ui/stats-3'
import Testimonials2 from '@/components/watermelon-ui/testimonials-2'
import { Pricing1 } from '@/components/watermelon-ui/pricing-1'
import { Faq1 } from '@/components/watermelon-ui/faq-1'
import { Cta1 } from '@/components/watermelon-ui/cta-1'
import Footer17 from '@/components/watermelon-ui/footer-17'

export default function App() {
  return (
    <>
      <Nav brand={site.brand} links={site.nav} cta={site.navCta} />
      <main id="top">
        <ScrollHero {...site.hero} />

        <section id="services" className="scroll-mt-16">
          <Reveal><Features1 {...site.services} /></Reveal>
        </section>

        {site.stats.metrics.length > 0 && (
          <Reveal><Stats3 {...site.stats} /></Reveal>
        )}

        {site.testimonials.items.length > 0 && (
          <Reveal><Testimonials2 {...site.testimonials} /></Reveal>
        )}

        <section id="pricing" className="scroll-mt-16 py-16">
          <Reveal>
            <h2 className="mb-10 text-center text-4xl font-semibold tracking-tight md:text-5xl">Simple pricing</h2>
            <Pricing1 plans={site.pricing} />
          </Reveal>
        </section>

        <section id="faq" className="scroll-mt-16">
          <Reveal><Faq1 title={site.faq.title} faqs={site.faq.items} /></Reveal>
        </section>

        <section id="contact" className="scroll-mt-16 px-4">
          <Reveal>
            <Cta1 title={site.cta.title} description={site.cta.description} buttonText={site.cta.button.label} buttonLink={site.cta.button.href} />
          </Reveal>
        </section>
      </main>

      <Footer17
        heading={site.footer.tagline}
        brandName={site.brand}
        navColumns={site.footer.columns}
        socialLinks={[]}
        legalText={site.footer.legal}
        bottomLinks={[]}
      />
    </>
  )
}
