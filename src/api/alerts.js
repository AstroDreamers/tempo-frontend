// alert.js - API calls for alert management
// Requires Bearer token for authentication

const BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

/**
 * Create or update an alert for a sensor at a location
 * @param {string} locationID - The location ID
 * @param {string} sensorId - The sensor's ID
 * @param {boolean} alertEnabled - Enable or disable the alert
 * @param {number} threshold - Threshold value for the alert
 * @param {string} quietStart - Start time for quiet period (HH:mm:ss)
 * @param {string} quietEnd - End time for quiet period (HH:mm:ss)
 * @param {string} token - Bearer token
 * @returns {Promise<object|string>} - Alert object on success, error message on failure
 */
export async function setAlert(locationID, sensorId, alertEnabled, threshold, quietStart, quietEnd, token) {
  try {
    const body = {
      sensorId,
      alertEnabled,
      threshold,
      quietStart,
      quietEnd,
    };
    const response = await fetch(`${BASE_URL}/subscriptions/${locationID}/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const contentType = response.headers.get('content-type');
    if (response.ok) {
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } else {
      // Error: return text message
      return await response.text();
    }
  } catch (err) {
    return `Network error: ${err.message}`;
  }
}

/**
 * Get alerts for a location
 * @param {string} locationID - The location ID
 * @param {string} token - Bearer token
 * @returns {Promise<object|string>} - Alert object(s) on success, error message on failure
 */
export async function getAlerts(locationID, token) {
  try {
    const response = await fetch(`${BASE_URL}/subscriptions/${locationID}/alerts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const contentType = response.headers.get('content-type');
    if (response.ok) {
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } else {
      // Error: return text message
      return await response.text();
    }
  } catch (err) {
    return `Network error: ${err.message}`;
  }
}

/**
 * Enable an alert for a sensor at a location
 * @param {string} locationID - The location ID
 * @param {string} sensorID - The sensor ID
 * @param {string} token - Bearer token
 * @returns {Promise<object|string>} - Alert object on success, error message on failure
 */
export async function enableAlert(locationID, sensorID, token) {
  try {
    const response = await fetch(`${BASE_URL}/subscriptions/${locationID}/alerts/${sensorID}/enable`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const contentType = response.headers.get('content-type');
    if (response.ok) {
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } else {
      // Error: return text message
      return await response.text();
    }
  } catch (err) {
    return `Network error: ${err.message}`;
  }
}

/**
 * Disable an alert for a sensor at a location
 * @param {string} locationID - The location ID
 * @param {string} sensorID - The sensor ID
 * @param {string} token - Bearer token
 * @returns {Promise<object|string>} - Alert object on success, error message on failure
 */
export async function disableAlert(locationID, sensorID, token) {
  try {
    const response = await fetch(`${BASE_URL}/subscriptions/${locationID}/alerts/${sensorID}/disable`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const contentType = response.headers.get('content-type');
    if (response.ok) {
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } else {
      // Error: return text message
      return await response.text();
    }
  } catch (err) {
    return `Network error: ${err.message}`;
  }
}

/**
 * Delete an alert for a sensor at a location
 * @param {string} locationID - The location ID
 * @param {string} sensorID - The sensor ID
 * @param {string} token - Bearer token
 * @returns {Promise<string>} - Success/error message (text response)
 */
export async function deleteAlert(locationID, sensorID, token) {
  try {
    const response = await fetch(`${BASE_URL}/subscriptions/${locationID}/alerts/${sensorID}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    // DELETE returns text response
    if (response.ok) {
      return await response.text();
    } else {
      // Error: return text message
      return await response.text();
    }
  } catch (err) {
    return `Network error: ${err.message}`;
  }
}