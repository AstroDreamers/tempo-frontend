import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllSubscriptions, deleteSubscription } from '../api/subscriptions';
import { fetchLocations } from '../api/locations';

export default function SubscriptionsPage() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [locationDetails, setLocationDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await getAllSubscriptions();
      setSubscriptions(data);
      
      // Fetch location details for each subscription - ONLY exact matches
      const details = {};
      for (const sub of data) {
        try {
          // Fetch locations near this subscription's coordinates
          const locations = await fetchLocations({
            coordinates: `${sub.lon},${sub.lat}`,
            radius: 100, // Very small radius for exact matches only
            limit: 5
          });
          
          console.log(`Fetching location for ID ${sub.locationId}:`, locations);
          
          // ONLY use exact locationId match, never use closest/fallback
          const exactMatch = locations?.find(loc => loc.id === sub.locationId);
          
          if (exactMatch) {
            details[sub.locationId] = {
              name: exactMatch.locality || exactMatch.name || `Location ${sub.locationId}`
            };
            console.log(`Found exact match for ${sub.locationId}:`, details[sub.locationId].name);
          } else {
            // No exact match - just use locationId
            details[sub.locationId] = {
              name: `Location ${sub.locationId}`
            };
            console.log(`No exact match for ${sub.locationId}, using ID`);
          }
        } catch (locErr) {
          console.error(`Failed to fetch location for ${sub.locationId}:`, locErr);
          details[sub.locationId] = {
            name: `Location ${sub.locationId}`
          };
        }
      }
      setLocationDetails(details);
      setError(null);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError(err.message || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (locationId) => {
    if (!window.confirm('Are you sure you want to unsubscribe from this location?')) {
      return;
    }

    try {
      await deleteSubscription(locationId);
      // Refresh the list
      await fetchSubscriptions();
    } catch (err) {
      console.error('Error unsubscribing:', err);
      alert('Failed to unsubscribe: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading your subscriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16 px-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Subscriptions</h1>
          <p className="text-gray-600">
            Manage locations you're tracking and their configured alerts
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📍</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Subscriptions Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Subscribe to locations on the map or dashboard to track their air quality
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/map"
                className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Browse Map
              </Link>
              <Link
                to="/dashboard"
                className="inline-block px-5 py-2.5 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {locationDetails[subscription.locationId]?.name || 'Loading...'}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          📍 {subscription.lat?.toFixed(4)}, {subscription.lon?.toFixed(4)}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {subscription.alerts?.length || 0} {subscription.alerts?.length === 1 ? 'alert' : 'alerts'}
                      </span>
                    </div>

                    {/* Alerts List */}
                    {subscription.alerts && subscription.alerts.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Active Alerts:</h4>
                        {subscription.alerts.map((alert) => (
                          <div
                            key={alert.id}
                            className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-800">
                                    Sensor: {alert.sensorId}
                                  </span>
                                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                    alert.alertEnabled 
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {alert.alertEnabled ? 'Enabled' : 'Disabled'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Threshold: {alert.threshold}
                                </p>
                                {alert.quietStart && alert.quietEnd && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    🌙 Quiet hours: {alert.quietStart} - {alert.quietEnd}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        // Always use the subscription's actual locationId and coordinates
                        // Don't rely on fetched location data which might have different ID
                        navigate('/dashboard', {
                          state: {
                            autoLoadLocation: {
                              id: subscription.locationId,
                              coordinates: [subscription.lon, subscription.lat],
                              locality: locationDetails[subscription.locationId]?.name || `Location ${subscription.locationId}`,
                              latitude: subscription.lat,
                              longitude: subscription.lon
                            }
                          }
                        });
                      }}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleUnsubscribe(subscription.locationId)}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Unsubscribe
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 About Subscriptions</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Subscriptions let you track specific locations and receive alerts</li>
            <li>• You can configure custom alert thresholds for each location</li>
            <li>• Set quiet hours to pause notifications during specific times</li>
            <li>• Unsubscribe anytime to stop tracking a location</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

