"use client";

import React, { useState } from "react";
import { CandleData } from "./CandleChart3D";
import { CandleChart3D } from "./CandleChart3D";
import { CandleChart2D } from "./CandleChart2D";
import { AreaChart } from "./AreaChart";
import { Mountain3DChart } from "./Mountain3DChart";
import { motion } from "framer-motion";

export type ChartType = "3D Candles" | "2D Candles" | "Area" | "Mountain";

export const CHART_TYPES: ChartType[] = ["3D Candles", "2D Candles", "Area", "Mountain"];

interface ChartSwitcherProps {
  data: CandleData[];
  externalType?: ChartType;
  onTypeChange?: (type: ChartType) => void;
}

export const ChartSwitcher = ({ data, externalType, onTypeChange }: ChartSwitcherProps) => {
  const [internalSelected, setInternalSelected] = useState<ChartType>("3D Candles");
  
  const selectedType = externalType || internalSelected;

  const handleTypeChange = (t: ChartType) => {
    if (!externalType) setInternalSelected(t);
    onTypeChange?.(t);
  };

  const renderChart = () => {
    switch (selectedType) {
      case "3D Candles": return <CandleChart3D data={data} />;
      case "2D Candles": return <CandleChart2D data={data} />;
      case "Area": return <AreaChart data={data} />;
      case "Mountain": return <Mountain3DChart data={data} />;
      default: return <CandleChart3D data={data} />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* If externalType is not provided, render internal toggle buttons */}
      {!externalType && (
        <div className="absolute top-4 right-4 z-10 flex gap-2 p-1 bg-[var(--bg-glass)] border border-[var(--border-glass)] backdrop-blur-md rounded-full">
          {CHART_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                selectedType === type ? "text-white" : "text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              {selectedType === type && (
                <motion.div
                  layoutId="chartTabIndicator"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{type}</span>
            </button>
          ))}
        </div>
      )}
      
      <div className="flex-1 w-full relative">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartSwitcher;
