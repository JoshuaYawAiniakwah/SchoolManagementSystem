'use client';
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext"
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

interface SBARecord {
  id: string;
  studentId: string;
  studentName: string;
  gender: string;
  monthlyTest1: number;
  monthlyTest2: number;
  groupExercise: number;
  homeWork: number;
  classEve1: number;
  classEve2: number;
  projectWork: number;
  totalSBAScore: number;
  fiftyPercent: number;
  endOfTermExams: number;
  fiftyPercentExam: number;
  grandTotal: number;
  grade: string;
  position: number;
  className: string;
  subject: string;
  term: number;
  academicYear: string;
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

// Mock SBA Data with updated gender values (Male/Female instead of Boy/Girl)
const mockSBARecords: SBARecord[] = [
  {
    id: "SBA001",
    studentId: "S007",
    studentName: "Dick Kwamena Norbert",
    gender: "Male",
    monthlyTest1: 18,
    monthlyTest2: 19,
    groupExercise: 10,
    homeWork: 19,
    classEve1: 10,
    classEve2: 10,
    projectWork: 10,
    totalSBAScore: 96,
    fiftyPercent: 48,
    endOfTermExams: 60,
    fiftyPercentExam: 30,
    grandTotal: 78,
    grade: "A",
    position: 1,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA002",
    studentId: "S012",
    studentName: "Sampson Kelvin Moses",
    gender: "Male",
    monthlyTest1: 18,
    monthlyTest2: 20,
    groupExercise: 10,
    homeWork: 18,
    classEve1: 10,
    classEve2: 10,
    projectWork: 10,
    totalSBAScore: 96,
    fiftyPercent: 48,
    endOfTermExams: 52,
    fiftyPercentExam: 26,
    grandTotal: 74,
    grade: "B+",
    position: 2,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA003",
    studentId: "S002",
    studentName: "Appiah Olygere George",
    gender: "Male",
    monthlyTest1: 19,
    monthlyTest2: 19,
    groupExercise: 10,
    homeWork: 18,
    classEve1: 10,
    classEve2: 10,
    projectWork: 10,
    totalSBAScore: 96,
    fiftyPercent: 48,
    endOfTermExams: 50,
    fiftyPercentExam: 25,
    grandTotal: 73,
    grade: "B",
    position: 3,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA004",
    studentId: "S015",
    studentName: "Andoh Aredziwa Nasrin",
    gender: "Female",
    monthlyTest1: 17,
    monthlyTest2: 14,
    groupExercise: 10,
    homeWork: 16,
    classEve1: 10,
    classEve2: 10,
    projectWork: 10,
    totalSBAScore: 87,
    fiftyPercent: 44,
    endOfTermExams: 55,
    fiftyPercentExam: 28,
    grandTotal: 71,
    grade: "B-",
    position: 4,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA005",
    studentId: "S006",
    studentName: "Cobbinah Kwei Franklin",
    gender: "Male",
    monthlyTest1: 17,
    monthlyTest2: 20,
    groupExercise: 10,
    homeWork: 18,
    classEve1: 10,
    classEve2: 10,
    projectWork: 10,
    totalSBAScore: 95,
    fiftyPercent: 48,
    endOfTermExams: 46,
    fiftyPercentExam: 23,
    grandTotal: 71,
    grade: "B-",
    position: 4,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA006",
    studentId: "S001",
    studentName: "Addison Hughes Gideon",
    gender: "Male",
    monthlyTest1: 17,
    monthlyTest2: 17,
    groupExercise: 10,
    homeWork: 18,
    classEve1: 10,
    classEve2: 10,
    projectWork: 10,
    totalSBAScore: 92,
    fiftyPercent: 46,
    endOfTermExams: 47,
    fiftyPercentExam: 24,
    grandTotal: 70,
    grade: "C+",
    position: 6,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA007",
    studentId: "S011",
    studentName: "Quaicoe Kwaku Galous",
    gender: "Male",
    monthlyTest1: 17,
    monthlyTest2: 15,
    groupExercise: 6,
    homeWork: 17,
    classEve1: 10,
    classEve2: 10,
    projectWork: 7,
    totalSBAScore: 82,
    fiftyPercent: 41,
    endOfTermExams: 43,
    fiftyPercentExam: 22,
    grandTotal: 63,
    grade: "C",
    position: 7,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA008",
    studentId: "S019",
    studentName: "Danquah Abena Elzer",
    gender: "Female",
    monthlyTest1: 16,
    monthlyTest2: 14,
    groupExercise: 9,
    homeWork: 6,
    classEve1: 10,
    classEve2: 10,
    projectWork: 10,
    totalSBAScore: 85,
    fiftyPercent: 43,
    endOfTermExams: 36,
    fiftyPercentExam: 18,
    grandTotal: 61,
    grade: "C-",
    position: 8,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA009",
    studentId: "S003",
    studentName: "Arthur K. Nana Jeffery",
    gender: "Male",
    monthlyTest1: 16,
    monthlyTest2: 19,
    groupExercise: 5,
    homeWork: 15,
    classEve1: 10,
    classEve2: 10,
    projectWork: 7,
    totalSBAScore: 82,
    fiftyPercent: 41,
    endOfTermExams: 37,
    fiftyPercentExam: 19,
    grandTotal: 60,
    grade: "D+",
    position: 9,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA010",
    studentId: "S023",
    studentName: "Mensah Ninjira Magdalene",
    gender: "Female",
    monthlyTest1: 15,
    monthlyTest2: 16,
    groupExercise: 5,
    homeWork: 15,
    classEve1: 10,
    classEve2: 10,
    projectWork: 7,
    totalSBAScore: 78,
    fiftyPercent: 39,
    endOfTermExams: 41,
    fiftyPercentExam: 21,
    grandTotal: 60,
    grade: "D+",
    position: 9,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA011",
    studentId: "S022",
    studentName: "Gebiwaa A. Sussanina Bonah",
    gender: "Female",
    monthlyTest1: 16,
    monthlyTest2: 15,
    groupExercise: 9,
    homeWork: 16,
    classEve1: 10,
    classEve2: 10,
    projectWork: 10,
    totalSBAScore: 86,
    fiftyPercent: 43,
    endOfTermExams: 32,
    fiftyPercentExam: 16,
    grandTotal: 59,
    grade: "D",
    position: 11,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA012",
    studentId: "S010",
    studentName: "Nietsiah Junior Joseph",
    gender: "Male",
    monthlyTest1: 15,
    monthlyTest2: 19,
    groupExercise: 5,
    homeWork: 16,
    classEve1: 10,
    classEve2: 10,
    projectWork: 7,
    totalSBAScore: 82,
    fiftyPercent: 41,
    endOfTermExams: 35,
    fiftyPercentExam: 18,
    grandTotal: 59,
    grade: "D",
    position: 11,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA013",
    studentId: "S014",
    studentName: "Americk Philpa",
    gender: "Female",
    monthlyTest1: 15,
    monthlyTest2: 12,
    groupExercise: 8,
    homeWork: 14,
    classEve1: 10,
    classEve2: 10,
    projectWork: 7,
    totalSBAScore: 76,
    fiftyPercent: 38,
    endOfTermExams: 41,
    fiftyPercentExam: 21,
    grandTotal: 59,
    grade: "D",
    position: 11,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA014",
    studentId: "S004",
    studentName: "Arthur Yaw Nana",
    gender: "Male",
    monthlyTest1: 15,
    monthlyTest2: 18,
    groupExercise: 6,
    homeWork: 14,
    classEve1: 10,
    classEve2: 10,
    projectWork: 7,
    totalSBAScore: 80,
    fiftyPercent: 40,
    endOfTermExams: 33,
    fiftyPercentExam: 17,
    grandTotal: 57,
    grade: "D-",
    position: 14,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA015",
    studentId: "S005",
    studentName: "Asamoah Arhu Isaac",
    gender: "Male",
    monthlyTest1: 15,
    monthlyTest2: 18,
    groupExercise: 5,
    homeWork: 14,
    classEve1: 10,
    classEve2: 10,
    projectWork: 7,
    totalSBAScore: 79,
    fiftyPercent: 40,
    endOfTermExams: 32,
    fiftyPercentExam: 16,
    grandTotal: 56,
    grade: "E",
    position: 15,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA016",
    studentId: "S024",
    studentName: "Odum Anna Emerald",
    gender: "Female",
    monthlyTest1: 13,
    monthlyTest2: 10,
    groupExercise: 9,
    homeWork: 15,
    classEve1: 10,
    classEve2: 10,
    projectWork: 10,
    totalSBAScore: 77,
    fiftyPercent: 39,
    endOfTermExams: 32,
    fiftyPercentExam: 16,
    grandTotal: 55,
    grade: "E",
    position: 16,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA017",
    studentId: "S009",
    studentName: "Nietsiah Leon",
    gender: "Male",
    monthlyTest1: 14,
    monthlyTest2: 17,
    groupExercise: 5,
    homeWork: 15,
    classEve1: 10,
    classEve2: 10,
    projectWork: 7,
    totalSBAScore: 78,
    fiftyPercent: 39,
    endOfTermExams: 28,
    fiftyPercentExam: 14,
    grandTotal: 53,
    grade: "F",
    position: 17,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA018",
    studentId: "S021",
    studentName: "Gaisey Emmanuela",
    gender: "Female",
    monthlyTest1: 14,
    monthlyTest2: 15,
    groupExercise: 5,
    homeWork: 15,
    classEve1: 10,
    classEve2: 10,
    projectWork: 7,
    totalSBAScore: 76,
    fiftyPercent: 38,
    endOfTermExams: 30,
    fiftyPercentExam: 15,
    grandTotal: 53,
    grade: "F",
    position: 17,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA019",
    studentId: "S013",
    studentName: "Teiterh Bryan",
    gender: "Male",
    monthlyTest1: 14,
    monthlyTest2: 16,
    groupExercise: 4,
    homeWork: 13,
    classEve1: 10,
    classEve2: 10,
    projectWork: 7,
    totalSBAScore: 74,
    fiftyPercent: 37,
    endOfTermExams: 32,
    fiftyPercentExam: 16,
    grandTotal: 53,
    grade: "F",
    position: 17,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA020",
    studentId: "S020",
    studentName: "Dey Vanessa",
    gender: "Female",
    monthlyTest1: 14,
    monthlyTest2: 15,
    groupExercise: 5,
    homeWork: 14,
    classEve1: 10,
    classEve2: 10,
    projectWork: 7,
    totalSBAScore: 75,
    fiftyPercent: 38,
    endOfTermExams: 30,
    fiftyPercentExam: 15,
    grandTotal: 53,
    grade: "F",
    position: 17,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA021",
    studentId: "S017",
    studentName: "Baidoo Christabel",
    gender: "Female",
    monthlyTest1: 14,
    monthlyTest2: 14,
    groupExercise: 5,
    homeWork: 14,
    classEve1: 10,
    classEve2: 10,
    projectWork: 7,
    totalSBAScore: 74,
    fiftyPercent: 37,
    endOfTermExams: 27,
    fiftyPercentExam: 14,
    grandTotal: 51,
    grade: "F",
    position: 21,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
  },
  {
    id: "SBA022",
    studentId: "S018",
    studentName: "Banson Ruth",
    gender: "Female",
    monthlyTest1: 15,
    monthlyTest2: 15,
    groupExercise: 5,
    homeWork: 15,
    classEve1: 10,
    classEve2: 10,
    projectWork: 7,
    totalSBAScore: 77,
    fiftyPercent: 39,
    endOfTermExams: 23,
    fiftyPercentExam: 12,
    grandTotal: 50,
    grade: "F",
    position: 22,
    className: "Grade 7",
    subject: "Mathematics",
    term: 1,
    academicYear: "2024/2025"
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

// SBA Modal
const SBAModal: React.FC<{
  sba: SBARecord;
  onClose: () => void;
  onUpdate: (updatedSBA: SBARecord) => Promise<void>;
}> = ({ sba, onClose, onUpdate }) => {
  const [monthlyTest1, setMonthlyTest1] = useState(sba.monthlyTest1.toString());
  const [monthlyTest2, setMonthlyTest2] = useState(sba.monthlyTest2.toString());
  const [groupExercise, setGroupExercise] = useState(sba.groupExercise.toString());
  const [homeWork, setHomeWork] = useState(sba.homeWork.toString());
  const [classEve1, setClassEve1] = useState(sba.classEve1.toString());
  const [classEve2, setClassEve2] = useState(sba.classEve2.toString());
  const [projectWork, setProjectWork] = useState(sba.projectWork.toString());
  const [endOfTermExams, setEndOfTermExams] = useState(sba.endOfTermExams.toString());
  const [isUpdating, setIsUpdating] = useState(false);

  const calculateScores = () => {
    const mt1 = parseFloat(monthlyTest1) || 0;
    const mt2 = parseFloat(monthlyTest2) || 0;
    const ge = parseFloat(groupExercise) || 0;
    const hw = parseFloat(homeWork) || 0;
    const ce1 = parseFloat(classEve1) || 0;
    const ce2 = parseFloat(classEve2) || 0;
    const pw = parseFloat(projectWork) || 0;
    const eote = parseFloat(endOfTermExams) || 0;

    const totalSBAScore = mt1 + mt2 + ge + hw + ce1 + ce2 + pw;
    const fiftyPercent = totalSBAScore / 2;
    const fiftyPercentExam = eote / 2;
    const grandTotal = fiftyPercent + fiftyPercentExam;

    return {
      totalSBAScore,
      fiftyPercent,
      fiftyPercentExam,
      grandTotal
    };
  };

  const calculateGrade = (score: number) => {
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    if (score >= 40) return "E";
    return "F";
  };

  const handleSubmit = async () => {
    setIsUpdating(true);
    try {
      const calculated = calculateScores();
      await onUpdate({
        ...sba,
        monthlyTest1: parseFloat(monthlyTest1),
        monthlyTest2: parseFloat(monthlyTest2),
        groupExercise: parseFloat(groupExercise),
        homeWork: parseFloat(homeWork),
        classEve1: parseFloat(classEve1),
        classEve2: parseFloat(classEve2),
        projectWork: parseFloat(projectWork),
        endOfTermExams: parseFloat(endOfTermExams),
        totalSBAScore: calculated.totalSBAScore,
        fiftyPercent: calculated.fiftyPercent,
        fiftyPercentExam: calculated.fiftyPercentExam,
        grandTotal: calculated.grandTotal,
        grade: calculateGrade(calculated.grandTotal)
      });
      onClose();
    } catch (error) {
      console.error("Error updating SBA:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const calculatedScores = calculateScores();

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
        <h2 className="text-xl font-bold text-green-800 mb-4">Student Based Assessment</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
              <p className="text-gray-900">{sba.studentName}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <p className="text-gray-900">{sba.gender}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <p className="text-gray-900">{sba.className}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <p className="text-gray-900">{sba.subject}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
              <p className="text-gray-900">{sba.term}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
              <p className="text-gray-900">{sba.academicYear}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Assessment Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Test 1 (20)</label>
                <input
                  type="number"
                  value={monthlyTest1}
                  onChange={(e) => setMonthlyTest1(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  max="20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Test 2 (20)</label>
                <input
                  type="number"
                  value={monthlyTest2}
                  onChange={(e) => setMonthlyTest2(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  max="20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Exercise (10)</label>
                <input
                  type="number"
                  value={groupExercise}
                  onChange={(e) => setGroupExercise(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  max="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Home Work (20)</label>
                <input
                  type="number"
                  value={homeWork}
                  onChange={(e) => setHomeWork(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  max="20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Eve 1 (10)</label>
                <input
                  type="number"
                  value={classEve1}
                  onChange={(e) => setClassEve1(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  max="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Eve 2 (10)</label>
                <input
                  type="number"
                  value={classEve2}
                  onChange={(e) => setClassEve2(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  max="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Work (10)</label>
                <input
                  type="number"
                  value={projectWork}
                  onChange={(e) => setProjectWork(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  max="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End of Term Exams (100)</label>
                <input
                  type="number"
                  value={endOfTermExams}
                  onChange={(e) => setEndOfTermExams(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Calculated Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TOTAL SBA SCORE (100)</label>
                <p className="text-gray-900 font-semibold">{calculatedScores.totalSBAScore.toFixed(1)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">50%</label>
                <p className="text-gray-900 font-semibold">{calculatedScores.fiftyPercent.toFixed(1)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">END OF TERM EXAMS (100)</label>
                <p className="text-gray-900 font-semibold">{parseFloat(endOfTermExams) || 0}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">50%</label>
                <p className="text-gray-900 font-semibold">{calculatedScores.fiftyPercentExam.toFixed(1)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GRAND TOTAL (50+50)</label>
                <p className="text-gray-900 font-semibold">{calculatedScores.grandTotal.toFixed(1)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GRADE</label>
                <p className="text-gray-900 font-semibold">{calculateGrade(calculatedScores.grandTotal)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">POSITION</label>
                <p className="text-gray-900 font-semibold">{sba.position}</p>
              </div>
            </div>
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

  // Attendance State
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

  // SBA State
  const [sbaRecords, setSBARecords] = useState<SBARecord[]>(mockSBARecords);
  const [selectedSBARecord, setSelectedSBARecord] = useState<SBARecord | null>(null);
  const [selectedClassForSBA, setSelectedClassForSBA] = useState("");
  const [selectedSubjectForSBA, setSelectedSubjectForSBA] = useState("");

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

  const updateSBARecord = async (updatedSBA: SBARecord) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSBARecords(prev => 
        prev.map(record => record.id === updatedSBA.id ? updatedSBA : record)
      );
    } catch (error) {
      console.error("Error updating SBA record:", error);
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

  // Filter SBA records based on selected class and subject
  const filteredSBARecords = sbaRecords.filter(record => {
    if (!selectedClassForSBA || !selectedSubjectForSBA) return false;
    if (record.className !== selectedClassForSBA) return false;
    if (record.subject !== selectedSubjectForSBA) return false;
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
            {["📝 Attendance", "📊 Grades", "📚 Assignments", "📈 SBA"].map((title, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  `px-6 py-2 text-lg font-semibold rounded-lg transition-all ${
                    selected
                      ? "bg-green-600 text-white shadow-md"
                      : "text-gray-700 bg-gray-200 hover:bg-gray-300"
                  }`
                }
              >
                {title}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-6">
            {/* Attendance Tab */}
            <Tab.Panel>
              <motion.div
                className="p-6 bg-green-50 border-2 border-green-200 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl font-semibold text-green-800 mb-4">📝 Attendance from Teachers</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-green-700">Select Class</label>
                    <select
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    <label className="block text-sm font-medium mb-1 text-green-700">Select Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={selectedDateForAttendance}
                      onChange={(e) => setSelectedDateForAttendance(e.target.value)}
                    />
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                ) : filteredAttendanceReports.length === 0 ? (
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-green-100 text-center">
                    {!selectedClassForAttendance || !selectedDateForAttendance ? 
                      "Please select both a class and a date to view attendance" : 
                      "No attendance reports available for the selected criteria"}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAttendanceReports.map((report) => (
                      <div 
                        key={report.id} 
                        className={`p-4 bg-white rounded-lg shadow-sm border border-green-100 cursor-pointer transition-all ${
                          selectedAttendanceReport?.id === report.id ? 'ring-2 ring-green-500' : ''
                        }`}
                        onClick={() => setSelectedAttendanceReport(report)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-green-700">{report.studentName}</h3>
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
                className="p-6 bg-green-50 border-2 border-green-200 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl font-semibold text-green-800 mb-4">📊 Grade Reports from Teachers</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-green-700">Select Class</label>
                    <select
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    <label className="block text-sm font-medium mb-1 text-green-700">Select Subject</label>
                    <select
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    <label className="block text-sm font-medium mb-1 text-green-700">Select Test</label>
                    <select
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                ) : filteredGradeReports.length === 0 ? (
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-green-100 text-center">
                    {!selectedClassForGrades || !selectedSubjectForGrades || !selectedTestForGrades ? 
                      "Please select a class, subject, and test to view grade reports" : 
                      "No grade reports available for the selected criteria"}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredGradeReports.map((report) => (
                      <div 
                        key={report.id} 
                        className={`p-4 bg-white rounded-lg shadow-sm border border-green-100 cursor-pointer transition-all ${
                          selectedGradeReport?.id === report.id ? 'ring-2 ring-green-500' : ''
                        }`}
                        onClick={() => setSelectedGradeReport(report)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-green-700">{report.studentName}</h3>
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

            {/* SBA Tab */}
            <Tab.Panel>
              <motion.div
                className="p-6 bg-green-50 border-2 border-green-200 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl font-semibold text-green-800 mb-4">📈 Student Based Assessment (SBA)</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-green-700">Select Class</label>
                    <select
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={selectedClassForSBA}
                      onChange={(e) => setSelectedClassForSBA(e.target.value)}
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
                      value={selectedSubjectForSBA}
                      onChange={(e) => setSelectedSubjectForSBA(e.target.value)}
                      disabled={!selectedClassForSBA}
                    >
                      <option value="">Select Subject</option>
                      {allSubjects.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                ) : filteredSBARecords.length === 0 ? (
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-green-100 text-center">
                    {!selectedClassForSBA || !selectedSubjectForSBA ? 
                      "Please select both a class and a subject to view SBA records" : 
                      "No SBA records available for the selected criteria"}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                      <thead className="bg-green-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">SN</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Names</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Gender</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Monthly Test 1 (20)</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Monthly Test 2 (20)</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Group Exercise (10)</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Home Work (20)</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Class Eve 1 (10)</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Class Eve 2 (10)</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Project Work (10)</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">TOTAL SBA SCORE (100)</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">50%</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">END OF TERM EXAMS (100)</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">50%</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">GRAND TOTAL (50+50)</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">GRADE</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">POSITION</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-green-200">
                        {filteredSBARecords.map((record, index) => (
                          <tr 
                            key={record.id} 
                            className={`hover:bg-green-50 ${index % 2 === 0 ? 'bg-white' : 'bg-green-50'}`}
                          >
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{record.studentName}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{record.gender}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{record.monthlyTest1}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{record.monthlyTest2}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{record.groupExercise}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{record.homeWork}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{record.classEve1}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{record.classEve2}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{record.projectWork}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">{record.totalSBAScore}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">{record.fiftyPercent}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{record.endOfTermExams}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">{record.fiftyPercentExam}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">{record.grandTotal}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                record.grade === 'A' ? 'bg-green-100 text-green-800' :
                                record.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                                record.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                                record.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {record.grade}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">{record.position}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                              <button
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                onClick={() => setSelectedSBARecord(record)}
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedSBARecord && (
                  <SBAModal
                    sba={selectedSBARecord}
                    onClose={() => setSelectedSBARecord(null)}
                    onUpdate={updateSBARecord}
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