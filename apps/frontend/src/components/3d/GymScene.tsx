import { useState, useEffect, lazy, Suspense } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

function CSSFallbackBackground() {
  return (
    <div
      className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none"
      style={{
        background: `
          radial-gradient(ellipse at 20% 40%, rgba(57,255,20,0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 60%, rgba(0,212,255,0.06) 0%, transparent 60%),
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

const ThreeScene = lazy(() => import("./ThreeScene"));

export default function GymScene() {
  const isMobile = useIsMobile();
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglSupported(checkWebGLSupport());
  }, []);

  // On mobile devices, always use ultra-fast, zero-overhead CSS background
  if (isMobile || webglSupported === null || !webglSupported) {
    return <CSSFallbackBackground />;
  }

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#060608] pointer-events-none">
      <Suspense fallback={<CSSFallbackBackground />}>
        <ThreeScene />
      </Suspense>
    </div>
  );
}