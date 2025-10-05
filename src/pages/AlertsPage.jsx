import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAlerts, setAlert, enableAlert, disableAlert, deleteAlert } from "../api/alerts";
import { getSensorsByLocationId } from "../api/sensors";

export default function AlertsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const locationId = location.state?.locationId;
  const locationName = location.state?.locationName;
  
  const [sensors, setSensors] = useState([]);
  const [alerts, setAlerts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAlert, setEditingAlert] = useState(null);
  const [formData, setFormData] = useState({
    threshold: '',
    quietStart: '22:00',
    quietEnd: '08:00'
  });

  useEffect(() => {
    if (!locationId) {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [locationId, navigate]);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      // Fetch sensors for this location
      const sensorsData = await getSensorsByLocationId(locationId);
      setSensors(sensorsData);

      // Fetch existing alerts
      const alertsData = await getAlerts(locationId, token);
      
      // Convert alerts array to object keyed by sensorId
      const alertsMap = {};
      if (Array.isArray(alertsData)) {
        alertsData.forEach(alert => {
          alertsMap[alert.sensorId] = alert;
        });
      }
      setAlerts(alertsMap);
    } catch (err) {
      setError(err.message || "Failed to load alert data");
    }
    setLoading(false);
  }

  const handleToggleAlert = async (sensorId, currentlyEnabled) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      let result;
      if (currentlyEnabled) {
        result = await disableAlert(locationId, sensorId, token);
      } else {
        result = await enableAlert(locationId, sensorId, token);
      }

      // Update local state
      if (typeof result === 'object') {
        setAlerts(prev => ({
          ...prev,
          [sensorId]: result
        }));
      }
    } catch (err) {
      setError(err.message || "Failed to toggle alert");
    }
  };

  const handleDeleteAlert = async (sensorId) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      await deleteAlert(locationId, sensorId, token);
      
      // Remove from local state
      setAlerts(prev => {
        const updated = { ...prev };
        delete updated[sensorId];
        return updated;
      });
    } catch (err) {
      setError(err.message || "Failed to delete alert");
    }
  };

  const handleEditAlert = (sensor) => {
    const existingAlert = alerts[sensor.id];
    setEditingAlert(sensor.id);
    setFormData({
      threshold: existingAlert?.threshold || '',
      quietStart: existingAlert?.quietStart?.substring(0, 5) || '22:00',
      quietEnd: existingAlert?.quietEnd?.substring(0, 5) || '08:00'
    });
  };

  const handleSaveAlert = async (sensorId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const result = await setAlert(
        locationId,
        sensorId,
        true,
        Number(formData.threshold),
        formData.quietStart + ':00',
        formData.quietEnd + ':00',
        token
      );

      if (typeof result === 'object') {
        setAlerts(prev => ({
          ...prev,
          [sensorId]: result
        }));
        setEditingAlert(null);
      } else {
        setError(result);
      }
    } catch (err) {
      setError(err.message || "Failed to save alert");
    }
  };

  const handleCancelEdit = () => {
    setEditingAlert(null);
    setFormData({
      threshold: '',
      quietStart: '22:00',
      quietEnd: '08:00'
    });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading alerts...</div>;

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
      </div>

      {/* Alert Configuration Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700">Alert Configuration</h1>
            {locationName && (
              <p className="text-gray-600 mt-1">{locationName}</p>
            )}
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {sensors.length === 0 ? (
          <div className="text-gray-500 text-center py-12">
            <p className="text-lg">No sensors found for this location.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sensors.map(sensor => {
              const alert = alerts[sensor.id];
              const isEditing = editingAlert === sensor.id;
              const hasAlert = !!alert;

              return (
                <div key={sensor.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {sensor.parameter?.displayName || sensor.parameter?.name || 'Unknown Parameter'}
                        </h3>
                        <span className="text-sm text-gray-500">
                          ({sensor.parameter?.units || 'N/A'})
                        </span>
                        {hasAlert && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            alert.alertEnabled 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {alert.alertEnabled ? 'Active' : 'Disabled'}
                          </span>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Threshold Value
                            </label>
                            <input
                              type="number"
                              value={formData.threshold}
                              onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter threshold value"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quiet Start
                              </label>
                              <input
                                type="time"
                                value={formData.quietStart}
                                onChange={(e) => setFormData(prev => ({ ...prev, quietStart: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quiet End
                              </label>
                              <input
                                type="time"
                                value={formData.quietEnd}
                                onChange={(e) => setFormData(prev => ({ ...prev, quietEnd: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => handleSaveAlert(sensor.id)}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors"
                            >
                              Save Alert
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-400 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        hasAlert && (
                          <div className="mt-3 text-sm text-gray-600 space-y-1">
                            <p><strong>Threshold:</strong> {alert.threshold} {sensor.parameter?.units}</p>
                            <p><strong>Quiet Hours:</strong> {alert.quietStart?.substring(0, 5)} - {alert.quietEnd?.substring(0, 5)}</p>
                          </div>
                        )
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {!isEditing && (
                        <>
                          {hasAlert ? (
                            <>
                              <button
                                onClick={() => handleToggleAlert(sensor.id, alert.alertEnabled)}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                                  alert.alertEnabled
                                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                    : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                              >
                                {alert.alertEnabled ? 'Disable' : 'Enable'}
                              </button>
                              <button
                                onClick={() => handleEditAlert(sensor)}
                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold text-sm hover:bg-indigo-600 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteAlert(sensor.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEditAlert(sensor)}
                              className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold text-sm hover:bg-indigo-600 transition-colors"
                            >
                              Create Alert
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}