import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllSubscriptions, deleteSubscription, subscribeToLocation, getSubscription } from "../api/subscriptions";
import { getSensorsByLocationId, getHourlyMeasurementBySensorId } from "../api/sensors";
import { getAlerts } from "../api/alerts";
import { fetchLocations } from "../api/locations";
import { askWithData } from "../api/ai";
import { calculateOverallAqi } from "../features/dashboardV2/utils";

// Import new dashboard components
import CityHero from "../features/dashboardV2/CityHero";
import SensorsPanel from "../features/dashboardV2/SensorsPanel";
import RightColumn from "../features/dashboardV2/RightColumn";
import AqiReferenceTable from "../features/dashboardV2/AqiReferenceTable";
import PollutantBreakdown from "../features/dashboardV2/PollutantBreakdown";
import CurrentAqiCard from "../features/dashboardV2/CurrentAqiCard";
import AiInsight from "../features/dashboardV2/AiInsight";
import MapView from "../components/map/MapView";

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const autoLoadLocation = location.state?.autoLoadLocation;
  
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionSensors, setSubscriptionSensors] = useState({});
  const [subscriptionAlerts, setSubscriptionAlerts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unsubscribing, setUnsubscribing] = useState({});
  
  // New state for dashboard layout
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sensorsForMap, setSensorsForMap] = useState([]);
  const [currentAqi, setCurrentAqi] = useState({ value: 0, category: "Unknown" }); // Default before selection
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [hasUserSelectedLocation, setHasUserSelectedLocation] = useState(false);
  
  // Subscription state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  
  // Ref for map section
  const mapRef = React.useRef(null);
  
  // Auto-load location if passed from navigation
  useEffect(() => {
    if (autoLoadLocation && !loading && locations.length > 0) {
      console.log("=== Auto-loading location ===");
      console.log("Location ID:", autoLoadLocation.id);
      console.log("Location Name:", autoLoadLocation.locality);
      console.log("Coordinates:", autoLoadLocation.coordinates);
      handleLocationClick(autoLoadLocation);
      // Clear state to prevent re-loading
      window.history.replaceState({}, document.title);
    }
  }, [autoLoadLocation, loading, locations.length]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // If no token, just load locations and show default dashboard
          const locationsList = await fetchLocations({ limit: 1000, page: 1 }).catch(() => []);
          setLocations(locationsList || []);
          
          // Find a location with sensors (try Rutland first, then fallback to first available location)
          console.log("Available locations:", locationsList.length);
          console.log("Sample locations:", locationsList.slice(0, 5));
          
          let selectedLocation = locationsList.find(loc => 
            loc.locality?.toLowerCase().includes('rutland') || 
            loc.name?.toLowerCase().includes('rutland') ||
            (loc.coordinates && Math.abs(loc.coordinates[0] - (-72.9726)) < 0.1 && Math.abs(loc.coordinates[1] - 43.6106) < 0.1)
          );
          
          // If Rutland not found, use the first available location
          if (!selectedLocation && locationsList.length > 0) {
            selectedLocation = locationsList[0];
            console.log("Rutland not found, using first available location:", selectedLocation);
          }
          
          console.log("Selected location:", selectedLocation);
          
          if (selectedLocation) {
            setSelectedLocation(selectedLocation);
            // Load sensors for the selected location
            try {
              console.log("Loading sensors for location ID:", selectedLocation.id);
              const sensors = await getSensorsByLocationId(selectedLocation.id);
              console.log("Sensors loaded:", sensors);
              setSensorsForMap(sensors || []);
              
              // Calculate overall AQI from all pollutants
              const aqiData = calculateOverallAqi(sensors || []);
              setCurrentAqi({ value: aqiData.value, category: aqiData.category });
            } catch (err) {
              console.log("Could not load sensors:", err);
            }
          } else {
            console.log("No locations found, using fallback");
            setSelectedLocation({ locality: "Rutland", coordinates: [-72.9726, 43.6106] });
          }
          setLoading(false);
          return;
        }

        // Load all locations for map
        const locationsList = await fetchLocations({ limit: 1000, page: 1 }).catch(() => []);
        setLocations(locationsList || []);

        // Load subscriptions data (this might fail if user has no subscriptions)
        try {
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

        // Set default location to first subscription or Rutland
        if (topSubs.length > 0) {
          const defaultLocation = locationsList.find(loc => loc.id === topSubs[0].locationId);
          if (defaultLocation) {
            setSelectedLocation(defaultLocation);
            setSensorsForMap(sensorsMap[topSubs[0].locationId] || []);
            
            // Calculate overall AQI from all pollutants
            const aqiData = calculateOverallAqi(sensorsMap[topSubs[0].locationId] || []);
            setCurrentAqi({ value: aqiData.value, category: aqiData.category });
          }
        } else {
          // Find a location with sensors (try Rutland first, then fallback to first available location)
          console.log("Available locations (with subscriptions):", locationsList.length);
          console.log("Sample locations:", locationsList.slice(0, 5));
          
          let selectedLocation = locationsList.find(loc => 
            loc.locality?.toLowerCase().includes('rutland') || 
            loc.name?.toLowerCase().includes('rutland') ||
            (loc.coordinates && Math.abs(loc.coordinates[0] - (-72.9726)) < 0.1 && Math.abs(loc.coordinates[1] - 43.6106) < 0.1)
          );
          
          // If Rutland not found, use the first available location
          if (!selectedLocation && locationsList.length > 0) {
            selectedLocation = locationsList[0];
            console.log("Rutland not found (with subscriptions), using first available location:", selectedLocation);
          }
          
          console.log("Selected location (with subscriptions):", selectedLocation);
          
          if (selectedLocation) {
            setSelectedLocation(selectedLocation);
            // Load sensors for the selected location
            try {
              console.log("Loading sensors for location ID (with subscriptions):", selectedLocation.id);
              const sensors = await getSensorsByLocationId(selectedLocation.id);
              console.log("Sensors loaded (with subscriptions):", sensors);
              setSensorsForMap(sensors || []);
              
              // Calculate overall AQI from all pollutants
              const aqiData = calculateOverallAqi(sensors || []);
              setCurrentAqi({ value: aqiData.value, category: aqiData.category });
            } catch (err) {
              console.log("Could not load sensors (with subscriptions):", err);
            }
          } else {
            console.log("No locations found (with subscriptions), using fallback");
            // Fallback to default Rutland coordinates
            setSelectedLocation({ locality: "Rutland", coordinates: [-72.9726, 43.6106] });
          }
        }
        } catch (subsError) {
          // If subscriptions fail, just show default dashboard without subscriptions
          console.log("Subscriptions not available:", subsError.message);
          setSelectedLocation({ locality: "Rutland", coordinates: [-72.9726, 43.6106] });
        }
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

  const handleConfigureAlert = (locationId, locationName, lat, lon) => {
    navigate('/alerts', { state: { locationId, locationName, lat, lon } });
  };

  // Check if location is subscribed
  const checkSubscriptionStatus = async (locationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsSubscribed(false);
        return;
      }
      await getSubscription(locationId);
      setIsSubscribed(true);
    } catch (err) {
      setIsSubscribed(false);
    }
  };

  // Handle subscribing to current location
  const handleSubscribe = async () => {
    if (!selectedLocation) return;
    
    setSubscribing(true);
    try {
      const lat = selectedLocation?.coordinates?.latitude || selectedLocation?.coordinates?.[1] || selectedLocation?.latitude;
      const lon = selectedLocation?.coordinates?.longitude || selectedLocation?.coordinates?.[0] || selectedLocation?.longitude;
      
      await subscribeToLocation({
        locationId: selectedLocation.id,
        locationName: selectedLocation.locality || selectedLocation.name,
        lat,
        lon
      });
      
      setIsSubscribed(true);
      console.log("Subscribed successfully to", selectedLocation.id);
    } catch (err) {
      console.error("Failed to subscribe:", err);
      setError(err.message || "Failed to subscribe to location");
    }
    setSubscribing(false);
  };

  // Handle location click from map
  const handleLocationClick = async (location) => {
    console.log("=== handleLocationClick called ===");
    console.log("Location object:", location);
    console.log("Location ID:", location.id);
    
    setSelectedLocation(location);
    setHasUserSelectedLocation(true); // Mark that user has selected a location
    
    // Check subscription status
    await checkSubscriptionStatus(location.id);
    
    try {
      console.log("Fetching sensors for location ID:", location.id);
      const sensors = await getSensorsByLocationId(location.id);
      console.log("Sensors loaded:", sensors?.length || 0, "sensors");
      setSensorsForMap(sensors || []);
      
      // Calculate overall AQI from all pollutants
      const aqiData = calculateOverallAqi(sensors || []);
      setCurrentAqi({ value: aqiData.value, category: aqiData.category });

      // Generate AI insight
      setAiLoading(true);
      const token = localStorage.getItem('token');
      if (token && sensors && sensors.length > 0) {
        // Build enhanced payload with multi-pollutant AQI data
        const now = new Date();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const windowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        const reqBody = {
          locationName: location.locality || location.name || "Unknown Location",
          latitude: location.coordinates?.latitude || location.coordinates?.[1] || 0,
          longitude: location.coordinates?.longitude || location.coordinates?.[0] || 0,
          timezone: timezone,
          startDate: windowStart.toISOString(),
          endDate: now.toISOString(),
          
          // Enhanced AQI data
          overallIndex: aqiData.value,
          dominant: aqiData.dominantPollutant,
          available: aqiData.allPollutants.map(p => p.pollutant),
          
          perPollutant: aqiData.allPollutants.map(p => ({
            key: p.pollutant,
            value: p.concentration,
            units: p.unit,
            subIndex: p.aqi
          })),
          
          // Reference compact string
          referenceCompact: "Good:1–50; Moderate:51–100; Unhealthy for SG:101–150; Unhealthy:151–200; Very Unhealthy:201–300; Hazardous:301–500",
          
          // Optional: include time series sample (keep small)
          jsonData: sensors.slice(0, 5).map(sensor => ({
            timestamp: sensor.latest?.lastUpdated || now.toISOString(),
            value: sensor.latest?.value || 0
          }))
        };
        
        try {
          const data = await askWithData(reqBody, token);
          setAiInsight(data.response || "No AI insight available.");
        } catch (err) {
          setAiInsight("Unable to generate AI insight at this time.");
        }
      }
      setAiLoading(false);
    } catch (err) {
      console.error("Error loading location data:", err);
      setSensorsForMap([]);
    }
  };

  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="mt-10 p-8 text-center text-red-500">{error}</div>;

  return (
    <main className="container mx-auto max-w-[1280px] px-[64px] pt-[100px] pb-6">
      {!hasUserSelectedLocation ? (
        /* Welcome message before location selection */
        <div className="flex flex-col items-center justify-center min-h-[600px] text-center">
          <div className="bg-white shadow-lg rounded-xl p-12 max-w-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto mb-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Air Quality Dashboard</h2>
            <p className="text-lg text-gray-600 mb-6">
              Click on any location marker on the map below to view detailed air quality data, sensor readings, and AI-powered insights.
            </p>
            <button
              onClick={scrollToMap}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors"
            >
              View Map ↓
            </button>
          </div>
          
          {/* Map */}
          <div ref={mapRef} className="w-full mt-8 bg-white border border-blue-200 rounded-xl overflow-hidden" style={{ height: '500px' }}>
            <MapView 
              locations={locations || []}
              onMarkerClick={handleLocationClick}
              center={[-72.9726, 43.6106]}
            />
          </div>
        </div>
      </div>

          {/* Split row: equal depth */}
          <section className="grid grid-cols-12 gap-5" style={{ gridAutoRows: '1fr' }}>
            {/* LEFT: AQI + PollutantBreakdown + Insight + Map stacked */}
            <div className="col-span-7">
              <div className="grid grid-rows-[auto_auto_auto_minmax(0,1fr)] gap-5 min-h-[720px]">
                {/* Overall AQI Card */}
                <CurrentAqiCard aqi={currentAqi.value} />
                
                {/* Pollutant Breakdown */}
                <PollutantBreakdown sensors={sensorsForMap} />
                
                {/* AI Insight */}
                <AiInsight insight={aiInsight} loading={aiLoading} />
                
                {/* Map */}
                <div className="min-h-0 bg-white border border-blue-200 rounded-xl overflow-hidden">
                  <MapView 
                    locations={locations || []}
                    onMarkerClick={handleLocationClick}
                    center={selectedLocation?.coordinates || [-72.9726, 43.6106]}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT: scrollable sensors panel */}
            <div className="col-span-5 min-h-[720px]">
              <SensorsPanel 
                sensors={sensorsForMap}
                cityName={selectedLocation?.locality || "Location"}
                location={selectedLocation}
                className="h-full"
              />
            </div>
          </section>
        </>
      )}

      {/* AQI Reference table */}
      <section className="mt-8">
        <AqiReferenceTable />
      </section>
    </main>
  );
}