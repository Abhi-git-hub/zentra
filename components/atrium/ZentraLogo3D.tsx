"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

/* ─── Orbiting Particle Streams ──────────────────────────────────── */
const ParticleStreams = ({ count = 200 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 4;
      const y = (Math.random() - 0.5) * 6;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      spd[i] = 0.2 + Math.random() * 0.5;
    }
    return { positions: pos, speeds: spd };
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
      // Gentle vertical bob
      posArr[i * 3 + 1] += Math.sin(angle * 3) * delta * 0.1;
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
      />
    </points>
  );
};

/* ─── The Z-Arrow Logo Shape ─────────────────────────────────────── */
const createZShape = (): THREE.Shape => {
  const s = new THREE.Shape();
  // A stylized "Z" arrow pointing upward-right, then down-right
  // Scaled to roughly -2 to +2 on both axes
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

  // Split geometry into upper (emerald) and lower (hematite) halves
  // We achieve this by rendering two meshes with clipping planes
  const upperClip = useMemo(() => [new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.1)], []);
  const lowerClip = useMemo(() => [new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.1)], []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Elegant slow rotation
    groupRef.current.rotation.y += delta * 0.15;

    // Emerald internal pulse
    pulseRef.current += delta;
    if (emeraldRef.current) {
      const mat = emeraldRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.6 + Math.sin(pulseRef.current * 1.5) * 0.3;
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

        {/* Orbiting particles */}
        <ParticleStreams />
      </group>
    </Float>
  );
};

export default ZentraLogo3D;
