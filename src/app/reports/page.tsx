"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import { Modal } from '@/components/ui/Modal';

// Student Image Component
const UserIcon = () => (
  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
    <span className="text-gray-500 text-sm">N/A</span>
  </div>
);

// Static data for reports
const staticGradesReports = [
  {
    id: "1",
    className: "Grade 5",
    subject: "Mathematics",
    teacherName: "Mr. Johnson",
    date: "2023-10-15",
    students: [
      { 
        name: "Emma Watson", 
        testScore: 90,
        assignmentScore: 92,
        examScore: 92,
        comments: "Excellent performance in algebra. Consistently scores high on all assessments." 
      },
      { 
        name: "John Smith", 
        testScore: 82,
        assignmentScore: 85,
        examScore: 81,
        comments: "Needs improvement in geometry. Struggles with proofs but shows effort." 
      },
      { 
        name: "Sarah Parker", 
        testScore: 85,
        assignmentScore: 87,
        examScore: 89,
        comments: "Consistent performance. Strong problem-solving skills." 
      }
    ],
    overallComments: "The class is performing well overall, with most students showing good understanding of algebraic concepts. Geometry needs more attention."
  },
  {
    id: "2",
    className: "Grade 3",
    subject: "English",
    teacherName: "Ms. Thompson",
    date: "2023-10-18",
    students: [
      { 
        name: "Michael Brown", 
        testScore: 70,
        assignmentScore: 75,
        examScore: 71,
        comments: "Struggling with reading comprehension. Needs extra practice with inference questions." 
      },
      { 
        name: "Lisa Ray", 
        testScore: 98,
        assignmentScore: 96,
        examScore: 97,
        comments: "Excellent vocabulary and reading fluency. Advanced for grade level." 
      },
      { 
        name: "David Wilson", 
        testScore: 82,
        assignmentScore: 85,
        examScore: 86,
        comments: "Good writing skills. Needs to work on grammar in creative writing." 
      }
    ],
    overallComments: "Reading comprehension needs work across the class. Writing skills are generally strong. Vocabulary development is excellent for most students."
  }
];

const staticSupportReports = [
  {
    id: "1",
    className: "Grade 2",
    teacherName: "Mrs. Anderson",
    date: "2023-10-10",
    description: "Several students are struggling with basic reading skills and falling behind the class average.",
    students: [
      {
        name: "Olivia Martinez",
        subjectAffected: "Reading",
        description: "Has difficulty decoding multi-syllabic words. Needs phonics reinforcement."
      },
      {
        name: "James Wilson",
        subjectAffected: "Reading",
        description: "Struggles with reading fluency. Often loses place when reading aloud."
      },
      {
        name: "Sophia Garcia",
        subjectAffected: "Reading",
        description: "Comprehension issues. Can read words but doesn't always understand meaning."
      }
    ]
  },
  {
    id: "2",
    className: "Grade 4",
    teacherName: "Mr. Roberts",
    date: "2023-10-12",
    description: "A group of students shows signs of math anxiety during tests and complex problems.",
    students: [
      {
        name: "Ethan Brown",
        subjectAffected: "Mathematics",
        description: "Freezes during timed tests. Performs better with untimed practice."
      },
      {
        name: "Mia Johnson",
        subjectAffected: "Mathematics",
        description: "Expresses negative self-talk about math abilities. Needs confidence building."
      },
      {
        name: "Noah Smith",
        subjectAffected: "Mathematics",
        description: "Avoids asking for help. Needs encouragement to seek clarification."
      }
    ]
  }
];

