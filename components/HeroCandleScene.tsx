/* c:\Users\hp\Desktop\Zentra\components\HeroCandleScene.tsx */
"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Individual animated candle
const HeroCandle = ({ 
  index, 
  xPos, 
  isUp, 
  height, 
  delayMs 
}: { 
  index: number; 
  xPos: number; 
  isUp: boolean; 
  height: number; 
  delayMs: number 
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [started, setStarted] = useState(false);
  
  const color = isUp ? "#00C896" : "#FF3B5C";
  const bodyHeight = height;
  const wickHeight = height * 1.6; // Wicks scale natively

  useEffect(() => {
    const t = setTimeout(() => {
      setStarted(true);
    }, delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    
    // Scale and rise animation
    if (started) {
      meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, 1, 4, state.delta);
      const targetY = isUp ? bodyHeight * 0.2 : -bodyHeight * 0.1;
      meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 4, state.delta);
      
      // Material emissive pulse
      const pulse = 0.2 + (Math.sin(state.clock.elapsedTime * 2 + index) * 0.5 + 0.5) * 0.4;
      materialRef.current.emissiveIntensity = pulse;
    }
  });

  return (
    <group ref={meshRef} position={[xPos, -5, 0]} scale={[1, 0.001, 1]}>
      {/* Wick */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, wickHeight, 8]} />
        <meshStandardMaterial color={color} roughness={0.15} metalness={0.8} />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.35, bodyHeight, 0.35]} />
        <meshStandardMaterial 
          ref={materialRef}
          color={color} 
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.15} 
          metalness={0.8} 
        />
      </mesh>
    </group>
  );
};

// Particles flowing upward behind the chart
const DataFlowParticles = () => {
  const count = 200;
  const meshRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24; // x: -12 to 12
      pos[i * 3 + 1] = Math.random() * 13 - 5; // y: -5 to 8
      pos[i * 3 + 2] = -Math.random() * 6 - 2; // z: -8 to -2
    }
    return pos;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += 0.003;
      if (posArray[i * 3 + 1] > 8) {
        posArray[i * 3 + 1] = -5;
        posArray[i * 3] = (Math.random() - 0.5) * 24;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ffffff" transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
};

// Main Scene Holder
const SceneContent = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create 18 candles using alternating probability logic
  const candlesData = useMemo(() => {
    const numCandles = 18;
    const spacing = 1.2;
    const startX = -(numCandles * spacing) / 2;
    
    const data = [];
    let upStreak = 0;
    let downStreak = 0;
    
    for (let i = 0; i < numCandles; i++) {
      let isUp = Math.random() > 0.4; // 60% bias for green
      
      // Prevent more than 3 of same color
      if (upStreak >= 3) isUp = false;
      if (downStreak >= 3) isUp = true;
      
      if (isUp) { upStreak++; downStreak = 0; }
      else { downStreak++; upStreak = 0; }
      
      const height = 0.8 + Math.random() * 2.7;
      
      // Add a slight arc by offsetting Y based on distance from center
      const xObj = startX + i * spacing;
      const arcOffset = -Math.pow(xObj * 0.15, 2); 
      
      data.push({ x: xObj, isUp, height, arcY: arcOffset });
    }
    return data;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Cinematic breathing animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
      // Cinematic drift
      state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.08) * 1.5;
      state.camera.lookAt(0, 1, 0);
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} color="#0A0A15" />
      <pointLight position={[5, 10, 8]} color="#00C896" intensity={2.0} />
      <pointLight position={[-5, 5, 8]} color="#7B6EF6" intensity={1.0} />
      
      <group ref={groupRef}>
        <DataFlowParticles />
        {candlesData.map((c, i) => (
          <group key={i} position={[0, c.arcY, 0]}>
            <HeroCandle 
              index={i} 
              xPos={c.x} 
              isUp={c.isUp} 
              height={c.height} 
              delayMs={i * 120} 
            />
          </group>
        ))}
      </group>
    </>
  );
};

export default function HeroCandleScene() {
  return (
    <div 
      style={{
        position: "absolute",
        right: "5%",
        top: "50%",
        transform: "translateY(-50%)",
        width: "45%",
        height: "70vh",
        pointerEvents: "none",
        zIndex: 10
      }}
    >
      <Canvas camera={{ position: [0, 2, 18], fov: 45 }} dpr={[1, 1.5]}>
        <SceneContent />
      </Canvas>
    </div>
  );
}
