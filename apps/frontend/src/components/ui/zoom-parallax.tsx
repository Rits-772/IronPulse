'use client';

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
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);
  const centerOpacity = useTransform(scrollYProgress, [0.7, 1], [1, 0.2]);
  const brightnessFilter = useTransform(
  scrollYProgress,
  [0, 0.6, 1],
  [
    "brightness(1)",     // normal
    "brightness(1)",     // still normal before fade
    "brightness(0.5)"    // fade happens here
  ]
);
  // Adjust scales array so center image gets scale4 (if it's the first image)
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} className="relative h-[300vh] w-full bg-[#060608]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {images.map(({ src, alt, styleClass }, index) => {
          const scale = scales[index % scales.length];
          const isCenter = index === 0;
          
          return (
            <motion.div
              key={index}
              style={{ 
                scale,
                opacity: isCenter ? centerOpacity : 1,
              }}
              className="absolute top-0 flex h-full w-full items-center justify-center pointer-events-none"
            >
              <div className={`relative shadow-2xl shadow-primary/10 transition-all duration-700 pointer-events-auto ${styleClass || 'h-[25vh] w-[25vw]'}`}>
                <motion.img
                  src={src || '/placeholder.svg'}
                  alt={alt || `Parallax image ${index + 1}`}
                  className="h-full w-full object-cover rounded-md border border-white/5"
                  style={{
                    filter: isCenter ? brightnessFilter : undefined,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
