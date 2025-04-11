'use client';
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { Modal } from '@/components/ui/Modal';
import { Tab } from '@headlessui/react';
import  Calendar  from '@/components/ui/calendar';
import { format } from 'date-fns';

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

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
  markedBy: string;
}

interface GradeRecord {
  term: number;
  year: number;
  grade: string;
  subjects: {
    name: string;
    classScore: number;
    examScore: number;
    total: number;
    grade: string;
    position: number;
    remarks: string;
  }[];
  teacherRemarks: string;
  headmasterRemarks: string;
}

// Mock data for students
const mockStudents: Admission[] = [
  {
    classForAdmission: "Grade 1",
    academicYear: 2024,
    preferredSecondLanguage: null,
    hasSiblingsInSchool: false,
    siblingName: null,
    siblingClass: null,
    status: "Active",
    student: {
      fullName: "John Doe",
      grade: "Grade 1",
      dateOfBirth: "2017-05-15",
      nationality: "Ghanaian",
      religion: "Christian",
      gender: "Male",
      passportPhotoPath: "john-doe.jpg",
      studentId: "ST001",
      residentialAddress: {
        city: "Accra",
        region: "Greater Accra",
        country: "Ghana",
        street_name: "Main Street",
        house_number: 12
      },
      medicalInformation: {
        bloodType: "A+",
        allergiesOrConditions: "None",
        emergencyContactsName: "Jane Doe",
        emergencyContactsNumber: "0244123456"
      },
      parentGuardian: [
        {
          firstName: "James",
          lastName: "Doe",
          contactNumber: "0244123456",
          emailAddress: "james.doe@example.com",
          occupation: "Engineer"
        },
        {
          firstName: "Jane",
          lastName: "Doe",
          contactNumber: "0244123457",
          emailAddress: "jane.doe@example.com",
          occupation: "Teacher"
        }
      ]
    }
  },
  {
    classForAdmission: "Grade 2",
    academicYear: 2024,
    preferredSecondLanguage: null,
    hasSiblingsInSchool: false,
    siblingName: null,
    siblingClass: null,
    status: "Active",
    student: {
      fullName: "Alice Smith",
      grade: "Grade 2",
      dateOfBirth: "2016-08-22",
      nationality: "Ghanaian",
      religion: "Christian",
      gender: "Female",
      passportPhotoPath: "alice-smith.jpg",
      studentId: "ST002",
      residentialAddress: {
        city: "Kumasi",
        region: "Ashanti",
        country: "Ghana",
        street_name: "Oak Avenue",
        house_number: 5
      },
      medicalInformation: {
        bloodType: "O+",
        allergiesOrConditions: "Peanuts",
        emergencyContactsName: "Robert Smith",
        emergencyContactsNumber: "0244123458"
      },
      parentGuardian: [
        {
          firstName: "Robert",
          lastName: "Smith",
          contactNumber: "0244123458",
          emailAddress: "robert.smith@example.com",
          occupation: "Doctor"
        }
      ]
    }
  },
  {
    classForAdmission: "Grade 7",
    academicYear: 2024,
    preferredSecondLanguage: "French",
    hasSiblingsInSchool: true,
    siblingName: "Kwame Mensah",
    siblingClass: "Grade 5",
    status: "Active",
    student: {
      fullName: "Ama Mensah",
      grade: "Grade 7",
      dateOfBirth: "2011-03-10",
      nationality: "Ghanaian",
      religion: "Christian",
      gender: "Female",
      passportPhotoPath: "ama-mensah.jpg",
      studentId: "ST003",
      residentialAddress: {
        city: "Tema",
        region: "Greater Accra",
        country: "Ghana",
        street_name: "Maple Road",
        house_number: 8
      },
      medicalInformation: {
        bloodType: "B+",
        allergiesOrConditions: "None",
        emergencyContactsName: "Kofi Mensah",
        emergencyContactsNumber: "0244123459"
      },
      parentGuardian: [
        {
          firstName: "Kofi",
          lastName: "Mensah",
          contactNumber: "0244123459",
          emailAddress: "kofi.mensah@example.com",
          occupation: "Business Owner"
        }
      ]
    }
  }
];

