"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import React, { useState } from "react";

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
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-6">Teacher Profiles</h1>
        
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setIsAddTeacherModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add New Teacher
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Search by Name</label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter teacher name..."
                  className="w-full p-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-300"
                  value={tempSearchTerm}
                  onChange={(e) => setTempSearchTerm(e.target.value)}
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !tempSearchTerm}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
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
              <label className="block text-sm font-medium mb-1">Filter by Class</label>
              <div className="flex">
                <select
                  className="w-full p-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-300"
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
                  className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
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
              <label className="block text-sm font-medium mb-1">Filter by Subject</label>
              <div className="flex">
                <select
                  className="w-full p-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-300"
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
                  className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
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
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
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
          <div className="bg-blue-50 p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-lg shadow text-center">
                <h3 className="font-bold text-lg">Total Teachers</h3>
                <p className="text-2xl">{totalTeachers}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow text-center">
                <h3 className="font-bold text-lg">Male Teachers</h3>
                <p className="text-2xl">{maleCount}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow text-center">
                <h3 className="font-bold text-lg">Female Teachers</h3>
                <p className="text-2xl">{femaleCount}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nationality</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Gender</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Classes</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Subjects</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hasSearched ? (
                filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {teacher.name}
                        {teacher.isClassTeacher && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            Class Teacher ({teacher.classTeacherFor})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 hover:underline">
                        <a href={`mailto:${teacher.email}`}>{teacher.email}</a>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{teacher.nationality}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{teacher.gender}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{teacher.address}</td>
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
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{teacher.phone}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(teacher)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openAssignModal(teacher.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => handleRemoveTeacher(teacher.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-4 text-center text-gray-500">
                      No teachers found matching your criteria
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={9} className="p-4 text-center text-gray-500">
                    Use the search or filter options above to view teachers
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Teacher Modal */}
        {isAddTeacherModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Add New Teacher</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nationality</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newTeacher.nationality}
                    onChange={(e) => setNewTeacher({...newTeacher, nationality: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={newTeacher.gender}
                    onChange={(e) => setNewTeacher({...newTeacher, gender: e.target.value})}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newTeacher.address}
                    onChange={(e) => setNewTeacher({...newTeacher, address: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newTeacher.phone}
                    onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subjects</label>
                  <div className="flex">
                    <select
                      className="w-full p-2 border rounded-l"
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
                      className="bg-blue-500 text-white px-3 py-1 rounded-r hover:bg-blue-600 disabled:bg-blue-300"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {newTeacher.subjects.map((subject, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {subject}
                        <button 
                          type="button"
                          onClick={() => removeSubjectFromNewTeacher(subject)}
                          className="ml-1 text-blue-600 hover:text-blue-900"
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
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTeacher}
                  disabled={!newTeacher.name || !newTeacher.email}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                  Add Teacher
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Teacher Modal */}
        {isEditTeacherModalOpen && editTeacher && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Edit Teacher</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={editTeacher.name}
                    onChange={(e) => setEditTeacher({...editTeacher, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nationality</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={editTeacher.nationality}
                    onChange={(e) => setEditTeacher({...editTeacher, nationality: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={editTeacher.gender}
                    onChange={(e) => setEditTeacher({...editTeacher, gender: e.target.value})}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={editTeacher.address}
                    onChange={(e) => setEditTeacher({...editTeacher, address: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded"
                    value={editTeacher.email}
                    onChange={(e) => setEditTeacher({...editTeacher, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={editTeacher.phone}
                    onChange={(e) => setEditTeacher({...editTeacher, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subjects</label>
                  <div className="flex">
                    <select
                      className="w-full p-2 border rounded-l"
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
                      className="bg-blue-500 text-white px-3 py-1 rounded-r hover:bg-blue-600 disabled:bg-blue-300"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {editTeacher.subjects.map((subject, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {subject}
                        <button 
                          type="button"
                          onClick={() => removeSubjectFromEditTeacher(subject)}
                          className="ml-1 text-blue-600 hover:text-blue-900"
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
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditTeacher}
                  disabled={!editTeacher.name || !editTeacher.email}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assign Teacher Modal */}
        {isAssignModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Assign Teacher</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Class</label>
                  <select
                    className="w-full p-2 border rounded"
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
                    <label htmlFor="isClassTeacher" className="text-sm font-medium">
                      Assign as Class Teacher
                    </label>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Subject (for Grade 4-9)</label>
                  <select
                    className="w-full p-2 border rounded"
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
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTeacher}
                  disabled={!assignmentData.class && !assignmentData.subject}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}