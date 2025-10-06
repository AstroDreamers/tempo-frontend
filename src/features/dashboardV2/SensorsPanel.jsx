import React from "react";
import SensorChart from "./SensorChart";

export default function SensorsPanel({ sensors = [], cityName = "New York City", location, className = "" }) {
  return (
    <div className={`bg-white border border-blue-200 rounded-xl p-4 h-full flex flex-col ${className}`}>
      {/* Sticky header */}
      <div className="mb-4 sticky top-0 bg-white z-10 pb-2">
        <h3 className="font-semibold text-blue-800 text-sm">
          Sensors for {cityName}
        </h3>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {sensors.length > 0 ? (
          <ul className="space-y-2">
            {sensors.map((sensor, idx) => (
              <li key={sensor.id || idx}>
                <SensorChart
                  sensor={sensor}
                  location={location}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 text-sm p-3 text-center h-full flex items-center justify-center">
            No sensors available for this location
          </div>
        )}
      </div>
    </div>
  );
}
