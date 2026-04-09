"use client";

import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { CandleData } from "./CandleChart3D";

const Scene = ({ data }: { data: CandleData[] }) => {
  const { theme } = useTheme();

  // Create customized geometry
  const geometry = useMemo(() => {
    // Basic plane geometry: width based on length, depth fixed.
    const sections = data.length > 1 ? data.length - 1 : 1;
    const geometry = new THREE.PlaneGeometry(sections * 1.2, 10, sections, 10);
    
    // Displace vertices and set colors
    const colors = [];
    const positions = geometry.attributes.position.array as Float32Array;
    
    // We basically map X to the sections
    // Y is up/down displacement (Z in plane before rotation)
    // Z is depth (Y in plane before rotation)
    
    const minClose = Math.min(...data.map(d => d.close));
    const maxClose = Math.max(...data.map(d => d.close));
    const range = maxClose - minClose || 1;
    
    // For each vertex
    const vertexCount = positions.length / 3;
    const colorAttribute = new Float32Array(vertexCount * 3);
    
    const upColor = new THREE.Color("#22c55e");
    const downColor = new THREE.Color("#ef4444");
    
    for (let i = 0; i < vertexCount; i++) {
      const px = positions[i * 3];     // X
      const py = positions[i * 3 + 1]; // Z depth
      
      // Determine which data index this corresponds to roughly based on px
      const width = sections * 1.2;
      const normalizedX = (px + width / 2) / width;
      const dataIndexFloat = normalizedX * sections;
      const dataIndex = Math.floor(Math.min(sections, Math.max(0, dataIndexFloat)));
      
      const prevClose = data[Math.max(0, dataIndex - 1)].close;
      const currentClose = data[dataIndex].close;
      const normalizedPrice = ((currentClose - minClose) / range) * 15 + 2;
      
      // Displacement: if py > 0, it is the 'front/top' of the mountain, if py < 0 it goes down to zero
      const factor = (py + 5) / 10; // 0 to 1 based on depth
      const height = normalizedPrice * factor;
      
      positions[i * 3 + 2] = height; // Z becomes Y when rotated
      
      const isRising = currentClose >= prevClose;
      const c = isRising ? upColor : downColor;
      
      colorAttribute[i * 3] = c.r;
      colorAttribute[i * 3 + 1] = c.g;
      colorAttribute[i * 3 + 2] = c.b;
    }
    
    geometry.setAttribute("color", new THREE.BufferAttribute(colorAttribute, 3));
    geometry.computeVertexNormals();
    
    return geometry;
  }, [data]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} geometry={geometry}>
        <meshStandardMaterial 
          vertexColors 
          roughness={0.4} 
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

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

export const Mountain3DChart = ({ data }: { data: CandleData[] }) => {
  return (
    <div className="w-full h-full min-h-[500px] select-none">
      <Canvas camera={{ position: [0, 15, 20], fov: 45 }}>
        <Scene data={data} />
        <OrbitControls 
          enablePan={false} 
          minDistance={8} 
          maxDistance={35} 
          maxPolarAngle={Math.PI / 2.2} 
          autoRotate 
          autoRotateSpeed={0.5} 
        />
      </Canvas>
    </div>
  );
};

export default Mountain3DChart;
