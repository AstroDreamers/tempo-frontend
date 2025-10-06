import React from "react";
import CurrentAqiCard from "./CurrentAqiCard";
import AiInsight from "./AiInsight";
import MapView from "../../components/map/MapView";

export default function RightColumn({ 
  aqi, 
  aiInsight, 
  aiLoading = false,
  mapProps = {},
  className = ""
}) {
  return (
    <div className={`grid grid-rows-[auto_auto_minmax(0,1fr)] gap-5 min-h-[720px] ${className}`}>
      {/* AQI Card */}
      <CurrentAqiCard aqi={aqi} />
      
      {/* AI Insight */}
      <AiInsight insight={aiInsight} loading={aiLoading} />
      
      {/* Map */}
      <div className="min-h-0 bg-white border border-blue-200 rounded-xl overflow-hidden">
        <MapView 
          locations={mapProps.locations || []}
          onMarkerClick={mapProps.onMarkerClick}
          center={mapProps.center}
        />
      </div>
    </div>
  );
}
