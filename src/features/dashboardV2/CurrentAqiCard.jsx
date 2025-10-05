import React from "react";
import { aqiCategory } from "./utils";

export default function CurrentAqiCard({ aqi = 58, timestamp }) {
  const { label, colorClass } = aqiCategory(aqi);
  const currentTime = timestamp || new Date().toLocaleString();

  return (
    <div className="bg-white border border-blue-200 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-blue-600">Overall AQI</div>
          <div className="text-4xl font-extrabold text-blue-900">{aqi}</div>
          <div className="text-xs text-gray-500 mt-1">Updated: {currentTime}</div>
        </div>
        <span className={`px-3 py-1 rounded-md text-sm font-semibold ${colorClass}`}>
          {label}
        </span>
      </div>
    </div>
  );
}
