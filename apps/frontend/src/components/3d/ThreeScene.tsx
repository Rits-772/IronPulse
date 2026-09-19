import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Sparkles } from "@react-three/drei";
import { useRef, useEffect, useMemo, memo } from "react";

/* ---------------- CAMERA SCROLL ---------------- */

function ScrollCamera() {
  const { camera } = useThree();
  const scrollRef = useRef(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          scrollRef.current = max > 0 ? window.scrollY / max : 0;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    const targetZ = 8 - scrollRef.current * 70;
    const targetY = scrollRef.current * 1.5;

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.06);
  });

  return null;
}

/* ---------------- GYM OBJECTS ---------------- */

const GymTunnelObjects = memo(() => {
  const group = useRef<THREE.Group>(null);

  const plates = useMemo(() => {
    const items = [];
    for (let i = 0; i < 20; i++) {
      const z = -i * 6;
      items.push(
        <mesh key={"l" + i} position={[-5.5, (i % 3) * 0.4 - 0.5, z]}>
          <torusGeometry args={[1.1, 0.22, 12, 32]} />
          <meshStandardMaterial
            color="#141418"
            metalness={0.85}
            roughness={0.3}
          />
        </mesh>
      );

      items.push(
        <mesh key={"r" + i} position={[5.5, ((i + 1) % 3) * 0.4 - 0.5, z]}>
          <torusGeometry args={[1.1, 0.22, 12, 32]} />
          <meshStandardMaterial
            color="#141418"
            metalness={0.85}
            roughness={0.3}
          />
        </mesh>
      );
    }
    return items;
  }, []);

  useFrame(() => {
    if (!group.current) return;
    const children = group.current.children;
    for (let i = 0; i < children.length; i++) {
      children[i].rotation.x += 0.003;
      children[i].rotation.y += 0.004;
    }
  });

  return <group ref={group}>{plates}</group>;
});

GymTunnelObjects.displayName = "GymTunnelObjects";

/* ---------------- FLOOR ENERGY LINES ---------------- */

const EnergyFloor = memo(() => {
  const lines = useMemo(() => {
    const items = [];
    for (let i = -8; i <= 8; i++) {
      items.push(
        <mesh key={i} position={[i * 1.0, -2.5, -50]}>
          <boxGeometry args={[0.04, 0.02, 120]} />
          <meshBasicMaterial color="#39FF14" />
        </mesh>
      );
    }
    return items;
  }, []);

  return <group>{lines}</group>;
});

EnergyFloor.displayName = "EnergyFloor";

/* ---------------- SIDE RAILS ---------------- */

const SideRails = memo(() => {
  return (
    <group>
      <mesh position={[-4.5, -2.3, -50]}>
        <boxGeometry args={[0.08, 0.04, 120]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>

      <mesh position={[4.5, -2.3, -50]}>
        <boxGeometry args={[0.08, 0.04, 120]} />
        <meshBasicMaterial color="#39FF14" />
      </mesh>
    </group>
  );
});

SideRails.displayName = "SideRails";

/* ---------------- SCENE ---------------- */

export default function ThreeScene() {
  return (
    <Canvas
      gl={{ antialias: false, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 50 }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

      <ScrollCamera />

      <color attach="background" args={["#060608"]} />
      <fog attach="fog" args={["#060608", 10, 75]} />

      <ambientLight intensity={0.4} />
      <pointLight position={[0, 4, 4]} intensity={8} color="#39FF14" />

      <GymTunnelObjects />
      <EnergyFloor />
      <SideRails />

      <Sparkles
        count={80}
        scale={25}
        size={1.2}
        speed={0.2}
        opacity={0.25}
        color="#39FF14"
      />
    </Canvas>
  );
}