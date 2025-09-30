// TempoImageLayer.jsx
import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import * as EL from "esri-leaflet";

const HOURLY_URL =
  "https://gis.earthdata.nasa.gov/image/rest/services/C3685896708-LARC_CLOUD/TEMPO_NO2_L3_V04_HOURLY_TROPOSPHERIC_VERTICAL_COLUMN/ImageServer";

export default function TempoImageLayer({
  opacity = 0.6,
  visible = true,
  url = HOURLY_URL,
  // If you pass `time`, we’ll use it; otherwise we track “latest” automatically.
  time,
  // how often to check for a new slice (ms)
  pollMs = 15 * 60 * 1000,
}) {
  const map = useMap();
  const layerRef = useRef(null);
  const [latestMs, setLatestMs] = useState(
    time ? new Date(time).getTime() : undefined
  );

  // Poll the service for the newest available time when `time` prop is not provided
  useEffect(() => {
    if (time) return; // controlled by parent
    let cancelled = false;

    async function fetchLatest() {
      try {
        // Get service metadata (timeInfo has [start, end])
        const res = await fetch(`${url}?f=json&_ts=${Date.now()}`);
        const json = await res.json();
        const end = json?.timeInfo?.timeExtent?.[1];
        // Some ImageServers return ms; if not, parse to ms as needed.
        if (!cancelled && typeof end === "number") {
          setLatestMs((prev) => (prev !== end ? end : prev));
        }
      } catch {
        // ignore network errors; try again next tick
      }
    }

    // initial + interval
    fetchLatest();
    const id = setInterval(fetchLatest, pollMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [url, pollMs, time]);

  // Build/replace the image layer when url or time changes
  useEffect(() => {
    const chosenMs = time ? new Date(time).getTime() : latestMs;
    // Add a tiny cache-buster param
    const cacheBustedUrl = `${url}${url.includes("?") ? "&" : "?"}_ts=${Date.now()}`;

    const layerOptions = {
      url: cacheBustedUrl,
      opacity: visible ? opacity : 0,
      transparent: true,
      format: "png32",
    };

    if (chosenMs) {
      layerOptions.time = chosenMs; // esri-leaflet expects ms epoch for time slices
    }

    const layer = EL.imageMapLayer(layerOptions);
    layer.addTo(map);

    // replace previous
    if (layerRef.current) map.removeLayer(layerRef.current);
    layerRef.current = layer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, url, time, latestMs, visible, opacity]);

  // Smooth opacity changes
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    let start = null;
    let animationFrame;
    const duration = 350;
    const initial = layer.options.opacity ?? 0;
    const target = visible ? opacity : 0;
    if (initial === target) return;

    function animate(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      layer.setOpacity(initial + (target - initial) * progress);
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    }
    animationFrame = requestAnimationFrame(animate);
    return () => animationFrame && cancelAnimationFrame(animationFrame);
  }, [visible, opacity]);

  return null;
}
