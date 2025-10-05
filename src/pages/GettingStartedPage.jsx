import React from 'react';
import { Link } from 'react-router-dom';

const GettingStartedPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-12 md:px-10 md:py-16">
        
        {/* 1️⃣ HERO SECTION */}
        <header className="text-center space-y-6 mb-16">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome to Astro Dreamers
            </span>
          </h1>
          <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto">
            Explore global air quality, monitor locations you care about, and get smart alerts powered by real-time data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link
              to="/dashboard"
              className="inline-block rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 transition-colors"
            >
              Open Dashboard
            </Link>
            <Link
              to="/map"
              className="inline-block rounded-2xl border border-blue-600 text-blue-600 hover:bg-blue-50  px-5 py-2.5 font-medium transition-colors"
            >
              View Map
            </Link>
          </div>
        </header>

        <div className="space-y-8">
          
          {/* 2️⃣ WHAT IS ASTRO DREAMERS */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800  mt-10 mb-4">
              About the Project
            </h2>
            <p className="text-gray-600  leading-relaxed mb-6">
              Astro Dreamers was built for the{' '}
              <a
                href="https://www.spaceappschallenge.org/2025/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700   underline font-medium"
              >
                NASA Space Apps Challenge 2025
              </a>{' '}
              by{' '}
              <a
                href="https://www.spaceappschallenge.org/2025/find-a-team/astrodreamers/?tab=details"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700   underline font-medium"
              >
                Team Astro Dreamers
              </a>
              . Our mission is to make satellite air-quality data understandable and actionable for everyone — turning complex science into everyday insight.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="rounded-2xl border border-gray-200  p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white/60  backdrop-blur">
                <div className="text-3xl mb-3">🗺️</div>
                <h3 className="font-semibold text-gray-800  mb-2">Map</h3>
                <p className="text-gray-600  text-sm leading-relaxed">
                  Explore live air-quality sensors and satellite data worldwide.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200  p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white/60  backdrop-blur">
                <div className="text-3xl mb-3">📍</div>
                <h3 className="font-semibold text-gray-800  mb-2">Subscriptions</h3>
                <p className="text-gray-600  text-sm leading-relaxed">
                  Pin the locations you care about to track updates easily.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200  p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white/60  backdrop-blur">
                <div className="text-3xl mb-3">🔔</div>
                <h3 className="font-semibold text-gray-800  mb-2">Alerts</h3>
                <p className="text-gray-600  text-sm leading-relaxed">
                  Receive real-time notifications when air quality changes.
                </p>
              </div>
            </div>
          </section>

          {/* 3️⃣ HOW IT WORKS */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800  mt-10 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600  leading-relaxed mb-6">
              Get started in four simple steps.
            </p>

            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200  p-5 hover:shadow-md transition bg-white/60 ">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                    1
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800  mb-2">Explore the Map</h3>
                    <p className="text-gray-600  text-sm leading-relaxed mb-3">
                      Click any sensor to view detailed pollutant data and AQI levels.
                    </p>
                    <Link
                      to="/map"
                      className="text-blue-600 hover:text-blue-700  text-sm font-medium"
                    >
                      Open Map →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200  p-5 hover:shadow-md transition bg-white/60 ">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                    2
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800  mb-2">Subscribe to Locations</h3>
                    <p className="text-gray-600  text-sm leading-relaxed mb-3">
                      Add your favorite places to track their air quality. View all your subscribed locations in one place.
                    </p>
                    <div className="flex gap-3">
                      <Link
                        to="/dashboard"
                        className="text-blue-600 hover:text-blue-700  text-sm font-medium"
                      >
                        Go to Dashboard →
                      </Link>
                      <Link
                        to="/subscriptions"
                        className="text-blue-600 hover:text-blue-700  text-sm font-medium"
                      >
                        View Subscriptions →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200  p-5 hover:shadow-md transition bg-white/60 ">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                    3
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800  mb-2">Configure Alerts</h3>
                    <p className="text-gray-600  text-sm leading-relaxed mb-3">
                      Choose a sensor from your dashboard first, then press the alert button to set thresholds and configure when you get notified.
                    </p>
                    <Link
                      to="/dashboard"
                      className="text-blue-600 hover:text-blue-700  text-sm font-medium"
                    >
                      Go to Dashboard →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200  p-5 hover:shadow-md transition bg-white/60 ">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                    4
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800  mb-2">Save & Sync</h3>
                    <p className="text-gray-600  text-sm leading-relaxed mb-3">
                      Log in to keep your preferences and alerts synced across devices.
                    </p>
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700  text-sm font-medium"
                    >
                      Log In →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4️⃣ QUICK TIPS */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800  mt-10 mb-4">
              Quick Tips
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 ">
              <li>🌙 Use quiet hours to pause alerts overnight.</li>
              <li>📏 Alert thresholds use the same units shown on pollutant cards.</li>
              <li>✏️ You can edit or remove alerts anytime.</li>
              <li>🔄 Data refreshes periodically; slight delays are normal.</li>
            </ul>
          </section>

          {/* 5️⃣ GLOSSARY */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800  mt-10 mb-4">
              Glossary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <span className="font-semibold text-gray-800 ">AQI:</span>{' '}
                <span className="text-gray-600 ">
                  Air Quality Index, summarizing pollution level.
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-800 ">Pollutant:</span>{' '}
                <span className="text-gray-600 ">
                  Substances measured in air (PM₂.₅, NO₂, O₃).
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-800 ">Threshold:</span>{' '}
                <span className="text-gray-600 ">
                  The limit where an alert triggers.
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-800 ">Quiet Hours:</span>{' '}
                <span className="text-gray-600 ">
                  Periods when notifications are paused.
                </span>
              </div>
            </div>
          </section>

          {/* 6️⃣ DATA SOURCES & CREDITS */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800  mt-10 mb-4">
              Data & Credits
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700  mb-4">
              <li>Public satellite and remote-sensing missions (e.g., TEMPO).</li>
              <li>Open ground-sensor networks and government APIs.</li>
              <li>AQI standards from environmental agencies.</li>
              <li>Open-source libraries and community contributions.</li>
            </ul>
            <p className="text-gray-600  leading-relaxed text-sm italic">
              All data and visuals are for educational purposes only. This project is not intended for medical or safety-critical use.
            </p>
          </section>

          {/* 7️⃣ PRINCIPLES */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800  mt-10 mb-4">
              Our Principles
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 rounded-2xl border border-gray-200  p-5 shadow-sm bg-white/60  backdrop-blur">
                <p className="font-semibold text-gray-800  text-center">
                  Clarity over clutter
                </p>
              </div>
              <div className="flex-1 rounded-2xl border border-gray-200  p-5 shadow-sm bg-white/60  backdrop-blur">
                <p className="font-semibold text-gray-800  text-center">
                  Trustworthy data sources
                </p>
              </div>
              <div className="flex-1 rounded-2xl border border-gray-200  p-5 shadow-sm bg-white/60  backdrop-blur">
                <p className="font-semibold text-gray-800  text-center">
                  Privacy-first alerts
                </p>
              </div>
            </div>
          </section>

          {/* 8️⃣ FINAL CALL-TO-ACTION */}
          <section className="text-center mt-16 pt-8 border-t border-gray-200 ">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link
                to="/dashboard"
                className="inline-block rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 transition-colors"
              >
                Open Dashboard
              </Link>
              <Link
                to="/map"
                className="inline-block rounded-2xl border border-blue-600 text-blue-600 hover:bg-blue-50  px-5 py-2.5 font-medium transition-colors"
              >
                View Map
              </Link>
            </div>
            <p className="text-gray-500  text-sm">
              Built with ❤️ by Team Astro Dreamers for NASA Space Apps Challenge 2025.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default GettingStartedPage;

