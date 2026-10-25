import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface CyberHyperspeedProps {
  speed?: number;
  streakCount?: number;
  starCount?: number;
  className?: string;
}

export default function CyberHyperspeed({
  speed = 1.4,
  streakCount = 260,
  starCount = 650,
  className = "",
}: CyberHyperspeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060608, 0.0035);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 20;

    // 2. WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false, // Turn off MSAA for silky 60/120fps during scrolling
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap DPR to 1.5 to eliminate GPU rasterization stalls
      renderer.setClearColor(0x060608, 1);
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("[CyberHyperspeed] WebGL initialization failed", e);
      return;
    }

    // 3. Hyperspeed Light Streaks (Neon Green #39FF14 & Electric Cyan #00D4FF)
    const streakPositions = new Float32Array(streakCount * 6);
    const streakColors = new Float32Array(streakCount * 6);
    const streakSpeeds = new Float32Array(streakCount);

    const colorGreen = new THREE.Color(0.22, 1.0, 0.08); // #39FF14
    const colorCyan = new THREE.Color(0.0, 0.83, 1.0);  // #00D4FF
    const colorWhite = new THREE.Color(0.85, 1.0, 0.9);

    for (let i = 0; i < streakCount; i++) {
      const radius = 2.5 + Math.random() * 36;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.7; // elliptical tunnel shape
      const z = -Math.random() * 320;
      const length = 5 + Math.random() * 18;

      const idx = i * 6;
      streakPositions[idx] = x;
      streakPositions[idx + 1] = y;
      streakPositions[idx + 2] = z;

      streakPositions[idx + 3] = x;
      streakPositions[idx + 4] = y;
      streakPositions[idx + 5] = z + length;

      const pickColor = Math.random() > 0.45 ? colorGreen : (Math.random() > 0.25 ? colorCyan : colorWhite);
      streakColors[idx] = pickColor.r;
      streakColors[idx + 1] = pickColor.g;
      streakColors[idx + 2] = pickColor.b;
      streakColors[idx + 3] = pickColor.r * 0.15; // rear fade
      streakColors[idx + 4] = pickColor.g * 0.15;
      streakColors[idx + 5] = pickColor.b * 0.15;

      streakSpeeds[i] = (0.7 + Math.random() * 1.4) * speed;
    }

    const streakGeometry = new THREE.BufferGeometry();
    streakGeometry.setAttribute("position", new THREE.BufferAttribute(streakPositions, 3));
    streakGeometry.setAttribute("color", new THREE.BufferAttribute(streakColors, 3));

    const streakMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false, // Prevent depth-sorting overhead during motion
    });

    const streakLines = new THREE.LineSegments(streakGeometry, streakMaterial);
    scene.add(streakLines);

    // 4. Warp Starfield Particle Cloud
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 1 + Math.random() * 42;
      const angle = Math.random() * Math.PI * 2;
      starPositions[i3] = Math.cos(angle) * radius;
      starPositions[i3 + 1] = Math.sin(angle) * radius * 0.6;
      starPositions[i3 + 2] = -Math.random() * 350;

      const starCol = Math.random() > 0.5 ? colorCyan : colorGreen;
      starColors[i3] = starCol.r;
      starColors[i3 + 1] = starCol.g;
      starColors[i3 + 2] = starCol.b;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    // Custom circular soft glow texture for particles
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.35, "rgba(57,255,20,0.8)");
      grad.addColorStop(0.7, "rgba(0,212,255,0.25)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const starMaterial = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);

    // 5. Central Cyber Hex Horizon Ring
    const ringGeo = new THREE.RingGeometry(22, 22.3, 6);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x39ff14,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const hexRing = new THREE.Mesh(ringGeo, ringMat);
    hexRing.position.z = -120;
    scene.add(hexRing);

    // 6. Smooth Mouse & Inertial Scroll Physics
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let targetCameraZ = 20;

    let targetScrollMultiplier = 1.0;
    let smoothScrollMultiplier = 1.0;
    let lastScrollY = window.scrollY;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 4.5;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 3;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
      
      // Calculate smooth velocity boost without abrupt spikes
      const velocityBoost = Math.min(diff * 0.03, 1.4);
      targetScrollMultiplier = 1.0 + velocityBoost;

      // Gentle camera Z transition on scroll
      targetCameraZ = 20 - Math.min(currentScrollY * 0.03, 15);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 7. Resize Observer
    const handleResize = () => {
      if (!container || !renderer) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    // 8. 60/120fps Animation Loop with Safe Delta Time
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // Clamped delta to avoid frame jumping when browser handles scroll events
      const rawDelta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const delta = Math.min(Math.max(rawDelta, 0.005), 0.04);

      // Inertial decay: return smoothly to base speed
      targetScrollMultiplier = THREE.MathUtils.lerp(targetScrollMultiplier, 1.0, 0.04);
      smoothScrollMultiplier = THREE.MathUtils.lerp(smoothScrollMultiplier, targetScrollMultiplier, 0.08);

      const effectiveSpeed = speed * smoothScrollMultiplier;

      // Parallax camera lerp
      targetCameraX = THREE.MathUtils.lerp(targetCameraX, mouseX, 0.04);
      targetCameraY = THREE.MathUtils.lerp(targetCameraY, mouseY, 0.04);
      camera.position.x = targetCameraX;
      camera.position.y = targetCameraY;
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCameraZ, 0.05);
      camera.lookAt(0, 0, -100);

      // Slowly rotate hex ring
      hexRing.rotation.z += 0.0025;

      // Advance light streaks smoothly
      const posAttr = streakGeometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      for (let i = 0; i < streakCount; i++) {
        const idx = i * 6;
        const streakVelocity = streakSpeeds[i] * effectiveSpeed * 60 * delta;

        posArr[idx + 2] += streakVelocity;
        posArr[idx + 5] += streakVelocity;

        // Wrap around seamlessly
        if (posArr[idx + 2] > 25) {
          const radius = 2.5 + Math.random() * 36;
          const angle = Math.random() * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.7;
          const z = -300 - Math.random() * 50;
          const length = 5 + Math.random() * 18;

          posArr[idx] = x;
          posArr[idx + 1] = y;
          posArr[idx + 2] = z;

          posArr[idx + 3] = x;
          posArr[idx + 4] = y;
          posArr[idx + 5] = z + length;
        }
      }
      posAttr.needsUpdate = true;

      // Advance starfield particles smoothly
      const starAttr = starGeometry.attributes.position as THREE.BufferAttribute;
      const starArr = starAttr.array as Float32Array;

      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        starArr[i3 + 2] += effectiveSpeed * 32 * delta;

        if (starArr[i3 + 2] > 25) {
          const radius = 1 + Math.random() * 42;
          const angle = Math.random() * Math.PI * 2;
          starArr[i3] = Math.cos(angle) * radius;
          starArr[i3 + 1] = Math.sin(angle) * radius * 0.6;
          starArr[i3 + 2] = -320 - Math.random() * 40;
        }
      }
      starAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      streakGeometry.dispose();
      streakMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      particleTexture.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [speed, streakCount, starCount]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}
      style={{ 
        background: "#060608",
        transform: "translate3d(0, 0, 0)",
        willChange: "transform",
      }}
    />
  );
}
