"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

interface DataPoint {
  date: string;
  value: number;
}

/* ─── 3D Line with Glow ──────────────────────────────────────── */
const PortfolioLine = ({ data, isNeon }: { data: DataPoint[]; isNeon: boolean }) => {
  const meshRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Line>(null);

  const { points, isPositive, color, colorObj } = useMemo(() => {
    if (!data || data.length < 2) return { points: [], isPositive: true, color: "#22c55e", colorObj: new THREE.Color("#22c55e") };

    const minVal = Math.min(...data.map((d) => d.value));
    const maxVal = Math.max(...data.map((d) => d.value));
    const range = maxVal - minVal || 1;
    const width = data.length * 0.5;

    const pts = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width - width / 2;
      const y = ((d.value - minVal) / range) * 6;
      return new THREE.Vector3(x, y, 0);
    });

    const positive = data[data.length - 1].value >= data[0].value;
    const c = positive ? "#22c55e" : "#ef4444";
    return { points: pts, isPositive: positive, color: c, colorObj: new THREE.Color(c) };
  }, [data]);

  useFrame((state) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  if (points.length < 2) return null;

  const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.5);
  const tubeGeo = new THREE.TubeGeometry(curve, 128, 0.06, 8, false);
  const glowTubeGeo = isNeon ? new THREE.TubeGeometry(curve, 128, 0.2, 8, false) : null;

  return (
    <group ref={meshRef}>
      {/* Main line */}
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Neon glow tube */}
      {isNeon && glowTubeGeo && (
        <mesh geometry={glowTubeGeo}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Data point spheres */}
      {points.filter((_, i) => i % Math.max(1, Math.floor(data.length / 12)) === 0 || i === data.length - 1).map((pt, i) => (
        <mesh key={i} position={pt}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1}
          />
        </mesh>
      ))}

      {/* Floor grid */}
      <gridHelper
        args={[points.length * 0.6, 20]}
        position={[0, -0.5, 0]}
        rotation={[0, 0, 0]}
      >
        <meshBasicMaterial attach="material" color="var(--border-glass)" opacity={0.1} transparent />
      </gridHelper>
    </group>
  );
};

/* ─── Scene ──────────────────────────────────────────────────── */
const Scene = ({ data, isNeon }: { data: DataPoint[]; isNeon: boolean }) => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 15, 10]} intensity={1} />
      <pointLight position={[0, 8, 5]} intensity={1.5} color={data.length > 1 && data[data.length - 1].value >= data[0].value ? "#22c55e" : "#ef4444"} />
      <PortfolioLine data={data} isNeon={isNeon} />
    </>
  );
};

/* ─── Main Export ────────────────────────────────────────────── */
export const PortfolioChart3D = ({ data }: { data: DataPoint[] }) => {
  const { theme } = useTheme();
  const isNeon = theme === "neon";

  if (!data || data.length < 2) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ color: "var(--text-secondary)" }}>
        <p className="text-sm opacity-60">No portfolio data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 5, 14], fov: 40 }} dpr={[1, 1.5]}>
        <Scene data={data} isNeon={isNeon} />
        <OrbitControls
          enablePan={false}
          minDistance={6}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
};

export default PortfolioChart3D;
