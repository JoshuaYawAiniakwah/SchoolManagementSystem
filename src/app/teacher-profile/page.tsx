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
      subjects: ["Mathematics", "Science"]
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
      subjects: ["English", "Social Studies"]
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
      subjects: ["ICT", "French"]
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
      subjects: ["Creative Arts", "Physical Education"]
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
      subjects: ["Mathematics", "Science", "ICT"]
    }
  ];

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

  const allSubjects = Array.from(
    new Set(staticTeachers.flatMap(teacher => teacher.subjects))
  ).sort();

  const filteredTeachers = staticTeachers.filter(teacher => {
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

  return (
    <ProtectedRoute>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-6">Teacher Profiles</h1>
        
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hasSearched ? (
                filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.name}</td>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      No teachers found matching your criteria
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    Use the search or filter options above to view teachers
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}