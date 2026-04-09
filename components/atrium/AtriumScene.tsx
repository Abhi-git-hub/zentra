"use client";

import React, { useRef, useCallback, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { AtriumEnvironment } from "./AtriumEnvironment";
import { ZentraLogo3D } from "./ZentraLogo3D";
import { HolographicAuth } from "./HolographicAuth";
import { PostProcessing } from "./PostProcessing";
import { AtriumLoader } from "./AtriumLoader";

/* ─── Mouse Parallax Camera Rig ──────────────────────────────────── */
const CameraRig = () => {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 5, 18));
  const lookTarget = useRef(new THREE.Vector3(0, 3, 0));

  useFrame((state, delta) => {
    const px = state.pointer.x; // -1 to 1
    const py = state.pointer.y;

    // Parallax offset
    target.current.x = THREE.MathUtils.lerp(target.current.x, px * 2, delta * 2);
    target.current.y = THREE.MathUtils.lerp(target.current.y, 5 + py * 1, delta * 2);

    // Smooth camera follow
    camera.position.lerp(target.current, delta * 3);
    
    // Look-at with slight parallax
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
      {/* Key light — directional, warm-blue from upper-left */}
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

      {/* Fill light — subtle purple from the right */}
      <directionalLight
        position={[12, 8, -5]}
        intensity={0.4}
        color="#a78bfa"
      />

      {/* Spot on the logo */}
      <spotLight
        position={[0, 18, 5]}
        angle={0.3}
        penumbra={0.8}
        intensity={3}
        color="#ffffff"
        castShadow
        target-position={[0, 3, 0]}
      />

      {/* Spot on the auth panel */}
      <spotLight
        position={[3, 12, 10]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        color="#93c5fd"
        target-position={[0, 3, 6]}
      />

      {/* Ambient base — very low so shadows are rich */}
      <ambientLight intensity={0.08} color="#1e1b4b" />

      {/* Hemisphere for subtle top/bottom contrast */}
      <hemisphereLight
        args={["#1e1b4b", "#0a0a0f", 0.3]}
      />
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
          antialias: false, // SMAA handles this
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
