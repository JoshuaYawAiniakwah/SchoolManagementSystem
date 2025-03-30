"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import React, { useState, useEffect } from "react";

// Placeholder User Icon
const UserIcon = () => (
  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
    <span className="text-gray-500 text-sm">N/A</span>
  </div>
);

// Student Image Component
const StudentImage: React.FC<{ fileName?: string; altText: string }> = ({ fileName, altText }) => {
  return fileName ? (
    <img src={fileName} alt={altText} className="w-12 h-12 rounded-full object-cover" />
  ) : (
    <UserIcon />
  );
};

// Interfaces
interface Address {
  streetName?: string;
  houseNumber?: number;
  city?: string;
  region?: string;
  country?: string;
}

interface Guardian {
  pid: string;
  firstName: string;
  lastName: string;
  contactNumber?: string;
  emailAddress?: string;
  occupation?: string;
}

interface MedicalInformation {
  bloodType?: string;
  allergiesOrConditions?: string;
  emergencyContactsName?: string;
  emergencyContactsNumber?: string;
}

interface Student {
  sid: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  religion?: string;
  gender: string;
  passportPhotoPath?: string;
  birthCertificate?: string;
  residentialAddress?: Address;
  medicalInformation?: MedicalInformation;
  parentGuardian?: Guardian[];
}

interface Admission {
  applicationNumber: string;
  classForAdmission: string;
  academicYear?: number;
  preferredSecondLanguage?: string;
  hasSiblingsInSchool?: boolean;
  siblingName?: string;
  siblingClass?: string;
  status?: string;
  student?: Student;
}

