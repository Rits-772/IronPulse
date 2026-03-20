import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TestimonialAuthor {
  name: string;
  role: string;
  avatar?: string;
  stars?: number;
}

export interface TestimonialCardProps {
  author: TestimonialAuthor;
  text: string;
  href?: string;
}

export function TestimonialCard({ author, text, href }: TestimonialCardProps) {
  return (
    <div className={cn(
      "w-[320px] shrink-0 rounded-2xl border border-white/5 bg-card/60 p-6 backdrop-blur-md transition-all hover:bg-card/80 hover:border-primary/20",
      "flex flex-col gap-4 text-left"
    )}>
      <div className="flex items-center gap-1">
        {[...Array(author.stars || 5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
        ))}
      </div>
      <blockquote className="flex-1 text-sm md:text-base leading-relaxed text-foreground/80 italic">
        "{text}"
      </blockquote>
      <div className="flex items-center gap-4 mt-auto">
        <div className="flex flex-col">
          <span className="font-display font-bold uppercase tracking-widest text-glow-small">
            {author.name}
          </span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {author.role}
          </span>
        </div>
      </div>
    </div>
  );
}
