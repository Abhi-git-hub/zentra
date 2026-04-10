"use client";

import React, { useRef, useCallback, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { AtriumEnvironment } from "./AtriumEnvironment";
import { ZentraLogo3D } from "./ZentraLogo3D";
import { HolographicAuth } from "./HolographicAuth";
import { PostProcessing } from "./PostProcessing";
import { AtriumLoader } from "./AtriumLoader";

/* ─── Ambient Star Dust ───────────────────────────────────────────── */
const StarDust = ({ count = 500 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null);

  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = Math.random() * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const posArr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += delta * 0.05;
      if (posArr[i * 3 + 1] > 40) posArr[i * 3 + 1] = 0;
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
        size={0.08}
        color="#6366f1"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/* ─── Mouse Parallax Camera Rig ──────────────────────────────────── */
const CameraRig = () => {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 5, 18));
  const lookTarget = useRef(new THREE.Vector3(0, 3, 0));

  useFrame((state, delta) => {
    const px = state.pointer.x;
    const py = state.pointer.y;

    // Parallax offset with subtle breathing
    const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    target.current.x = THREE.MathUtils.lerp(target.current.x, px * 2, delta * 2);
    target.current.y = THREE.MathUtils.lerp(target.current.y, 5 + py * 1 + breathe, delta * 2);

    camera.position.lerp(target.current, delta * 3);
    
    lookTarget.current.x = px * 0.5;
    lookTarget.current.y = 3 + py * 0.3;
    camera.lookAt(lookTarget.current);
  });

  return null;
};

/* ─── Cinematic Lighting ─────────────────────────────────────────── */
const CinematicLighting = () => {
  return (
    <>
      <directionalLight
        position={[-15, 20, 10]}
        intensity={1.2}
        color="#8ba8ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />

      <directionalLight
        position={[12, 8, -5]}
        intensity={0.4}
        color="#a78bfa"
      />

      <spotLight
        position={[0, 18, 5]}
        angle={0.3}
        penumbra={0.8}
        intensity={3}
        color="#ffffff"
        castShadow
        target-position={[0, 3, 0]}
      />

      <spotLight
        position={[3, 12, 10]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        color="#93c5fd"
        target-position={[0, 3, 6]}
      />

      <ambientLight intensity={0.08} color="#1e1b4b" />

      <hemisphereLight
        args={["#1e1b4b", "#0a0a0f", 0.3]}
      />

      {/* Atmospheric fog */}
      <fog attach="fog" args={["#050510", 30, 100]} />
    </>
  );
};

/* ─── Inner Scene ────────────────────────────────────────────────── */
const InnerScene = () => {
  return (
    <>
      <CameraRig />
      <CinematicLighting />
      <AtriumEnvironment />
      <ZentraLogo3D />
      <HolographicAuth />
      <StarDust />
      <PostProcessing />
    </>
  );
};

/* ─── Main Exported Component ────────────────────────────────────── */
export const AtriumScene = () => {
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#050510" }}>
      <AtriumLoader onComplete={handleLoaded} />

      <Canvas
        gl={{
          antialias: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          localClippingEnabled: true,
        }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 5, 18], fov: 50, near: 0.1, far: 200 }}
        shadows
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease" }}
      >
        <Suspense fallback={null}>
          <InnerScene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default AtriumScene;
