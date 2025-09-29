
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue in React
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const API_BASE = "http://localhost:8080";






function App() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Fetch all locations with coordinates (adjust limit as needed)
    axios
      .get(`${API_BASE}/oa/locations`, {
        params: {
          limit: 1000,
          page: 1,
        },
      })
      .then((res) => {
        setLocations((res.data && res.data.results) ? res.data.results.filter(l => l.coordinates) : []);
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer center={[37.8, -96]} zoom={4} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MarkerClusterGroup>
          {locations.map((loc, idx) =>
            loc.coordinates ? (
              <Marker
                key={loc.id || `${loc.coordinates.latitude},${loc.coordinates.longitude}`}
                position={[loc.coordinates.latitude, loc.coordinates.longitude]}
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
}

export default App;