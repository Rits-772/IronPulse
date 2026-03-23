import { lazy, Suspense, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Activity, Zap, Target, BarChart3, Dumbbell, Gauge, ChevronRight } from "lucide-react";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { TestimonialsSection } from "@/components/ui/testimonial-section";
import { MetaTags } from "@/components/seo/MetaTags";
import { useIsMobile } from "@/hooks/use-mobile";

const SplineScene = lazy(() => import("@/components/ui/spline-scene").then(module => ({ default: module.SplineScene })));
const GymScene = lazy(() => import("@/components/3d/GymScene"));

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
} as const;

const parallaxImages = [
  { src: '/images/imgCenter.webp', styleClass: 'h-[25vh] w-[25vw]' }, 
  { src: '/images/istockphoto-1212373738-170667a.webp', styleClass: '-top-[30vh] left-[5vw] h-[30vh] w-[35vw]' },
  { src: '/images/OIP.webp', styleClass: '-top-[10vh] -left-[25vw] h-[45vh] w-[20vw]' },
  { src: '/images/imgCenterRight.webp', styleClass: 'left-[27.5vw] h-[25vh] w-[25vw]' },
  { src: '/images/imgBottom2.webp', styleClass: 'top-[27.5vh] left-[5vw] h-[25vh] w-[20vw]' },
  { src: '/images/imgBottom1.webp', styleClass: 'top-[27.5vh] -left-[22.5vw] h-[25vh] w-[30vw]' },
  { src: '/images/imgBottom3.webp', styleClass: 'top-[25.5vh] left-[27.5vw] w-[20vw] aspect-[16/9]' },
];

const testimonialsData = [
  {
    author: { name: "Marcus Chen", role: "Powerlifter — 1,500lb Total", stars: 5 },
    text: "IronPulse showed me patterns in my training I never would have found on my own. Added 80lbs to my total in 6 months."
  },
  {
    author: { name: "Sarah Volkov", role: "CrossFit Competitor", stars: 5 },
    text: "The workout logger is insanely fast. I can log a full session in under a minute between sets. Nothing else comes close."
  },
  {
    author: { name: "Derek Osei", role: "Bodybuilder — NPC Competitor", stars: 5 },
    text: "The body metrics tracking paired with volume analytics helped me dial in my prep. I came in 8lbs heavier and leaner than last year."
  },
  {
    author: { name: "Elena Rostova", role: "Olympic Weightlifter", stars: 5 },
    text: "Finally an intelligence platform that understands structured percentage work. Changed how I approach my peak phases forever."
  },
  {
    author: { name: "James Holden", role: "Functional Fitness Coach", stars: 5 },
    text: "I moved all my clients over. The UI is sleek, the data is deep, and it gets out of your way when you're on the floor."
  }
];

