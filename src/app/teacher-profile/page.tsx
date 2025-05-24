"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import React, { useState, useEffect } from "react";
import { Modal } from '@/components/ui/Modal';

interface Teacher {
  id: string;
  name: string;
  nationality: string;
  gender: string;
  address: string;
  classAllocation?: string[];
  assignedClass?: string;
  email: string;
  phone: string;
  subjects: string[];
  role: string;
  classTeacherFor?: string;
  subjectsTaught?: Array<{ subjectName: string }>;
}

interface GenderCount {
  male: number;
  female: number;
}

interface Class {
  id: string;
  className: string;
  gradeLevel: string;
}

interface Subject {
  id: string;
  subjectName: string;
}

export default function TeacherProfile() {
  // State management
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [gradeLevelFilter, setGradeLevelFilter] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [tempClassFilter, setTempClassFilter] = useState("");
  const [tempSubjectFilter, setTempSubjectFilter] = useState("");
  const [tempGenderFilter, setTempGenderFilter] = useState("");
  const [tempGradeLevelFilter, setTempGradeLevelFilter] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isViewAllLoading, setIsViewAllLoading] = useState(false);
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [isEditTeacherModalOpen, setIsEditTeacherModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [newTeacher, setNewTeacher] = useState<Omit<Teacher, 'id'>>({
    name: "",
    nationality: "Ghanaian",
    gender: "Male",
    address: "",
    email: "",
    phone: "",
    role: "SUBJECT_TEACHER",
    classAllocation: [],
    subjects: []
  });

  const [newClass, setNewClass] = useState({
    className: "",
    gradeLevel: "Pre-School"
  });
  const [newSubject, setNewSubject] = useState({
    subjectName: ""
  });
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [assignmentData, setAssignmentData] = useState({
    class: "",
    isClassTeacher: false,
    subject: ""
  });
  const [subjectInput, setSubjectInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [genderCounts, setGenderCounts] = useState<GenderCount>({ male: 0, female: 0 });
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [isUpdatingTeacher, setIsUpdatingTeacher] = useState(false);
  const [isAssigningTeacher, setIsAssigningTeacher] = useState(false);
  const [isRemovingTeacher, setIsRemovingTeacher] = useState(false);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isAssigningClass, setIsAssigningClass] = useState(false);
  const [isAssigningSubject, setIsAssigningSubject] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<Record<string, string>>({});
  const [selectedSubjects, setSelectedSubjects] = useState<Record<string, string>>({});
  const [assigningClassForTeacher, setAssigningClassForTeacher] = useState<string | null>(null);
  const [assigningSubjectForTeacher, setAssigningSubjectForTeacher] = useState<string | null>(null);

  const gradeLevels = ["Pre-School", "Lower Primary", "Upper Primary", "JHS"];

  const eligibleClassTeacherClasses = [
    "Creche", "Nursery 1", "Nursery 2", "KG 1", "KG 2", "Grade 1", "Grade 2", "Grade 3"
  ];

  // Helper functions
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const calculateGenderCounts = (teachersList: Teacher[]) => {
    const maleCount = teachersList.filter(t => t.gender.toLowerCase() === 'male').length;
    const femaleCount = teachersList.filter(t => t.gender.toLowerCase() === 'female').length;
    
    setGenderCounts({
      male: maleCount,
      female: femaleCount
    });
    setTotalTeachers(teachersList.length);
  };

  const processSubjects = (teacher: any) => {
    if (!teacher) return [];
    
    if (teacher.subjectsTaught) {
      if (Array.isArray(teacher.subjectsTaught)) {
        return teacher.subjectsTaught.map((subj: any) => subj.subjectName || subj);
      }
      return [teacher.subjectsTaught];
    }
    if (teacher.subjects) {
      if (Array.isArray(teacher.subjects)) {
        return teacher.subjects;
      }
      return teacher.subjects.split(", ");
    }
    return [];
  };

  // API functions
  const fetchAllTeachers = async () => {
    try {
      const response = await fetch("https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/teachers/all", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch teachers");
      
      const data = await response.json();
      const mappedTeachers = data.map((teacher: any) => ({
        id: teacher.id || teacher._id || '',
        name: teacher.fullName || teacher.name || 'Unknown',
        nationality: teacher.nationality || '',
        gender: teacher.gender || '',
        address: teacher.address || '',
        classAllocation: teacher.classAllocation || [],
        assignedClass: teacher.assignedClass || teacher.classAllocation?.[0] || '',
        email: teacher.email || '',
        phone: teacher.phoneNumber || teacher.phone || '',
        subjects: processSubjects(teacher),
        role: teacher.role || "SUBJECT_TEACHER",
        classTeacherFor: teacher.classTeacherFor || ""
      }));

      setTeachers(mappedTeachers);
      setAllTeachers(mappedTeachers);
      calculateGenderCounts(mappedTeachers);
      return mappedTeachers;
    } catch (error) {
      console.error("Error fetching teachers:", error);
      return [];
    }
  };

  const fetchAllClasses = async () => {
    try {
      const response = await fetch("https://xpnnkh6h-8082.uks1.devtunnels.ms/teacher/classes/all", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      
      const data = await response.json();
      setAllClasses(data);
      return data;
    } catch (error) {
      console.error("Error fetching classes:", error);
      return [];
    }
  };

  const fetchAllSubjects = async () => {
    try {
      const response = await fetch("https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/subjects/all", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      
      const data = await response.json();
      setAllSubjects(data);
      return data;
    } catch (error) {
      console.error("Error fetching subjects:", error);
      return [];
    }
  };

  const addClass = async (classData: { className: string; gradeLevel: string }) => {
    setIsAddingClass(true);
    try {
      const response = await fetch("https://xpnnkh6h-8082.uks1.devtunnels.ms/teacher/classes/add", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          className: classData.className,
          gradeLevel: classData.gradeLevel
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add class");
      }
      
      const newClass = await response.json();
      await fetchAllClasses();
      return newClass;
    } catch (error) {
      console.error("Error adding class:", error);
      throw error;
    } finally {
      setIsAddingClass(false);
    }
  };

  const addSubject = async (subjectData: { subjectName: string }) => {
    setIsAddingSubject(true);
    try {
      const response = await fetch("https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/subjects/add", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subjectName: subjectData.subjectName
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add subject");
      }
      
      const newSubject = await response.json();
      // Update the allSubjects state immediately with the new subject
      setAllSubjects(prev => [...prev, newSubject]);
      return newSubject;
    } catch (error) {
      console.error("Error adding subject:", error);
      throw error;
    } finally {
      setIsAddingSubject(false);
    }
  };

  const assignClassToTeacher = async (email: string, className: string) => {
    setIsAssigningClass(true);
    setAssigningClassForTeacher(email);
    try {
      const response = await fetch(
        `https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/teachers/${email}/assign-class/${className}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to assign class";
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorText;
        } catch {
          errorMessage = errorText || "Failed to assign class";
        }
        
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      let updatedTeacher = null;
      
      if (responseText) {
        try {
          updatedTeacher = JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse response as JSON:", e);
        }
      }

      setTeachers(prevTeachers => 
        prevTeachers.map(teacher => 
          teacher.email === email ? { 
            ...teacher, 
            classAllocation: [className],
            assignedClass: className 
          } : teacher
        )
      );

      return updatedTeacher || { success: true };
    } catch (error) {
      console.error("Error assigning class:", error);
      throw error;
    } finally {
      setIsAssigningClass(false);
      setAssigningClassForTeacher(null);
    }
  };

  const assignSubjectToTeacher = async (email: string, subject: string) => {
    setIsAssigningSubject(true);
    setAssigningSubjectForTeacher(email);
    try {
      const response = await fetch(
        `https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/teachers/${email}/assign-subjects`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify([subject]) // Send as an array of strings
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to assign subject";
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorText;
        } catch {
          errorMessage = errorText || "Failed to assign subject";
        }
        
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      let updatedTeacher = null;
      
      if (responseText) {
        try {
          updatedTeacher = JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse response as JSON:", e);
        }
      }

      setTeachers(prevTeachers => 
        prevTeachers.map(teacher => 
          teacher.email === email ? { 
            ...teacher,
            subjects: [...new Set([...teacher.subjects, subject])]
          } : teacher
        )
      );

      return updatedTeacher || { success: true };
    } catch (error) {
      console.error("Error assigning subject:", error);
      throw error;
    } finally {
      setIsAssigningSubject(false);
      setAssigningSubjectForTeacher(null);
    }
  };

  const searchTeachersByName = async (name: string) => {
    try {
      const response = await fetch(`https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/teachers/search/by-name/${name}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to search teachers");
      }
      
      const data = await response.json();
      const mappedTeachers = data.map((teacher: any) => ({
        id: teacher.id || teacher._id || '',
        name: teacher.fullName || teacher.name || 'Unknown',
        nationality: teacher.nationality || '',
        gender: teacher.gender || '',
        address: teacher.address || '',
        classAllocation: teacher.classAllocation || [],
        assignedClass: teacher.assignedClass || teacher.classAllocation?.[0] || '',
        email: teacher.email || '',
        phone: teacher.phoneNumber || teacher.phone || '',
        subjects: processSubjects(teacher),
        role: teacher.role || "SUBJECT_TEACHER",
        classTeacherFor: teacher.classTeacherFor || ""
      }));

      setTeachers(mappedTeachers);
      return mappedTeachers;
    } catch (error) {
      console.error("Error searching teachers:", error);
      return [];
    }
  };

  const fetchTeachersByClass = async (className: string) => {
    try {
      const response = await fetch(`https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/teachers/search/class/${className}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch teachers by class");
      }
      
      const data = await response.json();
      const mappedTeachers = data.map((teacher: any) => ({
        id: teacher.id || teacher._id || '',
        name: teacher.fullName || teacher.name || 'Unknown',
        nationality: teacher.nationality || '',
        gender: teacher.gender || '',
        address: teacher.address || '',
        classAllocation: teacher.classAllocation || [],
        assignedClass: teacher.assignedClass || teacher.classAllocation?.[0] || '',
        email: teacher.email || '',
        phone: teacher.phoneNumber || teacher.phone || '',
        subjects: processSubjects(teacher),
        role: teacher.role || "SUBJECT_TEACHER",
        classTeacherFor: teacher.classTeacherFor || ""
      }));

      setTeachers(mappedTeachers);
      return mappedTeachers;
    } catch (error) {
      console.error("Error fetching teachers by class:", error);
      return [];
    }
  };

  const fetchTeachersBySubject = async (subject: string) => {
    try {
      const response = await fetch(`https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/teachers/search/by-subject/${subject}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch teachers by subject");
      }
      
      const data = await response.json();
      const mappedTeachers = data.map((teacher: any) => ({
        id: teacher.id || teacher._id || '',
        name: teacher.fullName || teacher.name || 'Unknown',
        nationality: teacher.nationality || '',
        gender: teacher.gender || '',
        address: teacher.address || '',
        classAllocation: teacher.classAllocation || [],
        assignedClass: teacher.assignedClass || teacher.classAllocation?.[0] || '',
        email: teacher.email || '',
        phone: teacher.phoneNumber || teacher.phone || '',
        subjects: processSubjects(teacher),
        role: teacher.role || "SUBJECT_TEACHER",
        classTeacherFor: teacher.classTeacherFor || ""
      }));

      setTeachers(mappedTeachers);
      return mappedTeachers;
    } catch (error) {
      console.error("Error fetching teachers by subject:", error);
      return [];
    }
  };

  const fetchTeachersByGender = async (gender: string) => {
    try {
      const response = await fetch(`https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/teachers/by-gender?gender=${gender}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch teachers by gender");
      }
      
      const data = await response.json();
      const mappedTeachers = data.map((teacher: any) => ({
        id: teacher.id || teacher._id || '',
        name: teacher.fullName || teacher.name || 'Unknown',
        nationality: teacher.nationality || '',
        gender: teacher.gender || '',
        address: teacher.address || '',
        classAllocation: teacher.classAllocation || [],
        assignedClass: teacher.assignedClass || teacher.classAllocation?.[0] || '',
        email: teacher.email || '',
        phone: teacher.phoneNumber || teacher.phone || '',
        subjects: processSubjects(teacher),
        role: teacher.role || "SUBJECT_TEACHER",
        classTeacherFor: teacher.classTeacherFor || ""
      }));

      setTeachers(mappedTeachers);
      return mappedTeachers;
    } catch (error) {
      console.error("Error fetching teachers by gender:", error);
      return [];
    }
  };

  const fetchTeachersByGradeLevel = async (gradeLevel: string) => {
    try {
      const response = await fetch(`https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/teachers/search/grade-level/${gradeLevel}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch teachers by grade level");
      }
      
      const data = await response.json();
      const mappedTeachers = data.map((teacher: any) => ({
        id: teacher.id || teacher._id || '',
        name: teacher.fullName || teacher.name || 'Unknown',
        nationality: teacher.nationality || '',
        gender: teacher.gender || '',
        address: teacher.address || '',
        classAllocation: teacher.classAllocation || [],
        assignedClass: teacher.assignedClass || teacher.classAllocation?.[0] || '',
        email: teacher.email || '',
        phone: teacher.phoneNumber || teacher.phone || '',
        subjects: processSubjects(teacher),
        role: teacher.role || "SUBJECT_TEACHER",
        classTeacherFor: teacher.classTeacherFor || ""
      }));

      setTeachers(mappedTeachers);
      return mappedTeachers;
    } catch (error) {
      console.error("Error fetching teachers by grade level:", error);
      return [];
    }
  };

  const addTeacher = async (teacherData: Omit<Teacher, 'id'>) => {
    setIsAddingTeacher(true);
    try {
      if (!teacherData.name || !teacherData.nationality || !teacherData.gender || 
          !teacherData.address || !teacherData.email || !teacherData.phone) {
        throw new Error("All fields must be filled");
      }

      if (!validateEmail(teacherData.email)) {
        throw new Error("Please enter a valid email address");
      }

      const response = await fetch("https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/teachers/add", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: teacherData.name,
          nationality: teacherData.nationality,
          gender: teacherData.gender,
          address: teacherData.address,
          email: teacherData.email,
          phoneNumber: teacherData.phone,
          role: teacherData.role || "SUBJECT_TEACHER",
          assignedClass: null,
          subjectsTaught: []
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add teacher");
      }
      
      const addedTeacher = await response.json();
      await fetchAllTeachers();
      return addedTeacher;
    } catch (error) {
      console.error("Error adding teacher:", error);
      throw error;
    } finally {
      setIsAddingTeacher(false);
    }
  };  

  const updateTeacher = async (teacherData: Teacher) => {
    setIsUpdatingTeacher(true);
    try {
      const response = await fetch(
        `https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/teachers/${teacherData.email}/update`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fullName: teacherData.name,
            nationality: teacherData.nationality,
            gender: teacherData.gender,
            address: teacherData.address,
            email: teacherData.email,
            phoneNumber: teacherData.phone,
            role: teacherData.role
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        throw new Error(errorData.message || "Failed to update teacher");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating teacher:", error);
      throw error;
    } finally {
      setIsUpdatingTeacher(false);
    }
  };

  const deleteTeacher = async (email: string) => {
    setIsRemovingTeacher(true);
    try {
      const response = await fetch(
        `https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/teachers/${email}/delete`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          const text = await response.text();
          throw new Error(text || "Failed to delete teacher");
        }
        throw new Error(errorData.message || "Failed to delete teacher");
      }

      await fetchAllTeachers();
      return true;
    } catch (error) {
      console.error("Error deleting teacher:", error);
      throw error;
    } finally {
      setIsRemovingTeacher(false);
    }
  };

 const assignSubjectsToTeacher = async (email: string, subjects: string[]) => {
    setIsAssigningSubject(true);
    setAssigningSubjectForTeacher(email);
    try {
      const response = await fetch(
        `https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/teachers/${email}/assign-subjects`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(subjects) // Just send the array directly
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to assign subjects");
      }

      await fetchAllTeachers();
      return await response.json();
    } catch (error) {
      console.error("Error assigning subjects:", error);
      throw error;
    } finally {
      setIsAssigningSubject(false);
      setAssigningSubjectForTeacher(null);
    }
  };

  const handleAddClass = async () => {
    try {
      if (!newClass.className) {
        throw new Error("Class name is required");
      }

      await addClass(newClass);
      setIsAddClassModalOpen(false);
      setNewClass({
        className: "",
        gradeLevel: "Pre-School"
      });
    } catch (error) {
      console.error("Error adding class:", error);
      alert(error instanceof Error ? error.message : "Failed to add class");
    }
  };

  const handleAddSubject = async () => {
  try {
    if (!newSubject.subjectName) {
      throw new Error("Subject name is required");
    }

    await addSubject(newSubject);
    // Fetch all subjects again after adding a new one
    await fetchAllSubjects();
    setIsAddSubjectModalOpen(false);
    setNewSubject({
      subjectName: ""
    });
  } catch (error) {
    console.error("Error adding subject:", error);
    alert(error instanceof Error ? error.message : "Failed to add subject");
  }
};

  const handleAssignClass = async (email: string) => {
    try {
      if (!selectedClasses[email]) {
        throw new Error("Please select a class to assign");
      }

      await assignClassToTeacher(email, selectedClasses[email]);
      setSelectedClasses(prev => ({ ...prev, [email]: "" }));
      alert("Class assigned successfully!");
    } catch (error) {
      console.error("Error assigning class:", error);
      alert(error instanceof Error ? error.message : "Failed to assign class");
    }
  };

  const handleAssignSubject = async (email: string) => {
    try {
      if (!selectedSubjects[email]) {
        throw new Error("Please select a subject to assign");
      }

      await assignSubjectToTeacher(email, selectedSubjects[email]);
      setSelectedSubjects(prev => ({ ...prev, [email]: "" }));
      alert("Subject assigned successfully!");
    } catch (error) {
      console.error("Error assigning subject:", error);
      alert(error instanceof Error ? error.message : "Failed to assign subject");
    }
  };

  // Effect hooks
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await fetchAllTeachers();
        await fetchAllClasses();
        await fetchAllSubjects();
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeData();
  }, []);

  // Filtering and search functions
  const filteredTeachers = teachers.filter(teacher => {
    const nameMatch = teacher.name ? teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const classMatch = classFilter === "" || teacher.classAllocation.includes(classFilter);
    const subjectMatch = subjectFilter === "" || teacher.subjects.includes(subjectFilter);
    const genderMatch = genderFilter === "" || (teacher.gender ? teacher.gender.toLowerCase() === genderFilter.toLowerCase() : false);
    const gradeLevelMatch = gradeLevelFilter === "" || 
      (teacher.classAllocation.some(cls => {
        if (gradeLevelFilter === "Pre-School") {
          return ["Creche", "Nursery 1", "Nursery 2", "KG 1", "KG 2"].includes(cls);
        } else if (gradeLevelFilter === "Lower Primary") {
          return ["Grade 1", "Grade 2", "Grade 3"].includes(cls);
        } else if (gradeLevelFilter === "Upper Primary") {
          return ["Grade 4", "Grade 5", "Grade 6"].includes(cls);
        } else if (gradeLevelFilter === "JHS") {
          return ["Grade 7", "Grade 8", "Grade 9"].includes(cls);
        }
        return false;
      }));
    return nameMatch && classMatch && subjectMatch && genderMatch && gradeLevelMatch;
  });

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      if (tempSearchTerm) {
        await searchTeachersByName(tempSearchTerm);
      } else {
        await fetchAllTeachers();
      }
      setSearchTerm(tempSearchTerm);
      setHasSearched(true);
    } catch (error) {
      console.error("Error in handleSearch:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClassFilter = async () => {
    setIsFiltering(true);
    try {
      if (tempClassFilter) {
        await fetchTeachersByClass(tempClassFilter);
      } else {
        await fetchAllTeachers();
      }
      setClassFilter(tempClassFilter);
      setHasSearched(true);
    } catch (error) {
      console.error("Error in handleClassFilter:", error);
    } finally {
      setIsFiltering(false);
    }
  };

  const handleSubjectFilter = async () => {
    setIsFiltering(true);
    try {
      if (tempSubjectFilter) {
        await fetchTeachersBySubject(tempSubjectFilter);
      } else {
        await fetchAllTeachers();
      }
      setSubjectFilter(tempSubjectFilter);
      setHasSearched(true);
    } catch (error) {
      console.error("Error in handleSubjectFilter:", error);
    } finally {
      setIsFiltering(false);
    }
  };

  const handleGenderFilter = async () => {
    setIsFiltering(true);
    try {
      if (tempGenderFilter) {
        await fetchTeachersByGender(tempGenderFilter);
      } else {
        await fetchAllTeachers();
      }
      setGenderFilter(tempGenderFilter);
      setHasSearched(true);
    } catch (error) {
      console.error("Error in handleGenderFilter:", error);
    } finally {
      setIsFiltering(false);
    }
  };

  const handleGradeLevelFilter = async () => {
    setIsFiltering(true);
    try {
      if (tempGradeLevelFilter) {
        await fetchTeachersByGradeLevel(tempGradeLevelFilter);
      } else {
        await fetchAllTeachers();
      }
      setGradeLevelFilter(tempGradeLevelFilter);
      setHasSearched(true);
    } catch (error) {
      console.error("Error in handleGradeLevelFilter:", error);
    } finally {
      setIsFiltering(false);
    }
  };

  const handleViewAll = async () => {
    setIsViewAllLoading(true);
    try {
      await fetchAllTeachers();
      setSearchTerm("");
      setClassFilter("");
      setSubjectFilter("");
      setGenderFilter("");
      setGradeLevelFilter("");
      setTempSearchTerm("");
      setTempClassFilter("");
      setTempSubjectFilter("");
      setTempGenderFilter("");
      setTempGradeLevelFilter("");
      setHasSearched(true);
    } catch (error) {
      console.error("Error in handleViewAll:", error);
    } finally {
      setIsViewAllLoading(false);
    }
  };

  // Teacher management functions
  const handleAddTeacher = async () => {
    setEmailError("");
    try {
      if (!newTeacher.name || !newTeacher.nationality || !newTeacher.gender || 
          !newTeacher.address || !newTeacher.email || !newTeacher.phone) {
        throw new Error("All fields must be filled");
      }

      if (!validateEmail(newTeacher.email)) {
        setEmailError("Please enter a valid email address");
        return;
      }

      await addTeacher(newTeacher);
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
        role: "SUBJECT_TEACHER",
        classTeacherFor: ""
      });
    } catch (error) {
      console.error("Error in handleAddTeacher:", error);
      alert(error instanceof Error ? error.message : "Failed to add teacher");
    }
  };

  const handleEditTeacher = async () => {
    if (!editTeacher) return;
    
    try {
      await updateTeacher(editTeacher);
      setIsEditTeacherModalOpen(false);
      setEditTeacher(null);
      await fetchAllTeachers();
    } catch (error) {
      console.error("Error in handleEditTeacher:", error);
      alert(error instanceof Error ? error.message : "Failed to update teacher");
    }
  };

  const openEditModal = (teacher: Teacher) => {
    setEditTeacher({...teacher});
    setIsEditTeacherModalOpen(true);
  };

  const handleRemoveTeacher = async (email: string) => {
    if (window.confirm("Are you sure you want to remove this teacher?")) {
      try {
        await deleteTeacher(email);
      } catch (error) {
        console.error("Error in handleRemoveTeacher:", error);
        alert(error instanceof Error ? error.message : "Failed to remove teacher");
      }
    }
  };

  const isAnyButtonLoading = isAddingTeacher || isUpdatingTeacher || isAssigningTeacher || isRemovingTeacher || 
                            isSearching || isFiltering || isViewAllLoading || isAddingClass || isAddingSubject ||
                            isAssigningClass || isAssigningSubject;

  // Loading state
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="p-5 bg-green-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-green-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-green-800">Loading teachers...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Main render
  return (
    <ProtectedRoute>
      <div className="p-5 bg-green-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-green-800">Teacher Profiles</h1>
        
        <div className="flex justify-between mb-6">
          <div className="flex space-x-3">
            <button
              onClick={() => setIsAddTeacherModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow-md"
              disabled={isAnyButtonLoading}
            >
              {isAddingTeacher ? 'Adding...' : 'Add New Teacher'}
            </button>
            <button
              onClick={() => setIsAddClassModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow-md"
              disabled={isAnyButtonLoading}
            >
              {isAddingClass ? 'Adding...' : 'Add Class'}
            </button>
            <button
              onClick={() => setIsAddSubjectModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow-md"
              disabled={isAnyButtonLoading}
            >
              {isAddingSubject ? 'Adding...' : 'Add Subject'}
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search by Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-green-700">Search by Name</label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter teacher name..."
                  className="flex-1 p-2 border border-green-300 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  value={tempSearchTerm}
                  onChange={(e) => setTempSearchTerm(e.target.value)}
                  disabled={isAnyButtonLoading}
                />
                <button
                  onClick={handleSearch}
                  disabled={isAnyButtonLoading || !tempSearchTerm}
                  className="bg-green-600 text-white px-3 py-2 rounded-r hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center text-sm"
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

            {/* Search by Class */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-green-700">Search by Class</label>
              <div className="flex">
                <select
                  className="flex-1 p-2 border border-green-300 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  value={tempClassFilter}
                  onChange={(e) => setTempClassFilter(e.target.value)}
                  disabled={isAnyButtonLoading}
                >
                  <option value="">Select Class</option>
                  {allClasses.map((cls) => (
                    <option key={cls.id} value={cls.className}>{cls.className}</option>
                  ))}
                </select>
                <button
                  onClick={handleClassFilter}
                  disabled={isAnyButtonLoading || !tempClassFilter}
                  className="bg-green-600 text-white px-3 py-2 rounded-r hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center text-sm"
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

            {/* Search by Gender */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-green-700">Search by Gender</label>
              <div className="flex">
                <select
                  className="flex-1 p-2 border border-green-300 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  value={tempGenderFilter}
                  onChange={(e) => setTempGenderFilter(e.target.value)}
                  disabled={isAnyButtonLoading}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <button
                  onClick={handleGenderFilter}
                  disabled={isAnyButtonLoading || !tempGenderFilter}
                  className="bg-green-600 text-white px-3 py-2 rounded-r hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center text-sm"
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

            {/* Filter by Grade Level */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-green-700">Filter by Grade Level</label>
              <div className="flex">
                <select
                  className="flex-1 p-2 border border-green-300 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  value={tempGradeLevelFilter}
                  onChange={(e) => setTempGradeLevelFilter(e.target.value)}
                  disabled={isAnyButtonLoading}
                >
                  <option value="">All Levels</option>
                  {gradeLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <button
                  onClick={handleGradeLevelFilter}
                  disabled={isAnyButtonLoading || !tempGradeLevelFilter}
                  className="bg-green-600 text-white px-3 py-2 rounded-r hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center text-sm"
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

          {/* View All Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleViewAll}
              disabled={isAnyButtonLoading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center text-sm shadow-md"
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

        {hasSearched && (
          <>
            <div className="bg-green-100 p-6 rounded-lg shadow-md mb-6 border border-green-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200 text-center">
                  <h3 className="font-bold text-lg text-green-800">Total Teachers</h3>
                  <p className="text-2xl text-green-600">{allTeachers.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200 text-center">
                  <h3 className="font-bold text-lg text-green-800">Male Teachers</h3>
                  <p className="text-2xl text-green-600">{allTeachers.filter(t => t.gender.toLowerCase() === 'male').length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200 text-center">
                  <h3 className="font-bold text-lg text-green-800">Female Teachers</h3>
                  <p className="text-2xl text-green-600">{allTeachers.filter(t => t.gender.toLowerCase() === 'female').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-green-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Nationality</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Gender</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Address</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Class</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Subjects</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teachers.map((teacher) => (
                    <tr key={teacher.email} className="hover:bg-green-50">
                      {/* Name Column */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-900">
                        {teacher.name}
                        {teacher.role === "CLASS_TEACHER" && (
                          <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                            Class Teacher
                          </span>
                        )}
                      </td>

                      {/* Email Column */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">
                        <a href={`mailto:${teacher.email}`} className="hover:underline">
                          {teacher.email}
                        </a>
                      </td>

                      {/* Nationality Column */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">
                        {teacher.nationality}
                      </td>

                      {/* Gender Column */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">
                        {teacher.gender}
                      </td>

                      {/* Address Column */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">
                        {teacher.address}
                      </td>

                      {/* Class Column */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {teacher.assignedClass || teacher.classAllocation?.[0] ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            {teacher.assignedClass || teacher.classAllocation?.[0]}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">Not assigned</span>
                        )}
                      </td>

                      {/* Subjects Column */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects?.length > 0 ? (
                            teacher.subjects.map((subject, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                              >
                                {subject}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">No subjects</span>
                          )}
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">
                        {teacher.role === "CLASS_TEACHER" ? "Class Teacher" : "Subject Teacher"}
                      </td>

                      {/* Phone Column */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">
                        {teacher.phone}
                      </td>

                      {/* Actions Column */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(teacher)}
                              className="text-green-600 hover:text-green-800 hover:underline text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleRemoveTeacher(teacher.email)}
                              className="text-red-600 hover:text-red-800 hover:underline text-xs"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="flex space-x-2">
                            <select
                              className="flex-1 p-1 border border-green-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-xs"
                              value={selectedClasses[teacher.email] || ""}
                              onChange={(e) => setSelectedClasses(prev => ({ ...prev, [teacher.email]: e.target.value }))}
                              disabled={isAssigningClass && assigningClassForTeacher === teacher.email}
                            >
                              <option value="">Select Class</option>
                              {allClasses.map((cls) => (
                                <option key={cls.id} value={cls.className}>{cls.className}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssignClass(teacher.email)}
                              disabled={!selectedClasses[teacher.email] || (isAssigningClass && assigningClassForTeacher === teacher.email)}
                              className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 text-xs flex items-center justify-center min-w-[60px]"
                            >
                              {isAssigningClass && assigningClassForTeacher === teacher.email ? (
                                <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                'Assign'
                              )}
                            </button>
                          </div>
                          
                          <div className="flex space-x-2">
                            <select
                              className="flex-1 p-1 border border-green-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-xs"
                              value={selectedSubjects[teacher.email] || ""}
                              onChange={(e) => setSelectedSubjects(prev => ({ ...prev, [teacher.email]: e.target.value }))}
                              disabled={isAssigningSubject && assigningSubjectForTeacher === teacher.email}
                            >
                              <option value="">Select Subject</option>
                              {allSubjects.map((subject) => (
                                <option key={subject.id} value={subject.subjectName}>{subject.subjectName}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssignSubject(teacher.email)}
                              disabled={!selectedSubjects[teacher.email] || (isAssigningSubject && assigningSubjectForTeacher === teacher.email)}
                              className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 text-xs flex items-center justify-center min-w-[60px]"
                            >
                              {isAssigningSubject && assigningSubjectForTeacher === teacher.email ? (
                                <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                'Assign'
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>  
          </>
        )}

        {!hasSearched && (
          <div className="bg-white rounded-lg shadow p-8 text-center border border-green-200">
            <p className="text-green-700 text-lg">
              Use the search or filter options above to view teachers
            </p>
          </div>
        )}

        {/* Add Teacher Modal */}
        <Modal isOpen={isAddTeacherModalOpen} onClose={() => setIsAddTeacherModalOpen(false)}>
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-green-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">Add New Teacher</h2>
              <button onClick={() => setIsAddTeacherModalOpen(false)} className="text-green-600 hover:text-green-800">
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Full Name*</label>
                <input
                  type="text"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Nationality*</label>
                <input
                  type="text"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newTeacher.nationality}
                  onChange={(e) => setNewTeacher({...newTeacher, nationality: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Gender*</label>
                <select
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newTeacher.gender}
                  onChange={(e) => setNewTeacher({...newTeacher, gender: e.target.value})}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Address*</label>
                <input
                  type="text"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newTeacher.address}
                  onChange={(e) => setNewTeacher({...newTeacher, address: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Email*</label>
                <input
                  type="email"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                  required
                />
                {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Phone Number*</label>
                <input
                  type="text"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Role*</label>
                <select
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newTeacher.role}
                  onChange={(e) => setNewTeacher({...newTeacher, role: e.target.value})}
                  required
                >
                  <option value="SUBJECT_TEACHER">Subject Teacher</option>
                  <option value="CLASS_TEACHER">Class Teacher</option>
                </select>
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
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center min-w-[120px]"
                disabled={isAddingTeacher || !newTeacher.name || !newTeacher.email}
              >
                {isAddingTeacher ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Teacher'
                )}
              </button>
            </div>
          </div>
        </Modal>

        {/* Edit Teacher Modal */}
        <Modal isOpen={isEditTeacherModalOpen} onClose={() => setIsEditTeacherModalOpen(false)}>
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-green-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">Edit Teacher</h2>
              <button onClick={() => setIsEditTeacherModalOpen(false)} className="text-green-600 hover:text-green-800">
                ×
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
                <label className="block text-sm font-medium mb-1 text-green-700">Role</label>
                <select
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={editTeacher?.role || "SUBJECT_TEACHER"}
                  onChange={(e) => editTeacher && setEditTeacher({...editTeacher, role: e.target.value})}
                >
                  <option value="SUBJECT_TEACHER">Subject Teacher</option>
                  <option value="CLASS_TEACHER">Class Teacher</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditTeacherModalOpen(false)}
                className="px-4 py-2 border border-green-300 rounded hover:bg-green-50 transition-colors"
                disabled={isUpdatingTeacher}
              >
                Cancel
              </button>
              <button
                onClick={handleEditTeacher}
                disabled={isUpdatingTeacher || !editTeacher?.name || !editTeacher?.email}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 transition-colors flex items-center justify-center min-w-[120px]"
              >
                {isUpdatingTeacher ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </Modal>

        {/* Add Class Modal */}
        <Modal isOpen={isAddClassModalOpen} onClose={() => setIsAddClassModalOpen(false)}>
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-green-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">Add New Class</h2>
              <button 
                onClick={() => setIsAddClassModalOpen(false)}
                className="text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Class Name*</label>
                <input
                  type="text"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newClass.className}
                  onChange={(e) => setNewClass({...newClass, className: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Grade Level*</label>
                <select
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newClass.gradeLevel}
                  onChange={(e) => setNewClass({...newClass, gradeLevel: e.target.value})}
                  required
                >
                  {gradeLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddClassModalOpen(false)}
                className="px-4 py-2 border border-green-300 rounded hover:bg-green-50 transition-colors"
                disabled={isAddingClass}
              >
                Cancel
              </button>
              <button
                onClick={handleAddClass}
                disabled={isAddingClass || !newClass.className}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 transition-colors flex items-center justify-center min-w-[120px]"
              >
                {isAddingClass ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Class'
                )}
              </button>
            </div>
          </div>
        </Modal>

        {/* Add Subject Modal */}
        <Modal isOpen={isAddSubjectModalOpen} onClose={() => setIsAddSubjectModalOpen(false)}>
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-green-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">Add New Subject</h2>
              <button 
                onClick={() => setIsAddSubjectModalOpen(false)}
                className="text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">Subject Name*</label>
                <input
                  type="text"
                  className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newSubject.subjectName}
                  onChange={(e) => setNewSubject({...newSubject, subjectName: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddSubjectModalOpen(false)}
                className="px-4 py-2 border border-green-300 rounded hover:bg-green-50 transition-colors"
                disabled={isAddingSubject}
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubject}
                disabled={isAddingSubject || !newSubject.subjectName}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 transition-colors flex items-center justify-center min-w-[120px]"
              >
                {isAddingSubject ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Subject'
                )}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}