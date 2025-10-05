import React from 'react';

export default function GuidePage() {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">Quick Guide</h1>
      <p className="text-gray-600 mb-4">
        This short guide will help you get started with Astro Dreamers. Follow the simple steps below to view air quality, manage subscriptions, and configure alerts.
      </p>

      <section className="mb-4">
        <h2 className="font-semibold text-lg text-gray-800">1. Explore the Map</h2>
        <p className="text-gray-600 mt-1">
          Open the Map page to see sensor locations and live pollutant values. Click a sensor to view details and a small legend with units.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold text-lg text-gray-800">2. Subscribe to Locations</h2>
        <p className="text-gray-600 mt-1">
          On the Dashboard, add subscriptions for locations you care about. Subscriptions let you quickly view the latest sensor readings for that place.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold text-lg text-gray-800">3. Configure Alerts</h2>
        <p className="text-gray-600 mt-1">
          For each subscription you can configure alerts. Set a sensor, a threshold, and quiet hours. You'll receive alerts when values exceed your threshold outside quiet hours.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold text-lg text-gray-800">4. Account & Authentication</h2>
        <p className="text-gray-600 mt-1">
          Sign up or log in to save subscriptions and alerts. Tokens are used by the app to call protected APIs.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold text-lg text-gray-800">Tips</h2>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li>Use short thresholds for frequent updates and higher thresholds to avoid noise.</li>
          <li>Set quiet hours at night to avoid non-urgent notifications while you sleep.</li>
          <li>If sensor data is missing, try refreshing or check the Map for nearby sensors.</li>
        </ul>
      </section>

    </div>
  );
}
