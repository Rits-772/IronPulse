import * as React from 'react';
import { cn } from '@/lib/utils';

type HexagonBackgroundProps = React.ComponentProps<'div'> & {
  hexagonProps?: React.ComponentProps<'div'>;
  hexagonSize?: number;
  hexagonMargin?: number;
};

function HexagonBackground({
  className,
  children,
  hexagonSize = 60,
  ...props
}: HexagonBackgroundProps) {
  // Ultra-lightweight GPU-accelerated SVG hexagon pattern with zero DOM node explosion
  const hexPatternSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${hexagonSize}" height="${Math.round(hexagonSize * 1.732)}" viewBox="0 0 60 103.92"><path d="M30 0 L60 17.32 L60 51.96 L30 69.28 L0 51.96 L0 17.32 Z M30 103.92 L60 86.6 L60 51.96 L30 69.28 L0 51.96 L0 86.6 Z" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1.2"/></svg>`;

  return (
    <div
      data-slot="hexagon-background"
      className={cn(
        'relative w-full min-h-screen overflow-x-hidden bg-background',
        className
      )}
      {...props}
    >
      {/* High performance hardware-accelerated grid layer */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-60 -z-10"
        style={{
          backgroundImage: `url('${hexPatternSvg}')`,
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center top',
        }}
      />
      {/* Ambient Cyberpunk Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(57,255,20,0.06),rgba(255,255,255,0))]" />
      {children}
    </div>
  );
}

export { HexagonBackground, type HexagonBackgroundProps };
