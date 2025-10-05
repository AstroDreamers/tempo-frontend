export function aqiCategory(aqi) {
  if (aqi <= 50) return { label: "Good", colorClass: "text-white bg-[#22c55e]" };
  if (aqi <= 100) return { label: "Moderate", colorClass: "text-white bg-[#eab308]" };
  if (aqi <= 150) return { label: "Unhealthy for SG", colorClass: "text-white bg-[#f97316]" };
  if (aqi <= 200) return { label: "Unhealthy", colorClass: "text-white bg-[#ef4444]" };
  if (aqi <= 300) return { label: "Very Unhealthy", colorClass: "text-white bg-[#9333ea]" };
  return { label: "Hazardous", colorClass: "text-white bg-[#be123c]" };
}

// Generic AQI calculation function
function calculateAqi(concentration, breakpoints) {
  if (concentration === undefined || concentration === null || Number.isNaN(concentration)) return null;
  const c = Math.max(0, concentration);
  const r = breakpoints.find((r) => c >= r.Cl && c <= r.Ch);
  if (!r) return null;
  const aqi = ((r.Ih - r.Il) / (r.Ch - r.Cl)) * (c - r.Cl) + r.Il;
  return Math.round(aqi);
}

// EPA AQI breakpoints for all pollutants
// Source: https://www.airnow.gov/aqi/aqi-calculation/

// PM2.5 (µg/m³) → US AQI conversion
export function pm25ToAqi(pm25) {
  const breakpoints = [
    { Cl: 0.0,   Ch: 12.0,  Il: 0,   Ih: 50 },
    { Cl: 12.1,  Ch: 35.4,  Il: 51,  Ih: 100 },
    { Cl: 35.5,  Ch: 55.4,  Il: 101, Ih: 150 },
    { Cl: 55.5,  Ch: 150.4, Il: 151, Ih: 200 },
    { Cl: 150.5, Ch: 250.4, Il: 201, Ih: 300 },
    { Cl: 250.5, Ch: 350.4, Il: 301, Ih: 400 },
    { Cl: 350.5, Ch: 500.4, Il: 401, Ih: 500 },
  ];
  return calculateAqi(pm25, breakpoints);
}

// PM10 (µg/m³) → US AQI conversion
export function pm10ToAqi(pm10) {
  const breakpoints = [
    { Cl: 0,    Ch: 54,    Il: 0,   Ih: 50 },
    { Cl: 55,   Ch: 154,   Il: 51,  Ih: 100 },
    { Cl: 155,  Ch: 254,   Il: 101, Ih: 150 },
    { Cl: 255,  Ch: 354,   Il: 151, Ih: 200 },
    { Cl: 355,  Ch: 424,   Il: 201, Ih: 300 },
    { Cl: 425,  Ch: 504,   Il: 301, Ih: 400 },
    { Cl: 505,  Ch: 604,   Il: 401, Ih: 500 },
  ];
  return calculateAqi(pm10, breakpoints);
}

// O3 (ppm) → US AQI conversion (8-hour average)
export function o3ToAqi(o3) {
  const breakpoints = [
    { Cl: 0.000, Ch: 0.054, Il: 0,   Ih: 50 },
    { Cl: 0.055, Ch: 0.070, Il: 51,  Ih: 100 },
    { Cl: 0.071, Ch: 0.085, Il: 101, Ih: 150 },
    { Cl: 0.086, Ch: 0.105, Il: 151, Ih: 200 },
    { Cl: 0.106, Ch: 0.200, Il: 201, Ih: 300 },
  ];
  return calculateAqi(o3, breakpoints);
}

// NO2 (ppb) → US AQI conversion (1-hour average)
export function no2ToAqi(no2) {
  const breakpoints = [
    { Cl: 0,    Ch: 53,    Il: 0,   Ih: 50 },
    { Cl: 54,   Ch: 100,   Il: 51,  Ih: 100 },
    { Cl: 101,  Ch: 360,   Il: 101, Ih: 150 },
    { Cl: 361,  Ch: 649,   Il: 151, Ih: 200 },
    { Cl: 650,  Ch: 1249,  Il: 201, Ih: 300 },
    { Cl: 1250, Ch: 1649,  Il: 301, Ih: 400 },
    { Cl: 1650, Ch: 2049,  Il: 401, Ih: 500 },
  ];
  return calculateAqi(no2, breakpoints);
}

