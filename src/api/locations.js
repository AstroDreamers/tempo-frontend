import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;
export async function fetchLocations({ limit = 1000, page = 1 } = {}) {
  const res = await axios.get(`${API_BASE}/oa/locations`, {
    params: { limit, page },
  });
  return (res.data && res.data.results) ? res.data.results.filter(l => l.coordinates) : [];
}
