'use client';
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import { Modal } from '@/components/ui/Modal';

// Interfaces
interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late';
  teacherId: string;
  teacherName: string;
  className: string;
}

interface GradeReport {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  subject: string;
  term: number;
  academicYear: number;
  grade: string;
  score: number;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  dateSubmitted: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  className: string;
  dueDate: string;
  teacherId: string;
  teacherName: string;
  dateAssigned: string;
  totalPoints: number;
}

interface Teacher {
  teacherId: string;
  fullName: string;
  email: string;
  subjects: string[];
  classes: string[];
}

// Mock Data
const mockTeachers: Teacher[] = [
  {
    teacherId: "T001",
    fullName: "John Smith",
    email: "john.smith@school.edu",
    subjects: ["Mathematics", "Physics"],
    classes: ["Grade 7", "Grade 8", "Grade 9"]
  },
  {
    teacherId: "T002",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@school.edu",
    subjects: ["English", "Literature"],
    classes: ["Grade 6", "Grade 7", "Grade 8"]
  },
  {
    teacherId: "T003",
    fullName: "Michael Brown",
    email: "michael.brown@school.edu",
    subjects: ["Science", "Biology"],
    classes: ["Grade 5", "Grade 6", "Grade 7"]
  }
];

const mockStudents = [
  { id: "S001", name: "Alice Johnson", class: "Grade 7" },
  { id: "S002", name: "Kwame Mensah", class: "Grade 8" },
  { id: "S003", name: "Esi Bonsu", class: "Grade 6" },
  { id: "S004", name: "David Ofori", class: "Grade 7" },
  { id: "S005", name: "Ama Serwaa", class: "Grade 8" },
  { id: "S006", name: "Yaw Boateng", class: "Grade 6" },
  { id: "S007", name: "Akosua Adoma", class: "Grade 7" },
  { id: "S008", name: "Kofi Ansah", class: "Grade 8" },
  { id: "S009", name: "Abena Pokua", class: "Grade 6" },
  { id: "S010", name: "Nana Yaa", class: "Grade 7" }
];

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "AT001",
    date: "2024-05-01",
    studentId: "S001",
    studentName: "Alice Johnson",
    status: "present",
    teacherId: "T001",
    teacherName: "John Smith",
    className: "Grade 7"
  },
  {
    id: "AT002",
    date: "2024-05-01",
    studentId: "S002",
    studentName: "Kwame Mensah",
    status: "late",
    teacherId: "T001",
    teacherName: "John Smith",
    className: "Grade 8"
  },
  {
    id: "AT003",
    date: "2024-05-01",
    studentId: "S003",
    studentName: "Esi Bonsu",
    status: "absent",
    teacherId: "T002",
    teacherName: "Sarah Johnson",
    className: "Grade 6"
  },
  {
    id: "AT004",
    date: "2024-05-01",
    studentId: "S004",
    studentName: "David Ofori",
    status: "present",
    teacherId: "T001",
    teacherName: "John Smith",
    className: "Grade 7"
  },
  {
    id: "AT005",
    date: "2024-05-01",
    studentId: "S005",
    studentName: "Ama Serwaa",
    status: "present",
    teacherId: "T001",
    teacherName: "John Smith",
    className: "Grade 8"
  },
  {
    id: "AT006",
    date: "2024-05-01",
    studentId: "S006",
    studentName: "Yaw Boateng",
    status: "absent",
    teacherId: "T002",
    teacherName: "Sarah Johnson",
    className: "Grade 6"
  },
  {
    id: "AT007",
    date: "2024-05-02",
    studentId: "S001",
    studentName: "Alice Johnson",
    status: "present",
    teacherId: "T002",
    teacherName: "Sarah Johnson",
    className: "Grade 7"
  },
  {
    id: "AT008",
    date: "2024-05-02",
    studentId: "S002",
    studentName: "Kwame Mensah",
    status: "present",
    teacherId: "T003",
    teacherName: "Michael Brown",
    className: "Grade 8"
  },
  {
    id: "AT009",
    date: "2024-05-02",
    studentId: "S003",
    studentName: "Esi Bonsu",
    status: "present",
    teacherId: "T002",
    teacherName: "Sarah Johnson",
    className: "Grade 6"
  },
  {
    id: "AT010",
    date: "2024-05-02",
    studentId: "S007",
    studentName: "Akosua Adoma",
    status: "late",
    teacherId: "T002",
    teacherName: "Sarah Johnson",
    className: "Grade 7"
  },
  {
    id: "AT011",
    date: "2024-05-02",
    studentId: "S008",
    studentName: "Kofi Ansah",
    status: "present",
    teacherId: "T003",
    teacherName: "Michael Brown",
    className: "Grade 8"
  },
  {
    id: "AT012",
    date: "2024-05-02",
    studentId: "S009",
    studentName: "Abena Pokua",
    status: "absent",
    teacherId: "T002",
    teacherName: "Sarah Johnson",
    className: "Grade 6"
  },
  {
    id: "AT013",
    date: "2024-05-03",
    studentId: "S001",
    studentName: "Alice Johnson",
    status: "present",
    teacherId: "T001",
    teacherName: "John Smith",
    className: "Grade 7"
  },
  {
    id: "AT014",
    date: "2024-05-03",
    studentId: "S002",
    studentName: "Kwame Mensah",
    status: "present",
    teacherId: "T001",
    teacherName: "John Smith",
    className: "Grade 8"
  },
  {
    id: "AT015",
    date: "2024-05-03",
    studentId: "S010",
    studentName: "Nana Yaa",
    status: "late",
    teacherId: "T001",
    teacherName: "John Smith",
    className: "Grade 7"
  }
];

