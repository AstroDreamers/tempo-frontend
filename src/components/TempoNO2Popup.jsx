import React, { useState } from "react";
import { Popup, useMapEvents } from "react-leaflet";

const TempoNO2Popup = ({ showTempo }) => {
  const [popup, setPopup] = useState(null);
  useMapEvents({
    click: async (e) => {
      if (!showTempo) return;
      const { lat, lng } = e.latlng;
      const url = `https://gis.earthdata.nasa.gov/image/rest/services/C3685896708-LARC_CLOUD/TEMPO_NO2_L3_V04_HOURLY_TROPOSPHERIC_VERTICAL_COLUMN/ImageServer/identify?f=json&geometry=${lng},${lat}&geometryType=esriGeometryPoint&sr=4326&returnGeometry=false&returnCatalogItems=false&returnPixelValues=true`;
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
        <strong>TEMPO NO₂:</strong> {formatNO2(popup.value)}
      </div>
    </Popup>
  ) : null;
};

export default TempoNO2Popup;
