"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import React, { useState } from "react";
import { Modal } from '@/components/ui/Modal';

interface Teacher {
  id: string;
  name: string;
  nationality: string;
  gender: string;
  address: string;
  classAllocation: string[];
  email: string;
  phone: string;
  subjects: string[];
  isClassTeacher?: boolean;
  classTeacherFor?: string;
}

export default function TeacherProfile() {
  const staticTeachers: Teacher[] = [
    {
      id: "1",
      name: "John Smith",
      nationality: "Ghanaian",
      gender: "Male",
      address: "123 Main St, Accra",
      classAllocation: ["Grade 1", "Grade 2"],
      email: "john.smith@school.edu.gh",
      phone: "+233 24 123 4567",
      subjects: ["Mathematics", "Science"],
      isClassTeacher: true,
      classTeacherFor: "Grade 1"
    },
    {
      id: "2",
      name: "Alice Johnson",
      nationality: "Ghanaian",
      gender: "Female",
      address: "456 Oak Ave, Kumasi",
      classAllocation: ["Grade 2", "Grade 3"],
      email: "alice.johnson@school.edu.gh",
      phone: "+233 20 987 6543",
      subjects: ["English", "Social Studies"],
      isClassTeacher: true,
      classTeacherFor: "Grade 2"
    },
    {
      id: "3",
      name: "Kwame Mensah",
      nationality: "Ghanaian",
      gender: "Male",
      address: "789 Palm Rd, Takoradi",
      classAllocation: ["Grade 3", "Grade 4"],
      email: "kwame.mensah@school.edu.gh",
      phone: "+233 27 555 1234",
      subjects: ["ICT", "French"],
      isClassTeacher: true,
      classTeacherFor: "Grade 3"
    },
    {
      id: "4",
      name: "Esi Boateng",
      nationality: "Ghanaian",
      gender: "Female",
      address: "321 Pine St, Tamale",
      classAllocation: ["Grade 1", "Grade 5"],
      email: "esi.boateng@school.edu.gh",
      phone: "+233 54 321 6789",
      subjects: ["Creative Arts", "Physical Education"],
      isClassTeacher: false
    },
    {
      id: "5",
      name: "David Ofori",
      nationality: "Ghanaian",
      gender: "Male",
      address: "654 Cedar Ln, Cape Coast",
      classAllocation: ["Grade 4", "Grade 6"],
      email: "david.ofori@school.edu.gh",
      phone: "+233 50 111 2222",
      subjects: ["Mathematics", "Science", "ICT"],
      isClassTeacher: true,
      classTeacherFor: "Grade 4"
    }
  ];

  const [teachers, setTeachers] = useState<Teacher[]>(staticTeachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [tempClassFilter, setTempClassFilter] = useState("");
  const [tempSubjectFilter, setTempSubjectFilter] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isViewAllLoading, setIsViewAllLoading] = useState(false);
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [isEditTeacherModalOpen, setIsEditTeacherModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [newTeacher, setNewTeacher] = useState<Omit<Teacher, 'id'>>({
    name: "",
    nationality: "Ghanaian",
    gender: "Male",
    address: "",
    classAllocation: [],
    email: "",
    phone: "",
    subjects: [],
    isClassTeacher: false,
    classTeacherFor: ""
  });
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [assignmentData, setAssignmentData] = useState({
    class: "",
    isClassTeacher: false,
    subject: ""
  });
  const [newSubject, setNewSubject] = useState("");

  const allClasses = [
    "Creche", "Nursery 1", "Nursery 2", "KG 1", "KG 2", 
    ...Array.from({ length: 9 }, (_, i) => `Grade ${i + 1}`)
  ];
  
  const allSubjects = Array.from(
    new Set(teachers.flatMap(teacher => teacher.subjects))
  ).sort();

  const filteredTeachers = teachers.filter(teacher => {
    const nameMatch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase());
    const classMatch = classFilter === "" || teacher.classAllocation.includes(classFilter);
    const subjectMatch = subjectFilter === "" || teacher.subjects.includes(subjectFilter);
    return nameMatch && classMatch && subjectMatch;
  });

  // Calculate gender counts
  const totalTeachers = filteredTeachers.length;
  const maleCount = filteredTeachers.filter(teacher => teacher.gender === 'Male').length;
  const femaleCount = filteredTeachers.filter(teacher => teacher.gender === 'Female').length;

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setSearchTerm(tempSearchTerm);
      setHasSearched(true);
      setIsSearching(false);
    }, 500);
  };

  const handleClassFilter = () => {
    setIsFiltering(true);
    setTimeout(() => {
      setClassFilter(tempClassFilter);
      setHasSearched(true);
      setIsFiltering(false);
    }, 500);
  };

  const handleSubjectFilter = () => {
    setIsFiltering(true);
    setTimeout(() => {
      setSubjectFilter(tempSubjectFilter);
      setHasSearched(true);
      setIsFiltering(false);
    }, 500);
  };

  const handleViewAll = () => {
    setIsViewAllLoading(true);
    setTimeout(() => {
      setSearchTerm("");
      setClassFilter("");
      setSubjectFilter("");
      setTempSearchTerm("");
      setTempClassFilter("");
      setTempSubjectFilter("");
      setHasSearched(true);
      setIsViewAllLoading(false);
    }, 500);
  };

  const handleAddTeacher = () => {
    const newId = (teachers.length + 1).toString();
    setTeachers([...teachers, { ...newTeacher, id: newId }]);
    setIsAddTeacherModalOpen(false);
    setNewTeacher({
      name: "",
      nationality: "Ghanaian",
      gender: "Male",
      address: "",
      classAllocation: [],
      email: "",
      phone: "",
      subjects: [],
      isClassTeacher: false,
      classTeacherFor: ""
    });
  };

  const handleEditTeacher = () => {
    if (!editTeacher) return;
    
    setTeachers(teachers.map(teacher => 
      teacher.id === editTeacher.id ? editTeacher : teacher
    ));
    setIsEditTeacherModalOpen(false);
    setEditTeacher(null);
  };

  const openEditModal = (teacher: Teacher) => {
    setEditTeacher({...teacher});
    setIsEditTeacherModalOpen(true);
  };

  const handleRemoveTeacher = (id: string) => {
    setTeachers(teachers.filter(teacher => teacher.id !== id));
  };

  const handleAssignTeacher = () => {
    setTeachers(teachers.map(teacher => {
      if (teacher.id === selectedTeacherId) {
        const updatedClassAllocation = assignmentData.class && !teacher.classAllocation.includes(assignmentData.class) 
          ? [...teacher.classAllocation, assignmentData.class] 
          : teacher.classAllocation;
        
        const updatedSubjects = assignmentData.subject && !teacher.subjects.includes(assignmentData.subject)
          ? [...teacher.subjects, assignmentData.subject]
          : teacher.subjects;

        return {
          ...teacher,
          classAllocation: updatedClassAllocation,
          subjects: updatedSubjects,
          isClassTeacher: assignmentData.isClassTeacher,
          classTeacherFor: assignmentData.isClassTeacher ? assignmentData.class : teacher.classTeacherFor
        };
      }
      return teacher;
    }));
    
    setIsAssignModalOpen(false);
    setAssignmentData({
      class: "",
      isClassTeacher: false,
      subject: ""
    });
  };

  const openAssignModal = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setIsAssignModalOpen(true);
  };

  const isClassTeacherEligible = (className: string) => {
    // Class teachers can only be assigned to classes from Creche to Primary 3 (Grade 3)
    const eligibleClasses = ["Creche", "Nursery 1", "Nursery 2", "KG 1", "KG 2", "Grade 1", "Grade 2", "Grade 3"];
    return eligibleClasses.includes(className);
  };

  const addSubjectToNewTeacher = () => {
    if (newSubject && !newTeacher.subjects.includes(newSubject)) {
      setNewTeacher({
        ...newTeacher,
        subjects: [...newTeacher.subjects, newSubject]
      });
      setNewSubject("");
    }
  };

  const removeSubjectFromNewTeacher = (subjectToRemove: string) => {
    setNewTeacher({
      ...newTeacher,
      subjects: newTeacher.subjects.filter(subject => subject !== subjectToRemove)
    });
  };

  const addSubjectToEditTeacher = () => {
    if (!editTeacher) return;
    if (newSubject && !editTeacher.subjects.includes(newSubject)) {
      setEditTeacher({
        ...editTeacher,
        subjects: [...editTeacher.subjects, newSubject]
      });
      setNewSubject("");
    }
  };

  const removeSubjectFromEditTeacher = (subjectToRemove: string) => {
    if (!editTeacher) return;
    setEditTeacher({
      ...editTeacher,
      subjects: editTeacher.subjects.filter(subject => subject !== subjectToRemove)
    });
  };

  return (
    <ProtectedRoute>
      <div className="p-5 bg-green-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-green-800">Teacher Profiles</h1>
        
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setIsAddTeacherModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow-md"
          >
            Add New Teacher
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-green-700">Search by Name</label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter teacher name..."
                  className="flex-1 p-2 border border-green-300 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={tempSearchTerm}
                  onChange={(e) => setTempSearchTerm(e.target.value)}
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !tempSearchTerm}
                  className="bg-green-600 text-white px-4 rounded-r hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
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
              <label className="block text-sm font-medium mb-1 text-green-700">Filter by Class</label>
              <div className="flex">
                <select
                  className="flex-1 p-2 border border-green-300 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={tempClassFilter}
                  onChange={(e) => setTempClassFilter(e.target.value)}
                >
                  <option value="">All Classes</option>
                  {allClasses.map((className) => (
                    <option key={className} value={className}>{className}</option>
                  ))}
                </select>
                <button
                  onClick={handleClassFilter}
                  disabled={isFiltering || !tempClassFilter}
                  className="bg-green-600 text-white px-4 rounded-r hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  {isFiltering ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Filter'
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-green-700">Filter by Subject</label>
              <div className="flex">
                <select
                  className="flex-1 p-2 border border-green-300 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={tempSubjectFilter}
                  onChange={(e) => setTempSubjectFilter(e.target.value)}
                >
                  <option value="">All Subjects</option>
                  {allSubjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <button
                  onClick={handleSubjectFilter}
                  disabled={isFiltering || !tempSubjectFilter}
                  className="bg-green-600 text-white px-4 rounded-r hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  {isFiltering ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Filter'
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleViewAll}
              disabled={isViewAllLoading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-md"
            >
              {isViewAllLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'View All Teachers'
              )}
            </button>
          </div>
        </div>

        {/* Teacher Count Summary */}
        {hasSearched && filteredTeachers.length > 0 && (
          <div className="bg-green-100 p-6 rounded-lg shadow-md mb-6 border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200 text-center">
                <h3 className="font-bold text-lg text-green-800">Total Teachers</h3>
                <p className="text-2xl text-green-600">{totalTeachers}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200 text-center">
                <h3 className="font-bold text-lg text-green-800">Male Teachers</h3>
                <p className="text-2xl text-green-600">{maleCount}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200 text-center">
                <h3 className="font-bold text-lg text-green-800">Female Teachers</h3>
                <p className="text-2xl text-green-600">{femaleCount}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-green-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Nationality</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Gender</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Classes</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Subjects</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hasSearched ? (
                filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-green-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-900">
                        {teacher.name}
                        {teacher.isClassTeacher && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Class Teacher ({teacher.classTeacherFor})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 hover:underline">
                        <a href={`mailto:${teacher.email}`}>{teacher.email}</a>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">{teacher.nationality}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">{teacher.gender}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">{teacher.address}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {teacher.classAllocation.map((grade, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                            >
                              {grade}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.map((subject, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">{teacher.phone}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(teacher)}
                            className="text-green-600 hover:text-green-800 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openAssignModal(teacher.id)}
                            className="text-green-600 hover:text-green-800 hover:underline"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => handleRemoveTeacher(teacher.id)}
                            className="text-red-600 hover:text-red-800 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-4 text-center text-green-700">
                      No teachers found matching your criteria
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={9} className="p-4 text-center text-green-700">
                    Use the search or filter options above to view teachers
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Teacher Modal */}
        <Modal isOpen={isAddTeacherModalOpen} onClose={() => setIsAddTeacherModalOpen(false)}>
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-green-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">Add New Teacher</h2>
              <button 
                onClick={() => setIsAddTeacherModalOpen(false)}
                className="text-green-600 hover:text-green-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Nationality</label>
                <input
                  type="text"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newTeacher.nationality}
                  onChange={(e) => setNewTeacher({...newTeacher, nationality: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Gender</label>
                <select
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newTeacher.gender}
                  onChange={(e) => setNewTeacher({...newTeacher, gender: e.target.value})}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Address</label>
                <input
                  type="text"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newTeacher.address}
                  onChange={(e) => setNewTeacher({...newTeacher, address: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Phone</label>
                <input
                  type="text"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Subjects</label>
                <div className="flex">
                  <select
                    className="flex-1 p-2 border border-green-300 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  >
                    <option value="">Select Subject</option>
                    {allSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addSubjectToNewTeacher}
                    disabled={!newSubject}
                    className="bg-green-600 text-white px-3 py-1 rounded-r hover:bg-green-700 disabled:bg-green-300 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {newTeacher.subjects.map((subject, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                    >
                      {subject}
                      <button 
                        type="button"
                        onClick={() => removeSubjectFromNewTeacher(subject)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddTeacherModalOpen(false)}
                className="px-4 py-2 border border-green-300 rounded hover:bg-green-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeacher}
                disabled={!newTeacher.name || !newTeacher.email}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 transition-colors"
              >
                Add Teacher
              </button>
            </div>
          </div>
        </Modal>

        {/* Edit Teacher Modal */}
        <Modal isOpen={isEditTeacherModalOpen} onClose={() => setIsEditTeacherModalOpen(false)}>
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-green-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">Edit Teacher</h2>
              <button 
                onClick={() => setIsEditTeacherModalOpen(false)}
                className="text-green-600 hover:text-green-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editTeacher?.name || ""}
                  onChange={(e) => editTeacher && setEditTeacher({...editTeacher, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Nationality</label>
                <input
                  type="text"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editTeacher?.nationality || ""}
                  onChange={(e) => editTeacher && setEditTeacher({...editTeacher, nationality: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Gender</label>
                <select
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editTeacher?.gender || "Male"}
                  onChange={(e) => editTeacher && setEditTeacher({...editTeacher, gender: e.target.value})}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Address</label>
                <input
                  type="text"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editTeacher?.address || ""}
                  onChange={(e) => editTeacher && setEditTeacher({...editTeacher, address: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editTeacher?.email || ""}
                  onChange={(e) => editTeacher && setEditTeacher({...editTeacher, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Phone</label>
                <input
                  type="text"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editTeacher?.phone || ""}
                  onChange={(e) => editTeacher && setEditTeacher({...editTeacher, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Subjects</label>
                <div className="flex">
                  <select
                    className="flex-1 p-2 border border-green-300 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  >
                    <option value="">Select Subject</option>
                    {allSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addSubjectToEditTeacher}
                    disabled={!newSubject}
                    className="bg-green-600 text-white px-3 py-1 rounded-r hover:bg-green-700 disabled:bg-green-300 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {editTeacher?.subjects.map((subject, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                    >
                      {subject}
                      <button 
                        type="button"
                        onClick={() => removeSubjectFromEditTeacher(subject)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditTeacherModalOpen(false)}
                className="px-4 py-2 border border-green-300 rounded hover:bg-green-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTeacher}
                disabled={!editTeacher?.name || !editTeacher?.email}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>

        {/* Assign Teacher Modal */}
        <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)}>
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-green-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">Assign Teacher</h2>
              <button 
                onClick={() => setIsAssignModalOpen(false)}
                className="text-green-600 hover:text-green-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Class</label>
                <select
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={assignmentData.class}
                  onChange={(e) => setAssignmentData({...assignmentData, class: e.target.value})}
                >
                  <option value="">Select Class</option>
                  {allClasses.map((className) => (
                    <option key={className} value={className}>{className}</option>
                  ))}
                </select>
              </div>
              {assignmentData.class && isClassTeacherEligible(assignmentData.class) && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isClassTeacher"
                    className="mr-2"
                    checked={assignmentData.isClassTeacher}
                    onChange={(e) => setAssignmentData({...assignmentData, isClassTeacher: e.target.checked})}
                  />
                  <label htmlFor="isClassTeacher" className="text-sm font-medium text-green-700">
                    Assign as Class Teacher
                  </label>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Subject (for Grade 4-9)</label>
                <select
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={assignmentData.subject}
                  onChange={(e) => setAssignmentData({...assignmentData, subject: e.target.value})}
                >
                  <option value="">Select Subject (optional)</option>
                  {allSubjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 border border-green-300 rounded hover:bg-green-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTeacher}
                disabled={!assignmentData.class && !assignmentData.subject}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 transition-colors"
              >
                Assign
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}