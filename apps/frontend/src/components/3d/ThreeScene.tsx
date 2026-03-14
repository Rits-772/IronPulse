import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, PerspectiveCamera } from '@react-three/drei';
import type { Mesh, Group } from 'three';

interface PlateProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  color: string;
}

function AbstractPlate({ position, rotation, scale = 1, color }: PlateProps) {
  const mesh = useRef<Mesh>(null);
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh} position={position} rotation={rotation} scale={scale}>
        <torusGeometry args={[1, 0.2, 16, 64]} />
        <meshStandardMaterial 
          color={color || "#222"} 
          metalness={0.9} 
          roughness={0.2}
          emissive={color === "#39FF14" ? "#39FF14" : "#000"}
          emissiveIntensity={color === "#39FF14" ? 0.5 : 0}
        />
      </mesh>
    </Float>
  );
}

function EnergyLines() {
  const linesRef = useRef<Group>(null);
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.position.z = (state.clock.elapsedTime * 2) % 10;
    }
  });
  const lines = useRef(
    [...Array(20)].map((_, i) => ({
      key: i,
      position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 40 - 20] as [number, number, number],
      height: Math.random() * 5 + 2,
      color: Math.random() > 0.5 ? "#39FF14" : "#00D4FF",
    }))
  ).current;

  return (
    <group ref={linesRef}>
      {lines.map((line) => (
        <mesh key={line.key} position={line.position}>
          <cylinderGeometry args={[0.02, 0.02, line.height, 8]} />
          <meshBasicMaterial color={line.color} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function ScrollCamera() {
  const { camera } = useThree();
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame(() => {
    const targetZ = 8 - scrollRef.current * 6;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.position.y += (scrollRef.current * 2 - camera.position.y) * 0.03;
  });

  return null;
}

export default function ThreeScene() {
  return (
    <Canvas shadows gl={{ failIfMajorPerformanceCaveat: false }}>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <ScrollCamera />
      <color attach="background" args={['#060608']} />
      <fog attach="fog" args={['#060608', 5, 25]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" castShadow />
      <pointLight position={[-5, -2, -5]} intensity={50} color="#39FF14" distance={20} />
      <pointLight position={[5, 5, -10]} intensity={40} color="#00D4FF" distance={20} />
      <AbstractPlate position={[-3, 1, -2]} rotation={[Math.PI/4, Math.PI/4, 0]} scale={1.5} color="#2a2a2a" />
      <AbstractPlate position={[4, -1, -5]} rotation={[-Math.PI/6, Math.PI/3, 0]} scale={2} color="#151515" />
      <AbstractPlate position={[-2, -2, -8]} rotation={[0, Math.PI/2, 0]} scale={2.5} color="#39FF14" />
      <AbstractPlate position={[2, 3, -12]} rotation={[Math.PI/2, 0, 0]} scale={1.2} color="#111" />
      <EnergyLines />
      <Sparkles count={300} scale={20} size={1.5} speed={0.4} opacity={0.2} color="#ffffff" />
    </Canvas>
  );
}
