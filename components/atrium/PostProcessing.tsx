"use client";

import React from "react";
import { EffectComposer, Bloom, SMAA } from "@react-three/postprocessing";

interface PostProcessingProps {
  bloomIntensity?: number;
}

export const PostProcessing = ({ bloomIntensity = 1.2 }: PostProcessingProps) => {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.3}
        luminanceSmoothing={0.9}
        intensity={bloomIntensity}
        mipmapBlur
      />
      <SMAA />
    </EffectComposer>
  );
};

export default PostProcessing;
