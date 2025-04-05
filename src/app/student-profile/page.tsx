"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";

const UserIcon = () => (
  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
    <span className="text-gray-500 text-sm">N/A</span>
  </div>
);

const StudentImage: React.FC<{ fileName: string; altText: string }> = ({ fileName, altText }) => {
  return (
    <img 
      src="https://via.placeholder.com/48" 
      alt={altText} 
      className="w-12 h-12 rounded-full object-cover" 
    />
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

const StudentDetailsPopup: React.FC<{ student: Student | undefined; onClose: () => void }> = ({ student, onClose }) => {
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
                <p className="text-gray-600">{student.residentialAddress?.street_name || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">House Number:</p>
                <p className="text-gray-600">{student.residentialAddress?.house_number || "N/A"}</p>
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

function StudentList() {
  const staticStudents: Admission[] = [
    {
      classForAdmission: "Grade 1",
      academicYear: 2023,
      preferredSecondLanguage: "French",
      hasSiblingsInSchool: true,
      siblingName: "Jane Smith",
      siblingClass: "Grade 3",
      status: "Active",
      student: {
        fullName: "John Smith",
        grade: "Grade 1",
        dateOfBirth: "2016-05-15",
        nationality: "Ghanaian",
        religion: "Christian",
        gender: "Male",
        passportPhotoPath: "john_smith.jpg",
        residentialAddress: {
          city: "Accra",
          region: "Greater Accra",
          country: "Ghana",
          street_name: "Main Street",
          house_number: 123
        },
        medicalInformation: {
          bloodType: "A+",
          allergiesOrConditions: "None",
          emergencyContactsName: "Mary Smith",
          emergencyContactsNumber: "+233 24 123 4567"
        },
        parentGuardian: [
          {
            firstName: "James",
            lastName: "Smith",
            contactNumber: "+233 24 765 4321",
            emailAddress: "james.smith@example.com",
            occupation: "Engineer"
          },
          {
            firstName: "Mary",
            lastName: "Smith",
            contactNumber: "+233 24 123 4567",
            emailAddress: "mary.smith@example.com",
            occupation: "Teacher"
          }
        ],
        previousAcademicDetail: "KG 2 at ABC School",
        studentId: "ST001"
      }
    },
    {
      classForAdmission: "Grade 2",
      academicYear: 2023,
      preferredSecondLanguage: null,
      hasSiblingsInSchool: false,
      siblingName: null,
      siblingClass: null,
      status: "Active",
      student: {
        fullName: "Alice Johnson",
        grade: "Grade 2",
        dateOfBirth: "2015-08-22",
        nationality: "Ghanaian",
        religion: "Muslim",
        gender: "Female",
        passportPhotoPath: "alice_johnson.jpg",
        residentialAddress: {
          city: "Kumasi",
          region: "Ashanti",
          country: "Ghana",
          street_name: "Oak Avenue",
          house_number: 456
        },
        medicalInformation: {
          bloodType: "O+",
          allergiesOrConditions: "Peanuts",
          emergencyContactsName: "Sarah Johnson",
          emergencyContactsNumber: "+233 20 987 6543"
        },
        parentGuardian: [
          {
            firstName: "David",
            lastName: "Johnson",
            contactNumber: "+233 20 987 6543",
            emailAddress: "david.johnson@example.com",
            occupation: "Doctor"
          }
        ],
        previousAcademicDetail: "Grade 1 at XYZ School",
        studentId: "ST002"
      }
    },
    {
      classForAdmission: "Grade 3",
      academicYear: 2023,
      preferredSecondLanguage: "French",
      hasSiblingsInSchool: false,
      siblingName: null,
      siblingClass: null,
      status: "Suspended",
      student: {
        fullName: "Kwame Mensah",
        grade: "Grade 3",
        dateOfBirth: "2014-11-10",
        nationality: "Ghanaian",
        religion: "Christian",
        gender: "Male",
        passportPhotoPath: "kwame_mensah.jpg",
        residentialAddress: {
          city: "Takoradi",
          region: "Western",
          country: "Ghana",
          street_name: "Palm Road",
          house_number: 789
        },
        medicalInformation: {
          bloodType: "B+",
          allergiesOrConditions: "None",
          emergencyContactsName: "Ama Mensah",
          emergencyContactsNumber: "+233 27 555 1234"
        },
        parentGuardian: [
          {
            firstName: "Kofi",
            lastName: "Mensah",
            contactNumber: "+233 27 555 1234",
            emailAddress: "kofi.mensah@example.com",
            occupation: "Businessman"
          },
          {
            firstName: "Ama",
            lastName: "Mensah",
            contactNumber: "+233 27 555 5678",
            emailAddress: "ama.mensah@example.com",
            occupation: "Nurse"
          }
        ],
        previousAcademicDetail: "Grade 2 at DEF School",
        studentId: "ST003"
      }
    },
    {
      classForAdmission: "Grade 4",
      academicYear: 2023,
      preferredSecondLanguage: null,
      hasSiblingsInSchool: true,
      siblingName: "Kofi Boateng",
      siblingClass: "Grade 6",
      status: "Active",
      student: {
        fullName: "Esi Boateng",
        grade: "Grade 4",
        dateOfBirth: "2013-03-18",
        nationality: "Ghanaian",
        religion: "Christian",
        gender: "Female",
        passportPhotoPath: "esi_boateng.jpg",
        residentialAddress: {
          city: "Tamale",
          region: "Northern",
          country: "Ghana",
          street_name: "Pine Street",
          house_number: 321
        },
        medicalInformation: {
          bloodType: "AB+",
          allergiesOrConditions: "None",
          emergencyContactsName: "Yaa Boateng",
          emergencyContactsNumber: "+233 54 321 6789"
        },
        parentGuardian: [
          {
            firstName: "Yaw",
            lastName: "Boateng",
            contactNumber: "+233 54 321 6789",
            emailAddress: "yaw.boateng@example.com",
            occupation: "Farmer"
          },
          {
            firstName: "Yaa",
            lastName: "Boateng",
            contactNumber: "+233 54 987 6543",
            emailAddress: "yaa.boateng@example.com",
            occupation: "Teacher"
          }
        ],
        previousAcademicDetail: "Grade 3 at GHI School",
        studentId: "ST004"
      }
    },
    {
      classForAdmission: "Grade 5",
      academicYear: 2023,
      preferredSecondLanguage: "French",
      hasSiblingsInSchool: false,
      siblingName: null,
      siblingClass: null,
      status: "Completed",
      student: {
        fullName: "David Ofori",
        grade: "Grade 5",
        dateOfBirth: "2012-07-25",
        nationality: "Ghanaian",
        religion: "Christian",
        gender: "Male",
        passportPhotoPath: "david_ofori.jpg",
        residentialAddress: {
          city: "Cape Coast",
          region: "Central",
          country: "Ghana",
          street_name: "Cedar Lane",
          house_number: 654
        },
        medicalInformation: {
          bloodType: "A-",
          allergiesOrConditions: "Dust",
          emergencyContactsName: "Grace Ofori",
          emergencyContactsNumber: "+233 50 111 2222"
        },
        parentGuardian: [
          {
            firstName: "Samuel",
            lastName: "Ofori",
            contactNumber: "+233 50 111 2222",
            emailAddress: "samuel.ofori@example.com",
            occupation: "Banker"
          },
          {
            firstName: "Grace",
            lastName: "Ofori",
            contactNumber: "+233 50 333 4444",
            emailAddress: "grace.ofori@example.com",
            occupation: "Lawyer"
          }
        ],
        previousAcademicDetail: "Grade 4 at JKL School",
        studentId: "ST005"
      }
    },
    {
      classForAdmission: "Grade 6",
      academicYear: 2023,
      preferredSecondLanguage: null,
      hasSiblingsInSchool: false,
      siblingName: null,
      siblingClass: null,
      status: "Sacked",
      student: {
        fullName: "Ama Ansah",
        grade: "Grade 6",
        dateOfBirth: "2011-09-30",
        nationality: "Ghanaian",
        religion: "Muslim",
        gender: "Female",
        passportPhotoPath: "ama_ansah.jpg",
        residentialAddress: {
          city: "Tema",
          region: "Greater Accra",
          country: "Ghana",
          street_name: "Maple Road",
          house_number: 987
        },
        medicalInformation: {
          bloodType: "O-",
          allergiesOrConditions: "None",
          emergencyContactsName: "Fatima Ansah",
          emergencyContactsNumber: "+233 55 666 7777"
        },
        parentGuardian: [
          {
            firstName: "Mohammed",
            lastName: "Ansah",
            contactNumber: "+233 55 666 7777",
            emailAddress: "mohammed.ansah@example.com",
            occupation: "Businessman"
          }
        ],
        previousAcademicDetail: "Grade 5 at MNO School",
        studentId: "ST006"
      }
    }
  ];

  const [students, setStudents] = useState<Admission[]>(staticStudents);
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

  const allClasses = [
    "Creche", "Nursery 1", "Nursery 2", "KG 1", "KG 2", 
    ...Array.from({ length: 9 }, (_, i) => `Grade ${i + 1}`)
  ];

  const searchStudentsByName = () => {
    if (!searchQuery.trim()) {
      setError("Please enter a name to search.");
      return;
    }
    
    setIsSearching(true);
    setError(null);
    setTimeout(() => {
      const filtered = staticStudents.filter(student =>
        student.student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setStudents(filtered);
      setHasSearched(true);
      setIsSearching(false);
      if (filtered.length === 0) {
        setError("No students found matching your search");
      }
    }, 500);
  };

  const fetchStudentsByClass = () => {
    if (!classQuery.trim()) {
      setError("Please select a class to search.");
      return;
    }
    
    setIsFiltering(true);
    setError(null);
    setTimeout(() => {
      const filtered = staticStudents.filter(student =>
        student.student.grade === classQuery
      );
      setStudents(filtered);
      setHasSearched(true);
      setIsFiltering(false);
      if (filtered.length === 0) {
        setError("No students found in this class");
      }
    }, 500);
  };

  const fetchStudentsByStatus = (status: string) => {
    setIsStatusFilterLoading(true);
    setCurrentStatusFilter(status);
    setError(null);
    setTimeout(() => {
      const filtered = staticStudents.filter(student =>
        student.status === status
      );
      setStudents(filtered);
      setHasSearched(true);
      setIsStatusFilterLoading(false);
      if (filtered.length === 0) {
        setError(`No ${status.toLowerCase()} students found`);
      }
    }, 500);
  };

  const fetchAllStudents = () => {
    setIsViewAllLoading(true);
    setError(null);
    setTimeout(() => {
      setStudents(staticStudents);
      setHasSearched(true);
      setIsViewAllLoading(false);
    }, 500);
  };

  const updateStudentStatus = (studentId: string, status: string) => {
    setStudents(students.map(student => 
      student.student.studentId === studentId 
        ? { ...student, status } 
        : student
    ));
    setIsStatusModalOpen(false);
  };

  const promoteStudent = (studentId: string, newGrade: string) => {
    setStudents(students.map(student => 
      student.student.studentId === studentId 
        ? { 
            ...student, 
            classForAdmission: newGrade,
            student: { ...student.student, grade: newGrade }
          } 
        : student
    ));
    setIsPromoteModalOpen(false);
  };

  const openStatusModal = (student: Admission) => {
    setCurrentStudentForStatus(student);
    setNewStatus(student.status || "Active");
    setIsStatusModalOpen(true);
  };

  const openPromoteModal = (student: Admission) => {
    setCurrentStudentForStatus(student);
    setNewGrade("");
    setIsPromoteModalOpen(true);
  };

  const totalStudents = students.length;
  const maleCount = students.filter(admission => 
    admission.student.gender && admission.student.gender.toLowerCase() === 'male'
  ).length;
  const femaleCount = students.filter(admission => 
    admission.student.gender && admission.student.gender.toLowerCase() === 'female'
  ).length;

  const activeStudentsCount = staticStudents.filter(s => s.status === "Active").length;
  const completedStudentsCount = staticStudents.filter(s => s.status === "Completed").length;
  const suspendedStudentsCount = staticStudents.filter(s => s.status === "Suspended").length;
  const sackedStudentsCount = staticStudents.filter(s => s.status === "Sacked").length;

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

          {/* Status Filter Buttons */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => fetchStudentsByStatus("Active")}
              disabled={isStatusFilterLoading && currentStatusFilter === "Active"}
              className={`bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center ${
                isStatusFilterLoading && currentStatusFilter === "Active" ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isStatusFilterLoading && currentStatusFilter === "Active" ? (
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
              onClick={() => fetchStudentsByStatus("Completed")}
              disabled={isStatusFilterLoading && currentStatusFilter === "Completed"}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center ${
                isStatusFilterLoading && currentStatusFilter === "Completed" ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isStatusFilterLoading && currentStatusFilter === "Completed" ? (
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
              onClick={() => fetchStudentsByStatus("Suspended")}
              disabled={isStatusFilterLoading && currentStatusFilter === "Suspended"}
              className={`bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center ${
                isStatusFilterLoading && currentStatusFilter === "Suspended" ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isStatusFilterLoading && currentStatusFilter === "Suspended" ? (
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
              onClick={() => fetchStudentsByStatus("Sacked")}
              disabled={isStatusFilterLoading && currentStatusFilter === "Sacked"}
              className={`bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center ${
                isStatusFilterLoading && currentStatusFilter === "Sacked" ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isStatusFilterLoading && currentStatusFilter === "Sacked" ? (
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
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
                      <td className="px-4 py-3 text-sm text-gray-600">{admission.student.grade}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          admission.status === "Active" ? "bg-green-100 text-green-800" :
                          admission.status === "Completed" ? "bg-blue-100 text-blue-800" :
                          admission.status === "Suspended" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {admission.status || "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => setSelectedStudent(admission.student)}
                            className="text-blue-600 hover:text-blue-800 hover:underline text-left"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => openStatusModal(admission)}
                            className="text-yellow-600 hover:text-yellow-800 hover:underline text-left"
                          >
                            Update Status
                          </button>
                          <button
                            onClick={() => admission.status === "Active" && openPromoteModal(admission)}
                            disabled={admission.status !== "Active"}
                            className={`text-green-600 hover:text-green-800 hover:underline text-left ${
                              admission.status !== "Active" ? 'opacity-50 cursor-not-allowed' : ''
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

        {/* Status Update Modal */}
        {isStatusModalOpen && currentStudentForStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Update Student Status</h2>
              <div className="space-y-4">
                <p><span className="font-medium">Student:</span> {currentStudentForStatus.student.fullName}</p>
                <p><span className="font-medium">Current Status:</span> {currentStudentForStatus.status || "Active"}</p>
                
                <div>
                  <label className="block text-sm font-medium mb-1">New Status</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Sacked">Sacked</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateStudentStatus(currentStudentForStatus.student.studentId, newStatus)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Promote Student Modal */}
        {isPromoteModalOpen && currentStudentForStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Promote Student</h2>
              <div className="space-y-4">
                <p><span className="font-medium">Student:</span> {currentStudentForStatus.student.fullName}</p>
                <p><span className="font-medium">Current Class:</span> {currentStudentForStatus.student.grade}</p>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Promote To</label>
                  <select
                    className="w-full p-2 border rounded"
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
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => promoteStudent(currentStudentForStatus.student.studentId, newGrade)}
                  disabled={!newGrade}
                  className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${!newGrade ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Promote Student
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