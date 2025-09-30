import React from "react";

const LocationPopup = ({ location }) => {
  if (!location) return null;
  return (
    <div className="min-w-[220px] max-w-xs p-4 rounded-xl bg-white shadow-lg font-sans text-gray-900 leading-relaxed">
      <div className="font-semibold text-base mb-1">{location.locality || 'Unknown Location'}</div>
      <div className="flex items-center text-sm mb-1">
        <span className="text-gray-500 mr-1">Latitude:</span>
        <span className="font-medium">{location.coordinates.latitude}</span>
      </div>
      <div className="flex items-center text-sm">
        <span className="text-gray-500 mr-1">Longitude:</span>
        <span className="font-medium">{location.coordinates.longitude}</span>
      </div>
            <div className="flex items-center text-sm">
        <span className="text-gray-500 mr-1">Longitude:</span>
        <span className="font-medium">{location.coordinates.longitude}</span>
      </div>
            <div className="flex items-center text-sm">
        <span className="text-gray-500 mr-1">Longitude:</span>
        <span className="font-medium">{location.coordinates.longitude}</span>
      </div>
      {/* Future: Air pollution, trend, etc. */}
    </div>
  );
};

export default LocationPopup;