const mockGradeReports: GradeReport[] = [
  {
    id: "GR001",
    studentId: "S001",
    studentName: "Alice Johnson",
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: 2024,
    grade: "A",
    score: 92,
    teacherId: "T001",
    teacherName: "John Smith",
    title: "Algebra Midterm Exam",
    description: "Covering chapters 1-5 on algebraic expressions",
    dateSubmitted: "2024-03-15"
  },
  {
    id: "GR002",
    studentId: "S001",
    studentName: "Alice Johnson",
    className: "Grade 7",
    subject: "English",
    term: 1,
    academicYear: 2024,
    grade: "B",
    score: 85,
    teacherId: "T002",
    teacherName: "Sarah Johnson",
    title: "Literature Essay",
    description: "Analysis of character development in assigned novel",
    dateSubmitted: "2024-03-16"
  },
  {
    id: "GR003",
    studentId: "S002",
    studentName: "Kwame Mensah",
    className: "Grade 8",
    subject: "Science",
    term: 1,
    academicYear: 2024,
    grade: "B+",
    score: 88,
    teacherId: "T003",
    teacherName: "Michael Brown",
    title: "Physics Lab Report",
    description: "Measurement of acceleration due to gravity",
    dateSubmitted: "2024-03-14"
  },
  {
    id: "GR004",
    studentId: "S003",
    studentName: "Esi Bonsu",
    className: "Grade 6",
    subject: "Mathematics",
    term: 1,
    academicYear: 2024,
    grade: "A-",
    score: 90,
    teacherId: "T001",
    teacherName: "John Smith",
    title: "Fractions Test",
    description: "Operations with fractions and mixed numbers",
    dateSubmitted: "2024-03-17"
  },
  {
    id: "GR005",
    studentId: "S003",
    studentName: "Esi Bonsu",
    className: "Grade 6",
    subject: "English",
    term: 1,
    academicYear: 2024,
    grade: "A",
    score: 95,
    teacherId: "T002",
    teacherName: "Sarah Johnson",
    title: "Creative Writing Assignment",
    description: "Personal narrative writing exercise",
    dateSubmitted: "2024-03-18"
  },
  {
    id: "GR006",
    studentId: "S004",
    studentName: "David Ofori",
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: 2024,
    grade: "B",
    score: 83,
    teacherId: "T001",
    teacherName: "John Smith",
    title: "Geometry Quiz",
    description: "Basic geometry concepts and calculations",
    dateSubmitted: "2024-03-15"
  },
  {
    id: "GR007",
    studentId: "S004",
    studentName: "David Ofori",
    className: "Grade 7",
    subject: "Science",
    term: 1,
    academicYear: 2024,
    grade: "B-",
    score: 80,
    teacherId: "T003",
    teacherName: "Michael Brown",
    title: "Biology Project",
    description: "Ecosystem diorama and presentation",
    dateSubmitted: "2024-03-16"
  },
  {
    id: "GR008",
    studentId: "S005",
    studentName: "Ama Serwaa",
    className: "Grade 8",
    subject: "English",
    term: 1,
    academicYear: 2024,
    grade: "A-",
    score: 91,
    teacherId: "T002",
    teacherName: "Sarah Johnson",
    title: "Poetry Analysis",
    description: "Comparative analysis of two poems",
    dateSubmitted: "2024-03-17"
  },
  {
    id: "GR009",
    studentId: "S005",
    studentName: "Ama Serwaa",
    className: "Grade 8",
    subject: "Science",
    term: 1,
    academicYear: 2024,
    grade: "A",
    score: 94,
    teacherId: "T003",
    teacherName: "Michael Brown",
    title: "Chemistry Lab",
    description: "Chemical reactions experiment",
    dateSubmitted: "2024-03-14"
  },
  {
    id: "GR010",
    studentId: "S006",
    studentName: "Yaw Boateng",
    className: "Grade 6",
    subject: "Mathematics",
    term: 1,
    academicYear: 2024,
    grade: "C+",
    score: 77,
    teacherId: "T001",
    teacherName: "John Smith",
    title: "Decimals Test",
    description: "Operations with decimal numbers",
    dateSubmitted: "2024-03-15"
  },
  {
    id: "GR011",
    studentId: "S007",
    studentName: "Akosua Adoma",
    className: "Grade 7",
    subject: "English",
    term: 1,
    academicYear: 2024,
    grade: "B+",
    score: 87,
    teacherId: "T002",
    teacherName: "Sarah Johnson",
    title: "Book Report",
    description: "Analysis of assigned class reading",
    dateSubmitted: "2024-03-16"
  },
  {
    id: "GR012",
    studentId: "S008",
    studentName: "Kofi Ansah",
    className: "Grade 8",
    subject: "Mathematics",
    term: 1,
    academicYear: 2024,
    grade: "B",
    score: 84,
    teacherId: "T001",
    teacherName: "John Smith",
    title: "Algebra Quiz",
    description: "Solving linear equations",
    dateSubmitted: "2024-03-17"
  },
  {
    id: "GR013",
    studentId: "S009",
    studentName: "Abena Pokua",
    className: "Grade 6",
    subject: "Science",
    term: 1,
    academicYear: 2024,
    grade: "A-",
    score: 90,
    teacherId: "T003",
    teacherName: "Michael Brown",
    title: "Science Fair Project",
    description: "Plant growth under different conditions",
    dateSubmitted: "2024-03-18"
  },
  {
    id: "GR014",
    studentId: "S010",
    studentName: "Nana Yaa",
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: 2024,
    grade: "A",
    score: 93,
    teacherId: "T001",
    teacherName: "John Smith",
    title: "Problem Solving Test",
    description: "Word problems and solutions",
    dateSubmitted: "2024-03-15"
  }
];

