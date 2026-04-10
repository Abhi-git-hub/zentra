"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Grid } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

export type CandleData = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

/* ─── Single Candle ──────────────────────────────────────────── */
const Candle = ({
  data,
  index,
  themeType,
  totalCandles,
}: {
  data: CandleData & { _original?: CandleData };
  index: number;
  themeType: string | undefined;
  totalCandles: number;
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isUp = data.close >= data.open;
  const upColor = themeType === "neon" ? "#00ff94" : "#22c55e";
  const downColor = themeType === "neon" ? "#ff2d55" : "#ef4444";
  const color = isUp ? upColor : downColor;

  const bodyHeight = Math.max(Math.abs(data.close - data.open), 0.15);
  const bodyY = (data.close + data.open) / 2;
  const wickHeight = data.high - data.low;
  const wickY = (data.high + data.low) / 2;

  // Adaptive spacing based on candle count
  const spacing = totalCandles > 30 ? 0.8 : totalCandles > 15 ? 1.0 : 1.2;
  const bodyWidth = totalCandles > 30 ? 0.5 : totalCandles > 15 ? 0.65 : 0.8;
  const x = (index - totalCandles / 2) * spacing;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetY = mounted ? (hovered ? 1.1 : 1) : 0;
    const targetXZ = hovered ? 1.1 : 1;
    meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, targetY, 6, delta);
    meshRef.current.scale.x = THREE.MathUtils.damp(meshRef.current.scale.x, targetXZ, 6, delta);
    meshRef.current.scale.z = THREE.MathUtils.damp(meshRef.current.scale.z, targetXZ, 6, delta);
  });

  const emissiveIntensity = hovered ? 1.0 : (themeType === "neon" ? 0.5 : 0.2);
  const orig = data._original || data;

  return (
    <group
      ref={meshRef}
      position={[x, 0, 0]}
      scale={[1, 0, 1]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Body */}
      <mesh position={[0, bodyY, 0]}>
        <boxGeometry args={[bodyWidth, bodyHeight, bodyWidth]} />
        <meshStandardMaterial
          color={color}
          roughness={0.15}
          metalness={0.7}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Wick */}
      <mesh position={[0, wickY, 0]}>
        <cylinderGeometry args={[0.04, 0.04, wickHeight, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.6}
          emissive={color}
          emissiveIntensity={emissiveIntensity * 0.5}
        />
      </mesh>

      {/* Neon glow */}
      {themeType === "neon" && (
        <pointLight position={[0, data.high + 1.5, 0]} distance={6} intensity={1.5} color={color} />
      )}

      {/* Tooltip */}
      {hovered && (
        <Html position={[0, data.high + 1.5, 0]} center zIndexRange={[100, 0]}>
          <div
            className="px-3 py-2.5 text-xs w-40 shadow-xl pointer-events-none rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-glass)",
              backdropFilter: "blur(20px)",
              color: "var(--text-primary)",
            }}
          >
            <div className="font-bold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              {orig.date}
            </div>
            <div className="flex justify-between"><span style={{ color: "var(--text-secondary)" }}>O</span> <span>{orig.open.toFixed(2)}</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-secondary)" }}>H</span> <span>{orig.high.toFixed(2)}</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-secondary)" }}>L</span> <span>{orig.low.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold" style={{ color }}><span>C</span> <span>{orig.close.toFixed(2)}</span></div>
          </div>
        </Html>
      )}
    </group>
  );
};

/* ─── Scene ──────────────────────────────────────────────────── */
const Scene = ({ data, themeType }: { data: CandleData[]; themeType: string | undefined }) => {
  const normalizedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const minLow = Math.min(...data.map((d) => d.low));
    const maxHigh = Math.max(...data.map((d) => d.high));
    const range = maxHigh - minLow || 1;
    const targetRange = 15;

    return data.map((d) => ({
      ...d,
      open: ((d.open - minLow) / range) * targetRange + 2,
      close: ((d.close - minLow) / range) * targetRange + 2,
      high: ((d.high - minLow) / range) * targetRange + 2,
      low: ((d.low - minLow) / range) * targetRange + 2,
      _original: d,
    }));
  }, [data]);

  const gridCellColor = themeType === "neon" ? "#1a3a2a" : themeType === "light" ? "#e5e5e5" : "#1a1a1f";
  const gridSecColor = themeType === "neon" ? "#0d4d2d" : themeType === "light" ? "#d4d4d8" : "#2a2a30";

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} />
      <directionalLight position={[-5, 10, -5]} intensity={0.3} color="#6366f1" />

      {normalizedData.map((d, i) => (
        <Candle
          key={i}
          data={d}
          index={i}
          themeType={themeType}
          totalCandles={data.length}
        />
      ))}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} depthWrite={false} />
      </mesh>

      <Grid
        position={[0, 0.01, 0]}
        args={[80, 80]}
        cellSize={1}
        cellThickness={1}
        cellColor={gridCellColor}
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor={gridSecColor}
        fadeDistance={35}
      />
    </>
  );
};

/* ─── Main Export ────────────────────────────────────────────── */
export const CandleChart3D = ({ data }: { data: CandleData[] }) => {
  const { theme } = useTheme();
  const [interacting, setInteracting] = useState(false);
  const interactTimeout = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = () => {
    setInteracting(true);
    if (interactTimeout.current) clearTimeout(interactTimeout.current);
  };

  const handlePointerUp = () => {
    if (interactTimeout.current) clearTimeout(interactTimeout.current);
    interactTimeout.current = setTimeout(() => setInteracting(false), 4000);
  };

  // Dynamic camera position based on candle count
  const cameraZ = data.length > 30 ? 28 : data.length > 15 ? 24 : 20;

  return (
    <div
      className="w-full h-full select-none"
      style={{ minHeight: "100%", aspectRatio: "16/9" }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas
        camera={{ position: [0, 12, cameraZ], fov: 45 }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene data={data} themeType={theme} />
        <OrbitControls
          enablePan
          minDistance={8}
          maxDistance={45}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate={!interacting}
          autoRotateSpeed={0.3}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
};

export default CandleChart3D;
