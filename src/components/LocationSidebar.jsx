import React, { useEffect, useState } from "react";
import { getSensorsByLocationId, getHourlyMeasurementBySensorId } from "../api/sensors";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const LocationSidebar = ({ location, onClose }) => {
  const [sensors, setSensors] = useState([]);
  const [sensorTrends, setSensorTrends] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          {location.locality || "Unknown"} - US
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
              <div className="font-bold text-blue-700 text-lg mb-1">
                {sensor.parameter?.displayName || sensor.parameter?.name || 'Unknown Parameter'}
              </div>
              {/* Show hourly trend for this sensor if available */}
              {sensorTrends[sensor.id] && sensorTrends[sensor.id].length > 0 ? (
                <div className="text-sm text-gray-700">
                  <span className="font-semibold block mb-1">Hourly values (latest 24h):</span>
                  <div className="w-full h-32 bg-gray-50 rounded">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sensorTrends[sensor.id].map(m => ({
                        value: m.value,
                        time: m.period?.datetimeFrom?.utc?.slice(11, 16) || '',
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