const mockAssignments: Assignment[] = [
  {
    id: "AS001",
    title: "Algebra Basics",
    description: "Complete exercises 1-10 on page 45 about basic algebraic equations.",
    subject: "Mathematics",
    className: "Grade 7",
    dueDate: "2024-05-10",
    teacherId: "T001",
    teacherName: "John Smith",
    dateAssigned: "2024-05-01",
    totalPoints: 100
  },
  {
    id: "AS002",
    title: "Book Report",
    description: "Write a 2-page report on the assigned reading 'Things Fall Apart'.",
    subject: "English",
    className: "Grade 8",
    dueDate: "2024-05-15",
    teacherId: "T002",
    teacherName: "Sarah Johnson",
    dateAssigned: "2024-05-03",
    totalPoints: 50
  },
  {
    id: "AS003",
    title: "Science Experiment",
    description: "Conduct the photosynthesis experiment and write up your findings.",
    subject: "Science",
    className: "Grade 6",
    dueDate: "2024-05-12",
    teacherId: "T003",
    teacherName: "Michael Brown",
    dateAssigned: "2024-05-02",
    totalPoints: 75
  },
  {
    id: "AS004",
    title: "Geometry Problems",
    description: "Solve the geometry problems on pages 112-115, showing all work.",
    subject: "Mathematics",
    className: "Grade 8",
    dueDate: "2024-05-14",
    teacherId: "T001",
    teacherName: "John Smith",
    dateAssigned: "2024-05-04",
    totalPoints: 100
  },
  {
    id: "AS005",
    title: "Poetry Analysis",
    description: "Analyze the poem 'The Road Not Taken' and write a 1-page response.",
    subject: "English",
    className: "Grade 7",
    dueDate: "2024-05-11",
    teacherId: "T002",
    teacherName: "Sarah Johnson",
    dateAssigned: "2024-05-03",
    totalPoints: 60
  },
  {
    id: "AS006",
    title: "Biology Lab Report",
    description: "Complete the lab report on the microscope observations from class.",
    subject: "Science",
    className: "Grade 7",
    dueDate: "2024-05-13",
    teacherId: "T003",
    teacherName: "Michael Brown",
    dateAssigned: "2024-05-05",
    totalPoints: 80
  },
  {
    id: "AS007",
    title: "Creative Writing",
    description: "Write a short story (2-3 pages) about a memorable experience.",
    subject: "English",
    className: "Grade 6",
    dueDate: "2024-05-16",
    teacherId: "T002",
    teacherName: "Sarah Johnson",
    dateAssigned: "2024-05-06",
    totalPoints: 70
  },
  {
    id: "AS008",
    title: "Physics Calculations",
    description: "Complete the physics calculations worksheet showing all formulas used.",
    subject: "Science",
    className: "Grade 8",
    dueDate: "2024-05-17",
    teacherId: "T003",
    teacherName: "Michael Brown",
    dateAssigned: "2024-05-07",
    totalPoints: 90
  },
  {
    id: "AS009",
    title: "Algebra Quiz",
    description: "Complete the take-home quiz on algebraic expressions.",
    subject: "Mathematics",
    className: "Grade 6",
    dueDate: "2024-05-09",
    teacherId: "T001",
    teacherName: "John Smith",
    dateAssigned: "2024-05-02",
    totalPoints: 50
  },
  {
    id: "AS010",
    title: "Literature Review",
    description: "Write a review of the class novel 'The Giver' focusing on themes.",
    subject: "English",
    className: "Grade 7",
    dueDate: "2024-05-18",
    teacherId: "T002",
    teacherName: "Sarah Johnson",
    dateAssigned: "2024-05-08",
    totalPoints: 85
  }
];

