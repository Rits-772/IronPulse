import { useState, useEffect, lazy, Suspense } from 'react';

function CSSFallbackBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none"
      style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(57,255,20,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 30%, rgba(0,212,255,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, rgba(57,255,20,0.04) 0%, transparent 40%),
          linear-gradient(180deg, #060608 0%, #0a0a12 50%, #060608 100%)
        `
      }}
    >
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(57,255,20,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(57,255,20,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 animate-pulse"
        style={{ background: 'radial-gradient(circle, rgba(57,255,20,0.15) 0%, transparent 70%)' }}
      />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full opacity-15 animate-pulse"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)', animationDelay: '1s' }}
      />
    </div>
  );
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

const ThreeScene = lazy(() => import('./ThreeScene'));

export default function GymScene() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglSupported(checkWebGLSupport());
  }, []);

  if (webglSupported === null || !webglSupported) {
    return <CSSFallbackBackground />;
  }

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#0a0a0f] overflow-hidden pointer-events-none">
      <Suspense fallback={<CSSFallbackBackground />}>
        <ThreeScene />
      </Suspense>
    </div>
  );
}
