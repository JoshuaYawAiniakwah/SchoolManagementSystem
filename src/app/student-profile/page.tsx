"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { Modal } from '@/components/ui/Modal';

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
  status?: string;
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

const StudentDetailsPopup: React.FC<{ student: Student | undefined; onClose: () => void }> = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-green-200">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-green-800">Student Details</h2>
          <button onClick={onClose} className="text-green-600 hover:text-green-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-green-700">Full Name:</p>
              <p className="text-green-600">{student.fullName}</p>
            </div>
            <div>
              <p className="font-medium text-green-700">Date of Birth:</p>
              <p className="text-green-600">{student.dateOfBirth}</p>
            </div>
            <div>
              <p className="font-medium text-green-700">Nationality:</p>
              <p className="text-green-600">{student.nationality}</p>
            </div>
            <div>
              <p className="font-medium text-green-700">Religion:</p>
              <p className="text-green-600">{student.religion || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium text-green-700">Gender:</p>
              <p className="text-green-600">{student.gender}</p>
            </div>
          </div>

          <div className="border-t border-green-200 pt-4">
            <h3 className="font-bold mb-2 text-green-800">Residential Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-green-700">Street Name:</p>
                <p className="text-green-600">{student.residentialAddress?.street_name || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-green-700">House Number:</p>
                <p className="text-green-600">{student.residentialAddress?.house_number || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-green-700">City:</p>
                <p className="text-green-600">{student.residentialAddress?.city || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-green-700">Region:</p>
                <p className="text-green-600">{student.residentialAddress?.region || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-green-700">Country:</p>
                <p className="text-green-600">{student.residentialAddress?.country || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-green-200 pt-4">
            <h3 className="font-bold mb-2 text-green-800">Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-green-700">Blood Type:</p>
                <p className="text-green-600">{student.medicalInformation?.bloodType || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-green-700">Allergies/Conditions:</p>
                <p className="text-green-600">{student.medicalInformation?.allergiesOrConditions || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-green-700">Emergency Contact Name:</p>
                <p className="text-green-600">{student.medicalInformation?.emergencyContactsName || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-green-700">Emergency Contact Number:</p>
                <p className="text-green-600">{student.medicalInformation?.emergencyContactsNumber || "N/A"}</p>
              </div>
            </div>
          </div>

          {student.parentGuardian && student.parentGuardian.length > 0 && (
            <div className="border-t border-green-200 pt-4">
              <h3 className="font-bold mb-2 text-green-800">Parent/Guardian Information</h3>
              <div className="space-y-4">
                {student.parentGuardian.map((parent, idx) => (
                  <div key={idx} className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-green-700">Name:</p>
                        <p className="text-green-600">{parent.firstName} {parent.lastName}</p>
                      </div>
                      <div>
                        <p className="font-medium text-green-700">Contact Number:</p>
                        <p className="text-green-600">{parent.contactNumber || "N/A"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-green-700">Email Address:</p>
                        <p className="text-green-600">{parent.emailAddress || "N/A"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-green-700">Occupation:</p>
                        <p className="text-green-600">{parent.occupation || "N/A"}</p>
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
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function StudentList() {
  const [students, setStudents] = useState<Admission[]>([]);
  const [allStudents, setAllStudents] = useState<Admission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classQuery, setClassQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isViewAllLoading, setIsViewAllLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentStudentForStatus, setCurrentStudentForStatus] = useState<Admission | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [newGrade, setNewGrade] = useState("");
  const [isStatusFilterLoading, setIsStatusFilterLoading] = useState(false);
  const [currentStatusFilter, setCurrentStatusFilter] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isPromoteLoading, setIsPromoteLoading] = useState(false);

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
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const fetchAllStudents = async () => {
    setIsViewAllLoading(true);
    setCurrentStatusFilter("");
    setError(null);
    try {
      const data = await fetchAPI("https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/students/approved");
      
      const savedStatuses = JSON.parse(localStorage.getItem('studentStatuses') || '{}');
      
      const mappedStudents = Array.isArray(data) ? data.map((student: Student) => {
        const status = savedStatuses[student.studentId] || student.status || "ACTIVE";
        
        return {
          classForAdmission: student.grade,
          academicYear: new Date().getFullYear(),
          preferredSecondLanguage: null,
          hasSiblingsInSchool: false,
          siblingName: null,
          siblingClass: null,
          status: status,
          student: {
            ...student,
            status: status
          },
        };
      }) : [];

      setStudents(mappedStudents);
      setAllStudents(mappedStudents);
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

  const searchStudentsByName = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a name to search.");
      return;
    }
    
    setIsSearching(true);
    setError(null);
    try {
      const data = await fetchAPI(
        `https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/students/approved/search/name?name=${encodeURIComponent(searchQuery)}`
      );

      const mappedStudents = Array.isArray(data) ? data.map((student: Student) => ({
        classForAdmission: student.grade,
        academicYear: new Date().getFullYear(),
        preferredSecondLanguage: null,
        hasSiblingsInSchool: false,
        siblingName: null,
        siblingClass: null,
        status: student.status || "ACTIVE",
        student: {
          ...student,
          status: student.status || "ACTIVE"
        }
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
      const data = await fetchAPI(
        `https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/students/approved/search/grade?grade=${encodeURIComponent(classQuery)}`
      );

      const mappedStudents = Array.isArray(data) ? data.map((student: Student) => ({
        classForAdmission: student.grade,
        academicYear: new Date().getFullYear(),
        preferredSecondLanguage: null,
        hasSiblingsInSchool: false,
        siblingName: null,
        siblingClass: null,
        status: student.status || "ACTIVE",
        student: {
          ...student,
          status: student.status || "ACTIVE"
        }
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

  const fetchStudentsByStatus = async (status: string) => {
    setIsStatusFilterLoading(true);
    setCurrentStatusFilter(status);
    setError(null);
    try {
      const formattedStatus = status.toUpperCase();
      const data = await fetchAPI(
        `https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/students/status/${formattedStatus}`
      );

      const mappedStudents = Array.isArray(data) ? data.map((student: Student) => ({
        classForAdmission: student.grade,
        academicYear: new Date().getFullYear(),
        preferredSecondLanguage: null,
        hasSiblingsInSchool: false,
        siblingName: null,
        siblingClass: null,
        status: student.status || status,
        student: {
          ...student,
          status: student.status || status
        }
      })) : [];
      
      setStudents(mappedStudents);
      setHasSearched(true);
      
      if (mappedStudents.length === 0) {
        setError(`No ${status.toLowerCase()} students found`);
      }
    } catch (error: any) {
      console.error(`Error fetching ${status} students:`, error);
      setError(error.message || `Failed to fetch ${status} students. Please try again.`);
    } finally {
      setIsStatusFilterLoading(false);
    }
  };

  const updateStudentStatus = async (studentId: string, status: string) => {
    try {
      setIsUpdatingStatus(true);
      setError(null);
      
      const formattedStatus = status.toUpperCase();
      console.log("Updating status to:", formattedStatus);
      
      const endpoint = `https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/students/status/updateGrade/${studentId}?newStatus=${formattedStatus}`;
      
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        }
      });

      console.log("Response status:", response.status);
      const responseData = await response.text();
      console.log("Response data:", responseData);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      // Update localStorage
      const savedStatuses = JSON.parse(localStorage.getItem('studentStatuses') || '{}');
      savedStatuses[studentId] = formattedStatus;
      localStorage.setItem('studentStatuses', JSON.stringify(savedStatuses));

      // Update both students and allStudents state
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.student.studentId === studentId 
            ? { 
                ...student, 
                status: formattedStatus,
                student: { ...student.student, status: formattedStatus }
              } 
            : student
        )
      );

      setAllStudents(prevAllStudents => 
        prevAllStudents.map(student => 
          student.student.studentId === studentId 
            ? { 
                ...student, 
                status: formattedStatus,
                student: { ...student.student, status: formattedStatus }
              } 
            : student
        )
      );
      
      setIsStatusModalOpen(false);
      setError(`Status updated successfully to ${formattedStatus}`);
      setTimeout(() => setError(null), 3000);
      
    } catch (error) {
      console.error("Error updating student status:", error);
      setError(error instanceof Error ? error.message : "Failed to update student status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const promoteStudent = async () => {
    if (!currentStudentForStatus || !newGrade) return;

    try {
      setIsPromoteLoading(true);
      const endpoint = `https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/students/promote/${currentStudentForStatus.student.studentId}`;
      
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newGrade
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      // Update localStorage for grades if needed
      const savedGrades = JSON.parse(localStorage.getItem('studentGrades') || '{}');
      savedGrades[currentStudentForStatus.student.studentId] = newGrade;
      localStorage.setItem('studentGrades', JSON.stringify(savedGrades));

      // Update both states
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.student.studentId === currentStudentForStatus.student.studentId 
            ? { 
                ...student, 
                classForAdmission: newGrade,
                student: { ...student.student, grade: newGrade }
              } 
            : student
        )
      );

      setAllStudents(prevAllStudents => 
        prevAllStudents.map(student => 
          student.student.studentId === currentStudentForStatus.student.studentId 
            ? { 
                ...student, 
                classForAdmission: newGrade,
                student: { ...student.student, grade: newGrade }
              } 
            : student
        )
      );

      setIsPromoteModalOpen(false);
      setIsConfirmationModalOpen(false);
      setError(`Student promoted to ${newGrade} successfully`);
      setTimeout(() => setError(null), 3000);
    } catch (error) {
      console.error("Error promoting student:", error);
      setError(error instanceof Error ? error.message : "Failed to promote student");
    } finally {
      setIsPromoteLoading(false);
    }
  };

  const openStatusModal = (student: Admission) => {
    setCurrentStudentForStatus(student);
    setNewStatus(student.status || "ACTIVE");
    setIsStatusModalOpen(true);
  };

  const openPromoteModal = (student: Admission) => {
    setCurrentStudentForStatus(student);
    setNewGrade("");
    setIsPromoteModalOpen(true);
  };

  const allClasses = [
    "Creche", "Nursery 1", "Nursery 2", "KG 1", "KG 2", 
    ...Array.from({ length: 9 }, (_, i) => `Grade ${i + 1}`)
  ];

  useEffect(() => {
    fetchAllStudents();
  }, []);

  // Calculate counts from allStudents
  const totalStudents = allStudents.length;
  const maleCount = allStudents.filter(admission => 
    admission.student.gender && admission.student.gender.toLowerCase() === 'male'
  ).length;
  const femaleCount = allStudents.filter(admission => 
    admission.student.gender && admission.student.gender.toLowerCase() === 'female'
  ).length;

  const activeStudentsCount = allStudents.filter(s => s.status === "ACTIVE").length;
  const completedStudentsCount = allStudents.filter(s => s.status === "COMPLETED").length;
  const suspendedStudentsCount = allStudents.filter(s => s.status === "SUSPENDED").length;
  const sackedStudentsCount = allStudents.filter(s => s.status === "SACKED").length;

  return (
    <ProtectedRoute>
      <div className="p-5 bg-green-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-green-800">Student Profile Management</h1>

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

        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-green-700">Search by Name</label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter student name..."
                  className="flex-1 p-2 border border-green-300 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchStudentsByName()}
                />
                <button
                  onClick={searchStudentsByName}
                  disabled={isSearching || !searchQuery.trim()}
                  className={`bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700 flex items-center justify-center ${(isSearching || !searchQuery.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              <label className="block text-sm font-medium mb-1 text-green-700">Search by Class</label>
              <div className="flex">
                <select
                  className="flex-1 p-2 border border-green-300 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className={`bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700 flex items-center justify-center ${(isFiltering || !classQuery.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                className={`w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center ${isViewAllLoading ? 'opacity-50 cursor-not-allowed' : ''} transition-colors shadow-md`}
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

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => {
                setCurrentStatusFilter("ACTIVE");
                fetchStudentsByStatus("ACTIVE");
              }}
              className={`bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center ${
                isStatusFilterLoading && currentStatusFilter === "ACTIVE" ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isStatusFilterLoading && currentStatusFilter === "ACTIVE" ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <span className="mr-1">Active ({activeStudentsCount})</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setCurrentStatusFilter("COMPLETED");
                fetchStudentsByStatus("COMPLETED");
              }}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center ${
                isStatusFilterLoading && currentStatusFilter === "COMPLETED" ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isStatusFilterLoading && currentStatusFilter === "COMPLETED" ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <span className="mr-1">Completed ({completedStudentsCount})</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setCurrentStatusFilter("SUSPENDED");
                fetchStudentsByStatus("SUSPENDED");
              }}
              className={`bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center ${
                isStatusFilterLoading && currentStatusFilter === "SUSPENDED" ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isStatusFilterLoading && currentStatusFilter === "SUSPENDED" ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <span className="mr-1">Suspended ({suspendedStudentsCount})</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setCurrentStatusFilter("SACKED");
                fetchStudentsByStatus("SACKED");
              }}
              className={`bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center ${
                isStatusFilterLoading && currentStatusFilter === "SACKED" ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isStatusFilterLoading && currentStatusFilter === "SACKED" ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <span className="mr-1">Sacked ({sackedStudentsCount})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {students.length > 0 && (
          <div className="bg-green-100 p-6 rounded-lg shadow-md mb-6 border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200 text-center">
                <h3 className="font-bold text-lg text-green-800">Total Students</h3>
                <p className="text-2xl text-green-600">{totalStudents}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200 text-center">
                <h3 className="font-bold text-lg text-green-800">Male Students</h3>
                <p className="text-2xl text-green-600">{maleCount}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200 text-center">
                <h3 className="font-bold text-lg text-green-800">Female Students</h3>
                <p className="text-2xl text-green-600">{femaleCount}</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <span className="ml-3 text-green-700">Loading students...</span>
          </div>
        )}

        {!loading && !hasSearched && students.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center border border-green-200">
            <p className="text-green-700 text-lg">
              Use the search or filter options above to view students
            </p>
          </div>
        )}

        {!loading && hasSearched && (
          <div className="bg-white rounded-lg shadow overflow-hidden border border-green-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Photo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Date of Birth</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Nationality</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Gender</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.length > 0 ? (
                  students.map((admission, index) => (
                    <tr key={index} className="hover:bg-green-50">
                      <td className="px-4 py-3">
                        <StudentImage fileName={admission.student.passportPhotoPath} altText={admission.student.fullName} />
                      </td>
                      <td className="px-4 py-3 text-sm text-green-900">{admission.student.fullName}</td>
                      <td className="px-4 py-3 text-sm text-green-700">{admission.student.dateOfBirth}</td>
                      <td className="px-4 py-3 text-sm text-green-700">{admission.student.nationality}</td>
                      <td className="px-4 py-3 text-sm text-green-700">{admission.student.gender}</td>
                      <td className="px-4 py-3 text-sm text-green-700">{admission.student.grade}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          admission.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                          admission.status === "COMPLETED" ? "bg-blue-100 text-blue-800" :
                          admission.status === "SUSPENDED" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {admission.status || "ACTIVE"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => setSelectedStudent(admission.student)}
                            className="text-green-600 hover:text-green-800 hover:underline text-left"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => openStatusModal(admission)}
                            className="text-green-600 hover:text-green-800 hover:underline text-left"
                          >
                            Update Status
                          </button>
                          <button
                            onClick={() => openPromoteModal(admission)}
                            disabled={!(admission.status === "ACTIVE")}
                            className={`text-green-600 hover:text-green-800 hover:underline text-left ${
                              !(admission.status === "ACTIVE") ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            Promote
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-green-700">
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

        {isStatusModalOpen && currentStudentForStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md border-2 border-green-200">
              <h2 className="text-xl font-bold mb-4 text-green-800">Update Student Status</h2>
              <div className="space-y-4">
                <p><span className="font-medium text-green-700">Student:</span> <span className="text-green-600">{currentStudentForStatus.student.fullName}</span></p>
                <p><span className="font-medium text-green-700">Current Status:</span> <span className="text-green-600">{currentStudentForStatus.status || "ACTIVE"}</span></p>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-green-700">New Status</label>
                  <select
                    className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    disabled={isUpdatingStatus}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="SACKED">Sacked</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 border border-green-300 rounded hover:bg-green-50 transition-colors"
                  disabled={isUpdatingStatus}
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateStudentStatus(currentStudentForStatus.student.studentId, newStatus)}
                  className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center ${
                    isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''
                  } transition-colors`}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}

        {isPromoteModalOpen && currentStudentForStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md border-2 border-green-200">
              <h2 className="text-xl font-bold mb-4 text-green-800">Promote Student</h2>
              <div className="space-y-4">
                <p><span className="font-medium text-green-700">Student:</span> <span className="text-green-600">{currentStudentForStatus.student.fullName}</span></p>
                <p><span className="font-medium text-green-700">Current Class:</span> <span className="text-green-600">{currentStudentForStatus.student.grade}</span></p>
                <p><span className="font-medium text-green-700">Student ID:</span> <span className="text-green-600">{currentStudentForStatus.student.studentId}</span></p>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-green-700">Promote To</label>
                  <select
                    className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                  >
                    <option value="">Select New Class</option>
                    {allClasses.map((className, index) => {
                      const currentIndex = allClasses.indexOf(currentStudentForStatus.student.grade);
                      if (index > currentIndex) {
                        return (
                          <option key={className} value={className}>{className}</option>
                        );
                      }
                      return null;
                    })}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsPromoteModalOpen(false)}
                  className="px-4 py-2 border border-green-300 rounded hover:bg-green-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newGrade) {
                      setIsConfirmationModalOpen(true);
                    }
                  }}
                  disabled={!newGrade}
                  className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${!newGrade ? 'opacity-50 cursor-not-allowed' : ''} transition-colors`}
                >
                  Promote Student
                </button>
              </div>
            </div>
          </div>
        )}

        {isConfirmationModalOpen && currentStudentForStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md border-2 border-green-200">
              <h2 className="text-xl font-bold mb-4 text-green-800">Confirm Promotion</h2>
              <div className="space-y-4">
                <p className="text-red-600 font-medium">Are you sure you want to promote {currentStudentForStatus.student.fullName} to {newGrade}?</p>
                <p className="text-sm text-gray-600">This action is not reversible.</p>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsConfirmationModalOpen(false)}
                  className="px-4 py-2 border border-green-300 rounded hover:bg-green-50 transition-colors"
                  disabled={isPromoteLoading}
                >
                  No, Cancel
                </button>
                <button
                  onClick={async () => {
                    await promoteStudent();
                  }}
                  className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center ${
                    isPromoteLoading ? 'opacity-50 cursor-not-allowed' : ''
                  } transition-colors`}
                  disabled={isPromoteLoading}
                >
                  {isPromoteLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Promoting...
                    </>
                  ) : 'Yes, Promote'}
                </button>
              </div>
            </div>
          </div>
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