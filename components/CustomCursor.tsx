/* c:\Users\hp\Desktop\Zentra\components\CustomCursor.tsx */
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Check if hovering a clickable element
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const updateRing = () => {
      setRingPos((prev) => {
        // Lerp for smooth lag
        const lag = 0.12;
        const x = prev.x + (mousePos.x - prev.x) * lag;
        const y = prev.y + (mousePos.y - prev.y) * lag;
        return { x, y };
      });
      animationFrameId = requestAnimationFrame(updateRing);
    };
    
    updateRing();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  // If outside viewport early return nothing (or just hide it)
  if (mousePos.x === -100) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "6px",
            height: "6px",
            background: "#00C896",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      <motion.div
        animate={{
          width: isHovering ? 56 : 32,
          height: isHovering ? 56 : 32,
          backgroundColor: isHovering ? "rgba(0,200,150,0.1)" : "transparent",
        }}
        transition={{ duration: 0.2 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9998,
          border: "1px solid rgba(0, 200, 150, 0.6)",
          borderRadius: "50%",
          transform: `translate(calc(${ringPos.x}px - 50%), calc(${ringPos.y}px - 50%))`,
        }}
      />
    </>
  );
}
