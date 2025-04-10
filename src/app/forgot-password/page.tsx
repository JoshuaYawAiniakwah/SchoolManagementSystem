"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulating API call (Replace with actual API call)
    setTimeout(() => {
      setIsSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        {!isSubmitted ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">Forgot Password</h1>
            <p className="text-gray-600 text-center mb-4">
              Enter your email to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link href="/login" className="text-green-600 hover:underline">
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          // Success message after submission
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-600">Success!</h1>
            <p className="text-gray-700 mt-2">A reset link has been sent to your email.</p>
            <Link href="/login" className="mt-4 inline-block text-green-600 hover:underline">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}