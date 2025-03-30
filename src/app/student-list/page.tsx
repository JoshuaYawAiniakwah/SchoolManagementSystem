'use client';
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

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

interface PaymentDetails {
  id: number;
  no: number;
  year: string;
  date: string;
  class: string;
  type: string;
  fees: number;
  paid: number;
  balance: number;
  bank: string;
}

const students: Student[] = [
  {
    fullName: 'John Doe',
    grade: 'Grade 1',
    dateOfBirth: '2010-05-15',
    nationality: 'American',
    religion: 'Christian',
    gender: 'Male',
    passportPhotoPath: 'student1.jpg',
    residentialAddress: {
      city: 'New York',
      region: 'NY',
      country: 'USA',
      street_name: '123 Main St',
      house_number: 123,
    },
    medicalInformation: {
      bloodType: 'O',
      allergiesOrConditions: 'No allergies',
      emergencyContactsName: 'Jane Doe',
      emergencyContactsNumber: '123-456-7890',
    },
    parentGuardian: [
      {
        firstName: 'Jane',
        lastName: 'Doe',
        contactNumber: '123-456-7890',
        emailAddress: 'jane.doe@example.com',
        occupation: 'Engineer',
      },
    ],
    previousAcademicDetail: 'XYZ Elementary',
    studentId: '1',
  },
  {
    fullName: 'Jane Smith',
    grade: 'Grade 2',
    dateOfBirth: '2011-07-20',
    nationality: 'British',
    religion: 'Christian',
    gender: 'Female',
    passportPhotoPath: 'student2.jpg',
    residentialAddress: {
      city: 'London',
      region: 'England',
      country: 'UK',
      street_name: '456 Oak Ave',
      house_number: 456,
    },
    medicalInformation: {
      bloodType: 'A',
      allergiesOrConditions: 'Peanuts',
      emergencyContactsName: 'John Smith',
      emergencyContactsNumber: '44-123-456-7890',
    },
    parentGuardian: [
      {
        firstName: 'John',
        lastName: 'Smith',
        contactNumber: '44-123-456-7890',
        emailAddress: 'john.smith@example.com',
        occupation: 'Doctor',
      },
    ],
    previousAcademicDetail: 'ABC Primary',
    studentId: '2',
  },
];

const paymentDetails: PaymentDetails[] = [
  {
    id: 1,
    no: 1,
    year: '2024/2025',
    date: '23/08/2025',
    class: 'Grade 1',
    type: 'School Fees',
    fees: 3040,
    paid: 1160,
    balance: 4871,
    bank: 'Bank A',
  },
];

