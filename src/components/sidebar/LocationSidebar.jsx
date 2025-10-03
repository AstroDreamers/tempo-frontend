import React, { useEffect, useState } from "react";
import { getSensorsByLocationId, getHourlyMeasurementBySensorId } from "../../api/sensors";
import { askWithData } from "../../api/ai";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const LocationSidebar = ({ location, onClose }) => {
  const [sensors, setSensors] = useState([]);
  const [sensorTrends, setSensorTrends] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiNotes, setAiNotes] = useState({}); // sensorId -> response
  const [aiLoading, setAiLoading] = useState({}); // sensorId -> loading
  const [aiStreaming, setAiStreaming] = useState({}); // sensorId -> streaming text

  useEffect(() => {
    if (!location?.id) return;
    setLoading(true);
    setError(null);
    setSensors([]);
    setSensorTrends({});
    getSensorsByLocationId(location.id)
      .then(async (sensors) => {
        setSensors(sensors);
        // Fetch hourly trend for each sensor (last 24 hours)
  const now = new Date();
  // Format as YYYY-MM-DDTHH:mm:ssZ (no milliseconds)
  const formatDate = (date) => date.toISOString().replace(/\.\d{3}Z$/, 'Z');
  const datetime_to = formatDate(now);
  const datetime_from = formatDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
        const trendResults = {};
        await Promise.all(sensors.map(async (sensor) => {
          try {
            const trend = await getHourlyMeasurementBySensorId(sensor.id, { datetime_from, datetime_to, limit: 24, page: 1 });
            trendResults[sensor.id] = trend;
          } catch (e) {
            trendResults[sensor.id] = [];
          }
        }));
        setSensorTrends(trendResults);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load sensor data");
        setLoading(false);
      });
  }, [location]);

  if (!location) return null;
  return (
  <div className="fixed top-10 right-10 w-[360px] max-w-[90vw] min-h-[200px] bg-white shadow-2xl rounded-2xl z-[1200] flex flex-col transition-all duration-300">
  {/* Header */}
  <div className="w-full rounded-t-2xl bg-blue-600 px-6 py-4 flex items-center justify-between sticky top-0 z-20" style={{borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem'}}>
        <div className="text-white text-lg font-bold truncate" title={location.locality || 'Unknown'}>
          {location.locality || "Unknown"}
        </div>
        <button
          onClick={onClose}
          className="text-2xl border-none bg-transparent cursor-pointer text-blue-100 hover:text-white transition-colors duration-200 ml-4"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
      {/* Content */}
  <div className="px-6 py-5 text-base overflow-y-auto max-h-[70vh]">
        {loading && <div className="text-gray-500">Loading sensors...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && sensors.length === 0 && <div className="text-gray-500">No sensors found.</div>}
        <ul className="space-y-2">
          {sensors.map((sensor, idx) => (
            <li key={sensor.id || idx} className="border-b pb-2">
              <div className="font-bold text-blue-700 text-lg mb-1 flex items-center justify-between">
                <span>{sensor.parameter?.displayName || sensor.parameter?.name || 'Unknown Parameter'}</span>
                <button
                  className="ml-2 px-3 py-1 text-xs rounded text-yellow-900 font-semibold border border-transparent transition flex items-center gap-1 bg-transparent hover:bg-yellow-100 hover:border-yellow-300"
                  onClick={async () => {
                    setAiLoading(l => ({ ...l, [sensor.id]: true }));
                    setAiNotes(n => ({ ...n, [sensor.id]: null }));
                    setAiStreaming(s => ({ ...s, [sensor.id]: "" }));
                    // Prepare request body
                    const trend = sensorTrends[sensor.id] || [];
                    const reqBody = {
                      locationName: location.locality || "Unknown",
                      latitude: location.coordinates?.latitude,
                      longitude: location.coordinates?.longitude,
                      parameterName: sensor.parameter?.displayName || sensor.parameter?.name || 'Unknown Parameter',
                      units: sensor.parameter?.units || '',
                      startDate: trend.length > 0 ? trend[0].period?.datetimeFrom?.utc?.slice(0,10) : '',
                      endDate: trend.length > 0 ? trend[trend.length-1].period?.datetimeFrom?.utc?.slice(0,10) : '',
                      jsonData: trend.map(m => ({
                        timestamp: m.period?.datetimeFrom?.utc,
                        value: m.value
                      }))
                    };
                    try {
                      const data = await askWithData(reqBody);
                      // Typing effect
                      const text = data.response || "No response.";
                      let i = 0;
                      const step = 3; // Show 10 characters per frame
                      function streamText() {
                        setAiStreaming(s => ({ ...s, [sensor.id]: text.slice(0, i) }));
                        if (i < text.length) {
                          i += step;
                          setTimeout(streamText, 0.5);
                        } else {
                          setAiNotes(n => ({ ...n, [sensor.id]: text }));
                        }
                      }
                      streamText();
                    } catch (e) {
                      setAiNotes(n => ({ ...n, [sensor.id]: "AI request failed." }));
                    }
                    setAiLoading(l => ({ ...l, [sensor.id]: false }));
                  }}
                  disabled={aiLoading[sensor.id]}
                  title="Get AI interpretation of this chart"
                >
                  {aiLoading[sensor.id] ? "Asking..." : <><span role="img" aria-label="magic" style={{fontSize: '1.1em'}}>🪄</span> Ask AI</>}
                </button>
              </div>
              {/* Show AI note if available */}
              {(aiStreaming[sensor.id] || aiNotes[sensor.id]) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2 my-2 text-sm text-yellow-900 shadow-sm">
                  <strong>AI Note:</strong>
                    <div className="whitespace-pre-line mt-1" style={{ fontFamily: 'Caveat, Comic Sans MS, cursive', fontSize: '1em', lineHeight: 1.7, color: '#111' }}>
                      {aiStreaming[sensor.id] ? aiStreaming[sensor.id] : aiNotes[sensor.id]}
                    </div>
                </div>
              )}
              {/* Show hourly trend for this sensor if available */}
              {sensorTrends[sensor.id] && sensorTrends[sensor.id].length > 0 ? (
                <div className="text-sm text-gray-700">
                  <span className="font-semibold block mb-1">Hourly values (latest 24h):</span>
                  <div className="w-full h-32 bg-gray-50 rounded">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sensorTrends[sensor.id].map(m => ({
                        value: m.value,
                        time: m.period?.datetimeFrom?.utc
                          ? new Date(m.period.datetimeFrom.utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : '',
                        units: m.parameter?.units,
                        label: m.parameter?.displayName || m.parameter?.name
                      }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} width={40} />
                        <Tooltip formatter={(v, n, p) => [`${v} ${p.payload.units}`, p.payload.label]} />
                        <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-400">No hourly data.</div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LocationSidebar;
