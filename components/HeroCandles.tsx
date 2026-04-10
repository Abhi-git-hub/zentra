"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const HeroCandle = ({
  x,
  open,
  close,
  high,
  low,
}: {
  x: number;
  open: number;
  close: number;
  high: number;
  low: number;
}) => {
  const isUp = close >= open;
  const color = isUp ? "#22c55e" : "#ef4444";
  const bodyHeight = Math.max(Math.abs(close - open), 0.2);
  const bodyY = (close + open) / 2;
  const wickHeight = high - low;
  const wickY = (high + low) / 2;
  const emissiveIntensity = 0.5;

  return (
    <group position={[x, 0, 0]}>
      {/* Body */}
      <mesh position={[0, bodyY, 0]}>
        <boxGeometry args={[0.5, bodyHeight, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} emissive={color} emissiveIntensity={emissiveIntensity} />
      </mesh>
      {/* Wick */}
      <mesh position={[0, wickY, 0]}>
        <cylinderGeometry args={[0.03, 0.03, wickHeight, 8]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} emissive={color} emissiveIntensity={emissiveIntensity} />
      </mesh>
    </group>
  );
};

const HeroScene = ({ data }: { data: any[] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group position={[0, -5, 0]}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={2} />
      <pointLight position={[0, 15, 0]} intensity={3} color="#22c55e" />
      
      <group ref={groupRef}>
        {data.map((d, i) => (
          <HeroCandle key={i} x={(i - data.length / 2) * 0.8} {...d} />
        ))}
      </group>
    </group>
  );
};

export const HeroCandles = () => {
  // Generate 20 fake beautiful candles
  const data = useMemo(() => {
    let currentPrice = 10;
    const items = [];
    for (let i = 0; i < 20; i++) {
        const change = (Math.random() - 0.4) * 2;
        const open = currentPrice;
        const close = currentPrice + change;
        const high = Math.max(open, close) + Math.random() * 1.5;
        const low = Math.min(open, close) - Math.random() * 1.5;
        items.push({ open, close, high, low });
        currentPrice = close;
    }
    return items;
  }, []);

  return (
    <Canvas camera={{ position: [0, 8, 20], fov: 40 }} dpr={[1, 2]}>
      <HeroScene data={data} />
    </Canvas>
  );
};

export default HeroCandles;
