// import React, { useState } from 'react';
// import { verifyUser } from '../api/auth';
// import { useNavigate, useLocation } from 'react-router-dom';

// export default function VerifyPage() {
//   const location = useLocation();
//   const [email, setEmail] = useState(location.state?.email || '');
//   const [code, setCode] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     try {
//       await verifyUser({ email, verificationCode: code });
//       setSuccess('Account verified! You can now log in.');
//       setTimeout(() => navigate('/login'), 2000);
//     } catch (err) {
//       setError(err.message || 'Verification failed');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-indigo-200">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Verify Your Account</h2>
//         {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
//         {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
//         <div className="mb-4">
//           <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
//           <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
//         </div>
//         <div className="mb-6">
//           <label className="block mb-2 text-sm font-medium text-gray-700">Verification Code</label>
//           <input type="text" value={code} onChange={e => setCode(e.target.value)} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
//         </div>
//         <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">Verify</button>
//         <div className="mt-4 text-center">
//           <button type="button" className="text-indigo-600 hover:underline" onClick={() => navigate('/login')}>Back to Login</button>
//         </div>
//       </form>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { verifyUser, resendVerificationCode } from '../api/auth';
import { useNavigate, useLocation } from 'react-router-dom';

function VerifyAccount() {  // ← Missing function declaration
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await verifyUser({ email, verificationCode: code });
      setSuccess('Account verified! You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Verification failed');
    }
  };

  const handleResend = async () => {
    setResendMsg('');
    setResendLoading(true);
    try {
      const msg = await resendVerificationCode(email);
      setResendMsg(msg);
    } catch (err) {
      setResendMsg(err.message || 'Resend failed');
    }
    setResendLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-indigo-200">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Verify Your Account</h2>
        {resendMsg && (
          <div className="mb-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded text-center">{resendMsg}</div>
        )}
        {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center">{error}</div>}
        {success && <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-center">{success}</div>}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">Verification Code</label>
          <input type="text" value={code} onChange={e => setCode(e.target.value)} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">Verify</button>
        <div className="mt-4 text-center flex items-center justify-center gap-2">
          <button type="button" className="text-indigo-600 hover:underline" onClick={() => navigate('/login')}>Back to Login</button>
          <span className="text-indigo-600 cursor-pointer hover:underline" style={{marginLeft: '8px'}} onClick={handleResend}>
            {resendLoading ? 'Resending...' : 'Resend Code'}
          </span>
        </div>
      </form>
    </div>
  );
}

export default VerifyAccount;  // ← Missing export