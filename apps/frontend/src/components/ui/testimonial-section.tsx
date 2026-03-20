import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "./testimonial-card"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ 
  title,
  description,
  testimonials,
  className 
}: TestimonialsSectionProps) {
  return (
    <section className={cn(
      "w-full text-foreground relative z-20 bg-transparent flex flex-col items-center justify-center",
      "py-24 sm:py-32 overflow-hidden",
      className
    )}>
      <div className="mx-auto flex w-full flex-col items-center gap-8 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-6 max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-widest text-glow">
            Battle-<span className="text-primary">Tested</span>
          </h2>
          <p className="max-w-[600px] text-lg text-muted-foreground font-medium sm:text-xl">
            {description}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2 [--gap:1.5rem] [gap:var(--gap)] flex-row [--duration:80s]">
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
              {[...Array(4)].map((_, setIndex) => (
                testimonials.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`${setIndex}-${i}`}
                    {...testimonial}
                  />
                ))
              ))}
            </div>
          </div>

          {/* Fade gradients */}
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/4 bg-gradient-to-r from-background md:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/4 bg-gradient-to-l from-background md:block" />
        </div>
      </div>
    </section>
  )
}
