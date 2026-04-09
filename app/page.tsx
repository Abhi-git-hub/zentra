"use client";

import React from "react";
import dynamic from "next/dynamic";

// Lazy-load the entire 3D scene — no SSR for WebGL
const AtriumScene = dynamic(
  () => import("@/components/atrium/AtriumScene"),
  { ssr: false }
);

export default function LandingPage() {
  return <AtriumScene />;
}
