
// import React from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import MarkerClusterGroup from "react-leaflet-markercluster";


// const MapView = ({ locations, onMarkerClick }) => (
//   <MapContainer center={[37.8, -96]} zoom={4} style={{ height: "100%", width: "100%" }}>
//     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//     <MarkerClusterGroup>
//       {locations.map((loc) =>
//         loc.coordinates ? (
//           <Marker
//             key={loc.id || `${loc.coordinates.latitude},${loc.coordinates.longitude}`}
//             position={[loc.coordinates.latitude, loc.coordinates.longitude]}
//             eventHandlers={{
//               click: () => onMarkerClick(loc),
//             }}
//           >
//             <Popup>
//               <div>
//                 <strong>Location:</strong> {loc.locality || "Unknown"}
//                 <br />
//                 <strong>Lat:</strong> {loc.coordinates.latitude}
//                 <br />
//                 <strong>Lon:</strong> {loc.coordinates.longitude}
//               </div>
//             </Popup>
//           </Marker>
//         ) : null
//       )}
//     </MarkerClusterGroup>
//   </MapContainer>
// );

// export default MapView;




import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

import TempoImageLayer from "./TempoImageLayer";
import TempoLegend from "./TempoLegend";
import TempoNO2Popup from "./TempoNO2Popup";


const MapView = ({ locations, onMarkerClick }) => {

  const [showTempo, setShowTempo] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      {/* Options button in top right above sidebar */}
      <div className="absolute z-[1100] top-4 left-16 flex flex-row items-start space-x-4">
        {/* Options Dropdown */}
        <div ref={dropdownRef} className="flex flex-col items-start">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 border border-blue-200"
            style={{ fontWeight: 600, letterSpacing: '0.02em' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Options
          </button>
          {dropdownOpen && (
            <div
              className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] p-2"
            >
              <label className="flex items-center cursor-pointer px-2 py-1 hover:bg-gray-100 rounded">
                <input
                  type="checkbox"
                  checked={showTempo}
                  onChange={() => setShowTempo((v) => !v)}
                  className="mr-2 accent-blue-600"
                />
                TEMPO Satellite Layer
              </label>
              {/* Add more options here in the future */}
            </div>
          )}
        </div>
      </div>
      {/* Tempo Legend in bottom right */}
      {showTempo && (
        <div className="absolute bottom-4 right-4 z-[1100]">
          <TempoLegend />
        </div>
      )}
      <MapContainer center={[37.8, -96]} zoom={4} style={{ height: "100%", width: "100%" }}>
        <TempoNO2Popup showTempo={showTempo} />
        {/* base map */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* TEMPO overlay (semi-transparent) */}
        <TempoImageLayer visible={showTempo} opacity={0.6} />

        {/* your OpenAQ markers */}
        <MarkerClusterGroup>
          {locations.map((loc) =>
            loc.coordinates ? (
              <Marker
                key={loc.id || `${loc.coordinates.latitude},${loc.coordinates.longitude}`}
                position={[loc.coordinates.latitude, loc.coordinates.longitude]}
                eventHandlers={{ click: () => onMarkerClick(loc) }}
              >
                <Popup>
                  <div>
                    <strong>Location:</strong> {loc.locality || "Unknown"}
                    <br />
                    <strong>Lat:</strong> {loc.coordinates.latitude}
                    <br />
                    <strong>Lon:</strong> {loc.coordinates.longitude}
                  </div>
                </Popup>
              </Marker>
            ) : null
          )}
        </MarkerClusterGroup>
      </MapContainer>
  {/* Legend is now beside the options button above */}
    </div>
  );
};

export default MapView;
