
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
// All map-related imports belong here

const MapView = ({ locations, onMarkerClick }) => (
  <MapContainer center={[37.8, -96]} zoom={4} style={{ height: "100%", width: "100%" }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <MarkerClusterGroup>
      {locations.map((loc) =>
        loc.coordinates ? (
          <Marker
            key={loc.id || `${loc.coordinates.latitude},${loc.coordinates.longitude}`}
            position={[loc.coordinates.latitude, loc.coordinates.longitude]}
            eventHandlers={{
              click: () => onMarkerClick(loc),
            }}
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
);

export default MapView;
