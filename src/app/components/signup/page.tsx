'use client';
import React, { useState } from 'react';

interface SignupProps {
  onClose?: () => void;
}

const Signup = ({ onClose }: SignupProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          aria-label="Close"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-center mb-2">Create your account</h2>
        <p className="text-gray-500 text-center mb-6">Welcome! Please fill in the details to get started.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email address</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded shadow hover:bg-gray-900 transition"
          >
            Continue
          </button>
        </form>
        <div className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <a
            href="#"
            className="text-indigo-600 hover:underline"
            onClick={e => {
              e.preventDefault();
              onClose && onClose();
            }}
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
