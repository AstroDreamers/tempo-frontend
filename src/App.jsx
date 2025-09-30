

import React, { useEffect, useState, useRef } from "react";
import { fetchLocations } from "./api/locations";

import MapView from "./components/MapView";
import LocationSidebar from "./components/LocationSidebar";



function App() {
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
      mapRef.current.setView([
        loc.coordinates.latitude,
        loc.coordinates.longitude
      ], 12, { animate: true });
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
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
    </div>
  );
}

export default App;