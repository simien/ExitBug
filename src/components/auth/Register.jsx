import React, { useState } from 'react';

export default function Register({ onSwitch, onGuestLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleRegister = async (e) => {
    e.preventDefault();
    // Guest login for now
    if (onGuestLogin) onGuestLogin();
  };

  return (
    <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl w-full max-w-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        Register
      </h2>


      <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-3 rounded-lg mb-6 text-center text-sm font-semibold">
        ⚠️ Registration System Coming Soon
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 opacity-50 pointer-events-none grayscale">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 transition-colors"
            disabled
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 transition-colors"
            disabled
          />
        </div>
        <button
          type="button"
          onClick={onGuestLogin}
          className="mt-2 py-3 rounded-lg bg-green-600 hover:bg-green-500 font-bold text-white shadow-lg transform active:scale-95 transition-all"
        >
          Play as Guest
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have a pass?{' '}
        <button onClick={onSwitch} className="text-green-300 hover:text-green-200 underline">
          Login
        </button>
      </p>
    </div>
  );
}
