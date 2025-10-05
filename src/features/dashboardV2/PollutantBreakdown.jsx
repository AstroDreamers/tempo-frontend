import React from "react";
import { calculateOverallAqi } from "./utils";

export default function PollutantBreakdown({ sensors = [] }) {
  const aqiData = calculateOverallAqi(sensors);
  const { allPollutants = [], dominantPollutant } = aqiData;
  
  // Define all possible pollutants with their display order
  const pollutantOrder = ['SO₂', 'NO₂', 'PM10', 'PM2.5', 'O₃', 'CO'];
  
  // Create a map of available pollutants
  const pollutantMap = {};
  allPollutants.forEach(p => {
    pollutantMap[p.pollutant] = p;
  });
  
  // Render individual pollutant cell
  const renderPollutantCell = (pollutantKey) => {
    const data = pollutantMap[pollutantKey];
    
    if (!data) {
      return (
        <div key={pollutantKey} className="text-center p-2">
          <div className="text-sm font-semibold text-gray-600 mb-1">{pollutantKey}</div>
          <div className="text-xs text-gray-400">—</div>
          <div className="text-xs text-gray-400">—</div>
        </div>
      );
    }
    
    const isDominant = data.pollutant === dominantPollutant;
    
    return (
      <div 
        key={pollutantKey} 
        className={`text-center p-2 rounded-lg transition-all ${
          isDominant 
            ? 'ring-2 ring-blue-500 bg-blue-50' 
            : 'bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <div className="text-sm font-semibold text-gray-700 mb-1">{data.pollutant}</div>
        <div className="text-xs text-gray-600 mb-1">
          {data.concentration.toFixed(1)} {data.unit}
        </div>
        <div className={`text-xs px-2 py-1 rounded-full ${data.category.colorClass}`}>
          {data.aqi}
        </div>
        {isDominant && (
          <div className="text-xs text-blue-600 font-semibold mt-1">← Dominant</div>
        )}
      </div>
    );
  };

  if (allPollutants.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Pollutant Breakdown</h3>
        <div className="text-center text-gray-500 py-4">
          No pollutant data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Pollutant Breakdown</h3>
      <div className="text-xs text-gray-600 mb-3">
        Live values and AQI contributions. The highest AQI determines overall air quality.
      </div>
      
      <div className="grid grid-cols-6 gap-2">
        {pollutantOrder.map(renderPollutantCell)}
      </div>
      
      {dominantPollutant && (
        <div className="mt-3 text-center">
          <div className="text-sm text-gray-600">
            Overall AQI is driven by <span className="font-semibold text-blue-600">{dominantPollutant}</span>
          </div>
        </div>
      )}
    </div>
  );
}
