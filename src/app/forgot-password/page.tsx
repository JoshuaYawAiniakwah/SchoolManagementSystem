"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulating API call (Replace with actual API call)
    setTimeout(() => {
      setIsSubmitted(true);
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                Send Reset Link
              </button>
            </form>

            <div className="mt-4 text-center">
              <a href="/login" className="text-blue-500 hover:underline">
                Back to Login
              </a>
            </div>
          </>
        ) : (
          // Success message after submission
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-600">Success!</h1>
            <p className="text-gray-700 mt-2">A reset link has been sent to your email.</p>
            <a href="/login" className="mt-4 inline-block text-blue-500 hover:underline">
              Back to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
