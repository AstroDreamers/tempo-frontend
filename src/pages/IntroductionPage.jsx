import React from 'react';

export default function IntroductionPage() {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">Introduction to Astro Dreamers</h1>

      <p className="text-gray-600 mb-4">
        Welcome to Astro Dreamers — a lightweight air-quality monitoring client built to help you explore
        sensor data, create subscriptions to locations you care about, and receive alerts when
        values cross thresholds. Tempo surfaces pollutant levels on a map and makes it easy to
        manage what matters.
      </p>

      <section className="mb-4">
        <h2 className="font-semibold text-lg text-gray-800">Core Concepts</h2>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li>
            <strong>Map:</strong> Interactive map with sensor locations and current pollutant values.
          </li>
          <li>
            <strong>Subscriptions:</strong> Save places you care about to quickly see their latest
            readings.
          </li>
          <li>
            <strong>Alerts:</strong> Configure thresholds and quiet hours to receive notifications
            only when you want them.
          </li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold text-lg text-gray-800">How to get started</h2>
        <ol className="list-decimal list-inside text-gray-600 mt-2">
          <li>Open the Map page and explore nearby sensors.</li>
          <li>Create a subscription for a location you care about from the Dashboard.</li>
          <li>Set up an alert on that subscription if you'd like to be notified on thresholds.</li>
          <li>Sign up or log in to save your subscriptions and alerts across devices.</li>
        </ol>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold text-lg text-gray-800">Principles</h2>
        <p className="text-gray-600 mt-2">
          Tempo is designed for clarity and low-noise monitoring. We focus on presenting
          trustworthy sensor data, simple subscription management, and flexible alerting so you
          can act when air quality matters.
        </p>
      </section>
    </div>
  );
}
