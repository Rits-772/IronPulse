import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface CyberHyperspeedProps {
  speed?: number;
  streakCount?: number;
  starCount?: number;
  className?: string;
}

export default function CyberHyperspeed({
  speed = 1.6,
  streakCount = 280,
  starCount = 700,
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
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x060608, 1);
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("[CyberHyperspeed] WebGL not supported, falling back to CSS", e);
      return;
    }

    // 3. Hyperspeed Light Streaks (Neon Green #39FF14 & Electric Cyan #00D4FF)
    const streakPositions = new Float32Array(streakCount * 6); // 2 vertices per line (start, end)
    const streakColors = new Float32Array(streakCount * 6);
    const streakSpeeds = new Float32Array(streakCount);

    const colorGreen = new THREE.Color(0.22, 1.0, 0.08); // #39FF14
    const colorCyan = new THREE.Color(0.0, 0.83, 1.0);  // #00D4FF
    const colorWhite = new THREE.Color(0.9, 1.0, 0.95);

    for (let i = 0; i < streakCount; i++) {
      const radius = 2 + Math.random() * 38;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.7; // elliptical tunnel
      const z = -Math.random() * 320;
      const length = 4 + Math.random() * 16;

      const idx = i * 6;
      streakPositions[idx] = x;
      streakPositions[idx + 1] = y;
      streakPositions[idx + 2] = z;

      streakPositions[idx + 3] = x;
      streakPositions[idx + 4] = y;
      streakPositions[idx + 5] = z + length;

      // Color selection
      const pickColor = Math.random() > 0.45 ? colorGreen : (Math.random() > 0.3 ? colorCyan : colorWhite);
      streakColors[idx] = pickColor.r;
      streakColors[idx + 1] = pickColor.g;
      streakColors[idx + 2] = pickColor.b;
      streakColors[idx + 3] = pickColor.r * 0.2; // fade towards rear
      streakColors[idx + 4] = pickColor.g * 0.2;
      streakColors[idx + 5] = pickColor.b * 0.2;

      streakSpeeds[i] = (0.7 + Math.random() * 1.5) * speed;
    }

    const streakGeometry = new THREE.BufferGeometry();
    streakGeometry.setAttribute("position", new THREE.BufferAttribute(streakPositions, 3));
    streakGeometry.setAttribute("color", new THREE.BufferAttribute(streakColors, 3));

    const streakMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      linewidth: 2,
    });

    const streakLines = new THREE.LineSegments(streakGeometry, streakMaterial);
    scene.add(streakLines);

    // 4. Warp Starfield Particle Cloud
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 1 + Math.random() * 45;
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
      grad.addColorStop(0.3, "rgba(57,255,20,0.8)");
      grad.addColorStop(0.7, "rgba(0,212,255,0.3)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const starMaterial = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);

    // 5. Ambient Cyber Hex Horizon Ring
    const ringGeo = new THREE.RingGeometry(22, 22.3, 6); // Hexagonal ring
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x39ff14,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const hexRing = new THREE.Mesh(ringGeo, ringMat);
    hexRing.position.z = -120;
    scene.add(hexRing);

    // 6. Interactive Mouse & Scroll Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let scrollSpeedMultiplier = 1;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 6;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 4;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      scrollSpeedMultiplier = 1 + Math.min(scrollY / 400, 2.5);
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

    // 8. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const currentSpeed = speed * scrollSpeedMultiplier;

      // Parallax camera lerp
      targetCameraX = THREE.MathUtils.lerp(targetCameraX, mouseX, 0.04);
      targetCameraY = THREE.MathUtils.lerp(targetCameraY, mouseY, 0.04);
      camera.position.x = targetCameraX;
      camera.position.y = targetCameraY;
      camera.lookAt(0, 0, -100);

      // Rotate hex ring slowly
      hexRing.rotation.z += 0.003;

      // Move light streaks
      const posAttr = streakGeometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      for (let i = 0; i < streakCount; i++) {
        const idx = i * 6;
        const streakVelocity = streakSpeeds[i] * currentSpeed * 60 * delta;

        posArr[idx + 2] += streakVelocity;
        posArr[idx + 5] += streakVelocity;

        // Wrap around when streak flies past camera
        if (posArr[idx + 2] > 25) {
          const radius = 2 + Math.random() * 38;
          const angle = Math.random() * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.7;
          const z = -300 - Math.random() * 50;
          const length = 4 + Math.random() * 16;

          posArr[idx] = x;
          posArr[idx + 1] = y;
          posArr[idx + 2] = z;

          posArr[idx + 3] = x;
          posArr[idx + 4] = y;
          posArr[idx + 5] = z + length;
        }
      }
      posAttr.needsUpdate = true;

      // Move starfield particles
      const starAttr = starGeometry.attributes.position as THREE.BufferAttribute;
      const starArr = starAttr.array as Float32Array;

      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        starArr[i3 + 2] += currentSpeed * 35 * delta;

        if (starArr[i3 + 2] > 25) {
          const radius = 1 + Math.random() * 45;
          const angle = Math.random() * Math.PI * 2;
          starArr[i3] = Math.cos(angle) * radius;
          starArr[i3 + 1] = Math.sin(angle) * radius * 0.6;
          starArr[i3 + 2] = -320 - Math.random() * 40;
        }
      }
      starAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

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
      style={{ background: "#060608" }}
    />
  );
}
