import React from "react";

export default function AiInsight({ insight, loading = false }) {
  return (
    <div className="bg-white border border-blue-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-blue-800 mb-2">AI insight:</h3>
          {loading ? (
            <div className="text-sm text-gray-500">
              <div className="animate-pulse flex space-x-1">
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ) : insight ? (
            <div className="text-sm text-gray-700 whitespace-pre-line">
              {insight}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Click on a location to get AI-powered air quality insights.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