// Mock attendance records
const mockAttendanceRecords: Record<string, AttendanceRecord[]> = {
  "ST001": [
    { date: '2024-05-01', status: 'present', markedBy: 'Teacher A' },
    { date: '2024-05-02', status: 'present', markedBy: 'Teacher A' },
    { date: '2024-05-03', status: 'absent', markedBy: 'Teacher B' },
    { date: '2024-05-06', status: 'present', markedBy: 'Teacher C' },
    { date: '2024-05-07', status: 'present', markedBy: 'Teacher A' },
  ],
  "ST002": [
    { date: '2024-05-01', status: 'present', markedBy: 'Teacher A' },
    { date: '2024-05-02', status: 'present', markedBy: 'Teacher A' },
    { date: '2024-05-03', status: 'present', markedBy: 'Teacher B' },
    { date: '2024-05-06', status: 'absent', markedBy: 'Teacher C' },
    { date: '2024-05-07', status: 'present', markedBy: 'Teacher A' },
  ],
  "ST003": [
    { date: '2024-05-01', status: 'present', markedBy: 'Teacher A' },
    { date: '2024-05-02', status: 'absent', markedBy: 'Teacher A' },
    { date: '2024-05-03', status: 'present', markedBy: 'Teacher B' },
    { date: '2024-05-06', status: 'present', markedBy: 'Teacher C' },
    { date: '2024-05-07', status: 'present', markedBy: 'Teacher A' },
  ]
};

// Mock grade records
const mockGradeRecords: Record<string, GradeRecord[]> = {
  "ST001": [
    {
      term: 1,
      year: 2024,
      grade: 'Grade 1',
      subjects: [
        { name: 'English', classScore: 42, examScore: 40, total: 82, grade: 'A', position: 4, remarks: 'Excellent' },
        { name: 'Fante', classScore: 0, examScore: 0, total: 0, grade: 'F', position: 1, remarks: 'Fail' },
        { name: 'French', classScore: 0, examScore: 0, total: 0, grade: 'F', position: 1, remarks: 'Fail' },
        { name: 'History', classScore: 0, examScore: 0, total: 0, grade: 'F', position: 1, remarks: 'Fail' },
        { name: 'Maths', classScore: 0, examScore: 0, total: 0, grade: 'F', position: 1, remarks: 'Fail' },
        { name: 'Science', classScore: 0, examScore: 0, total: 0, grade: 'F', position: 1, remarks: 'Fail' },
        { name: 'Creative Arts', classScore: 0, examScore: 0, total: 0, grade: 'F', position: 1, remarks: 'Fail' },
        { name: 'Computing', classScore: 0, examScore: 0, total: 0, grade: 'F', position: 1, remarks: 'Fail' },
        { name: 'RME', classScore: 0, examScore: 0, total: 0, grade: 'F', position: 1, remarks: 'Fail' },
      ],
      teacherRemarks: 'Needs improvement in most subjects',
      headmasterRemarks: 'Please focus on studies'
    }
  ],
  "ST002": [
    {
      term: 1,
      year: 2024,
      grade: 'Grade 2',
      subjects: [
        { name: 'English', classScore: 45, examScore: 42, total: 87, grade: 'A', position: 2, remarks: 'Excellent' },
        { name: 'Fante', classScore: 30, examScore: 25, total: 55, grade: 'D', position: 10, remarks: 'Pass' },
        { name: 'French', classScore: 35, examScore: 30, total: 65, grade: 'C', position: 8, remarks: 'Good' },
        { name: 'History', classScore: 40, examScore: 38, total: 78, grade: 'B', position: 5, remarks: 'Very Good' },
        { name: 'Maths', classScore: 42, examScore: 40, total: 82, grade: 'A', position: 3, remarks: 'Excellent' },
        { name: 'Science', classScore: 38, examScore: 35, total: 73, grade: 'B', position: 6, remarks: 'Very Good' },
        { name: 'Creative Arts', classScore: 45, examScore: 44, total: 89, grade: 'A', position: 1, remarks: 'Excellent' },
        { name: 'Computing', classScore: 40, examScore: 38, total: 78, grade: 'B', position: 4, remarks: 'Very Good' },
        { name: 'RME', classScore: 35, examScore: 40, total: 75, grade: 'B', position: 7, remarks: 'Very Good' },
      ],
      teacherRemarks: 'Good performance overall',
      headmasterRemarks: 'Keep up the good work'
    }
  ],
  "ST003": [
    {
      term: 1,
      year: 2024,
      grade: 'Grade 7',
      subjects: [
        { name: 'English', classScore: 43, examScore: 40, total: 83, grade: 'A', position: 3, remarks: 'Excellent' },
        { name: 'Mathematics', classScore: 47, examScore: 40, total: 87, grade: 'A', position: 1, remarks: 'Excellent' },
        { name: 'Integrated Science', classScore: 47, examScore: 34, total: 81, grade: 'A', position: 1, remarks: 'Excellent' },
        { name: 'Social Studies', classScore: 43, examScore: 40, total: 82, grade: 'A', position: 4, remarks: 'Excellent' },
        { name: 'Career Tech', classScore: 43, examScore: 40, total: 83, grade: 'A', position: 2, remarks: 'Excellent' },
        { name: 'Fante', classScore: 43, examScore: 0, total: 43, grade: 'E', position: 4, remarks: 'PASS' },
        { name: 'French', classScore: 43, examScore: 38, total: 81, grade: 'A', position: 2, remarks: 'Excellent' },
        { name: 'Creative Arts', classScore: 41, examScore: 32, total: 72, grade: 'B', position: 6, remarks: 'Very Good' },
        { name: 'Computing', classScore: 47, examScore: 33, total: 80, grade: 'B', position: 1, remarks: 'Very Good' },
        { name: 'R.M.E', classScore: 43, examScore: 33, total: 76, grade: 'B', position: 7, remarks: 'Very Good' },
      ],
      teacherRemarks: 'More room for improvement',
      headmasterRemarks: 'Fairly good'
    }
  ]
};

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

