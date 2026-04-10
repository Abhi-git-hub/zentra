"use client";

import React from "react";
import { EffectComposer, Bloom, SMAA, Vignette } from "@react-three/postprocessing";

interface PostProcessingProps {
  bloomIntensity?: number;
}

export const PostProcessing = ({ bloomIntensity = 1.4 }: PostProcessingProps) => {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.25}
        luminanceSmoothing={0.9}
        intensity={bloomIntensity}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.7}
      />
      <SMAA />
    </EffectComposer>
  );
};

export default PostProcessing;
