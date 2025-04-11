// app/fee-management/page.tsx
'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function FeeManagementPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const handleGenerateInvoiceClick = () => {
    setIsGenerating(true);
    // Simulate loading before navigation
    setTimeout(() => {
      router.push('/student-list/invoice-generation');
      setIsGenerating(false);
    }, 1000);
  };

  const handleViewPaymentsClick = () => {
    setIsViewing(true);
    // Simulate loading before navigation
    setTimeout(() => {
      router.push('/student-list');
      setIsViewing(false);
    }, 1000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-black-800">Fee Management</h1>
      <p className="mb-6 text-black-700">Manage student fee payments and invoices.</p>

      <div className="space-y-6">
        <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-800">💳 View Payment Details</h2>
          <p className="text-green-700 mt-2">Check students fee payment history and details.</p>
          <button
            onClick={handleViewPaymentsClick}
            disabled={isViewing}
            className={`mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md ${
              isViewing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isViewing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              'View Payments'
            )}
          </button>
        </div>

        <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-800">📄 Generate Invoices</h2>
          <p className="text-green-700 mt-2">Create and send invoices to parents for fee payments.</p>
          <button
            onClick={handleGenerateInvoiceClick}
            disabled={isGenerating}
            className={`mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md ${
              isGenerating ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Invoice'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedFeeManagementPage() {
  return (
    <ProtectedRoute>
      <FeeManagementPage />
    </ProtectedRoute>
  );
}