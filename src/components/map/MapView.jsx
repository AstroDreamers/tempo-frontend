




import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import TempoImageLayer from "./TempoImageLayer";
import TempoLegend from "./TempoLegend";
import TempoNO2Popup from "./TempoNO2Popup";
import PropTypes from "prop-types";

const MapView = ({ locations, onMarkerClick, mapRef }) => {
  const [showTempo, setShowTempo] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState("TEMPO_NO2");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Available TEMPO products. Fill `url` with the ImageServer endpoint for each product.
  // Only `TEMPO_NO2` is configured by default (used elsewhere in the app).
  const PRODUCTS = {
    TEMPO_NO2: {
      key: "TEMPO_NO2",
      label: "NO₂ (Tropospheric Vertical Column)",
      url: "https://gis.earthdata.nasa.gov/image/rest/services/C3685896708-LARC_CLOUD/TEMPO_NO2_L3_V04_HOURLY_TROPOSPHERIC_VERTICAL_COLUMN/ImageServer",
    },
    TEMPO_NO2_V03: {
      key: "TEMPO_NO2_V03",
      label: "NO₂ (v03)",
      url: "https://gis.earthdata.nasa.gov/image/rest/services/C2930763263-LARC_CLOUD/TEMPO_NO2_L3_V03_HOURLY_TROPOSPHERIC_VERTICAL_COLUMN/ImageServer",
    },
    TEMPO_O3: {
      key: "TEMPO_O3",
      label: "O₃ (Ozone)",
      url: "https://gis.earthdata.nasa.gov/image/rest/services/C3685896625-LARC_CLOUD/TEMPO_O3TOT_L3_V04_HOURLY_OZONE_COLUMN_AMOUNT/ImageServer",
    },
    TEMPO_O3_V03: {
      key: "TEMPO_O3_V03",
      label: "O₃ (v03)",
      url: "https://gis.earthdata.nasa.gov/image/rest/services/C2930764281-LARC_CLOUD/TEMPO_O3TOT_L3_V03_HOURLY_OZONE_COLUMN_AMOUNT/ImageServer",
    },
    TEMPO_HCHO: {
      key: "TEMPO_HCHO",
      label: "HCHO (Formaldehyde)",
      url: "https://gis.earthdata.nasa.gov/image/rest/services/C3685897141-LARC_CLOUD/TEMPO_HCHO_L3_V04_HOURLY_VERTICAL_COLUMN/ImageServer",
    },
    TEMPO_HCHO_V03: {
      key: "TEMPO_HCHO_V03",
      label: "HCHO (v03)",
      url: "https://gis.earthdata.nasa.gov/image/rest/services/C2930761273-LARC_CLOUD/TEMPO_HCHO_L3_V03_HOURLY_VERTICAL_COLUMN/ImageServer",
    },
  
  };

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

  // Attach mapRef to the Leaflet map instance and dispatch custom event on map click
  function SetMapRef() {
    const map = useMap();
    useEffect(() => {
      if (mapRef) mapRef.current = map;
      // Dispatch custom event to close location search suggestions
      const handleMapClick = () => {
        window.dispatchEvent(new Event('tempo-map-click'));
      };
      map.on('click', handleMapClick);
      return () => {
        map.off('click', handleMapClick);
      };
    }, [map]);
    return null;
  }

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      {/* Options button in top right above sidebar */}
      <div className="absolute z-[1100] top-4 left-16 flex flex-row items-start space-x-4">
        {/* Options Dropdown */}
        <div ref={dropdownRef} className="flex flex-col items-start relative">
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
              className="absolute z-[1200] left-0 top-12 bg-white/50 border border-gray-200 rounded-lg shadow-lg min-w-[180px] p-2"
              style={{ marginTop: 0 }}
            >
              <label className="flex items-center cursor-pointer px-2 py-1 rounded-lg bg-gradient-to-r from-blue-100/40 via-white/0 to-blue-200/30 hover:from-blue-200/60 hover:to-blue-300/40 transition-all" style={{ opacity: 0.85 }}>
                <input
                  type="checkbox"
                  checked={showTempo}
                  onChange={() => setShowTempo((v) => !v)}
                  className="mr-2 accent-blue-600"
                />
                <span className="text-gray-800 font-medium">TEMPO Satellite Layer</span>
              </label>
              {/* Product selector */}
              <div className="mt-2 px-2">
                <label className="text-xs text-gray-600 font-medium">Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full mt-1 p-2 rounded-md border border-gray-200 bg-white text-sm"
                >
                  {Object.values(PRODUCTS).map((p) => (
                    <option key={p.key} value={p.key} disabled={!p.url}>
                      {p.label}{p.url ? (p.requiresToken ? ' — (token required)' : '') : ' — (not configured)'}
                    </option>
                  ))}
                </select>
              </div>
              {/* Add more options here in the future */}
            </div>
          )}
        </div>
      </div>

      {/* Tempo Legend in top left, below options button with smooth transition */}
      <div
        className={`absolute z-[1100] bottom-10 right-3 transition-all duration-500 ${showTempo ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={{ transitionProperty: 'opacity, transform', willChange: 'opacity, transform' }}
      >
        <TempoLegend product={PRODUCTS[selectedProduct]} />
      </div>
      <MapContainer center={[37.8, -96]} zoom={4} style={{ height: "100%", width: "100%" }}>
        <SetMapRef />
  <TempoNO2Popup showTempo={showTempo} product={PRODUCTS[selectedProduct]} />
        {/* base map */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* TEMPO overlay (semi-transparent) with smooth transition */}
  <div className={`transition-all duration-500 ${showTempo ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`} style={{ transitionProperty: 'opacity, transform', willChange: 'opacity, transform', position: 'absolute', inset: 0, zIndex: 1000, pointerEvents: 'none' }}>
          {showTempo && (
            <TempoImageLayer visible={showTempo} opacity={0.6} url={PRODUCTS[selectedProduct]?.url} />
          )}
        </div>

        {/* your OpenAQ markers */}
        <MarkerClusterGroup>
          {locations.map((loc) =>
            loc.coordinates ? (
              <Marker
                key={loc.id || `${loc.coordinates.latitude},${loc.coordinates.longitude}`}
                position={[loc.coordinates.latitude,loc.coordinates.longitude]}
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
    </div>
  );
};

MapView.propTypes = {
  locations: PropTypes.array.isRequired,
  onMarkerClick: PropTypes.func.isRequired,
  mapRef: PropTypes.object
};

export default MapView;
