import React, { useEffect, useState } from "react";
import { getHourlyMeasurementBySensorId } from "../../api/sensors";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

export default function SensorChart({ sensor, location }) {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const formatDate = (d) => d.toISOString().replace(/\.\d{3}Z$/, "Z");
        const datetime_to = formatDate(now);
        const datetime_from = formatDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));

        const response = await getHourlyMeasurementBySensorId(sensor.id, {
          datetime_from,
          datetime_to,
          limit: 24,
          page: 1
        }).catch(() => []);

        // Handle different response structures
        const data = Array.isArray(response) ? response : (response?.results ?? []);
        setSensorData(data || []);
      } catch (error) {
        console.error("Error loading sensor data:", error);
        setSensorData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sensor.id]);


  const renderChart = (data) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-sm text-gray-400">No hourly data.</div>
      );
    }

    return (
      <div className="text-sm text-gray-700">
        <div className="w-full h-32 bg-gray-50 rounded">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.map(m => ({
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
    );
  };

  const currentValue = sensor.latest?.value || sensorData[sensorData.length - 1]?.value;
  const unit = sensor.parameter?.units || '';

  return (
    <div className="border-b pb-2">
      <div className="font-bold text-blue-700 text-lg mb-1">
        {sensor.parameter?.displayName || sensor.parameter?.name || 'Unknown Parameter'}
      </div>
      
      {/* Show hourly trend */}
      {sensorData && sensorData.length > 0 ? (
        <div className="text-sm text-gray-700">
          <span className="font-semibold block mb-1">Hourly values (latest 24h):</span>
          {renderChart(sensorData)}
        </div>
      ) : (
        <div className="text-sm text-gray-400">No hourly data.</div>
      )}
    </div>
  );
}
