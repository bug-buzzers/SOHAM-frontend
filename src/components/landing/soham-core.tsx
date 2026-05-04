'use client';

import { Float, MeshDistortMaterial, OrbitControls, Sparkles } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export type CoreMode = 'general' | 'chat' | 'pdf' | 'vision' | 'voice' | 'search';

function CoreMesh({ mode }: { mode: CoreMode }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);

  // All mode colors use blue variants matching --primary: 220 90% 56%
  const config = useMemo(() => {
    switch (mode) {
      case 'chat':
        return { scale: [1.15, 1.15, 1.15], color: '#3b82f6', emissive: '#1d4ed8' };
      case 'pdf':
        return { scale: [1.4, 0.86, 1.02],  color: '#60a5fa', emissive: '#2563eb' };
      case 'vision':
        return { scale: [1.35, 1.02, 0.78], color: '#93c5fd', emissive: '#3b82f6' };
      case 'voice':
        return { scale: [0.92, 1.44, 0.92], color: '#a5b4fc', emissive: '#4f46e5' };
      case 'search':
        return { scale: [1.24, 1.24, 0.86], color: '#7dd3fc', emissive: '#0284c7' };
      default:
        return { scale: [1.08, 1.08, 1.08], color: '#bfdbfe', emissive: '#3b82f6' };
    }
  }, [mode]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const shell = shellRef.current;
    if (!mesh || !shell) return;

    mesh.rotation.x += delta * 0.28;
    mesh.rotation.y += delta * 0.42;
    shell.rotation.x -= delta * 0.11;
    shell.rotation.y -= delta * 0.2;

    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.045;
    const targetMeshScale = new THREE.Vector3(...(config.scale as [number, number, number])).multiplyScalar(pulse);
    const targetShellScale = new THREE.Vector3(...(config.scale as [number, number, number])).multiplyScalar(1.22 + Math.sin(state.clock.elapsedTime * 1.2) * 0.03);

    mesh.scale.lerp(targetMeshScale, 0.08);
    shell.scale.lerp(targetShellScale, 0.08);
    mesh.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.12;
  });

  return (
    <group>
      <Float speed={2.2} rotationIntensity={0.25} floatIntensity={0.55}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.55, 24]} />
          <MeshDistortMaterial
            color={config.color}
            emissive={config.emissive}
            emissiveIntensity={1.4}
            metalness={0.28}
            roughness={0.08}
            clearcoat={1}
            clearcoatRoughness={0}
            distort={0.48}
            speed={2.4}
            transparent
            opacity={0.92}
          />
        </mesh>
      </Float>

      <mesh ref={shellRef}>
        <octahedronGeometry args={[2.2, 0]} />
        <meshBasicMaterial color={config.color} wireframe transparent opacity={0.22} />
      </mesh>

      <Sparkles
        count={120}
        scale={[6, 6, 6]}
        size={2.4}
        speed={0.45}
        color="#bfdbfe"
        opacity={0.85}
      />
    </group>
  );
}

export function SohamCore({ mode }: { mode: CoreMode }) {
  return (
    <div className="h-[380px] w-full">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.8], fov: 42 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[0, 0, 3]} intensity={20} color="#3b82f6" />
        <pointLight position={[-3, -2, -2]} intensity={14} color="#1d4ed8" />
        <CoreMesh mode={mode} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
      </Canvas>
    </div>
  );
}