// SO2 (ppb) → US AQI conversion (1-hour average)
export function so2ToAqi(so2) {
  const breakpoints = [
    { Cl: 0,    Ch: 35,    Il: 0,   Ih: 50 },
    { Cl: 36,   Ch: 75,    Il: 51,  Ih: 100 },
    { Cl: 76,   Ch: 185,   Il: 101, Ih: 150 },
    { Cl: 186,  Ch: 304,   Il: 151, Ih: 200 },
    { Cl: 305,  Ch: 604,   Il: 201, Ih: 300 },
    { Cl: 605,  Ch: 804,   Il: 301, Ih: 400 },
    { Cl: 805,  Ch: 1004,  Il: 401, Ih: 500 },
  ];
  return calculateAqi(so2, breakpoints);
}

// CO (ppm) → US AQI conversion (8-hour average)
export function coToAqi(co) {
  const breakpoints = [
    { Cl: 0.0,   Ch: 4.4,   Il: 0,   Ih: 50 },
    { Cl: 4.5,   Ch: 9.4,   Il: 51,  Ih: 100 },
    { Cl: 9.5,   Ch: 12.4,  Il: 101, Ih: 150 },
    { Cl: 12.5,  Ch: 15.4,  Il: 151, Ih: 200 },
    { Cl: 15.5,  Ch: 30.4,  Il: 201, Ih: 300 },
    { Cl: 30.5,  Ch: 40.4,  Il: 301, Ih: 400 },
    { Cl: 40.5,  Ch: 50.4,  Il: 401, Ih: 500 },
  ];
  return calculateAqi(co, breakpoints);
}

// Calculate overall AQI from all available pollutants
export function calculateOverallAqi(sensors) {
  if (!sensors || !Array.isArray(sensors)) return { value: 0, category: "Unknown" };
  
  const pollutantData = [];
  
  sensors.forEach(sensor => {
    const paramName = sensor.parameter?.name?.toLowerCase();
    const paramDisplayName = sensor.parameter?.displayName?.toLowerCase();
    const value = sensor.latest?.value;
    
    if (value !== null && value !== undefined && !Number.isNaN(value)) {
      let aqi = null;
      let pollutant = null;
      
      // Map sensor parameter to AQI calculation function
      if (paramName === 'pm25' || paramDisplayName === 'pm2.5') {
        aqi = pm25ToAqi(value);
        pollutant = 'PM2.5';
      } else if (paramName === 'pm10') {
        aqi = pm10ToAqi(value);
        pollutant = 'PM10';
      } else if (paramName === 'o3') {
        aqi = o3ToAqi(value);
        pollutant = 'O₃';
      } else if (paramName === 'no2') {
        aqi = no2ToAqi(value);
        pollutant = 'NO₂';
      } else if (paramName === 'so2') {
        aqi = so2ToAqi(value);
        pollutant = 'SO₂';
      } else if (paramName === 'co') {
        aqi = coToAqi(value);
        pollutant = 'CO';
      }
      
      if (aqi !== null && pollutant !== null) {
        pollutantData.push({
          pollutant,
          concentration: value,
          aqi,
          unit: sensor.parameter?.units || '',
          category: aqiCategory(aqi)
        });
      }
    }
  });
  
  if (pollutantData.length === 0) return { value: 0, category: "Unknown" };
  
  // Find the pollutant with the highest AQI
  const maxPollutant = pollutantData.reduce((max, current) => 
    current.aqi > max.aqi ? current : max
  );
  
  return {
    value: maxPollutant.aqi,
    category: maxPollutant.category.label,
    dominantPollutant: maxPollutant.pollutant,
    allPollutants: pollutantData
  };
}
