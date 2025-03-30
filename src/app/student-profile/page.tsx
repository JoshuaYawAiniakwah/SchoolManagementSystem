"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";

const UserIcon = () => (
  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
    <span className="text-gray-500 text-sm">N/A</span>
  </div>
);

const fetchImage = async (fileName: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/api/getFile`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      }
    );

    if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("❌ Error fetching image:", error);
    return null;
  }
};

const StudentImage: React.FC<{ fileName: string; altText: string }> = ({ fileName, altText }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => setImageUrl(await fetchImage(fileName));
    loadImage();
  }, [fileName]);

  return imageUrl ? (
    <img src={imageUrl} alt={altText} className="w-12 h-12 rounded-full object-cover" />
  ) : (
    <UserIcon />
  );
};

interface ResidentialAddress {
  city?: string | null;
  region?: string | null;
  country?: string | null;
  street_name?: string | null;
  house_number?: number | null;
}

interface MedicalInformation {
  bloodType?: string;
  allergiesOrConditions?: string;
  emergencyContactsName?: string;
  emergencyContactsNumber?: string;
}

interface ParentGuardian {
  firstName: string;
  lastName: string;
  contactNumber?: string | null;
  emailAddress?: string | null;
  occupation?: string | null;
}

interface Student {
  fullName: string;
  grade: string;
  dateOfBirth: string;
  nationality: string;
  religion: string;
  gender: string;
  passportPhotoPath: string;
  residentialAddress?: ResidentialAddress;
  medicalInformation?: MedicalInformation;
  parentGuardian?: ParentGuardian[];
  previousAcademicDetail?: string | null;
  studentId: string;
}

interface Admission {
  classForAdmission: string;
  academicYear: number;
  preferredSecondLanguage?: string | null;
  hasSiblingsInSchool: boolean;
  siblingName?: string | null;
  siblingClass?: string | null;
  status?: string | null;
  student: Student;
}

const StudentDetailsPopup: React.FC<{ student: Student; onClose: () => void }> = ({ student, onClose }) => {
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
        {/* ... rest of the popup content remains the same ... */}
      </div>
    </div>
  );
};

function StudentList() {
  const [students, setStudents] = useState<Admission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classQuery, setClassQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isViewAllLoading, setIsViewAllLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchAPI = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      if (!text) {
        return [];
      }

      return JSON.parse(text);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const searchStudentsByName = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a name to search.");
      return;
    }
    
    setIsSearching(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = await fetchAPI(
        `https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/students/search?name=${encodeURIComponent(searchQuery)}`
      );
      const mappedStudents = Array.isArray(data) ? data.map((student: Student) => ({
        classForAdmission: student.grade,
        academicYear: new Date().getFullYear(),
        preferredSecondLanguage: null,
        hasSiblingsInSchool: false,
        siblingName: null,
        siblingClass: null,
        status: "Active",
        student,
      })) : [];
      setStudents(mappedStudents);
      setHasSearched(true);
      if (mappedStudents.length === 0) {
        setError("No students found matching your search");
      }
    } catch (error: any) {
      console.error("Error searching students by name:", error);
      setError(error.message || "Failed to search students. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const fetchStudentsByClass = async () => {
    if (!classQuery.trim()) {
      setError("Please select a class to search.");
      return;
    }
    
    setIsFiltering(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = await fetchAPI(
        `https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/students/grade?grade=${encodeURIComponent(classQuery)}`
      );
      const mappedStudents = Array.isArray(data) ? data.map((student: Student) => ({
        classForAdmission: student.grade,
        academicYear: new Date().getFullYear(),
        preferredSecondLanguage: null,
        hasSiblingsInSchool: false,
        siblingName: null,
        siblingClass: null,
        status: "Active",
        student,
      })) : [];
      setStudents(mappedStudents);
      setHasSearched(true);
      if (mappedStudents.length === 0) {
        setError("No students found in this class");
      }
    } catch (error: any) {
      console.error("Error fetching students by class:", error);
      setError(error.message || "Failed to fetch students by class. Please try again.");
    } finally {
      setIsFiltering(false);
    }
  };

  const fetchAllStudents = async () => {
    setIsViewAllLoading(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = await fetchAPI("https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/students");
      const mappedStudents = Array.isArray(data) ? data.map((student: Student) => ({
        classForAdmission: student.grade,
        academicYear: new Date().getFullYear(),
        preferredSecondLanguage: null,
        hasSiblingsInSchool: false,
        siblingName: null,
        siblingClass: null,
        status: "Active",
        student,
      })) : [];
      setStudents(mappedStudents);
      setHasSearched(true);
      if (mappedStudents.length === 0) {
        setError("No students found in the system");
      }
    } catch (error: any) {
      console.error("Error fetching all students:", error);
      setError(error.message || "Failed to fetch students. Please try again.");
    } finally {
      setIsViewAllLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const totalStudents = students.length;
  const maleCount = students.filter(admission => admission.student.gender === 'Male').length;
  const femaleCount = students.filter(admission => admission.student.gender === 'Female').length;

  return (
    <ProtectedRoute>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-6">Student Profile Management</h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded" role="alert">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Search by Name</label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter student name..."
                  className="w-full p-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchStudentsByName()}
                />
                <button
                  onClick={searchStudentsByName}
                  disabled={isSearching || !searchQuery.trim()}
                  className={`bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 flex items-center justify-center ${(isSearching || !searchQuery.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSearching ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : 'Search'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Search by Class</label>
              <div className="flex">
                <select
                  className="w-full p-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-300"
                  value={classQuery}
                  onChange={(e) => setClassQuery(e.target.value)}
                >
                  <option value="">Select Class</option>
                  <option value="Creche">Creche</option>
                  <option value="Nursery 1">Nursery 1</option>
                  <option value="Nursery 2">Nursery 2</option>
                  <option value="KG 1">KG 1</option>
                  <option value="KG 2">KG 2</option>
                  {[...Array(9).keys()].map((grade) => (
                    <option key={grade + 1} value={`Grade ${grade + 1}`}>
                      Grade {grade + 1}
                    </option>
                  ))}
                </select>
                <button
                  onClick={fetchStudentsByClass}
                  disabled={isFiltering || !classQuery.trim()}
                  className={`bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 flex items-center justify-center ${(isFiltering || !classQuery.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isFiltering ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Filtering...
                    </>
                  ) : 'Search'}
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchAllStudents}
                disabled={isViewAllLoading}
                className={`w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center ${isViewAllLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isViewAllLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : 'View All Students'}
              </button>
            </div>
          </div>
        </div>

        {students.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-lg shadow text-center">
                <h3 className="font-bold text-lg">Total Students</h3>
                <p className="text-2xl">{totalStudents}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow text-center">
                <h3 className="font-bold text-lg">Male Students</h3>
                <p className="text-2xl">{maleCount}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow text-center">
                <h3 className="font-bold text-lg">Female Students</h3>
                <p className="text-2xl">{femaleCount}</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3">Loading students...</span>
          </div>
        )}

        {!loading && !hasSearched && students.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">
              Use the search or filter options above to view students
            </p>
          </div>
        )}

        {!loading && hasSearched && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Photo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date of Birth</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nationality</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Gender</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.length > 0 ? (
                  students.map((admission, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <StudentImage fileName={admission.student.passportPhotoPath} altText={admission.student.fullName} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{admission.student.fullName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{admission.student.dateOfBirth}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{admission.student.nationality}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{admission.student.gender}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {admission.student.residentialAddress?.street_name}, {admission.student.residentialAddress?.city}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{admission.student.grade}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => setSelectedStudent(admission.student)}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      No students found. Try searching or viewing all students.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedStudent && (
          <StudentDetailsPopup student={selectedStudent} onClose={() => setSelectedStudent(null)} />
        )}
      </div>
    </ProtectedRoute>
  );
}

export default function ProtectedStudentList() {
  return (
    <ProtectedRoute>
      <StudentList />
    </ProtectedRoute>
  );
}