const AttendanceHistoryModal: React.FC<{
  student: Student;
  attendanceRecords: AttendanceRecord[];
  onClose: () => void;
  onUpdateAttendance: (date: string, newStatus: 'present' | 'absent') => void;
}> = ({ student, attendanceRecords, onClose, onUpdateAttendance }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    // Don't allow selection of weekends or future dates
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
    const isFuture = selectedDate > today;
    
    if (isWeekend || isFuture) return;
    
    setSelectedDate(selectedDate);
  };

  const handleUpdateStatus = async (newStatus: 'present' | 'absent') => {
    if (!selectedDate) return;
    
    setIsUpdating(true);
    try {
      await onUpdateAttendance(selectedDate.toISOString().split('T')[0], newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const record = attendanceRecords.find(r => r.date === dateStr);
    return record ? record.status : null;
  };

  const isDateSelectable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    const isWeekend = checkDate.getDay() === 0 || checkDate.getDay() === 6;
    const isFuture = checkDate > today;
    
    return !isWeekend && !isFuture;
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl border-2 border-green-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-800">Attendance History - {student.fullName}</h2>
          <button onClick={onClose} className="text-green-600 hover:text-green-800">
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border w-full"
            modifiers={{
              present: attendanceRecords
                .filter(r => r.status === 'present')
                .map(r => new Date(r.date)),
              absent: attendanceRecords
                .filter(r => r.status === 'absent')
                .map(r => new Date(r.date)),
              disabled: (date) => !isDateSelectable(date)
            }}
            modifiersStyles={{
              present: {
                border: '2px solid #10B981',
                backgroundColor: '#ECFDF5'
              },
              absent: {
                border: '2px solid #EF4444',
                backgroundColor: '#FEE2E2'
              },
              disabled: {
                backgroundColor: '#F3F4F6',
                color: '#9CA3AF',
                cursor: 'not-allowed'
              }
            }}
            disabled={(date) => !isDateSelectable(date)}
            styles={{
              root: {
                width: '100%'
              },
              month: {
                width: '100%'
              },
              day: {
                height: '3rem',
                width: '3rem'
              }
            }}
          />
        </div>

        {selectedDate && isDateSelectable(selectedDate) && (
          <div className="border-t border-green-200 pt-4">
            <h3 className="font-semibold mb-2 text-green-700">
              Attendance for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            
            {getStatusForDate(selectedDate) ? (
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  getStatusForDate(selectedDate) === 'present' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {getStatusForDate(selectedDate) === 'present' ? 'Present' : 'Absent'}
                </span>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdateStatus('present')}
                    disabled={isUpdating || getStatusForDate(selectedDate) === 'present'}
                    className={`px-3 py-1 bg-green-500 text-white rounded text-sm ${
                      isUpdating || getStatusForDate(selectedDate) === 'present' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
                    }`}
                  >
                    {isUpdating ? 'Updating...' : 'Mark Present'}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('absent')}
                    disabled={isUpdating || getStatusForDate(selectedDate) === 'absent'}
                    className={`px-3 py-1 bg-red-500 text-white rounded text-sm ${
                      isUpdating || getStatusForDate(selectedDate) === 'absent' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
                    }`}
                  >
                    {isUpdating ? 'Updating...' : 'Mark Absent'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateStatus('present')}
                  disabled={isUpdating}
                  className={`px-3 py-1 bg-green-500 text-white rounded text-sm ${
                    isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
                  }`}
                >
                  {isUpdating ? 'Marking...' : 'Mark Present'}
                </button>
                <button
                  onClick={() => handleUpdateStatus('absent')}
                  disabled={isUpdating}
                  className={`px-3 py-1 bg-red-500 text-white rounded text-sm ${
                    isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
                  }`}
                >
                  {isUpdating ? 'Marking...' : 'Mark Absent'}
                </button>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="font-semibold mb-2 text-green-700">Recent Attendance Records</h3>
          <div className="overflow-auto max-h-60">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase">Marked By</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.slice(0, 10).map((record, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-700">{record.date}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status === 'present' ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-700">{record.markedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const GradeHistoryModal: React.FC<{
  student: Student;
  gradeRecords: GradeRecord[];
  onClose: () => void;
  onSearch: (query: string) => void;
}> = ({ student, gradeRecords, onClose, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<GradeRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [invoiceContent, setInvoiceContent] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleSaveAsPDF = () => {
    if (!selectedRecord) return;
    
    setIsSaving(true);
    
    const element = document.createElement('div');
    element.innerHTML = invoiceContent;

    html2pdf()
      .set({
        margin: 10,
        filename: 'grade_report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: true, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save()
      .then(() => {
        setIsSaving(false);
      });
  };

  const handleSendInvoice = async () => {
    if (!selectedRecord) return;

    setIsSending(true);
    
    const element = document.createElement('div');
    element.innerHTML = invoiceContent;

    try {
      const pdfBlob = await html2pdf()
        .set({
          margin: 10,
          filename: 'grade_report.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, logging: true, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(element)
        .outputPdf('blob');

      const formData = new FormData();
      formData.append('file', pdfBlob, 'grade_report.pdf');

      const response = await fetch('/api/send-report', {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send grade report');
      }

      alert('Grade report sent successfully!');
    } catch (error) {
      console.error('Error sending grade report:', error);
      alert('Failed to send grade report. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const generateGradeReportHTML = (record: GradeRecord) => {
    if (record.grade.includes('Grade 1') || record.grade.includes('Grade 2') || 
        record.grade.includes('Grade 3') || record.grade.includes('Grade 4') ||
        record.grade.includes('Grade 5') || record.grade.includes('Grade 6')) {
      // Format for Grades 1-6 (similar to first image)
      return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="text-align: center; font-size: 24px; font-weight: bold;">OFORI-ATTAH INTERNATIONAL SCHOOL</h1>
          <p style="text-align: center;">Takoradi, Apowa Highways</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Roll</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">1</td>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Position</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">4</td>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Term</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">${record.term}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Surname</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">${student.fullName.toUpperCase()}</td>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Vacation Resuming</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">${new Date().toLocaleDateString()}</td>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Points Attendance Out of</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">82 50 12</td>
            </tr>
          </table>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr>
                <th style="border: 1px solid #000; padding: 8px; text-align: left;">SUBJECT</th>
                <th style="border: 1px solid #000; padding: 8px; text-align: left;">CLASS SCORE 50%</th>
                <th style="border: 1px solid #000; padding: 8px; text-align: left;">EXAM SCORE 50%</th>
                <th style="border: 1px solid #000; padding: 8px; text-align: left;">TOTAL</th>
                <th style="border: 1px solid #000; padding: 8px; text-align: left;">GRADE</th>
                <th style="border: 1px solid #000; padding: 8px; text-align: left;">POSITION</th>
                <th style="border: 1px solid #000; padding: 8px; text-align: left;">REMARKS</th>
              </tr>
            </thead>
            <tbody>
              ${record.subjects.map(subject => `
                <tr>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.name}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.classScore}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.examScore}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.total}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.grade}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.position}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.remarks}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Interest</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">ENGLISH</td>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Conduct</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">PLAYFUL</td>
            </tr>
          </table>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Teacher's Remarks</strong></td>
              <td style="border: 1px solid #000; padding: 8px;" colspan="3">${record.teacherRemarks}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Headmaster's remark</strong></td>
              <td style="border: 1px solid #000; padding: 8px;" colspan="3">${record.headmasterRemarks}</td>
            </tr>
          </table>
          
          <div style="margin-top: 40px; display: flex; justify-content: space-between;">
            <div>
              <p>TEACHER'S SIGNATURE</p>
              <p style="border-top: 1px solid #000; width: 200px; margin-top: 30px;"></p>
            </div>
            <div>
              <p>HEAD MASTER'S SIGNATURE</p>
              <p style="border-top: 1px solid #000; width: 200px; margin-top: 30px;"></p>
            </div>
          </div>
        </div>
      `;
    } else {
      // Format for Grades 7-9 (similar to second image)
      return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="text-align: center; font-size: 24px; font-weight: bold;">OFORI-ATTAH INTERNATIONAL SCHOOL</h1>
          <p style="text-align: center;">CONTACT: 0549994264, 0276200061</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Roll</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">1</td>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Position</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">${record.subjects.find(s => s.name === 'Mathematics')?.position || '-'}</td>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Promoted to</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">${record.grade.replace('Grade', 'JHS')}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Name</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">${student.fullName}</td>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Term</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">${record.term}</td>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Attendance</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">50</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Class</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">${record.grade}</td>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Date</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">${new Date().toLocaleDateString()}</td>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Out of</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">46</td>
            </tr>
          </table>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr>
                <th style="border: 1px solid #000; padding: 8px; text-align: left;">Subject</th>
                <th style="border: 1px solid #000; padding: 8px; text-align: left;">Class Score 50%</th>
                <th style="border: 1px solid #000; padding: 8px; text-align: left;">Exam Score 50%</th>
                <th style="border: 1px solid #000; padding: 8px; text-align: left;">Total Score 100%</th>
                <th style="border: 1px solid #000; padding: 8px; text-align: left;">Grade</th>
                <th style="border: 1px solid #000; padding: 8px; text-align: left;">Position</th>
                <th style="border: 1px solid #000; padding: 8px; text-align: left;">Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="7" style="border: 1px solid #000; padding: 8px; font-weight: bold; background-color: #f0f0f0;">Core Subjects</td>
              </tr>
              ${record.subjects.filter(subj => 
                ['English', 'Mathematics', 'Integrated Science', 'Social Studies', 'Career Tech'].includes(subj.name))
                .map(subject => `
                <tr>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.name}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.classScore}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.examScore}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.total}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.grade}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.position}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.remarks}</td>
                </tr>
              `).join('')}
              
              <tr>
                <td colspan="7" style="border: 1px solid #000; padding: 8px; font-weight: bold; background-color: #f0f0f0;">Other Subjects</td>
              </tr>
              ${record.subjects.filter(subj => 
                !['English', 'Mathematics', 'Integrated Science', 'Social Studies', 'Career Tech'].includes(subj.name))
                .map(subject => `
                <tr>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.name}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.classScore}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.examScore}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.total}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.grade}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.position}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${subject.remarks}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Interest</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">Creative Arts</td>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Conduct</strong></td>
              <td style="border: 1px solid #000; padding: 8px;">Respectful</td>
            </tr>
          </table>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Teacher's Remarks</strong></td>
              <td style="border: 1px solid #000; padding: 8px;" colspan="3">${record.teacherRemarks}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Headmaster's remark</strong></td>
              <td style="border: 1px solid #000; padding: 8px;" colspan="3">${record.headmasterRemarks}</td>
            </tr>
          </table>
          
          <div style="margin-top: 40px; display: flex; justify-content: space-between;">
            <div>
              <p>TEACHER'S SIGNATURE</p>
              <p style="border-top: 1px solid #000; width: 200px; margin-top: 30px;"></p>
            </div>
            <div>
              <p>HEAD MASTER'S SIGNATURE</p>
              <p style="border-top: 1px solid #000; width: 200px; margin-top: 30px;"></p>
            </div>
          </div>
        </div>
      `;
    }
  };

  useEffect(() => {
    if (selectedRecord) {
      setInvoiceContent(generateGradeReportHTML(selectedRecord));
    }
  }, [selectedRecord]);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-green-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-800">Grade History - {student.fullName}</h2>
          <button onClick={onClose} className="text-green-600 hover:text-green-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by class (e.g., Grade 1)"
            className="flex-1 p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Search
          </button>
        </div>

        <div className="space-y-6">
          {gradeRecords.length > 0 ? (
            gradeRecords.map((record, index) => (
              <div key={index} className="border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-green-700">
                    {record.grade} - Term {record.term} {record.year}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedRecord(selectedRecord === record ? null : record);
                      if (selectedRecord !== record) {
                        setIsEditing(false);
                      }
                    }}
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    {selectedRecord === record ? 'Hide Report' : 'View Report'}
                  </button>
                </div>

                {selectedRecord === record && (
                  <div className="mt-3">
                    {isEditing ? (
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="border border-green-300 p-4 rounded"
                        onBlur={(e) => setInvoiceContent(e.currentTarget.innerHTML)}
                        dangerouslySetInnerHTML={{ __html: invoiceContent }}
                      />
                    ) : (
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: invoiceContent }}
                      />
                    )}

                    <div className="mt-6 flex flex-wrap justify-end gap-2">
                      <button
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        onClick={() => {
                          setSelectedRecord(null);
                          setIsEditing(false);
                        }}
                      >
                        Close
                      </button>
                      
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? 'Finish Editing' : 'Edit Report'}
                      </button>
                      
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center min-w-[120px]"
                        onClick={handleSaveAsPDF}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          'Save as PDF'
                        )}
                      </button>
                      
                      <button
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center justify-center min-w-[120px]"
                        onClick={handleSendInvoice}
                        disabled={isSending}
                      >
                        {isSending ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          'Send Report'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-green-700 py-4">
              No grade records found for this student.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

const UserIcon = () => (
  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
    <span className="text-gray-500 text-sm">N/A</span>
  </div>
);

const StudentImage: React.FC<{ fileName: string; altText: string }> = ({ fileName, altText }) => {
  // In a real implementation, you would fetch the image based on fileName
  // For demo purposes, we'll just use a placeholder
  return <UserIcon />;
};

function AttendanceGradesPage() {
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
  const [selectedTab, setSelectedTab] = useState<'attendance' | 'grades'>('attendance');
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord[]>>(mockAttendanceRecords);
  const [gradeRecords, setGradeRecords] = useState<Record<string, GradeRecord[]>>(mockGradeRecords);
  const [showAttendanceHistory, setShowAttendanceHistory] = useState(false);
  const [showGradeHistory, setShowGradeHistory] = useState(false);
  const [currentStudentForHistory, setCurrentStudentForHistory] = useState<Student | null>(null);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [currentStudentForAttendance, setCurrentStudentForAttendance] = useState<string | null>(null);

  const searchStudentsByName = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a name to search.");
      return;
    }
    
    setIsSearching(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filteredStudents = mockStudents.filter(student => 
        student.student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setStudents(filteredStudents);
      setHasSearched(true);
      if (filteredStudents.length === 0) {
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filteredStudents = mockStudents.filter(student => 
        student.student.grade.toLowerCase() === classQuery.toLowerCase()
      );
      
      setStudents(filteredStudents);
      setHasSearched(true);
      if (filteredStudents.length === 0) {
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStudents(mockStudents);
      setHasSearched(true);
      if (mockStudents.length === 0) {
        setError("No students found in the system");
      }
    } catch (error: any) {
      console.error("Error fetching all students:", error);
      setError(error.message || "Failed to fetch students. Please try again.");
    } finally {
      setIsViewAllLoading(false);
    }
  };

  const markAttendance = async (studentId: string, status: 'present' | 'absent') => {
    setIsMarkingAttendance(true);
    setCurrentStudentForAttendance(studentId);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const today = new Date().toISOString().split('T')[0];
      const newRecord: AttendanceRecord = {
        date: today,
        status,
        markedBy: 'Current User'
      };

      setAttendanceRecords(prev => {
        const existingRecords = prev[studentId] || [];
        const existingIndex = existingRecords.findIndex(r => r.date === today);
        
        if (existingIndex >= 0) {
          const updatedRecords = [...existingRecords];
          updatedRecords[existingIndex] = newRecord;
          return {
            ...prev,
            [studentId]: updatedRecords
          };
        } else {
          return {
            ...prev,
            [studentId]: [...existingRecords, newRecord]
          };
        }
      });
    } catch (error) {
      console.error("Error marking attendance:", error);
    } finally {
      setIsMarkingAttendance(false);
      setCurrentStudentForAttendance(null);
    }
  };

  const updateAttendanceRecord = async (date: string, newStatus: 'present' | 'absent') => {
    if (!currentStudentForHistory) return;
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAttendanceRecords(prev => {
        const existingRecords = prev[currentStudentForHistory.studentId] || [];
        const existingIndex = existingRecords.findIndex(r => r.date === date);
        
        if (existingIndex >= 0) {
          const updatedRecords = [...existingRecords];
          updatedRecords[existingIndex] = {
            ...updatedRecords[existingIndex],
            status: newStatus,
            markedBy: 'Current User'
          };
          return {
            ...prev,
            [currentStudentForHistory.studentId]: updatedRecords
          };
        } else {
          const newRecord: AttendanceRecord = {
            date,
            status: newStatus,
            markedBy: 'Current User'
          };
          return {
            ...prev,
            [currentStudentForHistory.studentId]: [...existingRecords, newRecord]
          };
        }
      });
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const searchGradeHistory = async (query: string) => {
    if (!currentStudentForHistory) return;
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, this would filter records from the API
      // For now, we'll just return all records (filtering would happen on backend)
      return gradeRecords[currentStudentForHistory.studentId] || [];
    } catch (error) {
      console.error("Error searching grade history:", error);
      return [];
    }
  };

  const openAttendanceHistory = async (student: Student) => {
    setCurrentStudentForHistory(student);
    setShowAttendanceHistory(true);
  };

  const openGradeHistory = async (student: Student) => {
    setCurrentStudentForHistory(student);
    setShowGradeHistory(true);
  };

  const allClasses = [
    "Creche", "Nursery 1", "Nursery 2", "KG 1", "KG 2", 
    ...Array.from({ length: 9 }, (_, i) => `Grade ${i + 1}`)
  ];

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const totalStudents = students.length;
  const maleCount = students.filter(admission => 
    admission.student.gender && admission.student.gender.toLowerCase() === 'male'
  ).length;
  const femaleCount = students.filter(admission => 
    admission.student.gender && admission.student.gender.toLowerCase() === 'female'
  ).length;

  return (
    <ProtectedRoute>
      <div className="p-5 bg-green-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-green-800">Attendance & Grades Management</h1>

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

        <div className="bg-white p-6 rounded-lg shadow mb-6 border border-green-200">
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
                  className={`bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700 flex items-center justify-center ${
                    (isSearching || !searchQuery.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
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
                  {allClasses.map((className) => (
                    <option key={className} value={className}>{className}</option>
                  ))}
                </select>
                <button
                  onClick={fetchStudentsByClass}
                  disabled={isFiltering || !classQuery.trim()}
                  className={`bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700 flex items-center justify-center ${
                    (isFiltering || !classQuery.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
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
                className={`w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center ${
                  isViewAllLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
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
          <div className="bg-green-100 p-6 rounded-lg shadow mb-6 border border-green-200">
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

        <Tab.Group selectedIndex={selectedTab === 'attendance' ? 0 : 1} onChange={(index) => setSelectedTab(index === 0 ? 'attendance' : 'grades')}>
          <Tab.List className="flex space-x-1 rounded-lg bg-green-900/20 p-1 mb-6">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-green-700
                ring-white ring-opacity-60 ring-offset-2 ring-offset-green-400 focus:outline-none focus:ring-2
                ${selected ? 'bg-white shadow' : 'text-green-100 hover:bg-white/[0.12] hover:text-white'}`
              }
            >
              Attendance
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-green-700
                ring-white ring-opacity-60 ring-offset-2 ring-offset-green-400 focus:outline-none focus:ring-2
                ${selected ? 'bg-white shadow' : 'text-green-100 hover:bg-white/[0.12] hover:text-white'}`
              }
            >
              Grades
            </Tab>
          </Tab.List>
        </Tab.Group>

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
                  
                  {selectedTab === 'attendance' ? (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Mark Attendance</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Attendance History</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Grade History</th>
                    </>
                  )}
                  
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">View Details</th>
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
                      
                      {selectedTab === 'attendance' ? (
                        <>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => markAttendance(admission.student.studentId, 'present')}
                                disabled={isMarkingAttendance && currentStudentForAttendance === admission.student.studentId}
                                className={`px-3 py-1 bg-green-500 text-white rounded text-sm ${
                                  (isMarkingAttendance && currentStudentForAttendance === admission.student.studentId) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
                                }`}
                              >
                                {isMarkingAttendance && currentStudentForAttendance === admission.student.studentId ? (
                                  <svg className="animate-spin h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : 'Present'}
                              </button>
                              <button
                                onClick={() => markAttendance(admission.student.studentId, 'absent')}
                                disabled={isMarkingAttendance && currentStudentForAttendance === admission.student.studentId}
                                className={`px-3 py-1 bg-red-500 text-white rounded text-sm ${
                                  (isMarkingAttendance && currentStudentForAttendance === admission.student.studentId) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
                                }`}
                              >
                                {isMarkingAttendance && currentStudentForAttendance === admission.student.studentId ? (
                                  <svg className="animate-spin h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : 'Absent'}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => openAttendanceHistory(admission.student)}
                              className="text-green-600 hover:text-green-800 hover:underline"
                            >
                              View History
                            </button>
                          </td>
                        </>
                      ) : (
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => openGradeHistory(admission.student)}
                            className="text-green-600 hover:text-green-800 hover:underline"
                          >
                            View History
                          </button>
                        </td>
                      )}
                      
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => setSelectedStudent(admission.student)}
                          className="text-green-600 hover:text-green-800 hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={selectedTab === 'attendance' ? 9 : 8} className="p-4 text-center text-green-700">
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

        {showAttendanceHistory && currentStudentForHistory && (
          <AttendanceHistoryModal
            student={currentStudentForHistory}
            attendanceRecords={attendanceRecords[currentStudentForHistory.studentId] || []}
            onClose={() => setShowAttendanceHistory(false)}
            onUpdateAttendance={updateAttendanceRecord}
          />
        )}

        {showGradeHistory && currentStudentForHistory && (
          <GradeHistoryModal
            student={currentStudentForHistory}
            gradeRecords={gradeRecords[currentStudentForHistory.studentId] || []}
            onClose={() => setShowGradeHistory(false)}
            onSearch={searchGradeHistory}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

export default function ProtectedAttendanceGradesPage() {
  return (
    <ProtectedRoute>
      <AttendanceGradesPage />
    </ProtectedRoute>
  );  
}