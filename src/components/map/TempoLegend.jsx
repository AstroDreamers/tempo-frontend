
import React from "react";

// TEMPO NO₂ scientific color scale: purple → blue → green → yellow → orange → red
const GRADIENT = "linear-gradient(90deg, #6a1b9a 0%, #1976d2 20%, #43a047 40%, #fbc02d 60%, #fb8c00 80%, #c62828 100%)";
const TICKS = [
  { label: "Low", value: "1e15", color: "#6a1b9a" },
  { label: "", value: "", color: "#1976d2" },
  { label: "Medium", value: "5e15", color: "#43a047" },
  { label: "", value: "", color: "#fbc02d" },
  { label: "High", value: "1e16+", color: "#c62828" }
];

const TempoLegend = () => (
  <div className="bg-gradient-to-br from-white/60 via-blue-100/40 to-blue-200/30 backdrop-blur-lg border border-blue-300 shadow-2xl rounded-2xl px-6 py-4 flex flex-col items-start min-w-[180px] max-w-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
    <div className="flex items-center gap-3 mb-3">
      <span className="w-2 h-7 bg-gradient-to-b from-blue-500 to-blue-300 rounded-full"></span>
      <div>
        <div className="text-blue-800 font-semibold text-lg tracking-tight">TEMPO NO₂</div>
        <div className="text-xs text-gray-500 font-medium leading-tight">molecules/cm² · North America</div>
      </div>
    </div>
    <div className="w-full flex flex-col gap-2">
      <div className="w-full h-6 rounded-lg relative mb-4 border border-blue-200 shadow" style={{ background: GRADIENT }}>
        {/* Tick marks below the bar */}
        <div className="absolute left-0 w-full flex justify-between" style={{ top: '110%' }}>
          <span className="text-xs text-gray-700 font-semibold" style={{ minWidth: 32 }}>Low</span>
          <span className="text-xs text-gray-700 font-semibold">Medium</span>
          <span className="text-xs text-gray-700 font-semibold" style={{ minWidth: 32, textAlign: 'right' }}>High</span>
        </div>
        {/* Removed numeric value labels as requested */}
      </div>
    </div>
  </div>
);

export default TempoLegend;
