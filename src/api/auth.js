// API functions for authentication
const API_URL = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

export async function resendVerificationCode(email) {
  const res = await fetch(`${API_URL}/resend?email=${encodeURIComponent(email)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || 'Resend failed');
  return text;
}


export async function loginUser({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    let errorMsg = 'Invalid credentials';
    try {
      const errorData = await res.json();
      if (errorData && errorData.message) errorMsg = errorData.message;
    } catch (e) {}
    throw new Error(errorMsg);
  }
  const data = await res.json();
  // data should have { token, expiresIn }
  return { token: data.token, expiresIn: data.expiresIn };
}

export async function signupUser({ email, password, name }) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username: name })
  });
  if (!res.ok) throw new Error('Signup failed');
  return await res.json();
}


export async function verifyUser({ email, verificationCode }) {
  const res = await fetch(`${API_URL}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, verificationCode })
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || 'Verification failed');
  return text;
}
