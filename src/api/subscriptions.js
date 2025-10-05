// src/api/subscriptions.js

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

// Get all subscriptions
export async function getAllSubscriptions() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');
  const response = await fetch(`${API_BASE}/subscriptions`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch subscriptions');
  return await response.json();
}

// Get a single subscription by locationId
export async function getSubscription(locationId) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');
  const response = await fetch(`${API_BASE}/subscriptions/${locationId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch subscription');
  return await response.json();
}

// Delete a subscription by locationId
export async function deleteSubscription(locationId) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');
  const response = await fetch(`${API_BASE}/subscriptions/${locationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to delete subscription');
  
  // Handle text response instead of JSON
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    // If response is plain text, return it wrapped in an object
    return { message: text };
  }
}

// API for subscribing to a location
export async function subscribeToLocation({ locationId, locationName, lat, lon }) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE}/subscriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ locationId, locationName, lat, lon })
  });

  if (!response.ok) {
    // Try to get error message from response
    let errorMsg = 'Subscription failed';
    try {
      const errorText = await response.text();
      if (errorText) errorMsg = errorText;
    } catch (e) {}
    throw new Error(errorMsg);
  }

  return await response.json();
}