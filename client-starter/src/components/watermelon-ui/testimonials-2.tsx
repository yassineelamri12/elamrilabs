// Watermelon UI "testimonials-2" (https://ui.watermelon.sh), made data-driven.

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, Star } from "lucide-react";

export interface Testimonial { text: string; name: string; role?: string; avatar?: string }
export interface Testimonials2Props { title: string; description?: string; items: Testimonial[]; moreHref?: string }

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default function Testimonials2({ title, description, items, moreHref }: Testimonials2Props) {
  return (
    <section className="theme-injected bg-background px-4 py-16 md:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-foreground text-4xl font-semibold md:text-5xl">
          {title}
        </h2>

        {description && <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">{description}</p>}

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Card
              key={i}
              className="group border-primary/20 dark:border-primary/30 from-primary/30 to-primary/25 dark:from-primary/50 dark:to-primary/40 relative z-0 h-full overflow-hidden rounded-4xl border bg-gradient-to-b p-2 text-left ring-0"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-all duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 scale-[1.5] bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklab,var(--primary)_15%,transparent),transparent_40%),radial-gradient(circle_at_80%_30%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_40%),radial-gradient(circle_at_50%_80%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_40%)] transition-transform duration-500 group-hover:scale-100" />
              </div>

              <CardContent className="relative z-10 flex h-full flex-col rounded-3xl bg-background px-4 py-4 shadow-[0_0_4px_2px_rgba(0,0,0,0.04),0_0_0px_1px_rgba(0,0,0,0.05),inset_0_1px_4px_1px_rgba(255,255,255,1)] dark:bg-background dark:shadow-[inset_0_1px_0px_1px_rgba(255,255,255,0.1),0_0_4px_2px_rgba(0,0,0,0.14),0_0_0px_2px_rgba(0,0,0,0.15)]">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className="fill-primary text-primary h-4 w-4"
                    />
                  ))}
                </div>

                <p className="text-foreground flex-1 text-xl leading-relaxed">
                  "{t.text}"
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <Avatar className="h-8 w-8 rounded-lg">
                    {t.avatar && <AvatarImage src={t.avatar} />}
                    <AvatarFallback>{initials(t.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-left text-sm">
                    <span className="text-foreground block">{t.name}</span>
                    {t.role && <span className="text-muted-foreground block text-xs">{t.role}</span>}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {moreHref && (
          <div className="mx-auto mt-10">
            <a
              href={moreHref}
              className="text-muted-foreground hover:text-foreground decoration-primary flex items-center justify-center gap-1 underline-offset-4 transition hover:underline"
            >
              See all testimonials
              <ChevronRight />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
