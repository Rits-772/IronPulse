import { useState, useEffect, lazy, Suspense } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

function CSSFallbackBackground() {
  return (
    <div
      className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none"
      style={{
        background: `
          radial-gradient(ellipse at 20% 40%, rgba(57,255,20,0.12) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 60%, rgba(0,212,255,0.08) 0%, transparent 60%),
          linear-gradient(180deg,#060608 0%,#0a0a14 50%,#060608 100%)
        `
      }}
    />
  );
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

const CyberHyperspeed = lazy(() => import("./CyberHyperspeed"));

export default function GymScene() {
  const isMobile = useIsMobile();
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglSupported(checkWebGLSupport());
  }, []);

  if (webglSupported === false) {
    return <CSSFallbackBackground />;
  }

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#060608] pointer-events-none overflow-hidden">
      <Suspense fallback={<CSSFallbackBackground />}>
        <CyberHyperspeed 
          speed={isMobile ? 1.2 : 1.8} 
          streakCount={isMobile ? 120 : 320} 
          starCount={isMobile ? 300 : 800} 
        />
      </Suspense>

      {/* Ambient Lighting Orbs referencing Full Stack Portfolio Hero */}
      <div className="absolute top-1/4 right-[12%] w-[420px] h-[420px] rounded-full bg-primary/10 blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-[8%] w-[480px] h-[480px] rounded-full bg-[#00D4FF]/10 blur-[160px] pointer-events-none" />

      {/* Cybernetic Subtle Hex Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.14]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(57,255,20,0.3) 1px, transparent 0)`,
          backgroundSize: '36px 36px'
        }}
      />
    </div>
  );
}
