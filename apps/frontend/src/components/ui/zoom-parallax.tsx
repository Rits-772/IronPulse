import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export interface ParallaxImage {
  src: string;
  alt?: string;
  styleClass?: string;
  isCenter?: boolean;
}

interface ZoomParallaxProps {
  images: ParallaxImage[];
  onComplete?: () => void;
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Center image scales from 0.25 (thumbnail size) up to 1.0 (full screen native 4K)
  // This completely eliminates GPU texture magnification blur and tearing!
  const centerScale = useTransform(scrollYProgress, [0, 1], [0.25, 1.0]);

  // Outer images scale from 1 up to outer boundaries
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 4.5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 5.5]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 7.0]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 8.5]);

  const outerScales = [scale5, scale6, scale8, scale5, scale6, scale9];

  return (
    <div ref={container} className="relative h-[300vh] w-full bg-[#060608]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {images.map(({ src, alt, styleClass }, index) => {
          const isCenter = index === 0;

          if (isCenter) {
            return (
              <motion.div
                key={index}
                style={{ scale: centerScale }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none transform-gpu will-change-transform z-10"
              >
                <div className="relative w-screen h-screen pointer-events-auto flex items-center justify-center p-4">
                  <motion.img
                    src={src || '/placeholder.svg'}
                    alt={alt || "Central Protocol Overview"}
                    loading="eager"
                    decoding="sync"
                    className="w-full h-full object-cover rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.9)]"
                  />
                </div>
              </motion.div>
            );
          }

          const scale = outerScales[(index - 1) % outerScales.length];
          return (
            <motion.div
              key={index}
              style={{ scale }}
              className="absolute top-0 flex h-full w-full items-center justify-center pointer-events-none transform-gpu will-change-transform z-0"
            >
              <div className={`relative shadow-2xl shadow-black/80 pointer-events-auto ${styleClass || 'h-[25vh] w-[25vw]'}`}>
                <motion.img
                  src={src || '/placeholder.svg'}
                  alt={alt || `Parallax image ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover rounded-xl border border-white/10"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