// Modal Component
const StudentDetailsModal: React.FC<{ student: Student | undefined; onClose: () => void }> = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Student Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Full Name:</p>
              <p className="text-gray-600">{student.fullName}</p>
            </div>
            <div>
              <p className="font-medium">Date of Birth:</p>
              <p className="text-gray-600">{student.dateOfBirth}</p>
            </div>
            <div>
              <p className="font-medium">Nationality:</p>
              <p className="text-gray-600">{student.nationality}</p>
            </div>
            <div>
              <p className="font-medium">Religion:</p>
              <p className="text-gray-600">{student.religion || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Gender:</p>
              <p className="text-gray-600">{student.gender}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold mb-2">Residential Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Street Name:</p>
                <p className="text-gray-600">{student.residentialAddress?.streetName || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">House Number:</p>
                <p className="text-gray-600">{student.residentialAddress?.houseNumber || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">City:</p>
                <p className="text-gray-600">{student.residentialAddress?.city || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Region:</p>
                <p className="text-gray-600">{student.residentialAddress?.region || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Country:</p>
                <p className="text-gray-600">{student.residentialAddress?.country || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold mb-2">Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Blood Type:</p>
                <p className="text-gray-600">{student.medicalInformation?.bloodType || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Allergies/Conditions:</p>
                <p className="text-gray-600">{student.medicalInformation?.allergiesOrConditions || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Emergency Contact Name:</p>
                <p className="text-gray-600">{student.medicalInformation?.emergencyContactsName || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Emergency Contact Number:</p>
                <p className="text-gray-600">{student.medicalInformation?.emergencyContactsNumber || "N/A"}</p>
              </div>
            </div>
          </div>

          {student.parentGuardian && student.parentGuardian.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-bold mb-2">Parent/Guardian Information</h3>
              <div className="space-y-4">
                {student.parentGuardian.map((parent, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Name:</p>
                        <p className="text-gray-600">{parent.firstName} {parent.lastName}</p>
                      </div>
                      <div>
                        <p className="font-medium">Contact Number:</p>
                        <p className="text-gray-600">{parent.contactNumber || "N/A"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Email Address:</p>
                        <p className="text-gray-600">{parent.emailAddress || "N/A"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Occupation:</p>
                        <p className="text-gray-600">{parent.occupation || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function Applications() {
  const [applications, setApplications] = useState<Admission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("PENDING");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(undefined);
  const [applicationCounts, setApplicationCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    const storedStatus = localStorage.getItem("selectedStatus") || "PENDING";
    setSelectedStatus(storedStatus);
    fetchApplications(storedStatus);
  }, []);

  const updateApplicationCounts = (apps: Admission[]) => {
    setApplicationCounts({
      total: apps.length,
      pending: apps.filter(app => app.status === "PENDING").length,
      approved: apps.filter(app => app.status === "APPROVED").length,
      rejected: apps.filter(app => app.status === "REJECTED").length
    });
  };

  const fetchApplications = async (status: string) => {
    setLoading(true);
    setError(null);
    setIsDataLoaded(false);

    try {
      let url = "https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/admissions";
      
      if (status !== "ALL") {
        url = `https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/admissions/status?status=${status}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setApplications(data);
      
      // To get counts, we need to fetch all applications
      const allResponse = await fetch("https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/admissions");
      if (!allResponse.ok) {
        throw new Error(`HTTP error! status: ${allResponse.status}`);
      }
      
      const allData = await allResponse.json();
      updateApplicationCounts(allData);
      
      setSelectedStatus(status);
      localStorage.setItem("selectedStatus", status);
      setIsDataLoaded(true);
    } catch (error: any) {
      console.error("❌ Error fetching applications:", error.message);
      setError("Error fetching applications. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllApplications = async () => {
    setLoading(true);
    setError(null);
    setIsDataLoaded(false);

    try {
      const response = await fetch("https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/admissions");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setApplications(data);
      updateApplicationCounts(data);
      setSelectedStatus("ALL");
      localStorage.setItem("selectedStatus", "ALL");
      setIsDataLoaded(true);
    } catch (error: any) {
      console.error("❌ Error fetching all applications:", error.message);
      setError("Error fetching all applications. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationNumber: string, status: string) => {
    if (!applicationNumber) return setError("Missing Application Number. Update failed.");

    try {
      const response = await fetch("https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/admissions/updateStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationNumber,
          status
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the applications after update
      await fetchApplications(selectedStatus);
    } catch (error: any) {
      console.error("❌ Error updating application status:", error.message);
      setError(`Error updating application status: ${error.message}`);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-6">Application Management</h1>

        {/* Application Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-gray-500">Total Applications</h3>
            <p className="text-2xl font-bold">{applicationCounts.total}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <h3 className="font-medium text-blue-600">Pending</h3>
            <p className="text-2xl font-bold text-blue-600">{applicationCounts.pending}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <h3 className="font-medium text-green-600">Approved</h3>
            <p className="text-2xl font-bold text-green-600">{applicationCounts.approved}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow">
            <h3 className="font-medium text-red-600">Rejected</h3>
            <p className="text-2xl font-bold text-red-600">{applicationCounts.rejected}</p>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-3">
            {["PENDING", "APPROVED", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => fetchApplications(status)}
                className={`px-4 py-2 rounded text-white ${
                  selectedStatus === status
                    ? "bg-gray-700"
                    : status === "PENDING"
                    ? "bg-blue-500 hover:bg-blue-600"
                    : status === "APPROVED"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Fetch {status} Applications
              </button>
            ))}
            <button
              onClick={fetchAllApplications}
              className="px-4 py-2 rounded text-white bg-purple-500 hover:bg-purple-600"
            >
              Fetch All Applications
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {isDataLoaded && (
          <h2 className="text-xl font-semibold mb-4">
            {selectedStatus === "PENDING"
              ? "Pending Applications"
              : selectedStatus === "APPROVED"
              ? "Approved Applications"
              : selectedStatus === "REJECTED"
              ? "Rejected Applications"
              : "All Applications"}
          </h2>
        )}

        {!loading && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Application Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Photo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date of Birth</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nationality</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Gender</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app.applicationNumber} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{app.applicationNumber}</td>
                      <td className="px-4 py-3">
                        <StudentImage fileName={app.student?.passportPhotoPath} altText={app.student?.fullName || "Student"} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{app.student?.fullName || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{app.student?.dateOfBirth || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{app.student?.nationality || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{app.student?.gender || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{app.classForAdmission}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-3 py-1 rounded text-xs font-medium ${
                          app.status === "APPROVED" ? "bg-green-100 text-green-800" : 
                          app.status === "PENDING" ? "bg-blue-100 text-blue-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {app.status === "PENDING" ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateApplicationStatus(app.applicationNumber, "APPROVED")}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(app.applicationNumber, "REJECTED")}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500">No actions</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => setSelectedStudent(app.student)}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="p-4 text-center text-gray-500">
                      No applications found. Try changing the status filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedStudent && (
          <StudentDetailsModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(undefined)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

export default function ProtectedApplications() {
  return (
    <ProtectedRoute>
      <Applications />
    </ProtectedRoute>
  );
}