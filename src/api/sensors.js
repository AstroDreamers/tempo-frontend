import axios from "axios";

const API_BASE = "http://localhost:8080";

export async function getSensorsByLocationId(locationId) {
  const res = await axios.get(`${API_BASE}/oa/locations/${locationId}/sensors`);
  return res.data && res.data.results ? res.data.results : [];
}

export async function getLatestMeasureByLocationId(locationId, { limit = 10, page = 1, datetime_min } = {}) {
  const params = { limit, page };
  if (datetime_min) params.datetime_min = datetime_min;
  const res = await axios.get(`${API_BASE}/oa/locations/${locationId}/latest`, { params });
  return res.data && res.data.results ? res.data.results : [];
}

export async function getHourlyMeasurementBySensorId(sensorId, { datetime_from, datetime_to, limit = 24, page = 1 }) {
  const params = { datetime_from, datetime_to, limit, page };
  const res = await axios.get(`${API_BASE}/oa/sensors/${sensorId}/hours`, { params });
  return res.data && res.data.results ? res.data.results : [];
}
