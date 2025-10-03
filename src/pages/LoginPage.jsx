import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginUser({ email, password });
  localStorage.setItem('token', res.token);
  localStorage.setItem('expiresIn', res.expiresIn);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Login</h2>
        {error && (
          <div className="mb-4 text-red-500 text-center">
            {error}
            {error === 'Account not verified. Please verify your email and try again.' && (
              <span>
                {' '}
                <button
                  type="button"
                  className="text-indigo-600 hover:underline ml-2"
                  onClick={() => navigate('/verify', { state: { email } })}
                >
                  Verify Now
                </button>
              </span>
            )}
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">Login</button>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account?</span>
          <button type="button" className="ml-2 text-indigo-600 hover:underline" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </form>
    </div>
  );
}