// Attendance Report Modal
const AttendanceReportModal: React.FC<{
  report: AttendanceRecord;
  onClose: () => void;
  onUpdate: (updatedReport: AttendanceRecord) => Promise<void>;
}> = ({ report, onClose, onUpdate }) => {
  const [status, setStatus] = useState(report.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async () => {
    setIsUpdating(true);
    try {
      await onUpdate({
        ...report,
        status
      });
      onClose();
    } catch (error) {
      console.error("Error updating attendance:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-green-800 mb-4">Attendance Report</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
            <p className="text-gray-900">{report.studentName}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
            <p className="text-gray-900">{report.teacherName}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'present' | 'absent' | 'late')}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Grade Report Modal
const GradeReportModal: React.FC<{
  report: GradeReport;
  onClose: () => void;
  onUpdate: (updatedReport: GradeReport) => Promise<void>;
}> = ({ report, onClose, onUpdate }) => {
  const [grade, setGrade] = useState(report.grade);
  const [score, setScore] = useState(report.score.toString());
  const [title, setTitle] = useState(report.title);
  const [description, setDescription] = useState(report.description);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async () => {
    setIsUpdating(true);
    try {
      await onUpdate({
        ...report,
        grade,
        score: parseFloat(score),
        title,
        description
      });
      onClose();
    } catch (error) {
      console.error("Error updating grade:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-green-800 mb-4">Grade Report</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
            <p className="text-gray-900">{report.studentName}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <p className="text-gray-900">{report.subject}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
            <p className="text-gray-900">{report.term}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
            <p className="text-gray-900">{report.academicYear}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Submitted</label>
            <p className="text-gray-900">{new Date(report.dateSubmitted).toLocaleDateString()}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Assignment Modal
const AssignmentModal: React.FC<{
  assignment: Assignment;
  onClose: () => void;
  onUpdate: (updatedAssignment: Assignment) => Promise<void>;
}> = ({ assignment, onClose, onUpdate }) => {
  const [title, setTitle] = useState(assignment.title);
  const [description, setDescription] = useState(assignment.description);
  const [dueDate, setDueDate] = useState(assignment.dueDate);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async () => {
    setIsUpdating(true);
    try {
      await onUpdate({
        ...assignment,
        title,
        description,
        dueDate
      });
      onClose();
    } catch (error) {
      console.error("Error updating assignment:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-green-800 mb-4">Assignment Details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <p className="text-gray-900">{assignment.subject}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
            <p className="text-gray-900">{assignment.teacherName}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Main Page Component
function AttendanceGradesPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Attendance Reports State
  const [attendanceReports, setAttendanceReports] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [selectedAttendanceReport, setSelectedAttendanceReport] = useState<AttendanceRecord | null>(null);
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState("");
  const [selectedDateForAttendance, setSelectedDateForAttendance] = useState("");

  // Grade Reports State
  const [gradeReports, setGradeReports] = useState<GradeReport[]>(mockGradeReports);
  const [selectedGradeReport, setSelectedGradeReport] = useState<GradeReport | null>(null);
  const [selectedClassForGrades, setSelectedClassForGrades] = useState("");
  const [selectedSubjectForGrades, setSelectedSubjectForGrades] = useState("");
  const [selectedTestForGrades, setSelectedTestForGrades] = useState("");

  // Assignments State
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedClassForAssignments, setSelectedClassForAssignments] = useState("");
  const [selectedSubjectForAssignments, setSelectedSubjectForAssignments] = useState("");
  const [selectedAssignmentName, setSelectedAssignmentName] = useState("");

  const allClasses = [
    "Creche", "Nursery 1", "Nursery 2", "KG 1", "KG 2", 
    ...Array.from({ length: 9 }, (_, i) => `Grade ${i + 1}`)
  ];

  const allSubjects = Array.from(new Set(mockTeachers.flatMap(teacher => teacher.subjects)));

  // Update functions
  const updateAttendanceReport = async (updatedReport: AttendanceRecord) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAttendanceReports(prev => 
        prev.map(report => report.id === updatedReport.id ? updatedReport : report)
      );
    } catch (error) {
      console.error("Error updating attendance report:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateGradeReport = async (updatedReport: GradeReport) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setGradeReports(prev => 
        prev.map(report => report.id === updatedReport.id ? updatedReport : report)
      );
    } catch (error) {
      console.error("Error updating grade report:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAssignment = async (updatedAssignment: Assignment) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAssignments(prev => 
        prev.map(assignment => assignment.id === updatedAssignment.id ? updatedAssignment : assignment)
      );
    } catch (error) {
      console.error("Error updating assignment:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter attendance reports based on selected class and date
  const filteredAttendanceReports = attendanceReports.filter(report => {
    if (!selectedClassForAttendance || !selectedDateForAttendance) return false;
    if (report.className !== selectedClassForAttendance) return false;
    if (report.date !== selectedDateForAttendance) return false;
    return true;
  });

  // Filter grade reports based on selected class, subject, and test
  const filteredGradeReports = gradeReports.filter(report => {
    if (!selectedClassForGrades || !selectedSubjectForGrades || !selectedTestForGrades) return false;
    if (report.className !== selectedClassForGrades) return false;
    if (report.subject !== selectedSubjectForGrades) return false;
    if (report.id !== selectedTestForGrades) return false;
    return true;
  });

  // Filter assignments based on selected class, subject, and assignment
  const filteredAssignments = assignments.filter(assignment => {
    if (!selectedClassForAssignments || !selectedSubjectForAssignments || !selectedAssignmentName) return false;
    if (assignment.className !== selectedClassForAssignments) return false;
    if (assignment.subject !== selectedSubjectForAssignments) return false;
    if (assignment.id !== selectedAssignmentName) return false;
    return true;
  });

  return (
    <ProtectedRoute>
      <div className="bg-gray-100 min-h-screen p-8">
        <motion.h1
          className="text-4xl font-bold text-gray-800 mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          📊 Attendance & Grades Management
        </motion.h1>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex justify-center space-x-4 bg-white p-3 rounded-lg shadow-md">
            {["📝 Attendance Reports", "📊 Grade Reports", "📚 Assignments"].map((title, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  `px-6 py-2 text-lg font-semibold rounded-lg transition-all ${
                    selected
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 bg-gray-200 hover:bg-gray-300"
                  }`
                }
              >
                {title}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-6">
            {/* Attendance Reports Tab */}
            <Tab.Panel>
              <motion.div
                className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">📝 Attendance Reports from Teachers</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-blue-700">Select Class</label>
                    <select
                      className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedClassForAttendance}
                      onChange={(e) => setSelectedClassForAttendance(e.target.value)}
                    >
                      <option value="">Select Class</option>
                      {allClasses.map((className) => (
                        <option key={className} value={className}>{className}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-blue-700">Select Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedDateForAttendance}
                      onChange={(e) => setSelectedDateForAttendance(e.target.value)}
                    />
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : filteredAttendanceReports.length === 0 ? (
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-blue-100 text-center">
                    {!selectedClassForAttendance || !selectedDateForAttendance ? 
                      "Please select both a class and a date to view attendance reports" : 
                      "No attendance reports available for the selected criteria"}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAttendanceReports.map((report) => (
                      <div 
                        key={report.id} 
                        className={`p-4 bg-white rounded-lg shadow-sm border border-blue-100 cursor-pointer transition-all ${
                          selectedAttendanceReport?.id === report.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setSelectedAttendanceReport(report)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-blue-700">{report.studentName}</h3>
                            <p className="text-gray-600">Teacher: {report.teacherName}</p>
                            <p className="text-gray-600">Status: 
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                report.status === 'present' ? 'bg-green-100 text-green-800' :
                                report.status === 'absent' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedAttendanceReport && (
                  <AttendanceReportModal
                    report={selectedAttendanceReport}
                    onClose={() => setSelectedAttendanceReport(null)}
                    onUpdate={updateAttendanceReport}
                  />
                )}
              </motion.div>
            </Tab.Panel>

            {/* Grade Reports Tab */}
            <Tab.Panel>
              <motion.div
                className="p-6 bg-purple-50 border-2 border-purple-200 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl font-semibold text-purple-800 mb-4">📊 Grade Reports from Teachers</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-purple-700">Select Class</label>
                    <select
                      className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={selectedClassForGrades}
                      onChange={(e) => setSelectedClassForGrades(e.target.value)}
                    >
                      <option value="">Select Class</option>
                      {allClasses.map((className) => (
                        <option key={className} value={className}>{className}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-purple-700">Select Subject</label>
                    <select
                      className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={selectedSubjectForGrades}
                      onChange={(e) => setSelectedSubjectForGrades(e.target.value)}
                      disabled={!selectedClassForGrades}
                    >
                      <option value="">Select Subject</option>
                      {allSubjects.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-purple-700">Select Test</label>
                    <select
                      className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={selectedTestForGrades}
                      onChange={(e) => setSelectedTestForGrades(e.target.value)}
                      disabled={!selectedSubjectForGrades}
                    >
                      <option value="">Select Test</option>
                      {gradeReports
                        .filter(report => 
                          (!selectedClassForGrades || report.className === selectedClassForGrades) &&
                          (!selectedSubjectForGrades || report.subject === selectedSubjectForGrades)
                        )
                        .map((report) => (
                          <option key={report.id} value={report.id}>
                            {report.title}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : filteredGradeReports.length === 0 ? (
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-purple-100 text-center">
                    {!selectedClassForGrades || !selectedSubjectForGrades || !selectedTestForGrades ? 
                      "Please select a class, subject, and test to view grade reports" : 
                      "No grade reports available for the selected criteria"}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredGradeReports.map((report) => (
                      <div 
                        key={report.id} 
                        className={`p-4 bg-white rounded-lg shadow-sm border border-purple-100 cursor-pointer transition-all ${
                          selectedGradeReport?.id === report.id ? 'ring-2 ring-purple-500' : ''
                        }`}
                        onClick={() => setSelectedGradeReport(report)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-purple-700">{report.studentName}</h3>
                            <p className="text-gray-600">Title: {report.title}</p>
                            <p className="text-gray-600">Subject: {report.subject}</p>
                            <p className="text-gray-600">Teacher: {report.teacherName}</p>
                            <p className="text-gray-600">Date: {formatDate(report.dateSubmitted)}</p>
                            <p className="text-gray-600">Description: {report.description}</p>
                            <p className="text-gray-600">Grade: 
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                report.grade === 'A' ? 'bg-green-100 text-green-800' :
                                report.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                                report.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                                report.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {report.grade} ({report.score}%)
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedGradeReport && (
                  <GradeReportModal
                    report={selectedGradeReport}
                    onClose={() => setSelectedGradeReport(null)}
                    onUpdate={updateGradeReport}
                  />
                )}
              </motion.div>
            </Tab.Panel>

            {/* Assignments Tab */}
            <Tab.Panel>
              <motion.div
                className="p-6 bg-green-50 border-2 border-green-200 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl font-semibold text-green-800 mb-4">📚 Assignments from Teachers</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-green-700">Select Class</label>
                    <select
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={selectedClassForAssignments}
                      onChange={(e) => setSelectedClassForAssignments(e.target.value)}
                    >
                      <option value="">Select Class</option>
                      {allClasses.map((className) => (
                        <option key={className} value={className}>{className}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-green-700">Select Subject</label>
                    <select
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={selectedSubjectForAssignments}
                      onChange={(e) => setSelectedSubjectForAssignments(e.target.value)}
                      disabled={!selectedClassForAssignments}
                    >
                      <option value="">Select Subject</option>
                      {allSubjects.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-green-700">Select Assignment</label>
                    <select
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={selectedAssignmentName}
                      onChange={(e) => setSelectedAssignmentName(e.target.value)}
                      disabled={!selectedSubjectForAssignments}
                    >
                      <option value="">Select Assignment</option>
                      {assignments
                        .filter(assignment => 
                          (!selectedClassForAssignments || assignment.className === selectedClassForAssignments) &&
                          (!selectedSubjectForAssignments || assignment.subject === selectedSubjectForAssignments)
                        )
                        .map((assignment) => (
                          <option key={assignment.id} value={assignment.id}>
                            {assignment.title}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                ) : filteredAssignments.length === 0 ? (
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-green-100 text-center">
                    {!selectedClassForAssignments || !selectedSubjectForAssignments || !selectedAssignmentName ? 
                      "Please select a class, subject, and assignment to view details" : 
                      "No assignments available for the selected criteria"}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAssignments.map((assignment) => (
                      <div 
                        key={assignment.id} 
                        className={`p-4 bg-white rounded-lg shadow-sm border border-green-100 cursor-pointer transition-all ${
                          selectedAssignment?.id === assignment.id ? 'ring-2 ring-green-500' : ''
                        }`}
                        onClick={() => setSelectedAssignment(assignment)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-green-700">{assignment.title}</h3>
                            <p className="text-gray-600">Subject: {assignment.subject}</p>
                            <p className="text-gray-600">Teacher: {assignment.teacherName}</p>
                            <p className="text-gray-600">Assigned: {formatDate(assignment.dateAssigned)}</p>
                            <p className="text-gray-600">Due: {formatDate(assignment.dueDate)}</p>
                            <p className="text-gray-600">Description: {assignment.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedAssignment && (
                  <AssignmentModal
                    assignment={selectedAssignment}
                    onClose={() => setSelectedAssignment(null)}
                    onUpdate={updateAssignment}
                  />
                )}
              </motion.div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
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