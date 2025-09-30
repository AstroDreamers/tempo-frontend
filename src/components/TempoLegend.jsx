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
    <div className="bg-white/80 backdrop-blur border border-blue-200 shadow-lg rounded-xl px-4 py-3 flex flex-col items-start min-w-[180px]">
      <div className="flex items-center mb-2">
        <span className="w-2 h-6 bg-blue-500 rounded mr-3"></span>
        <div>
          <strong className="text-blue-700 text-base">TEMPO NO₂ (molecules/cm²)</strong>
          <div className="text-s text-gray-500 font-normal leading-tight">Only in North America</div>
        </div>
      </div>
      <div className="w-full">
        {legendItems.map((item, idx) => (
          <div key={idx} className="flex items-center mb-1 last:mb-0">
            {item.imageData && (
              <img
                src={`data:${item.contentType};base64,${item.imageData}`}
                alt={item.label || "legend color"}
                className="w-5 h-5 mr-2 inline-block border border-gray-300 rounded"
              />
            )}
            <span className="text-gray-700">
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
