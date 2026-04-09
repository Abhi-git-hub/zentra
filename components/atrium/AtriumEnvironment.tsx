"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";

/* ─── Data Formations ────────────────────────────────────────────────
   Abstract columns in the background representing abstracted stock data.
   Uses InstancedMesh for performance. */
const DataFormations = ({ count = 80 }: { count?: number }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const { matrices, colors } = useMemo(() => {
    const m: THREE.Matrix4[] = [];
    const c: Float32Array = new Float32Array(count * 3);
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Spread columns in a wide arc behind the scene
      const angle = (i / count) * Math.PI * 0.8 - Math.PI * 0.4;
      const radius = 25 + Math.random() * 35;
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius - 10;
      const height = 1 + Math.random() * 12;

      dummy.position.set(x, height / 2, z);
      dummy.scale.set(0.3 + Math.random() * 0.5, height, 0.3 + Math.random() * 0.5);
      dummy.updateMatrix();
      m.push(dummy.matrix.clone());

      // Muted blue/purple tones
      const hue = 0.6 + Math.random() * 0.15;
      const sat = 0.3 + Math.random() * 0.3;
      const light = 0.08 + Math.random() * 0.12;
      color.setHSL(hue, sat, light);
      c[i * 3] = color.r;
      c[i * 3 + 1] = color.g;
      c[i * 3 + 2] = color.b;
    }
    return { matrices: m, colors: c };
  }, [count]);

  React.useEffect(() => {
    if (!mesh.current) return;
    matrices.forEach((mat, i) => mesh.current!.setMatrixAt(i, mat));
    mesh.current.instanceMatrix.needsUpdate = true;

    const colorAttr = new THREE.InstancedBufferAttribute(colors, 3);
    mesh.current.instanceColor = colorAttr;
  }, [matrices, colors]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.85} metalness={0.3} />
    </instancedMesh>
  );
};

/* ─── Concrete Walls ─────────────────────────────────────────────── */
const Walls = () => {
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 8, -55]} receiveShadow>
        <planeGeometry args={[120, 30]} />
        <meshStandardMaterial color="#1a1a1f" roughness={0.92} metalness={0.15} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-45, 8, -20]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[70, 30]} />
        <meshStandardMaterial color="#161619" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* Right wall */}
      <mesh position={[45, 8, -20]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[70, 30]} />
        <meshStandardMaterial color="#161619" roughness={0.95} metalness={0.1} />
      </mesh>
    </group>
  );
};

/* ─── Main Environment ───────────────────────────────────────────── */
export const AtriumEnvironment = () => {
  return (
    <group>
      {/* Obsidian reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <MeshReflectorMaterial
          mirror={0.35}
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={0.6}
          roughness={0.15}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0a0f"
          metalness={0.8}
        />
      </mesh>

      <Walls />
      <DataFormations />
    </group>
  );
};

export default AtriumEnvironment;
