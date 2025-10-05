import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSubscriptions, deleteSubscription } from "../api/subscriptions";
import { getSensorsByLocationId } from "../api/sensors";
import { getAlerts } from "../api/alerts";

// Helper to get color class based on value and pollutant
function getValueColor(parameter, value) {
  if (value === undefined || value === null) return "text-gray-400";
  // Convert value to number
  const v = Number(value);
  switch (parameter?.name?.toLowerCase()) {
    case "so2":
      if (v < 20) return "text-green-600";
      if (v < 80) return "text-yellow-500";
      if (v < 250) return "text-orange-500";
      if (v < 350) return "text-red-500";
      return "text-pink-700";
    case "no2":
      if (v < 40) return "text-green-600";
      if (v < 70) return "text-yellow-500";
      if (v < 150) return "text-orange-500";
      if (v < 200) return "text-red-500";
      return "text-pink-700";
    case "pm10":
      if (v < 20) return "text-green-600";
      if (v < 50) return "text-yellow-500";
      if (v < 100) return "text-orange-500";
      if (v < 200) return "text-red-500";
      return "text-pink-700";
    case "pm25":
      if (v < 10) return "text-green-600";
      if (v < 25) return "text-yellow-500";
      if (v < 50) return "text-orange-500";
      if (v < 75) return "text-red-500";
      return "text-pink-700";
    case "o3":
      if (v < 60) return "text-green-600";
      if (v < 100) return "text-yellow-500";
      if (v < 140) return "text-orange-500";
      if (v < 180) return "text-red-500";
      return "text-pink-700";
    case "co":
      if (v < 4400) return "text-green-600";
      if (v < 9400) return "text-yellow-500";
      if (v < 12400) return "text-orange-500";
      if (v < 15400) return "text-red-500";
      return "text-pink-700";
    default:
      return "text-gray-700";
  }
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionSensors, setSubscriptionSensors] = useState({});
  const [subscriptionAlerts, setSubscriptionAlerts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unsubscribing, setUnsubscribing] = useState({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const subs = await getAllSubscriptions();
        const topSubs = subs.slice(0, 3);
        setSubscriptions(topSubs);
        
        // Fetch sensors and alerts for all subscriptions
        const sensorsMap = {};
        const alertsMap = {};
        for (const sub of topSubs) {
          try {
            const sensorsData = await getSensorsByLocationId(sub.locationId);
            sensorsMap[sub.locationId] = sensorsData;

            // Fetch alerts for this location
            const alertsData = await getAlerts(sub.locationId, token);
            if (Array.isArray(alertsData) && alertsData.length > 0) {
              alertsMap[sub.locationId] = alertsData;
            }
          } catch (err) {
            sensorsMap[sub.locationId] = [];
          }
        }
        setSubscriptionSensors(sensorsMap);
        setSubscriptionAlerts(alertsMap);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleUnsubscribe = async (locationId) => {
    setUnsubscribing(prev => ({ ...prev, [locationId]: true }));
    try {
      await deleteSubscription(locationId);
      
      // Remove the subscription from the list
      const updatedSubs = subscriptions.filter(sub => sub.locationId !== locationId);
      setSubscriptions(updatedSubs);
      
      // Remove sensors for this subscription
      const updatedSensors = { ...subscriptionSensors };
      delete updatedSensors[locationId];
      setSubscriptionSensors(updatedSensors);
    } catch (err) {
      setError(err.message || "Failed to unsubscribe");
    }
    setUnsubscribing(prev => ({ ...prev, [locationId]: false }));
  };

  const handleConfigureAlert = (locationId, locationName) => {
    navigate('/alerts', { state: { locationId, locationName } });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 space-y-6">
      {/* Air Quality Index Reference Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Air Quality Index Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Quality</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">Index</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">SO₂</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">NO₂</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">PM10</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">PM2.5</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">O₃</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">CO</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-green-50 hover:bg-green-100 transition-colors">
                <td className="border border-gray-300 px-4 py-3 font-semibold text-green-700">Good</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-green-700 font-semibold">1</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">0-20</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">0-40</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">0-20</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">0-10</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">0-60</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">0-4400</td>
              </tr>
              <tr className="bg-yellow-50 hover:bg-yellow-100 transition-colors">
                <td className="border border-gray-300 px-4 py-3 font-semibold text-yellow-600">Fair</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-yellow-600 font-semibold">2</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">20-80</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">40-70</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">20-50</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">10-25</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">60-100</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">4400-9400</td>
              </tr>
              <tr className="bg-orange-50 hover:bg-orange-100 transition-colors">
                <td className="border border-gray-300 px-4 py-3 font-semibold text-orange-600">Moderate</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-orange-600 font-semibold">3</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">80-250</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">70-150</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">50-100</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">25-50</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">100-140</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">9400-12400</td>
              </tr>
              <tr className="bg-red-50 hover:bg-red-100 transition-colors">
                <td className="border border-gray-300 px-4 py-3 font-semibold text-red-600">Poor</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-red-600 font-semibold">4</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">250-350</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">150-200</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">100-200</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">50-75</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">140-180</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">12400-15400</td>
              </tr>
              <tr className="bg-pink-50 hover:bg-pink-100 transition-colors">
                <td className="border border-gray-300 px-4 py-3 font-semibold text-pink-700">Very Poor</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-pink-700 font-semibold">5</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">≥350</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">≥200</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">≥200</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">≥75</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">≥180</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">≥15400</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 mt-3 italic">All pollutant concentrations are measured in μg/m³</p>
      </div>

      {/* Subscriptions Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-indigo-700">Your Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 text-gray-500 text-center">
            No subscriptions found.
          </div>
        ) : (
          subscriptions.map((sub) => (
            <div key={sub.id || sub.locationId} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-indigo-600">
                    {sub.locationName || `Location ${sub.locationId}`}
                  </h3>
                  {subscriptionAlerts[sub.locationId] && subscriptionAlerts[sub.locationId].length > 0 && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      {subscriptionAlerts[sub.locationId].length} Alert{subscriptionAlerts[sub.locationId].length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConfigureAlert(sub.locationId, sub.locationName)}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold text-sm hover:bg-indigo-600 transition-colors"
                  >
                    Configure Alert
                  </button>
                  <button
                    onClick={() => handleUnsubscribe(sub.locationId)}
                    disabled={unsubscribing[sub.locationId]}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {unsubscribing[sub.locationId] ? 'Unsubscribing...' : 'Unsubscribe'}
                  </button>
                </div>
              </div>
              
              {!subscriptionSensors[sub.locationId] || subscriptionSensors[sub.locationId].length === 0 ? (
                <div className="text-gray-500 text-center py-4">
                  No sensor data found for this location.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {subscriptionSensors[sub.locationId].map(sensor => (
                    <div key={sensor.id} className="bg-gray-50 rounded-xl shadow border border-gray-200 p-4 flex flex-col items-start">
                      <div className="font-bold text-lg text-gray-900 mb-1">
                        {sensor.parameter?.displayName || sensor.parameter?.name || 'Unknown Parameter'}
                      </div>
                      <div className={`text-2xl font-extrabold mb-1 ${getValueColor(sensor.parameter, sensor.latest?.value)}`}>
                        {sensor.latest?.value !== undefined ? sensor.latest.value : 'N/A'}
                        <span className="text-base font-medium text-gray-500 ml-1">
                          {sensor.parameter?.units || ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}