import React, { useState } from "react";
import { Popup, useMapEvents } from "react-leaflet";

// This component shows an identify popup for the currently selected TEMPO product.
// `product` should be an object with { key, label, url } and `showTempo` toggles behavior.
const TempoNO2Popup = ({ showTempo, product = null }) => {
  const [popup, setPopup] = useState(null);
  useMapEvents({
    click: async (e) => {
      if (!showTempo) return;
      if (!product || !product.url) return;
      if (product.requiresToken) {
        const { lat, lng } = e.latlng;
        setPopup({ lat, lng, value: 'Token required for this product' });
        return;
      }
      // Ignore clicks on markers (Leaflet markers have class 'leaflet-marker-icon')
      if (e.originalEvent && e.originalEvent.target && e.originalEvent.target.classList) {
        if (e.originalEvent.target.classList.contains('leaflet-marker-icon')) return;
      }
      const { lat, lng } = e.latlng;
      const url = `${product.url.replace(/\/+$/,'')}/identify?f=json&geometry=${lng},${lat}&geometryType=esriGeometryPoint&sr=4326&returnGeometry=false&returnCatalogItems=false&returnPixelValues=true`;
      setPopup({ lat, lng, value: 'Loading...' });
      try {
        const res = await fetch(url);
        const data = await res.json();
        const value = data.value ?? (data.pixelValues && data.pixelValues[0]?.value);
        setPopup({ lat, lng, value: value !== undefined ? value : 'No data' });
      } catch {
        setPopup({ lat, lng, value: 'Error' });
      }
    },
  });
  function formatNO2(val) {
    if (typeof val === 'number' || (!isNaN(Number(val)) && val !== null && val !== undefined)) {
      const num = Number(val);
      if (Math.abs(num) >= 1e6 || Math.abs(num) < 1e-2) {
        return num.toExponential(2);
      }
      return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
    }
    return val;
  }
  return popup ? (
    <Popup position={[popup.lat, popup.lng]} eventHandlers={{ remove: () => setPopup(null) }}>
      <div>
        <strong>{product?.label || 'TEMPO'}:</strong> {formatNO2(popup.value)}
      </div>
    </Popup>
  ) : null;
};

export default TempoNO2Popup;
