import React, { useEffect, useState } from "react";

const TempoLegend = () => {
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    fetch("https://gis.earthdata.nasa.gov/image/rest/services/C3685896708-LARC_CLOUD/TEMPO_NO2_L3_V04_HOURLY_TROPOSPHERIC_VERTICAL_COLUMN/ImageServer/legend?f=pjson")
      .then(res => res.json())
      .then(data => {
        const items =
          (data?.layers?.[0]?.legend || [])
            .map(l => ({
              label: l.label,
              imageData: l.imageData,
              contentType: l.contentType
            }));
        setLegendItems(items);
      })
      .catch(() => setLegendItems([]));
  }, []);

  return (
    <div className="bg-gradient-to-br from-white/60 via-blue-100/40 to-blue-200/30 backdrop-blur-lg border border-blue-300 shadow-2xl rounded-2xl px-6 py-4 flex flex-col items-start min-w-[180px] max-w-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="w-2 h-7 bg-gradient-to-b from-blue-500 to-blue-300 rounded-full"></span>
          <div>
            <div className="text-blue-800 font-semibold text-lg tracking-tight">TEMPO NO₂</div>
            <div className="text-xs text-gray-500 font-medium leading-tight">molecules/cm² · North America</div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          {legendItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">
              {item.imageData && (
                <img
                  src={`data:${item.contentType};base64,${item.imageData}`}
                  alt={item.label || "legend color"}
                  className="w-6 h-6 border border-gray-300 rounded shadow-sm"
                />
              )}
              <span className="text-gray-700 text-sm font-medium">
                {(() => {
                  // Try to extract and format the value if present in label
                  const match = item.label && item.label.match(/(High|Low) ?: ?([-+eE0-9.]+)/);
                  if (match) {
                    const [_, type, val] = match;
                    let num = Number(val);
                    let formatted = '';
                    if (!isNaN(num)) {
                      if (Math.abs(num) >= 1e6 || Math.abs(num) < 1e-2) {
                        formatted = num.toExponential(2);
                      } else {
                        formatted = num.toLocaleString(undefined, { maximumFractionDigits: 2 });
                      }
                      return `${type} : ${formatted}`;
                    }
                  }
                  return item.label;
                })()}
              </span>
            </div>
          ))}
        </div>
      </div>
  );
};

export default TempoLegend;
