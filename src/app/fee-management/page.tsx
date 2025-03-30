// app/fee-management/page.tsx
'use client';

import ProtectedRoute from "@/components/ProtectedRoute"; // Adjust the import path as needed
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter

function FeeManagementPage() {
  const router = useRouter(); // Initialize the router

  // Function to handle the "Generate Invoice" button click
  const handleGenerateInvoiceClick = () => {
    router.push('/student-list/invoice-generation'); // Navigate to the InvoiceGenerationPage
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Fee Management</h1>
      <p className="mb-6 text-gray-700">Manage student fee payments and invoices.</p>

      <div className="space-y-4">
        <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
          <h2 className="text-lg font-semibold">💳 View Payment Details</h2>
          <p>Check students fee payment history and details.</p>
          <Link href="/student-list">
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">View Payments</button>
          </Link>
        </div>

        <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
          <h2 className="text-lg font-semibold">📄 Generate Invoices</h2>
          <p>Create and send invoices to parents for fee payments.</p>
          <button
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleGenerateInvoiceClick} // Call the navigation function on click
          >
            Generate Invoice
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