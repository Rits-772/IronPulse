import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Activity, Zap, Target, BarChart3, Dumbbell, Gauge, Star, ChevronRight } from "lucide-react";
import GymScene from "@/components/3d/GymScene";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
} as const;

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div className="relative min-h-screen bg-transparent font-sans">
      <GymScene />
      
      <nav className="fixed top-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center backdrop-blur-sm border-b border-white/5 bg-background/20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-sm shadow-[0_0_10px_#39FF14]" />
          <h1 className="text-2xl font-display font-bold uppercase tracking-widest text-glow">Iron<span className="text-primary">Pulse</span></h1>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-foreground/80 hover:text-primary font-medium transition-colors">Login</Link>
          <Link href="/register" className="px-5 py-2 bg-primary text-black font-bold uppercase tracking-wider rounded-md hover:bg-primary/90 transition-all box-glow hidden sm:block">Get Started</Link>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-4xl mx-auto text-center z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-bold tracking-widest uppercase text-sm mb-6 box-glow">
              Elite Performance Analytics
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-black uppercase leading-[0.9] tracking-tighter mb-6">
              Track Like A <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Machine</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto mb-10 leading-relaxed">
              Step into the future of strength training. IronPulse merges raw iron with cyberpunk analytics to give you absolute control over your physical evolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="group px-8 py-4 bg-primary text-black font-display font-bold text-xl uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-all box-glow flex items-center justify-center gap-2">
                Start Training <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/dashboard" className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-display font-bold text-xl uppercase tracking-widest rounded-lg hover:bg-white/10 transition-all flex items-center justify-center">
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      <section className="relative z-20 bg-background py-32 px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-5xl mx-auto text-center">
          <motion.div variants={fadeUp}>
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-widest mb-6">
              The <span className="text-primary">Operating System</span> For Your Body
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-16">
              IronPulse is not another workout tracker. It is a performance intelligence platform built for athletes who treat training like engineering. Every metric measured. Every pattern surfaced. Every plateau dismantled.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "50K+", label: "Workouts Logged" },
              { value: "12M+", label: "Sets Tracked" },
              { value: "98%", label: "Retention Rate" },
              { value: "4.9", label: "App Store Rating" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-display font-black text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="relative z-20 bg-background border-t border-white/5 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-20">
            <motion.div variants={fadeUp}>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-widest mb-4">Architect Your <span className="text-primary">Physique</span></h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Stop guessing. Start analyzing. Our platform provides the deep data insights needed to push past plateaus.</p>
            </motion.div>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Activity, title: "Deep Analytics", desc: "Visualize your strength curve with precision. Every rep tracked, every pound graphed." },
              { icon: Zap, title: "Neural Logging", desc: "Frictionless workout entry designed for the gym floor. Less tapping, more lifting." },
              { icon: Target, title: "Metric Matrix", desc: "Cross-reference body composition changes with training volume to optimize your growth vectors." },
              { icon: BarChart3, title: "Progress Engine", desc: "Track compound lifts over time with automated PR detection and plateau analysis." },
              { icon: Dumbbell, title: "Routine Builder", desc: "Construct push/pull/legs splits and custom routines. Drag, drop, and dominate." },
              { icon: Gauge, title: "Body Scanner", desc: "Log weight, body fat, and measurements. Watch your transformation unfold in real-time charts." },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="bg-card/50 backdrop-blur-lg border border-white/5 p-8 rounded-2xl hover:border-primary/30 transition-colors group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold uppercase tracking-wider mb-3 relative z-10">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative z-20 bg-background border-t border-white/5 py-32 px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-widest mb-4">Your <span className="text-primary">Command Center</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">A dashboard built for athletes, not accountants. Every data point serves a purpose.</p>
          </motion.div>
          <motion.div variants={fadeUp} className="relative rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-primary/5">
            <div className="bg-card p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "WEEKLY VOLUME", value: "30,100 LBS", color: "text-primary" },
                  { label: "ACTIVE STREAK", value: "4 DAYS", color: "text-orange-400" },
                  { label: "SESSIONS/WEEK", value: "5 AVG", color: "text-accent" },
                  { label: "STRENGTH INDEX", value: "+12% MoM", color: "text-purple-400" },
                ].map((stat, i) => (
                  <div key={i} className="bg-secondary/50 rounded-xl p-4 border border-white/5">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{stat.label}</div>
                    <div className={`text-xl md:text-2xl font-display font-bold ${stat.color}`}>{stat.value}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-secondary/30 rounded-xl p-4 border border-white/5 h-48 flex items-end">
                  <div className="flex items-end gap-1 w-full h-full pb-4">
                    {[65, 40, 80, 55, 90, 70, 95, 50, 85, 75, 60, 88].map((h, i) => (
                      <div key={i} className="flex-1 bg-primary/80 rounded-t" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4 border border-white/5 space-y-3">
                  {["Heavy Legs", "Upper Hypertrophy", "Push Day"].map((name, i) => (
                    <div key={i} className="flex items-center gap-3 bg-background/50 rounded-lg p-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <Dumbbell className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">{name}</div>
                        <div className="text-xs text-muted-foreground">Today</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative z-20 bg-background border-t border-white/5 py-32 px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-widest mb-4">Battle-<span className="text-primary">Tested</span></h2>
            <p className="text-muted-foreground text-lg">Athletes who switched to IronPulse never look back.</p>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marcus Chen",
                role: "Powerlifter — 1,500lb Total",
                quote: "IronPulse showed me patterns in my training I never would have found on my own. Added 80lbs to my total in 6 months.",
                stars: 5,
              },
              {
                name: "Sarah Volkov",
                role: "CrossFit Competitor",
                quote: "The workout logger is insanely fast. I can log a full session in under a minute between sets. Nothing else comes close.",
                stars: 5,
              },
              {
                name: "Derek Osei",
                role: "Bodybuilder — NPC Competitor",
                quote: "The body metrics tracking paired with volume analytics helped me dial in my prep. I came in 8lbs heavier and leaner than last year.",
                stars: 5,
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="bg-card border border-white/5 rounded-2xl p-8 relative overflow-hidden"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-display font-bold text-lg uppercase tracking-wider">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground font-medium">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="relative z-20 bg-background border-t border-white/5 py-32 px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-6">
            Ready To <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Evolve</span>?
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Join thousands of athletes who have upgraded their training intelligence. Your first session is free.
          </p>
          <Link href="/register" className="group inline-flex items-center gap-3 px-10 py-5 bg-primary text-black font-display font-black text-2xl uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all box-glow">
            Initialize Protocol <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      <footer className="relative z-20 bg-black border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 bg-primary rounded-sm opacity-50" />
            <span className="font-display font-bold uppercase tracking-widest">IronPulse</span>
            <span className="text-sm">© 2025</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground uppercase tracking-wider font-bold">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
