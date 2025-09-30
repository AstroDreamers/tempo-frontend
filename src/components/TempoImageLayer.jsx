// TempoImageLayer.jsx
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import * as EL from "esri-leaflet";

export default function TempoImageLayer({
  opacity = 0.6,
  visible = true,
  // ArcGIS ImageServer for TEMPO NO2 L3 V04 hourly tropospheric column:
  url = "https://gis.earthdata.nasa.gov/image/rest/services/C3685896708-LARC_CLOUD/TEMPO_NO2_L3_V04_HOURLY_TROPOSPHERIC_VERTICAL_COLUMN/ImageServer",
  time // optional: ISO string like "2025-09-29T18:00:00Z"
}) {
  const map = useMap();

  const layerRef = useRef(null);

  // Create the layer once
  useEffect(() => {
    const layerOptions = {
      url,
      opacity: visible ? opacity : 0,
      transparent: true,
      format: "png32"
    };
    if (time) {
      layerOptions.time = new Date(time).getTime();
    }
    const layer = EL.imageMapLayer(layerOptions);
    layer.addTo(map);
    layerRef.current = layer;
    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, url, time]);

  // Animate opacity when visible or opacity changes
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    let start = null;
    let animationFrame;
    const duration = 350; // ms
    const initial = layer.options.opacity ?? 0;
    const target = visible ? opacity : 0;
    if (initial === target) return;

    function animate(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = initial + (target - initial) * progress;
      layer.setOpacity(current);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        layer.setOpacity(target);
      }
    }
    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [visible, opacity]);

  return null;
}
