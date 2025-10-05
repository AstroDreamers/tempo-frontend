import React from "react";

export default function AqiReferenceTable() {
  return (
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
  );
}