function StudentListPage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchName, setSearchName] = useState('');
  const [searchClass, setSearchClass] = useState('');
  const [tempSearchName, setTempSearchName] = useState('');
  const [tempSearchClass, setTempSearchClass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const classOptions = ["Creche", "Nursery 1", "Nursery 2", "KG 1", "KG 2", 
                       "Grade 1", "Grade 2", "Grade 3", "Grade 4", 
                       "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9"];

  const filteredStudents = students.filter(student => {
    const nameMatch = student.fullName.toLowerCase().includes(searchName.toLowerCase());
    const classMatch = student.grade.toLowerCase().includes(searchClass.toLowerCase());
    return nameMatch && classMatch;
  });

  // Calculate gender counts
  const totalStudents = filteredStudents.length;
  const maleCount = filteredStudents.filter(student => student.gender === 'Male').length;
  const femaleCount = filteredStudents.filter(student => student.gender === 'Female').length;

  const handleViewAll = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSearchName('');
      setSearchClass('');
      setTempSearchName('');
      setTempSearchClass('');
      setShowResults(true);
      setHasSearched(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleSearch = (type: 'name' | 'class') => {
    setIsSearching(true);
    if (type === 'name') {
      setSearchName(tempSearchName);
    } else {
      setSearchClass(tempSearchClass);
    }
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
      setHasSearched(true);
    }, 1000);
  };

  const openPaymentModal = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsPaymentModalOpen(true);
  };

  const openStudentModal = (student: Student) => {
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };

  const closeModals = () => {
    setIsPaymentModalOpen(false);
    setIsStudentModalOpen(false);
    setSelectedStudentId(null);
    setSelectedStudent(null);
  };

  const studentPayments = selectedStudentId ? paymentDetails.filter(payment => payment.id === parseInt(selectedStudentId)) : [];

  return (
    <ProtectedRoute>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-6">Student List</h1>
        
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Search by Name</label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-300"
                  placeholder="Enter student name"
                  value={tempSearchName}
                  onChange={(e) => setTempSearchName(e.target.value)}
                />
                <button 
                  className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                  onClick={() => handleSearch('name')}
                  disabled={isSearching || !tempSearchName}
                >
                  {isSearching ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Search by Class</label>
              <div className="flex">
                <select
                  className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-300"
                  value={tempSearchClass}
                  onChange={(e) => setTempSearchClass(e.target.value)}
                >
                  <option value="">Select Class</option>
                  {classOptions.map(classOption => (
                    <option key={classOption} value={classOption}>{classOption}</option>
                  ))}
                </select>
                <button 
                  className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                  onClick={() => handleSearch('class')}
                  disabled={isSearching || !tempSearchClass}
                >
                  {isSearching ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full flex items-center justify-center disabled:bg-blue-300 disabled:cursor-not-allowed"
                onClick={handleViewAll}
                disabled={isLoading || isSearching}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  'View All Students'
                )}
              </button>
            </div>
          </div>
        </div>

        {!hasSearched && (
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Payment Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Student Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={9} className="p-4 text-center text-gray-500">
                    Use the search or filter options above to view students
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {hasSearched && (
          <>
            {/* Gender Count Summary */}
            {(searchName || searchClass || filteredStudents.length > 0) ? (
              <>
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Payment Details</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Student Details</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.studentId} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <img src={student.passportPhotoPath} alt={student.fullName} className="w-10 h-10 rounded-full" />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{student.fullName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{student.dateOfBirth}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{student.nationality}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{student.gender}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {student.residentialAddress?.street_name}, {student.residentialAddress?.city}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{student.grade}</td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => openPaymentModal(student.studentId)}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              View
                            </button>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => openStudentModal(student)}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Payment Details</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Student Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={9} className="p-4 text-center text-gray-500">
                        No students found. Try searching or viewing all students.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Payment Details Modal */}
        <Modal isOpen={isPaymentModalOpen} onClose={closeModals}>
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Payment Details</h2>
              <button 
                onClick={closeModals}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">No</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Year</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Class</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Fees</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Paid</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Balance</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Bank</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentPayments.map((payment) => (
                    <tr key={payment.no} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{payment.no}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{payment.year}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{payment.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{payment.class}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{payment.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{payment.fees}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{payment.paid}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{payment.balance}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{payment.bank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModals}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>

        {/* Student Details Modal */}
        <Modal isOpen={isStudentModalOpen} onClose={closeModals}>
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Student Details</h2>
              <button 
                onClick={closeModals}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Full Name:</p>
                  <p className="text-gray-600">{selectedStudent?.fullName}</p>
                </div>
                <div>
                  <p className="font-medium">Date of Birth:</p>
                  <p className="text-gray-600">{selectedStudent?.dateOfBirth}</p>
                </div>
                <div>
                  <p className="font-medium">Nationality:</p>
                  <p className="text-gray-600">{selectedStudent?.nationality}</p>
                </div>
                <div>
                  <p className="font-medium">Religion:</p>
                  <p className="text-gray-600">{selectedStudent?.religion}</p>
                </div>
                <div>
                  <p className="font-medium">Gender:</p>
                  <p className="text-gray-600">{selectedStudent?.gender}</p>
                </div>
                <div>
                  <p className="font-medium">Class:</p>
                  <p className="text-gray-600">{selectedStudent?.grade}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-bold mb-2">Residential Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Street Name:</p>
                    <p className="text-gray-600">{selectedStudent?.residentialAddress?.street_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium">City:</p>
                    <p className="text-gray-600">{selectedStudent?.residentialAddress?.city || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Region:</p>
                    <p className="text-gray-600">{selectedStudent?.residentialAddress?.region || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Country:</p>
                    <p className="text-gray-600">{selectedStudent?.residentialAddress?.country || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium">House Number:</p>
                    <p className="text-gray-600">{selectedStudent?.residentialAddress?.house_number || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-bold mb-2">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Blood Type:</p>
                    <p className="text-gray-600">{selectedStudent?.medicalInformation?.bloodType || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Allergies/Conditions:</p>
                    <p className="text-gray-600">{selectedStudent?.medicalInformation?.allergiesOrConditions || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Emergency Contact Name:</p>
                    <p className="text-gray-600">{selectedStudent?.medicalInformation?.emergencyContactsName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Emergency Contact Number:</p>
                    <p className="text-gray-600">{selectedStudent?.medicalInformation?.emergencyContactsNumber || "N/A"}</p>
                  </div>
                </div>
              </div>

              {selectedStudent?.parentGuardian && selectedStudent.parentGuardian.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-bold mb-2">Parent/Guardian Information</h3>
                  <div className="space-y-4">
                    {selectedStudent.parentGuardian.map((parent, idx) => (
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

              <div className="border-t pt-4">
                <p className="font-medium">Previous Academic Detail:</p>
                <p className="text-gray-600">{selectedStudent?.previousAcademicDetail || "N/A"}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModals}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}

export default function ProtectedStudentListPage() {
  return (
    <ProtectedRoute>
      <StudentListPage />
    </ProtectedRoute>
  );
}