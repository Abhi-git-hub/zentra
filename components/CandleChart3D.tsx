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

// --- SINGLE CANDLE COMPONENT ---
const Candle = ({
  data,
  index,
  themeType,
  totalCandles,
}: {
  data: CandleData;
  index: number;
  themeType: string | undefined;
  totalCandles: number;
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isUp = data.close >= data.open;
  // Fallbacks if css vars aren't read properly (although we pass exact colors below)
  const color = isUp ? "#22c55e" : "#ef4444"; 

  // Dimensions
  const bodyHeight = Math.max(Math.abs(data.close - data.open), 0.1);
  const bodyY = (data.close + data.open) / 2;
  const wickHeight = data.high - data.low;
  const wickY = (data.high + data.low) / 2;
  
  // Position along X axis, centered
  const spacing = 1.2;
  const x = (index - totalCandles / 2) * spacing;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Scale-up on mount (Y axis spring to 1)
    const targetScaleY = mounted ? (hovered ? 1.15 : 1) : 0;
    const targetScaleXZ = hovered ? 1.15 : 1;
    
    // Use damp string-like behavior
    meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, targetScaleY, 6, delta);
    meshRef.current.scale.x = THREE.MathUtils.damp(meshRef.current.scale.x, targetScaleXZ, 6, delta);
    meshRef.current.scale.z = THREE.MathUtils.damp(meshRef.current.scale.z, targetScaleXZ, 6, delta);
  });

  const emissiveIntensity = hovered ? 0.8 : 0.2;

  return (
    <group 
      ref={meshRef} 
      position={[x, 0, 0]} 
      scale={[1, 0, 1]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Candle Body */}
      <mesh position={[0, bodyY, 0]}>
        <boxGeometry args={[0.8, bodyHeight, 0.8]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.2} 
          metalness={0.6} 
          emissive={color} 
          emissiveIntensity={emissiveIntensity} 
        />
      </mesh>
      
      {/* Candle Wick */}
      <mesh position={[0, wickY, 0]}>
        <cylinderGeometry args={[0.05, 0.05, wickHeight, 8]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.2} 
          metalness={0.6}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Neon Point Light */}
      {themeType === "neon" && (
        <pointLight position={[0, data.high + 2, 0]} distance={10} intensity={isUp ? 2 : 2.5} color={color} />
      )}

      {/* Tooltip */}
      {hovered && (
        <Html position={[0, data.high + 1, 0]} center zIndexRange={[100, 0]}>
          <div className="glass-card-base px-3 py-2 text-xs w-36 shadow-xl pointer-events-none" style={{ background: "rgba(0,0,0,0.8)" }}>
            <div className="text-[var(--text-secondary)] mb-1 font-bold">{(data as any)._original?.date || data.date}</div>
            <div className="flex justify-between"><span>O</span> <span>{((data as any)._original?.open || data.open).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>H</span> <span>{((data as any)._original?.high || data.high).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>L</span> <span>{((data as any)._original?.low || data.low).toFixed(2)}</span></div>
            <div className="flex justify-between font-bold"><span>C</span> <span>{((data as any)._original?.close || data.close).toFixed(2)}</span></div>
          </div>
        </Html>
      )}
    </group>
  );
};

// --- SCENE COMPONENT ---
const Scene = ({ data, themeType }: { data: CandleData[]; themeType: string | undefined }) => {
  const { theme } = useTheme();
  
  // Floor glowing plane
  const floorColor = theme === "neon" ? "rgba(0, 255, 148, 0.05)" : "rgba(34, 197, 94, 0.02)";

  // Normalize data so that it fits nicely around y=0 to y=20
  const normalizedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const minLow = Math.min(...data.map(d => d.low));
    const maxHigh = Math.max(...data.map(d => d.high));
    const range = maxHigh - minLow || 1;
    const targetRange = 15;
    
    return data.map(d => ({
      ...d,
      open: ((d.open - minLow) / range) * targetRange + 2,
      close: ((d.close - minLow) / range) * targetRange + 2,
      high: ((d.high - minLow) / range) * targetRange + 2,
      low: ((d.low - minLow) / range) * targetRange + 2,
      _original: d
    }));
  }, [data]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} />
      
      {normalizedData.map((d, i) => (
        <Candle 
          key={i} 
          data={d as any} 
          index={i} 
          themeType={themeType} 
          totalCandles={data.length}
        />
      ))}

      {/* Glowing horizontal plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color={floorColor} transparent opacity={0.5} depthWrite={false} />
      </mesh>

      {/* Grid helper */}
      <Grid 
        position={[0, 0, 0]} 
        args={[100, 100]} 
        cellSize={1} 
        cellThickness={1} 
        cellColor={theme === "light" ? "#e5e5e5" : "#262626"} 
        sectionSize={5} 
        sectionThickness={1.5} 
        sectionColor={theme === "light" ? "#d4d4d8" : "#3f3f46"} 
        fadeDistance={40} 
      />
    </>
  );
};

// --- MAIN COMPONENT EXPORT ---
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
    interactTimeout.current = setTimeout(() => {
      setInteracting(false);
    }, 4000);
  };

  return (
    <div 
      className="w-full h-full min-h-[500px] select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas camera={{ position: [0, 12, 22], fov: 45 }}>
        <Scene data={data} themeType={theme} />
        <OrbitControls 
          enablePan={false} 
          minDistance={8} 
          maxDistance={35} 
          maxPolarAngle={Math.PI / 2.2} 
          autoRotate={!interacting} 
          autoRotateSpeed={0.4} 
        />
      </Canvas>
    </div>
  );
};

export default CandleChart3D;
