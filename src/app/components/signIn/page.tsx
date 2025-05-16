"use client";
import React, { useState } from "react";

interface SignInModalProps {
  onClose?: () => void;
  onSignUp?: () => void;
}

const SignInModal = ({ onClose, onSignUp }: SignInModalProps) => {
  const [email, setEmail] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* Close Button */}
        <button
          className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close"
          onClick={onClose}
        >
          &times;
        </button>
        {/* Title */}
        <h2 className="mb-1 text-center text-xl font-semibold text-gray-900">
          Sign in to pfp.fm
        </h2>
        {/* Subtitle */}
        <p className="mb-6 text-center text-gray-500 text-sm">
          Welcome back! Please sign in to continue
        </p>
        {/* Email Input */}
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="email"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Continue Button */}
        <button className="mb-4 w-full rounded-md bg-gray-800 py-2 text-white font-semibold hover:bg-gray-700 transition">
          Continue
        </button>
        {/* Sign up Link */}
        <div className="mb-2 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <a
            href="#"
            className="text-blue-600 hover:underline font-medium"
            onClick={(e) => {
              e.preventDefault();
              onClose && onClose();
              onSignUp && onSignUp();
            }}
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
