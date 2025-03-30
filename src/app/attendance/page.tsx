"use client";
import ProtectedRoute from "@/components/ProtectedRoute"; // Adjust the import path as needed

function ReportingPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance & Grades</h1>
      <p className="mb-6 text-gray-700">View the attendance and grades of all students.</p>

      <div className="space-y-4">
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
          <h2 className="text-lg font-semibold">📅 Attendance & Grades</h2>
          <p>Compare student attendance and academic performance.</p>
          <button className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded">Check Attendance and Grades</button>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedReportingPage() {
  return (
    <ProtectedRoute>
      <ReportingPage />
    </ProtectedRoute>
  );
}