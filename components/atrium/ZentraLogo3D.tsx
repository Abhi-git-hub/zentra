"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

/* ─── Orbiting Particle Streams ──────────────────────────────────── */
const ParticleStreams = ({ count = 300 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 5;
      const y = (Math.random() - 0.5) * 8;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      spd[i] = 0.15 + Math.random() * 0.5;
      sz[i] = 0.02 + Math.random() * 0.04;
    }
    return { positions: pos, speeds: spd, sizes: sz };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const posArr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const x = posArr[i * 3];
      const z = posArr[i * 3 + 2];
      const angle = Math.atan2(z, x) + delta * speeds[i];
      const radius = Math.sqrt(x * x + z * z);
      posArr[i * 3] = Math.cos(angle) * radius;
      posArr[i * 3 + 2] = Math.sin(angle) * radius;
      posArr[i * 3 + 1] += Math.sin(angle * 3) * delta * 0.08;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#22c55e"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/* ─── Energy Ring ────────────────────────────────────────────────── */
const EnergyRing = ({ radius = 3.5, speed = 0.5 }: { radius?: number; speed?: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshBasicMaterial
        color="#22c55e"
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

/* ─── The Z-Arrow Logo Shape ─────────────────────────────────────── */
const createZShape = (): THREE.Shape => {
  const s = new THREE.Shape();
  s.moveTo(-1.8, 1.8);
  s.lineTo(1.8, 1.8);
  s.lineTo(-0.8, 0.15);
  s.lineTo(1.8, 0.15);
  s.lineTo(1.8, -0.15);
  s.lineTo(-1.8, -0.15);
  s.lineTo(0.8, -1.8);
  s.lineTo(-1.8, -1.8);
  s.lineTo(-1.8, -1.5);
  s.lineTo(0.2, -1.5);
  s.lineTo(-1.8, 0.15);
  s.lineTo(-1.8, 1.8);
  return s;
};

/* ─── Main 3D Logo Component ─────────────────────────────────────── */
export const ZentraLogo3D = () => {
  const groupRef = useRef<THREE.Group>(null);
  const emeraldRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);

  const shape = useMemo(() => createZShape(), []);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = useMemo(
    () => ({
      depth: 1.2,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.1,
      bevelSegments: 6,
    }),
    []
  );

  const geometry = useMemo(
    () => new THREE.ExtrudeGeometry(shape, extrudeSettings),
    [shape, extrudeSettings]
  );

  const upperClip = useMemo(() => [new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.1)], []);
  const lowerClip = useMemo(() => [new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.1)], []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.12;

    pulseRef.current += delta;
    if (emeraldRef.current) {
      const mat = emeraldRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.6 + Math.sin(pulseRef.current * 1.5) * 0.4;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, 3.5, 0]}>
        {/* Upper half — Luminous Emerald Crystal */}
        <mesh ref={emeraldRef} geometry={geometry} castShadow>
          <meshStandardMaterial
            color="#0f5132"
            roughness={0.08}
            metalness={0.9}
            emissive="#22c55e"
            emissiveIntensity={0.6}
            clippingPlanes={upperClip}
            clipShadows
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Lower half — Brushed Hematite Metal */}
        <mesh geometry={geometry} castShadow>
          <meshStandardMaterial
            color="#1c1c1e"
            roughness={0.7}
            metalness={0.95}
            emissive="#1c1c1e"
            emissiveIntensity={0.05}
            clippingPlanes={lowerClip}
            clipShadows
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner glow point light */}
        <pointLight
          position={[0, 1.5, 0.6]}
          color="#22c55e"
          intensity={8}
          distance={12}
          decay={2}
        />

        {/* Energy rings */}
        <EnergyRing radius={3} speed={0.3} />
        <EnergyRing radius={4} speed={-0.2} />
        <EnergyRing radius={5} speed={0.15} />

        {/* Orbiting particles */}
        <ParticleStreams count={300} />
      </group>
    </Float>
  );
};

export default ZentraLogo3D;
