
import React, { useEffect, useState } from "react";

// Per-product legend configurations. Use local, original palettes only (no remote fetch).
// Keep the TEMPO NO2 tropospheric palette as the original scientific color scale.
const LEGENDS = {
  TEMPO_NO2: {
    gradient: "linear-gradient(90deg, #6a1b9a 0%, #1976d2 20%, #43a047 40%, #fbc02d 60%, #fb8c00 80%, #c62828 100%)",
    label: "TEMPO NO₂ (Tropospheric Vertical Column)",
    sublabel: "molecules/cm² · North America",
    ticks: ["1e15", "5e15", "1e16+"],
  },
  TEMPO_NO2_V03: {
    gradient: "linear-gradient(90deg, #6a1b9a 0%, #1976d2 20%, #43a047 40%, #fbc02d 60%, #fb8c00 80%, #c62828 100%)",
    label: "TEMPO NO₂ (v03) (Tropospheric Vertical Column)",
    sublabel: "molecules/cm² · North America",
    ticks: ["1e15", "5e15", "1e16+"],
  },
  TEMPO_O3: {
    gradient: "linear-gradient(90deg, #e6f4ff 0%, #90caf9 30%, #42a5f5 60%, #1e88e5 80%, #0d47a1 100%)",
    label: "TEMPO O₃ (Total Column)",
    sublabel: "Dobson Units (approx) · North America",
    ticks: ["200 DU", "300 DU", "400+ DU"],
  },
  TEMPO_O3_V03: {
    gradient: "linear-gradient(90deg, #e6f4ff 0%, #90caf9 30%, #42a5f5 60%, #1e88e5 80%, #0d47a1 100%)",
    label: "TEMPO O₃ (v03)",
    sublabel: "Dobson Units (approx) · North America",
    ticks: ["200 DU", "300 DU", "400+ DU"],
  },
};

const DEFAULT = LEGENDS.TEMPO_NO2;

const TempoLegend = ({ product = null }) => {
  const key = product?.key || null;
  const cfg = (key && LEGENDS[key]) ? LEGENDS[key] : DEFAULT;
  const [legendEntries, setLegendEntries] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLegendEntries(null);

    // If product is TEMPO_NO2, we always use local hardcoded legend
    if (!product || product.key === 'TEMPO_NO2' || product.key === 'TEMPO_NO2_V03') {
      return () => { cancelled = true; };
    }

    async function fetchLegend() {
      try {
        if (!product?.url) return;
        const base = product.url.replace(/\/+$/, '');
        const res = await fetch(`${base}/legend?f=json`);
        if (!res.ok) throw new Error('legend fetch failed');
        const json = await res.json();
        const entries = json?.layers?.[0]?.legend;
        if (!cancelled && Array.isArray(entries) && entries.length) {
          setLegendEntries(entries.map((e) => ({ imageData: e.imageData, label: e.label })));
        }
      } catch (err) {
        // ignore and use fallback
      }
    }

    fetchLegend();
    return () => { cancelled = true; };
  }, [product]);

  const renderRemote = () => {
    if (!legendEntries) return null;
    return (
      <div className="w-full flex flex-col gap-2">
        <div className="w-full rounded-lg relative mb-2 border border-blue-200 shadow flex items-center justify-center" style={{ height: 28, overflow: 'hidden' }}>
          <div className="flex w-full h-full" style={{ alignItems: 'stretch' }}>
            {legendEntries.map((e, i) => (
              <img key={i} src={e.imageData ? `data:image/png;base64,${e.imageData}` : undefined} alt={e.label || ''} style={{ height: '100%', width: `${100 / legendEntries.length}%`, objectFit: 'cover' }} />
            ))}
          </div>
        </div>
        <div className="w-full flex justify-between text-xs text-gray-700 font-semibold" style={{ marginTop: -2 }}>
          <span style={{ minWidth: 32 }}>{legendEntries[legendEntries.length - 1]?.label || cfg.ticks[0]}</span>
          <span>{legendEntries[Math.floor(legendEntries.length / 2)]?.label || cfg.ticks[1]}</span>
          <span style={{ minWidth: 32, textAlign: 'right' }}>{legendEntries[0]?.label || cfg.ticks[2]}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-white/60 via-blue-100/40 to-blue-200/30 backdrop-blur-lg border border-blue-300 shadow-2xl rounded-2xl px-6 py-4 flex flex-col items-start min-w-[200px] max-w-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex items-center gap-3 mb-3">
        <span className="w-2 h-7 bg-gradient-to-b from-blue-500 to-blue-300 rounded-full"></span>
        <div>
          <div className="text-blue-800 font-semibold text-lg tracking-tight">{cfg.label}</div>
          <div className="text-xs text-gray-500 font-medium leading-tight">{cfg.sublabel}</div>
        </div>
      </div>
      {product && product.key !== 'TEMPO_NO2' && product.key !== 'TEMPO_NO2_V03' ? (
        (legendEntries && legendEntries.length) ? renderRemote() : (
          <div className="w-full flex flex-col gap-2">
            <div className="w-full h-6 rounded-lg relative mb-3 border border-blue-200 shadow" style={{ background: cfg.gradient }}>
              <div className="absolute left-0 w-full flex justify-between" style={{ top: '110%' }}>
                <span className="text-xs text-gray-700 font-semibold" style={{ minWidth: 32 }}>{cfg.ticks[0]}</span>
                <span className="text-xs text-gray-700 font-semibold">{cfg.ticks[1]}</span>
                <span className="text-xs text-gray-700 font-semibold" style={{ minWidth: 32, textAlign: 'right' }}>{cfg.ticks[2]}</span>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="w-full flex flex-col gap-2">
          <div className="w-full h-6 rounded-lg relative mb-3 border border-blue-200 shadow" style={{ background: LEGENDS.TEMPO_NO2.gradient }}>
            <div className="absolute left-0 w-full flex justify-between" style={{ top: '110%' }}>
              <span className="text-xs text-gray-700 font-semibold" style={{ minWidth: 32 }}>{LEGENDS.TEMPO_NO2.ticks[0]}</span>
              <span className="text-xs text-gray-700 font-semibold">{LEGENDS.TEMPO_NO2.ticks[1]}</span>
              <span className="text-xs text-gray-700 font-semibold" style={{ minWidth: 32, textAlign: 'right' }}>{LEGENDS.TEMPO_NO2.ticks[2]}</span>
            </div>
          </div>
        </div>
      )}
      <div className="text-xxs text-gray-400 italic text-xs mt-2">Values and units are typical/recommended labels; check product docs for exact units and scaling.</div>
    </div>
  );
};

export default TempoLegend;
