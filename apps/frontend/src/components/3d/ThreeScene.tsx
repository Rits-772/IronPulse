import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Sparkles } from "@react-three/drei";
import { useRef, useEffect } from "react";

/* ---------------- CAMERA SCROLL ---------------- */

function ScrollCamera() {
  const { camera } = useThree();
  const scroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    const targetZ = 8 - scroll.current * 80;
    const targetY = scroll.current * 2;

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.08);
  });

  return null;
}

/* ---------------- GYM OBJECTS ---------------- */

function GymTunnelObjects() {
  const group = useRef<THREE.Group>(null);

  const plates = [];

  for (let i = 0; i < 25; i++) {
    const z = -i * 6;

    plates.push(
      <mesh key={"l" + i} position={[-6, Math.random() * 2 - 1, z]}>
        <torusGeometry args={[1.2, 0.25, 16, 64]} />
        <meshStandardMaterial
          color="#111"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
    );

    plates.push(
      <mesh key={"r" + i} position={[6, Math.random() * 2 - 1, z]}>
        <torusGeometry args={[1.2, 0.25, 16, 64]} />
        <meshStandardMaterial
          color="#111"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
    );
  }

  useFrame(() => {
    if (!group.current) return;

    group.current.children.forEach((child) => {
      child.rotation.x += 0.002;
      child.rotation.y += 0.003;
    });
  });

  return <group ref={group}>{plates}</group>;
}

/* ---------------- FLOOR ENERGY LINES ---------------- */

function EnergyFloor() {
  const lines = [];

  for (let i = -12; i <= 12; i++) {
    lines.push(
      <mesh key={i} position={[i * 0.8, -2.5, -50]}>
        <boxGeometry args={[0.05, 0.02, 120]} />
        <meshBasicMaterial color="#39FF14" />
      </mesh>
    );
  }

  return <group>{lines}</group>;
}

/* ---------------- SIDE RAILS ---------------- */

function SideRails() {
  return (
    <group>
      <mesh position={[-4.5, -2.3, -50]}>
        <boxGeometry args={[0.1, 0.05, 120]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>

      <mesh position={[4.5, -2.3, -50]}>
        <boxGeometry args={[0.1, 0.05, 120]} />
        <meshBasicMaterial color="#39FF14" />
      </mesh>
    </group>
  );
}

/* ---------------- SCENE ---------------- */

export default function ThreeScene() {
  return (
    <Canvas
      gl={{ antialias: true }}
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 1.5]}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

      <ScrollCamera />

      <color attach="background" args={["#060608"]} />
      <fog attach="fog" args={["#060608", 10, 80]} />

      <ambientLight intensity={0.3} />

      <pointLight position={[0, 5, 5]} intensity={10} color="#39FF14" />

      <GymTunnelObjects />
      <EnergyFloor />
      <SideRails />

      <Sparkles
        count={180}
        scale={30}
        size={1.4}
        speed={0.25}
        opacity={0.25}
      />
    </Canvas>
  );
}