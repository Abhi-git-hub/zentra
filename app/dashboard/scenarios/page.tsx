/* c:\Users\hp\Desktop\Zentra\app\dashboard\scenarios\page.tsx */
"use client";

import React from "react";
import { motion } from "framer-motion";
import ScenarioCard from "@/components/ScenarioCard";

const PageEntrance = () => (
  <motion.div
    className="fixed inset-0 z-50 bg-black pointer-events-none"
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
  />
);

export default function ScenariosPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    },
  };

  const SCENARIOS = [
    {
      id: "covid-crash",
      name: "The COVID Crash",
      difficulty: "Beginner",
      context: "March 2020. Global markets are in freefall. Panic selling is at historic highs. VIX spiked to 82.69. The psychological pressure to liquidate everything is overwhelming.",
      accentColor: "#FF3B5C",
      glowShadowColor: "rgba(255, 59, 92, 0.15)",
      hoverGlowShadowColor: "rgba(255, 59, 92, 0.3)",
      sparklinePath: "M0,10 L20,12 L40,30 L60,25 L80,50 L100,45 L120,55 L140,50 L160,58 L180,53 L200,60",
      stats: [
        { label: "Drops", value: "-34%" },
        { label: "Vol", value: "82.6" },
        { label: "Trend", value: "Panic" }
      ]
    },
    {
      id: "bull-rally",
      name: "The Bull Rally",
      difficulty: "Intermediate",
      context: "November 2020. Vaccine announcements trigger massive gap-ups. Everything you look at is turning green. The FOMO is intense and you feel left behind.",
      accentColor: "#00C896",
      glowShadowColor: "rgba(0, 200, 150, 0.15)",
      hoverGlowShadowColor: "rgba(0, 200, 150, 0.3)",
      sparklinePath: "M0,50 L20,48 L40,30 L60,35 L80,10 L100,15 L120,5 L140,10 L160,2 L180,7 L200,0",
      stats: [
        { label: "Gains", value: "+45%" },
        { label: "Vol", value: "22.4" },
        { label: "Trend", value: "FOMO" }
      ]
    },
    {
      id: "choppy-market",
      name: "The Choppy Market",
      difficulty: "Expert",
      context: "Mid 2022. No clear direction. Fake breakouts followed by harsh rejections. The market is hunting stop-losses. This is where traders bleed out from a thousand cuts.",
      accentColor: "#7B6EF6",
      glowShadowColor: "rgba(123, 110, 246, 0.15)",
      hoverGlowShadowColor: "rgba(123, 110, 246, 0.3)",
      sparklinePath: "M0,30 L20,10 L40,50 L60,20 L80,45 L100,15 L120,55 L140,25 L160,40 L180,20 L200,30",
      stats: [
        { label: "Range", value: "Sideways" },
        { label: "Vol", value: "45.1" },
        { label: "Trend", value: "Chop" }
      ]
    }
  ] as const;

  return (
    <>
      <PageEntrance />
      <main className="w-full min-h-screen bg-[#000000] pt-[140px] pb-[80px] lg:pt-[160px] lg:pb-[120px] px-[5%] lg:px-[8%]">
        
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[1400px] mx-auto text-center mb-[80px] pt-10"
        >
          <div className="uppercase font-bold tracking-[0.2em] text-[12px] text-[#00C896] mb-4">
            Simulations
          </div>
          <h1 className="text-white text-[52px] font-bold tracking-[-1px] mb-4">
            Trading Scenarios
          </h1>
          <p className="text-[rgba(255,255,255,0.5)] text-[18px] max-w-[600px] mx-auto">
            Choose your psychological battleground. Each scenario tests a distinct weakness.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div 
          className="flex flex-col xl:flex-row gap-6 max-w-[1400px] mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {SCENARIOS.map((scenario) => (
            <motion.div key={scenario.id} variants={itemVariants} className="flex-1 w-full max-w-[500px] xl:max-w-none mx-auto">
              <ScenarioCard {...scenario} />
            </motion.div>
          ))}
        </motion.div>
        
      </main>
    </>
  );
}
