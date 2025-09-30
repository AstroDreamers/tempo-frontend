import axios from "axios";

const API_BASE = "http://localhost:8080";

export async function fetchLocations({ limit = 1000, page = 1 } = {}) {
  const res = await axios.get(`${API_BASE}/oa/locations`, {
    params: { limit, page },
  });
  return (res.data && res.data.results) ? res.data.results.filter(l => l.coordinates) : [];
}