const staticLessonPlans = [
  {
    id: "1",
    title: "Introduction to Fractions",
    className: "Grade 5",
    subject: "Mathematics",
    teacherName: "Mr. Johnson",
    date: "2023-10-20",
    duration: "2 weeks",
    objectives: [
      "Understand basic fraction concepts",
      "Identify numerator and denominator",
      "Compare simple fractions",
      "Add and subtract fractions with like denominators"
    ],
    materials: [
      "Fraction circles",
      "Graph paper",
      "Colored pencils",
      "Worksheets"
    ]
  },
  {
    id: "2",
    title: "Ancient Civilizations",
    className: "Grade 6",
    subject: "Social Studies",
    teacherName: "Ms. Lee",
    date: "2023-10-22",
    duration: "3 weeks",
    objectives: [
      "Identify key characteristics of ancient civilizations",
      "Compare and contrast different societies",
      "Understand cultural contributions",
      "Analyze primary sources"
    ],
    materials: [
      "Textbook chapter",
      "Primary source documents",
      "Art supplies for projects",
      "Map worksheets"
    ]
  }
];

const staticFlaggedAbsences = [
  {
    id: "1",
    studentName: "Daniel Kim",
    className: "Grade 3",
    teacherName: "Mrs. Anderson",
    absenceCount: 5,
    date: "2023-10-15",
    severity: "High",
    absenceDates: ["2023-10-02", "2023-10-05", "2023-10-09", "2023-10-12", "2023-10-15"],
    comments: "Student has missed 5 days this month without explanation. Performance is suffering.",
    parentName: "Jennifer Kim",
    parentPhone: "555-123-4567",
    parentEmail: "j.kim@email.com"
  },
  {
    id: "2",
    studentName: "Sophia Garcia",
    className: "Grade 2",
    teacherName: "Ms. Thompson",
    absenceCount: 3,
    date: "2023-10-14",
    severity: "Medium",
    absenceDates: ["2023-10-06", "2023-10-11", "2023-10-14"],
    comments: "Frequent absences on Fridays. Parent mentioned health concerns but no documentation provided.",
    parentName: "Carlos Garcia",
    parentPhone: "555-987-6543",
    parentEmail: "c.garcia@email.com"
  }
];

const staticAttendanceReports = [
  {
    id: "w1",
    className: "Grade 4",
    teacherName: "Mr. Roberts",
    type: "weekly",
    period: "Week 1",
    startDate: "2023-09-04",
    endDate: "2023-09-08",
    totalStudents: 22,
    averageAttendance: 92,
    students: [
      { name: "Emma Watson", present: 5, absent: 0, late: 1, attendancePercentage: 100 },
      { name: "John Smith", present: 4, absent: 1, late: 0, attendancePercentage: 80 },
      { name: "Sarah Parker", present: 5, absent: 0, late: 0, attendancePercentage: 100 }
    ],
    comments: "Good attendance overall. One student with an unexplained absence.",
    parents: [
      { id: "1", name: "Helen Watson", studentName: "Emma Watson" },
      { id: "2", name: "Robert Smith", studentName: "John Smith" },
      { id: "3", name: "Mary Parker", studentName: "Sarah Parker" }
    ]
  },
  {
    id: "w2",
    className: "Grade 4",
    teacherName: "Mr. Roberts",
    type: "weekly",
    period: "Week 2",
    startDate: "2023-09-11",
    endDate: "2023-09-15",
    totalStudents: 22,
    averageAttendance: 95,
    students: [
      { name: "Emma Watson", present: 5, absent: 0, late: 0, attendancePercentage: 100 },
      { name: "John Smith", present: 5, absent: 0, late: 0, attendancePercentage: 100 },
      { name: "Sarah Parker", present: 4, absent: 1, late: 0, attendancePercentage: 80 }
    ],
    comments: "Improved attendance from previous week. One student absent due to illness.",
    parents: [
      { id: "1", name: "Helen Watson", studentName: "Emma Watson" },
      { id: "2", name: "Robert Smith", studentName: "John Smith" },
      { id: "3", name: "Mary Parker", studentName: "Sarah Parker" }
    ]
  },
  {
    id: "m1",
    className: "Grade 5",
    teacherName: "Mr. Johnson",
    type: "monthly",
    period: "January",
    startDate: "2023-01-01",
    endDate: "2023-01-31",
    totalStudents: 25,
    averageAttendance: 88,
    students: [
      { name: "Michael Brown", present: 18, absent: 2, late: 3, attendancePercentage: 90 },
      { name: "Lisa Ray", present: 20, absent: 0, late: 1, attendancePercentage: 100 },
      { name: "David Wilson", present: 19, absent: 1, late: 0, attendancePercentage: 95 }
    ],
    comments: "Attendance has improved this month. Still monitoring a few students with frequent tardiness.",
    parents: [
      { id: "4", name: "Susan Brown", studentName: "Michael Brown" },
      { id: "5", name: "Rajesh Ray", studentName: "Lisa Ray" },
      { id: "6", name: "Jennifer Wilson", studentName: "David Wilson" }
    ]
  }
];

