import React from "react";
import { useNavigate } from "react-router-dom";

export default function CityHero({ 
  cityName = "New York City", 
  onAlertsClick, 
  isSubscribed = false, 
  onSubscribeClick,
  subscribing = false 
}) {
  const navigate = useNavigate();
  
  const handleAlertsClick = () => {
    if (onAlertsClick) {
      onAlertsClick();
    } else {
      navigate("/alerts");
    }
  };

  return (
    <div className="bg-white border border-blue-200 rounded-xl p-6 mb-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-800">{cityName}</h1>
          <p className="text-sm text-blue-600">live snapshot • last 24 hours</p>
        </div>
        <div className="flex gap-3">
          {isSubscribed ? (
            <>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                onClick={handleAlertsClick}
                aria-label="Get alerts"
              >
                Get alerts!
              </button>
              <button
                className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-md shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                onClick={() => navigate("/subscriptions")}
                aria-label="View subscriptions"
              >
                📍 Subscriptions
              </button>
            </>
          ) : (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={onSubscribeClick}
              disabled={subscribing}
              aria-label="Subscribe to location"
            >
              {subscribing ? 'Subscribing...' : '📍 Subscribe'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
