

import React, { useEffect, useState, useRef } from "react";
import { fetchLocations } from "../api/locations";


import MapView from "../components/map/MapView";
import LocationSidebar from "../components/sidebar/LocationSidebar";
import LocationSearchBar from "../components/search/LocationSearchBar";
import ChatbotWindow from "../components/chatbot/ChatbotWindow";



function MapPage() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    fetchLocations()
      .then(setLocations)
      .catch(console.error);
  }, []);

  const handleMarkerClick = (loc) => {
    setSelectedLocation(loc);
  };

  const closeSidebar = () => {
    setSelectedLocation(null);
  };

  const handleZoomToLocation = (loc) => {
    if (mapRef.current && loc?.coordinates) {
      // Use a smooth pan and zoom animation
      mapRef.current.flyTo([
        loc.coordinates.latitude,
        loc.coordinates.longitude
      ], 12, { animate: true, duration: 1.5 });
    }
  };

  return (
    <div style={{ height: "calc(100vh - 3rem)", width: "100vw", position: "relative", marginTop: "3rem" }}>
      {/* Search bar in top center */}
      <div className="absolute z-[1200] top-3 sm:top-4 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto w-full max-w-lg sm:max-w-xs md:max-w-sm lg:max-w-md">
          <LocationSearchBar
            locations={locations}
            onSearch={handleZoomToLocation}
            onSelect={setSelectedLocation}
          />
        </div>
      </div>
      <MapView
        locations={locations}
        onMarkerClick={handleMarkerClick}
        mapRef={mapRef}
      />
      <LocationSidebar
        location={selectedLocation}
        onClose={closeSidebar}
        onZoomToLocation={handleZoomToLocation}
      />
      <ChatbotWindow />
    </div>
  );
}

export default MapPage;