const allClasses = [
  "Creche", "Nursery 1", "Nursery 2", "KG 1", "KG 2", 
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9"
];

// Format date for display
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Main Reports Page Component
function ReportsPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [classQuery, setClassQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reports State
  const [gradesReports, setGradesReports] = useState<any[]>([]);
  const [selectedStudentGrades, setSelectedStudentGrades] = useState<any>(null);

  const [supportReports, setSupportReports] = useState<any[]>([]);
  const [selectedSupportStudent, setSelectedSupportStudent] = useState<any>(null);

  const [lessonPlans, setLessonPlans] = useState<any[]>([]);
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<any>(null);

  const [flaggedAbsences, setFlaggedAbsences] = useState<any[]>([]);
  const [selectedFlaggedAbsence, setSelectedFlaggedAbsence] = useState<any>(null);

  const [attendanceReports, setAttendanceReports] = useState<any[]>([]);
  const [selectedAttendanceStudent, setSelectedAttendanceStudent] = useState<any>(null);
  const [attendanceReportType, setAttendanceReportType] = useState("weekly");
  const [selectedParent, setSelectedParent] = useState("");

  // Filter reports by selected class
  const filterReportsByClass = () => {
    if (!classQuery) {
      setGradesReports([]);
      setSupportReports([]);
      setLessonPlans([]);
      setFlaggedAbsences([]);
      setAttendanceReports([]);
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      try {
        const filteredGrades = staticGradesReports.filter(report => report.className === classQuery);
        const filteredSupport = staticSupportReports.filter(report => report.className === classQuery);
        const filteredLessonPlans = staticLessonPlans.filter(report => report.className === classQuery);
        const filteredAbsences = staticFlaggedAbsences.filter(report => report.className === classQuery);
        const filteredAttendance = staticAttendanceReports.filter(report => report.className === classQuery);

        setGradesReports(filteredGrades);
        setSupportReports(filteredSupport);
        setLessonPlans(filteredLessonPlans);
        setFlaggedAbsences(filteredAbsences);
        setAttendanceReports(filteredAttendance);
        
        setError(null);
      } catch (error) {
        console.error("Error filtering reports:", error);
        setError("Failed to filter reports. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassQuery(e.target.value);
    setSelectedStudentGrades(null);
    setSelectedSupportStudent(null);
    setSelectedLessonPlan(null);
    setSelectedFlaggedAbsence(null);
    setSelectedAttendanceStudent(null);
  };

  useEffect(() => {
    filterReportsByClass();
  }, [classQuery]);

  const sendAttendanceReport = async (reportId: string, parentId: string) => {
    if (!parentId) {
      alert("Please select a parent first");
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Attendance report sent successfully!");
      setSelectedParent("");
    } catch (error) {
      console.error("Error sending attendance report:", error);
      alert("Failed to send attendance report");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <motion.h1
        className="text-4xl font-bold text-gray-800 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📊 Reports and Insights
      </motion.h1>

      {/* Class Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium mb-1 text-green-700">Select Class</label>
            <div className="flex">
              <select
                className="flex-1 p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={classQuery}
                onChange={handleClassChange}
              >
                <option value="">Select Class</option>
                {allClasses.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex justify-center space-x-4 bg-white p-3 rounded-lg shadow-md">
          {["📝 Grades Reports", "🆘 Support Needed", "📚 Lesson Plans", "🚩 Flagged Absences", "📅 Attendance Reports"].map((title, index) => (
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
          {/* Grades Reports Tab */}
          <Tab.Panel>
            <motion.div
              className="p-6 bg-green-50 border-2 border-green-200 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-green-800 mb-4">📝 Grades Reports from Teachers</h2>

              {!classQuery ? (
                <div className="p-4 bg-white rounded-lg shadow-sm border border-green-100 text-center">
                  Please select a class to view grades reports
                </div>
              ) : isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : gradesReports.length === 0 ? (
                <div className="p-4 bg-white rounded-lg shadow-sm border border-green-100 text-center">
                  No grades reports available for {classQuery}.
                </div>
              ) : (
                <div className="space-y-4">
                  {gradesReports.flatMap(report => 
                    report.students.map((student: any) => (
                      <div key={`${report.id}-${student.name}`}>
                        <div 
                          className={`p-4 bg-white rounded-lg shadow-sm border border-green-100 cursor-pointer transition-all ${
                            selectedStudentGrades?.name === student.name ? 'ring-2 ring-green-500' : ''
                          }`}
                          onClick={() => setSelectedStudentGrades({
                            ...student,
                            className: report.className,
                            subject: report.subject,
                            teacherName: report.teacherName,
                            date: report.date
                          })}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold text-green-700">{student.name}</h3>
                              <p className="text-gray-600">Class: {report.className}</p>
                              <p className="text-gray-600">Subject: {report.subject}</p>
                              <p className="text-gray-600">Teacher: {report.teacherName}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <p className="text-gray-600">Date: {formatDate(report.date)}</p>
                              <p className="text-sm text-gray-600">
                                Exam: {student.examScore}%
                              </p>
                            </div>
                          </div>
                        </div>

                        {selectedStudentGrades?.name === student.name && (
                          <div className="mt-2 bg-white p-4 rounded-lg shadow-sm border border-green-100">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-gray-600">Class:</p>
                                <p className="font-medium">{selectedStudentGrades.className}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Subject:</p>
                                <p className="font-medium">{selectedStudentGrades.subject}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Teacher:</p>
                                <p className="font-medium">{selectedStudentGrades.teacherName}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Date:</p>
                                <p className="font-medium">{formatDate(selectedStudentGrades.date)}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <h5 className="font-medium text-green-700 mb-2">Test Score:</h5>
                                <p>{selectedStudentGrades.testScore}%</p>
                              </div>
                              
                              <div>
                                <h5 className="font-medium text-green-700 mb-2">Assignment Score:</h5>
                                <p>{selectedStudentGrades.assignmentScore}%</p>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <h5 className="font-medium text-green-700 mb-1">Exam Score:</h5>
                              <p>{selectedStudentGrades.examScore}%</p>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-green-700 mb-1">Teacher Comments:</h5>
                              <p className="whitespace-pre-line bg-green-50 p-3 rounded">{selectedStudentGrades.comments}</p>
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                              <button 
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                onClick={() => setSelectedStudentGrades(null)}
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </Tab.Panel>

          {/* Support Needed Tab */}
          <Tab.Panel>
            <motion.div
              className="p-6 bg-green-50 border-2 border-green-200 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-green-800 mb-4">🆘 Support Needed Reports from Teachers</h2>

              {!classQuery ? (
                <div className="p-4 bg-white rounded-lg shadow-sm border border-green-100 text-center">
                  Please select a class to view support requests
                </div>
              ) : isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : supportReports.length === 0 ? (
                <div className="p-4 bg-white rounded-lg shadow-sm border border-green-100 text-center">
                  No support requests available for {classQuery}.
                </div>
              ) : (
                <div className="space-y-4">
                  {supportReports.flatMap(report => 
                    report.students.map((student: any) => (
                      <div key={`${report.id}-${student.name}`}>
                        <div 
                          className={`p-4 bg-white rounded-lg shadow-sm border border-green-100 cursor-pointer transition-all ${
                            selectedSupportStudent?.name === student.name ? 'ring-2 ring-green-500' : ''
                          }`}
                          onClick={() => setSelectedSupportStudent({
                            ...student,
                            className: report.className,
                            teacherName: report.teacherName,
                            date: report.date,
                            description: report.description
                          })}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold text-green-700">{student.name}</h3>
                              <p className="text-gray-600">Class: {report.className}</p>
                              <p className="text-gray-600">Teacher: {report.teacherName}</p>
                              <p className="text-gray-600">Subject Affected: {student.subjectAffected}</p>
                            </div>
                          </div>
                        </div>

                        {selectedSupportStudent?.name === student.name && (
                          <div className="mt-2 bg-white p-4 rounded-lg shadow-sm border border-green-100">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-gray-600">Class:</p>
                                <p className="font-medium">{selectedSupportStudent.className}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Teacher:</p>
                                <p className="font-medium">{selectedSupportStudent.teacherName}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Subject Affected:</p>
                                <p className="font-medium">{selectedSupportStudent.subjectAffected}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Date:</p>
                                <p className="font-medium">{formatDate(selectedSupportStudent.date)}</p>
                              </div>
                            </div>

                            <div className="mb-4">
                              <h4 className="text-lg font-semibold text-green-700 mb-2">Description:</h4>
                              <p className="whitespace-pre-line bg-green-50 p-3 rounded">{selectedSupportStudent.description}</p>
                            </div>

                            <div className="flex justify-end space-x-2">
                              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                Mark as Resolved
                              </button>
                              <button 
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                onClick={() => setSelectedSupportStudent(null)}
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </Tab.Panel>

          {/* Lesson Plans Tab */}
          <Tab.Panel>
            <motion.div
              className="p-6 bg-green-50 border-2 border-green-200 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-green-800 mb-4">📚 Lesson Plans from Teachers</h2>

              {!classQuery ? (
                <div className="p-4 bg-white rounded-lg shadow-sm border border-green-100 text-center">
                  Please select a class to view lesson plans
                </div>
              ) : isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : lessonPlans.length === 0 ? (
                <div className="p-4 bg-white rounded-lg shadow-sm border border-green-100 text-center">
                  No lesson plans available for {classQuery}.
                </div>
              ) : (
                <div className="space-y-4">
                  {lessonPlans.map((plan) => (
                    <div 
                      key={plan.id} 
                      className={`p-4 bg-white rounded-lg shadow-sm border border-green-100 cursor-pointer transition-all ${
                        selectedLessonPlan?.id === plan.id ? 'ring-2 ring-green-500' : ''
                      }`}
                      onClick={() => setSelectedLessonPlan(plan)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-green-700">{plan.title}</h3>
                          <p className="text-gray-600">Class: {plan.className}</p>
                          <p className="text-gray-600">Subject: {plan.subject}</p>
                          <p className="text-gray-600">Teacher: {plan.teacherName}</p>
                          <p className="text-gray-600">Date: {formatDate(plan.date)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedLessonPlan && (
                <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-green-100">
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Lesson Plan Details</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600">Title:</p>
                      <p className="font-medium">{selectedLessonPlan.title}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Class:</p>
                      <p className="font-medium">{selectedLessonPlan.className}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Subject:</p>
                      <p className="font-medium">{selectedLessonPlan.subject}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Teacher:</p>
                      <p className="font-medium">{selectedLessonPlan.teacherName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date Created:</p>
                      <p className="font-medium">{formatDate(selectedLessonPlan.date)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration:</p>
                      <p className="font-medium">{selectedLessonPlan.duration}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-green-700 mb-2">Learning Objectives:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedLessonPlan.objectives.map((obj: string, index: number) => (
                        <li key={index}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-green-700 mb-2">Required Materials:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedLessonPlan.materials.map((material: string, index: number) => (
                        <li key={index}>{material}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button 
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      onClick={() => setSelectedLessonPlan(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </Tab.Panel>

          {/* Flagged Absences Tab */}
          <Tab.Panel>
            <motion.div
              className="p-6 bg-green-50 border-2 border-green-200 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-green-800 mb-4">🚩 Flagged Absences from Teachers</h2>

              {!classQuery ? (
                <div className="p-4 bg-white rounded-lg shadow-sm border border-green-100 text-center">
                  Please select a class to view flagged absences
                </div>
              ) : isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : flaggedAbsences.length === 0 ? (
                <div className="p-4 bg-white rounded-lg shadow-sm border border-green-100 text-center">
                  No flagged absences available for {classQuery}.
                </div>
              ) : (
                <div className="space-y-4">
                  {flaggedAbsences.map((absence) => (
                    <div 
                      key={absence.id} 
                      className={`p-4 bg-white rounded-lg shadow-sm border border-green-100 cursor-pointer transition-all ${
                        selectedFlaggedAbsence?.id === absence.id ? 'ring-2 ring-green-500' : ''
                      }`}
                      onClick={() => setSelectedFlaggedAbsence(absence)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-green-700">{absence.studentName}</h3>
                          <p className="text-gray-600">Class: {absence.className}</p>
                          <p className="text-gray-600">Teacher: {absence.teacherName}</p>
                          <p className="text-gray-600">Absences: {absence.absenceCount}</p>
                          <p className="text-gray-600">Last Flagged: {formatDate(absence.date)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          absence.severity === 'High' ? 'bg-red-100 text-red-800' :
                          absence.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {absence.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedFlaggedAbsence && (
                <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-green-100">
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Flagged Absence Details</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600">Student:</p>
                      <p className="font-medium">{selectedFlaggedAbsence.studentName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Class:</p>
                      <p className="font-medium">{selectedFlaggedAbsence.className}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Teacher:</p>
                      <p className="font-medium">{selectedFlaggedAbsence.teacherName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Absences:</p>
                      <p className="font-medium">{selectedFlaggedAbsence.absenceCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Severity:</p>
                      <p className="font-medium">
                        <span className={`inline-block px-2 py-1 rounded ${
                          selectedFlaggedAbsence.severity === 'High' ? 'bg-red-100 text-red-800' :
                          selectedFlaggedAbsence.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {selectedFlaggedAbsence.severity}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-green-700 mb-2">Absence Dates:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFlaggedAbsence.absenceDates.map((date: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full">
                          {formatDate(date)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-green-700 mb-2">Teacher's Comments:</h4>
                    <p className="whitespace-pre-line bg-green-50 p-3 rounded">{selectedFlaggedAbsence.comments}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-green-700 mb-2">Parent Contact Information:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Parent Name:</p>
                        <p className="font-medium">{selectedFlaggedAbsence.parentName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Phone:</p>
                        <p className="font-medium">{selectedFlaggedAbsence.parentPhone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Email:</p>
                        <p className="font-medium">{selectedFlaggedAbsence.parentEmail}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Contact Parent
                    </button>
                    <button 
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      onClick={() => setSelectedFlaggedAbsence(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </Tab.Panel>

          {/* Attendance Reports Tab */}
          <Tab.Panel>
            <motion.div
              className="p-6 bg-green-50 border-2 border-green-200 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-green-800 mb-4">📅 Attendance from Teachers</h2>

              <div className="flex space-x-2 mb-4">
                <button
                  className={`px-4 py-2 rounded-lg ${attendanceReportType === 'weekly' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setAttendanceReportType('weekly')}
                >
                  Weekly Reports
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${attendanceReportType === 'monthly' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setAttendanceReportType('monthly')}
                >
                  Monthly Reports
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${attendanceReportType === 'academic' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setAttendanceReportType('academic')}
                >
                  Academic Year
                </button>
              </div>

              {!classQuery ? (
                <div className="p-4 bg-white rounded-lg shadow-sm border border-green-100 text-center">
                  Please select a class to view attendance reports
                </div>
              ) : isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : attendanceReports.filter(report => report.type === attendanceReportType).length === 0 ? (
                <div className="p-4 bg-white rounded-lg shadow-sm border border-green-100 text-center">
                  No {attendanceReportType} attendance reports available for {classQuery}.
                </div>
              ) : (
                <div className="space-y-4">
                  {attendanceReports
                    .filter(report => report.type === attendanceReportType)
                    .flatMap(report => 
                      report.students.map((student: any) => (
                        <div key={`${report.id}-${student.name}`}>
                          <div 
                            className={`p-4 bg-white rounded-lg shadow-sm border border-green-100 cursor-pointer transition-all ${
                              selectedAttendanceStudent?.name === student.name ? 'ring-2 ring-green-500' : ''
                            }`}
                            onClick={() => setSelectedAttendanceStudent({
                              ...student,
                              reportId: report.id,
                              className: report.className,
                              teacherName: report.teacherName,
                              period: report.period,
                              startDate: report.startDate,
                              endDate: report.endDate,
                              parents: report.parents.filter((p: any) => p.studentName === student.name)
                            })}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-semibold text-green-700">{student.name}</h3>
                                <p className="text-gray-600">Class: {report.className}</p>
                                <p className="text-gray-600">Teacher: {report.teacherName}</p>
                                <p className="text-gray-600">Period: {report.period}</p>
                              </div>
                              <div className="flex flex-col items-end">
                                <p className="text-gray-600">Attendance: {student.attendancePercentage}%</p>
                                <p className="text-sm text-gray-600">
                                  {formatDate(report.startDate)} - {formatDate(report.endDate)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {selectedAttendanceStudent?.name === student.name && (
                            <div className="mt-2 bg-white p-4 rounded-lg shadow-sm border border-green-100">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-gray-600">Class:</p>
                                  <p className="font-medium">{selectedAttendanceStudent.className}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Teacher:</p>
                                  <p className="font-medium">{selectedAttendanceStudent.teacherName}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Report Type:</p>
                                  <p className="font-medium">{attendanceReportType}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Period:</p>
                                  <p className="font-medium">{selectedAttendanceStudent.period}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Date Range:</p>
                                  <p className="font-medium">
                                    {formatDate(selectedAttendanceStudent.startDate)} to {formatDate(selectedAttendanceStudent.endDate)}
                                  </p>
                                </div>
                              </div>

                              <div className="mb-4">
                                <h4 className="text-lg font-semibold text-green-700 mb-2">Attendance Details:</h4>
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="bg-green-50 p-3 rounded-lg text-center">
                                    <p className="text-sm text-gray-600">Present</p>
                                    <p className="text-2xl font-bold text-green-700">{selectedAttendanceStudent.present}</p>
                                  </div>
                                  <div className="bg-red-50 p-3 rounded-lg text-center">
                                    <p className="text-sm text-gray-600">Absent</p>
                                    <p className="text-2xl font-bold text-red-700">{selectedAttendanceStudent.absent}</p>
                                  </div>
                                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                                    <p className="text-sm text-gray-600">Late</p>
                                    <p className="text-2xl font-bold text-yellow-700">{selectedAttendanceStudent.late}</p>
                                  </div>
                                </div>
                                <div className="mt-4 bg-blue-50 p-3 rounded-lg text-center">
                                  <p className="text-sm text-gray-600">Attendance Percentage</p>
                                  <p className="text-2xl font-bold text-blue-700">{selectedAttendanceStudent.attendancePercentage}%</p>
                                </div>
                              </div>

                              {selectedAttendanceStudent.parents.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="text-lg font-semibold text-green-700 mb-2">Send to Parent:</h4>
                                  <div className="flex items-center gap-4">
                                    <select
                                      className="flex-1 border border-green-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                      value={selectedParent}
                                      onChange={(e) => setSelectedParent(e.target.value)}
                                    >
                                      <option value="">Select Parent</option>
                                      {selectedAttendanceStudent.parents.map((parent: any, index: number) => (
                                        <option key={index} value={parent.id}>
                                          {parent.name}
                                        </option>
                                      ))}
                                    </select>
                                    <button
                                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                      onClick={() => sendAttendanceReport(selectedAttendanceStudent.reportId, selectedParent)}
                                    >
                                      Send Report
                                    </button>
                                  </div>
                                </div>
                              )}

                              <div className="flex justify-end space-x-2">
                                <button 
                                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                  onClick={() => setSelectedAttendanceStudent(null)}
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )
                  }
                </div>
              )}
            </motion.div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default function ProtectedReportsPage() {
  return (
    <ProtectedRoute>
      <ReportsPage />
    </ProtectedRoute>
  );
}