export default function Landing() {
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll();
  const bgOpacity = useTransform(scrollYProgress, [0.38, 0.45], [0, 0.4]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <div className="relative min-h-screen bg-transparent font-sans">
      <MetaTags 
        title="IronPulse | Elite Cybernetic Fitness Protocol" 
        description="Experience the next generation of training. IronPulse merges raw iron with cyberpunk analytics."
      />
      {/* Persistent Background Image (appears as parallax completes) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.img 
          src="/images/imgCenter.webp" 
          alt="Background"
          className="w-full h-full object-cover"
          style={{ 
            opacity: bgOpacity,
            filter: "brightness(0.35) contrast(1.2)" 
          }}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center backdrop-blur-sm border-b border-white/5 bg-background/20 hidden md:flex">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-sm shadow-[0_0_10px_#39FF14]" />
          <h1 className="text-2xl font-display font-bold uppercase tracking-widest text-glow">Iron<span className="text-primary">Pulse</span></h1>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-foreground/80 hover:text-primary font-medium transition-colors">Login</Link>
          <Link href="/register" className="px-5 py-2 bg-primary text-black font-bold uppercase tracking-wider rounded-md hover:bg-primary/90 transition-all box-glow hidden sm:block">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
        {/* Responsive 3D Background */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="w-full h-full bg-black/40 animate-pulse" />}>
            {isMobile ? (
              <GymScene />
            ) : (
              <SplineScene
                scene="/scene.splinecode"
                className="w-full h-full object-cover"
              />
            )}
          </Suspense>
        </div>

        {/* Cinematic Backdrop Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20 z-[5] pointer-events-none" />

        <motion.div style={{ opacity: heroOpacity }} className="container px-6 mx-auto relative z-10 w-full flex items-center pointer-events-none">
          {/* Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, ease: "easeOut" }} 
            className="text-left w-full relative z-20 max-w-3xl pointer-events-auto"
          >
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-bold tracking-widest uppercase text-sm mb-6 box-glow">
              Elite Performance Analytics
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase leading-[0.9] tracking-tighter mb-6 text-glow">
              Track Like A <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Machine</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-lg mb-10 leading-relaxed drop-shadow-lg">
              Step into the future of strength training. IronPulse merges raw iron with cyberpunk analytics to give you absolute control over your physical evolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="group px-8 py-4 bg-primary text-black font-display font-bold text-xl uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-all box-glow flex items-center justify-center gap-2">
                Start Training <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/dashboard" className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-display font-bold text-xl uppercase tracking-widest rounded-lg hover:bg-white/10 transition-all flex items-center justify-center">
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>
      {/* Parallax Zoom Section */}
      {/* Parallax needs a clean background to scale up against. */}
      <section className="relative z-30">
        <ZoomParallax images={parallaxImages} />
      </section>

      {/* Post-Parallax Wrapper */}
      {/* This wrapper holds everything after parallax. We use z-40 so it slides OVER the parallax image as you scroll. */}
      <div className="relative w-full z-40">
        
        <div className="relative w-full -mt-[100vh]">
          {/* Section: Overview Stats */}
          <section className="relative py-32 px-6">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10%" }} className="max-w-5xl mx-auto text-center">
              <motion.div variants={fadeUp}>
                <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-widest mb-6 text-glow">
                  The <span className="text-primary">Operating System</span> For Your Body
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-16 px-6 py-4 rounded-xl backdrop-blur-md bg-black/40 border border-white/5 shadow-2xl shadow-black/50">
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
                  <div key={i} className="text-center p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-primary/50 transition-colors group">
                    <div className="text-4xl md:text-5xl font-display font-black text-primary mb-2 text-glow-small group-hover:scale-110 transition-transform">{stat.value}</div>
                    <div className="text-sm text-foreground font-bold uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* Section: Features Array */}
          <section className="relative bg-black/20 backdrop-blur-[2px] border-t border-white/5 py-32 px-6">
            <div className="max-w-7xl mx-auto">
              <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10%" }} className="text-center mb-20">
                <motion.div variants={fadeUp}>
                  <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-widest mb-4">Architect Your <span className="text-primary">Physique</span></h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Stop guessing. Start analyzing. Our platform provides the deep data insights needed to push past plateaus.</p>
                </motion.div>
              </motion.div>
              <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10%" }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    className="bg-card/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-primary/50 transition-all hover:bg-card/50 group relative overflow-hidden shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-14 h-14 bg-secondary/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10 border border-white/5 box-glow">
                      <feature.icon className="w-7 h-7 text-primary drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]" />
                    </div>
                    <h3 className="text-2xl font-display font-bold uppercase tracking-wider mb-3 relative z-10 text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed relative z-10">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Testimonials Section */}
          <TestimonialsSection 
            title="Operational Debrief" 
            description="Athletes who switched to IronPulse never look back. Hear from the operatives already exploiting the matrix." 
            testimonials={testimonialsData} 
            className="border-t border-white/5 bg-black/40"
          />

          {/* Call to Action */}
          <section className="relative bg-gradient-to-t from-black to-transparent py-40 px-6 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto text-center relative z-20">
              <div className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent font-bold tracking-widest uppercase text-sm mb-6 box-glow">
                System Initialized
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter mb-6 text-glow">
                Ready To <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Evolve</span>?
              </h2>
              <p className="text-muted-foreground text-lg md:text-2xl mb-12 max-w-2xl mx-auto drop-shadow-lg">
                Join thousands of athletes who have upgraded their training intelligence. Your physical potential is waiting.
              </p>
              <Link href="/register" className="group inline-flex items-center gap-3 px-12 py-5 bg-primary text-black font-display font-black text-2xl uppercase tracking-widest rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all box-glow">
                Initialize Protocol <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </section>

          {/* Footer */}
          <footer className="relative bg-black/90 backdrop-blur-2xl border-t border-white/10 py-12 px-6 z-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-5 h-5 bg-primary rounded shadow-[0_0_10px_#39FF14]" />
                <span className="font-display font-bold uppercase tracking-widest text-lg text-white">IronPulse</span>
                <span className="text-sm font-medium tracking-widest">© 2026</span>
              </div>
              <div className="flex gap-8 text-sm text-muted-foreground uppercase tracking-widest font-bold">
                <a href="#" className="hover:text-primary transition-colors">Manifesto</a>
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Contact</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
