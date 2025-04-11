"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";

type Subject = {
  id: number;
  name: string;
  teacher: string;
  duration: string;
};

type TimetableEntry = {
  id: number;
  day: string;
  time: string;
  subject: Subject;
  classroom: string;
  invigilator?: string;
};

type ClassTimetable = {
  id: number;
  className: string;
  timetable: TimetableEntry[];
};

export default function TimetableManagement() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [classTimetables, setClassTimetables] = useState<ClassTimetable[]>([]);
  const [examTimetables, setExamTimetables] = useState<ClassTimetable[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [newEntry, setNewEntry] = useState<Omit<TimetableEntry, 'id'>>({
    day: "",
    time: "",
    subject: { id: 0, name: "", teacher: "", duration: "" },
    classroom: "",
    invigilator: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewAllGrades, setViewAllGrades] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isViewAllLoading, setIsViewAllLoading] = useState(false);

  // Initialize with sample data (same as before)
  useEffect(() => {
    // Class timetables initialization
    const initialClassTimetables = [

     {
        id: 1,
        className: "Creche",
        timetable: [
          {
            id: 1,
            day: "Monday",
            time: "09:00 - 10:00",
            subject: { id: 1, name: "Play Time", teacher: "Ms. Ama", duration: "1 hour" },
            classroom: "Play Room"
          },
        {
          id: 2,
          day: "Monday",
          time: "10:00 - 10:30",
          subject: { id: 2, name: "Story Time", teacher: "Ms. Esi", duration: "30 mins" },
          classroom: "Reading Corner"
        },
        {
          id: 3,
          day: "Monday",
          time: "11:00 - 12:00",
          subject: { id: 3, name: "Nap Time", teacher: "Ms. Ama", duration: "1 hour" },
          classroom: "Sleep Room"
        },
        {
          id: 4,
          day: "Monday",
          time: "13:00 - 14:00",
          subject: { id: 4, name: "Music Time", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Music Room"
        },
        {
          id: 5,
          day: "Monday",
          time: "14:30 - 15:30",
          subject: { id: 5, name: "Outdoor Play", teacher: "Ms. Adwoa", duration: "1 hour" },
          classroom: "Playground"
        },
        {
          id: 6,
          day: "Tuesday",
          time: "09:00 - 10:00",
          subject: { id: 6, name: "Art & Craft", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        },
        {
          id: 7,
          day: "Tuesday",
          time: "10:30 - 11:30",
          subject: { id: 7, name: "Sensory Play", teacher: "Ms. Esi", duration: "1 hour" },
          classroom: "Sensory Room"
        },
        {
          id: 8,
          day: "Tuesday",
          time: "13:00 - 14:00",
          subject: { id: 8, name: "Story Time", teacher: "Ms. Ama", duration: "1 hour" },
          classroom: "Reading Corner"
        },
        {
          id: 9,
          day: "Wednesday",
          time: "09:00 - 10:00",
          subject: { id: 9, name: "Music & Movement", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Music Room"
        },
        {
          id: 10,
          day: "Wednesday",
          time: "10:30 - 11:30",
          subject: { id: 10, name: "Water Play", teacher: "Ms. Adwoa", duration: "1 hour" },
          classroom: "Outdoor Area"
        },
        {
          id: 11,
          day: "Thursday",
          time: "09:00 - 10:00",
          subject: { id: 11, name: "Building Blocks", teacher: "Ms. Esi", duration: "1 hour" },
          classroom: "Play Room"
        },
        {
          id: 12,
          day: "Thursday",
          time: "10:30 - 11:30",
          subject: { id: 12, name: "Puppet Show", teacher: "Ms. Ama", duration: "1 hour" },
          classroom: "Reading Corner"
        },
        {
          id: 13,
          day: "Friday",
          time: "09:00 - 10:00",
          subject: { id: 13, name: "Free Play", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Play Room"
        },
        {
          id: 14,
          day: "Friday",
          time: "10:30 - 11:30",
          subject: { id: 14, name: "Show & Tell", teacher: "Ms. Adwoa", duration: "1 hour" },
          classroom: "Main Room"
        }
      ]
    },
    {
      id: 2,
      className: "Nursery 1",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "09:00 - 10:00",
          subject: { id: 1, name: "Circle Time", teacher: "Ms. Adwoa", duration: "1 hour" },
          classroom: "Main Room"
        },
        {
          id: 2,
          day: "Monday",
          time: "10:30 - 11:30",
          subject: { id: 2, name: "Phonics", teacher: "Ms. Akosua", duration: "1 hour" },
          classroom: "Main Room"
        },
        {
          id: 3,
          day: "Monday",
          time: "13:00 - 14:00",
          subject: { id: 3, name: "Numbers", teacher: "Ms. Abena", duration: "1 hour" },
          classroom: "Main Room"
        },
        {
          id: 4,
          day: "Monday",
          time: "14:30 - 15:30",
          subject: { id: 4, name: "Arts & Crafts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        },
        {
          id: 5,
          day: "Tuesday",
          time: "09:00 - 10:00",
          subject: { id: 5, name: "Story Time", teacher: "Ms. Esi", duration: "1 hour" },
          classroom: "Reading Corner"
        },
        {
          id: 6,
          day: "Tuesday",
          time: "10:30 - 11:30",
          subject: { id: 6, name: "Music", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Music Room"
        },
        {
          id: 7,
          day: "Tuesday",
          time: "13:00 - 14:00",
          subject: { id: 7, name: "Shapes & Colors", teacher: "Ms. Abena", duration: "1 hour" },
          classroom: "Main Room"
        },
        {
          id: 8,
          day: "Wednesday",
          time: "09:00 - 10:00",
          subject: { id: 8, name: "Phonics", teacher: "Ms. Akosua", duration: "1 hour" },
          classroom: "Main Room"
        },
        {
          id: 9,
          day: "Wednesday",
          time: "10:30 - 11:30",
          subject: { id: 9, name: "Outdoor Play", teacher: "Ms. Adwoa", duration: "1 hour" },
          classroom: "Playground"
        },
        {
          id: 10,
          day: "Wednesday",
          time: "13:00 - 14:00",
          subject: { id: 10, name: "Numbers", teacher: "Ms. Abena", duration: "1 hour" },
          classroom: "Main Room"
        },
        {
          id: 11,
          day: "Thursday",
          time: "09:00 - 10:00",
          subject: { id: 11, name: "Arts & Crafts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        },
        {
          id: 12,
          day: "Thursday",
          time: "10:30 - 11:30",
          subject: { id: 12, name: "Story Time", teacher: "Ms. Esi", duration: "1 hour" },
          classroom: "Reading Corner"
        },
        {
          id: 13,
          day: "Friday",
          time: "09:00 - 10:00",
          subject: { id: 13, name: "Show & Tell", teacher: "Ms. Adwoa", duration: "1 hour" },
          classroom: "Main Room"
        },
        {
          id: 14,
          day: "Friday",
          time: "10:30 - 11:30",
          subject: { id: 14, name: "Music & Movement", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Music Room"
        }
      ]
    },
    {
      id: 3,
      className: "Nursery 2",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "09:00 - 10:00",
          subject: { id: 1, name: "Phonics", teacher: "Ms. Akosua", duration: "1 hour" },
          classroom: "Main Room"
        },
        {
          id: 2,
          day: "Monday",
          time: "10:30 - 11:30",
          subject: { id: 2, name: "Numbers", teacher: "Ms. Abena", duration: "1 hour" },
          classroom: "Main Room"
        },
        {
          id: 3,
          day: "Monday",
          time: "13:00 - 14:00",
          subject: { id: 3, name: "Science Exploration", teacher: "Ms. Efia", duration: "1 hour" },
          classroom: "Science Corner"
        },
        {
          id: 4,
          day: "Monday",
          time: "14:30 - 15:30",
          subject: { id: 4, name: "Arts & Crafts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        },
        {
          id: 5,
          day: "Tuesday",
          time: "09:00 - 10:00",
          subject: { id: 5, name: "Story Time", teacher: "Ms. Esi", duration: "1 hour" },
          classroom: "Reading Corner"
        },
        {
          id: 6,
          day: "Tuesday",
          time: "10:30 - 11:30",
          subject: { id: 6, name: "Music", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Music Room"
        },
        {
          id: 7,
          day: "Tuesday",
          time: "13:00 - 14:00",
          subject: { id: 7, name: "Phonics", teacher: "Ms. Akosua", duration: "1 hour" },
          classroom: "Main Room"
        },
        {
          id: 8,
          day: "Wednesday",
          time: "09:00 - 10:00",
          subject: { id: 8, name: "Numbers", teacher: "Ms. Abena", duration: "1 hour" },
          classroom: "Main Room"
        },
        {
          id: 9,
          day: "Wednesday",
          time: "10:30 - 11:30",
          subject: { id: 9, name: "Outdoor Play", teacher: "Ms. Adwoa", duration: "1 hour" },
          classroom: "Playground"
        },
        {
          id: 10,
          day: "Wednesday",
          time: "13:00 - 14:00",
          subject: { id: 10, name: "Science Exploration", teacher: "Ms. Efia", duration: "1 hour" },
          classroom: "Science Corner"
        },
        {
          id: 11,
          day: "Thursday",
          time: "09:00 - 10:00",
          subject: { id: 11, name: "Arts & Crafts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        },
        {
          id: 12,
          day: "Thursday",
          time: "10:30 - 11:30",
          subject: { id: 12, name: "Story Time", teacher: "Ms. Esi", duration: "1 hour" },
          classroom: "Reading Corner"
        },
        {
          id: 13,
          day: "Friday",
          time: "09:00 - 10:00",
          subject: { id: 13, name: "Show & Tell", teacher: "Ms. Adwoa", duration: "1 hour" },
          classroom: "Main Room"
        },
        {
          id: 14,
          day: "Friday",
          time: "10:30 - 11:30",
          subject: { id: 14, name: "Music & Movement", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Music Room"
        }
      ]
    },
    {
      id: 4,
      className: "KG 1",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "09:00 - 10:00",
          subject: { id: 1, name: "English", teacher: "Ms. Akua", duration: "1 hour" },
          classroom: "KG Room 1"
        },
        {
          id: 2,
          day: "Monday",
          time: "10:30 - 11:30",
          subject: { id: 2, name: "Math", teacher: "Ms. Ama", duration: "1 hour" },
          classroom: "KG Room 1"
        },
        {
          id: 3,
          day: "Monday",
          time: "13:00 - 14:00",
          subject: { id: 3, name: "Science", teacher: "Ms. Efia", duration: "1 hour" },
          classroom: "Science Corner"
        },
        {
          id: 4,
          day: "Monday",
          time: "14:30 - 15:30",
          subject: { id: 4, name: "Creative Arts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        },
        {
          id: 5,
          day: "Tuesday",
          time: "09:00 - 10:00",
          subject: { id: 5, name: "Phonics", teacher: "Ms. Akosua", duration: "1 hour" },
          classroom: "KG Room 1"
        },
        {
          id: 6,
          day: "Tuesday",
          time: "10:30 - 11:30",
          subject: { id: 6, name: "Social Studies", teacher: "Mr. Kwame", duration: "1 hour" },
          classroom: "KG Room 1"
        },
        {
          id: 7,
          day: "Tuesday",
          time: "13:00 - 14:00",
          subject: { id: 7, name: "Music", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Music Room"
        },
        {
          id: 8,
          day: "Wednesday",
          time: "09:00 - 10:00",
          subject: { id: 8, name: "English", teacher: "Ms. Akua", duration: "1 hour" },
          classroom: "KG Room 1"
        },
        {
          id: 9,
          day: "Wednesday",
          time: "10:30 - 11:30",
          subject: { id: 9, name: "Math", teacher: "Ms. Ama", duration: "1 hour" },
          classroom: "KG Room 1"
        },
        {
          id: 10,
          day: "Wednesday",
          time: "13:00 - 14:00",
          subject: { id: 10, name: "Physical Education", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Playground"
        },
        {
          id: 11,
          day: "Thursday",
          time: "09:00 - 10:00",
          subject: { id: 11, name: "Science", teacher: "Ms. Efia", duration: "1 hour" },
          classroom: "Science Corner"
        },
        {
          id: 12,
          day: "Thursday",
          time: "10:30 - 11:30",
          subject: { id: 12, name: "Creative Arts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        },
        {
          id: 13,
          day: "Friday",
          time: "09:00 - 10:00",
          subject: { id: 13, name: "Show & Tell", teacher: "Ms. Adwoa", duration: "1 hour" },
          classroom: "KG Room 1"
        },
        {
          id: 14,
          day: "Friday",
          time: "10:30 - 11:30",
          subject: { id: 14, name: "Music & Movement", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Music Room"
        }
      ]
    },
    {
      id: 5,
      className: "KG 2",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "09:00 - 10:00",
          subject: { id: 1, name: "English", teacher: "Ms. Yaa", duration: "1 hour" },
          classroom: "KG Room 2"
        },
        {
          id: 2,
          day: "Monday",
          time: "10:30 - 11:30",
          subject: { id: 2, name: "Math", teacher: "Ms. Ama", duration: "1 hour" },
          classroom: "KG Room 2"
        },
        {
          id: 3,
          day: "Monday",
          time: "13:00 - 14:00",
          subject: { id: 3, name: "Science", teacher: "Ms. Efia", duration: "1 hour" },
          classroom: "Science Corner"
        },
        {
          id: 4,
          day: "Monday",
          time: "14:30 - 15:30",
          subject: { id: 4, name: "Creative Arts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        },
        {
          id: 5,
          day: "Tuesday",
          time: "09:00 - 10:00",
          subject: { id: 5, name: "Phonics", teacher: "Ms. Akosua", duration: "1 hour" },
          classroom: "KG Room 2"
        },
        {
          id: 6,
          day: "Tuesday",
          time: "10:30 - 11:30",
          subject: { id: 6, name: "Social Studies", teacher: "Mr. Kwame", duration: "1 hour" },
          classroom: "KG Room 2"
        },
        {
          id: 7,
          day: "Tuesday",
          time: "13:00 - 14:00",
          subject: { id: 7, name: "Music", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Music Room"
        },
        {
          id: 8,
          day: "Wednesday",
          time: "09:00 - 10:00",
          subject: { id: 8, name: "English", teacher: "Ms. Yaa", duration: "1 hour" },
          classroom: "KG Room 2"
        },
        {
          id: 9,
          day: "Wednesday",
          time: "10:30 - 11:30",
          subject: { id: 9, name: "Math", teacher: "Ms. Ama", duration: "1 hour" },
          classroom: "KG Room 2"
        },
        {
          id: 10,
          day: "Wednesday",
          time: "13:00 - 14:00",
          subject: { id: 10, name: "Physical Education", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Playground"
        },
        {
          id: 11,
          day: "Thursday",
          time: "09:00 - 10:00",
          subject: { id: 11, name: "Science", teacher: "Ms. Efia", duration: "1 hour" },
          classroom: "Science Corner"
        },
        {
          id: 12,
          day: "Thursday",
          time: "10:30 - 11:30",
          subject: { id: 12, name: "Creative Arts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        },
        {
          id: 13,
          day: "Friday",
          time: "09:00 - 10:00",
          subject: { id: 13, name: "Show & Tell", teacher: "Ms. Adwoa", duration: "1 hour" },
          classroom: "KG Room 2"
        },
        {
          id: 14,
          day: "Friday",
          time: "10:30 - 11:30",
          subject: { id: 14, name: "Music & Movement", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Music Room"
        }
      ]
    },
    {
      id: 6,
      className: "Grade 1",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "09:00 - 10:00",
          subject: { id: 1, name: "Mathematics", teacher: "Mr. Smith", duration: "1 hour" },
          classroom: "Room 101"
        },
        {
          id: 2,
          day: "Monday",
          time: "10:30 - 11:30",
          subject: { id: 2, name: "English", teacher: "Mrs. Brown", duration: "1 hour" },
          classroom: "Room 101"
        },
        {
          id: 3,
          day: "Monday",
          time: "13:00 - 14:00",
          subject: { id: 3, name: "Science", teacher: "Ms. Johnson", duration: "1 hour" },
          classroom: "Lab 1"
        },
        {
          id: 4,
          day: "Monday",
          time: "14:30 - 15:30",
          subject: { id: 4, name: "Creative Arts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        },
        {
          id: 5,
          day: "Tuesday",
          time: "09:00 - 10:00",
          subject: { id: 5, name: "Social Studies", teacher: "Mr. Kwame", duration: "1 hour" },
          classroom: "Room 101"
        },
        {
          id: 6,
          day: "Tuesday",
          time: "10:30 - 11:30",
          subject: { id: 6, name: "Physical Education", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Playground"
        },
        {
          id: 7,
          day: "Tuesday",
          time: "13:00 - 14:00",
          subject: { id: 7, name: "Mathematics", teacher: "Mr. Smith", duration: "1 hour" },
          classroom: "Room 101"
        },
        {
          id: 8,
          day: "Wednesday",
          time: "09:00 - 10:00",
          subject: { id: 8, name: "English", teacher: "Mrs. Brown", duration: "1 hour" },
          classroom: "Room 101"
        },
        {
          id: 9,
          day: "Wednesday",
          time: "10:30 - 11:30",
          subject: { id: 9, name: "Science", teacher: "Ms. Johnson", duration: "1 hour" },
          classroom: "Lab 1"
        },
        {
          id: 10,
          day: "Wednesday",
          time: "13:00 - 14:00",
          subject: { id: 10, name: "ICT", teacher: "Mr. Boateng", duration: "1 hour" },
          classroom: "Computer Lab"
        },
        {
          id: 11,
          day: "Thursday",
          time: "09:00 - 10:00",
          subject: { id: 11, name: "Mathematics", teacher: "Mr. Smith", duration: "1 hour" },
          classroom: "Room 101"
        },
        {
          id: 12,
          day: "Thursday",
          time: "10:30 - 11:30",
          subject: { id: 12, name: "English", teacher: "Mrs. Brown", duration: "1 hour" },
          classroom: "Room 101"
        },
        {
          id: 13,
          day: "Friday",
          time: "09:00 - 10:00",
          subject: { id: 13, name: "Science", teacher: "Ms. Johnson", duration: "1 hour" },
          classroom: "Lab 1"
        },
        {
          id: 14,
          day: "Friday",
          time: "10:30 - 11:30",
          subject: { id: 14, name: "Music", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Music Room"
        }
      ]
    },
    {
      id: 7,
      className: "Grade 2",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "09:00 - 10:30",
          subject: { id: 1, name: "English", teacher: "Mrs. Brown", duration: "1.5 hours" },
          classroom: "Room 102"
        },
        {
          id: 2,
          day: "Monday",
          time: "11:00 - 12:00",
          subject: { id: 2, name: "Mathematics", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Room 102"
        },
        {
          id: 3,
          day: "Monday",
          time: "13:00 - 14:00",
          subject: { id: 3, name: "Science", teacher: "Ms. Johnson", duration: "1 hour" },
          classroom: "Lab 1"
        },
        {
          id: 4,
          day: "Monday",
          time: "14:30 - 15:30",
          subject: { id: 4, name: "Creative Arts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        },
        {
          id: 5,
          day: "Tuesday",
          time: "09:00 - 10:00",
          subject: { id: 5, name: "Social Studies", teacher: "Mr. Kwame", duration: "1 hour" },
          classroom: "Room 102"
        },
        {
          id: 6,
          day: "Tuesday",
          time: "10:30 - 11:30",
          subject: { id: 6, name: "Physical Education", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Playground"
        },
        {
          id: 7,
          day: "Tuesday",
          time: "13:00 - 14:00",
          subject: { id: 7, name: "English", teacher: "Mrs. Brown", duration: "1 hour" },
          classroom: "Room 102"
        },
        {
          id: 8,
          day: "Wednesday",
          time: "09:00 - 10:00",
          subject: { id: 8, name: "Mathematics", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Room 102"
        },
        {
          id: 9,
          day: "Wednesday",
          time: "10:30 - 11:30",
          subject: { id: 9, name: "Science", teacher: "Ms. Johnson", duration: "1 hour" },
          classroom: "Lab 1"
        },
        {
          id: 10,
          day: "Wednesday",
          time: "13:00 - 14:00",
          subject: { id: 10, name: "ICT", teacher: "Mr. Boateng", duration: "1 hour" },
          classroom: "Computer Lab"
        },
        {
          id: 11,
          day: "Thursday",
          time: "09:00 - 10:30",
          subject: { id: 11, name: "English", teacher: "Mrs. Brown", duration: "1.5 hours" },
          classroom: "Room 102"
        },
        {
          id: 12,
          day: "Thursday",
          time: "11:00 - 12:00",
          subject: { id: 12, name: "Mathematics", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Room 102"
        },
        {
          id: 13,
          day: "Friday",
          time: "09:00 - 10:00",
          subject: { id: 13, name: "Science", teacher: "Ms. Johnson", duration: "1 hour" },
          classroom: "Lab 1"
        },
        {
          id: 14,
          day: "Friday",
          time: "10:30 - 11:30",
          subject: { id: 14, name: "Music", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Music Room"
        }
      ]
    },
    {
      id: 8,
      className: "Grade 3",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "09:00 - 10:00",
          subject: { id: 1, name: "Mathematics", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Room 103"
        },
        {
          id: 2,
          day: "Monday",
          time: "10:30 - 11:30",
          subject: { id: 2, name: "English", teacher: "Ms. Adjei", duration: "1 hour" },
          classroom: "Room 103"
        },
        {
          id: 3,
          day: "Monday",
          time: "13:00 - 14:00",
          subject: { id: 3, name: "Science", teacher: "Ms. Asante", duration: "1 hour" },
          classroom: "Lab 2"
        },
        {
          id: 4,
          day: "Monday",
          time: "14:30 - 15:30",
          subject: { id: 4, name: "ICT", teacher: "Mr. Boateng", duration: "1 hour" },
          classroom: "Computer Lab"
        },
        {
          id: 5,
          day: "Tuesday",
          time: "09:00 - 10:00",
          subject: { id: 5, name: "Social Studies", teacher: "Mr. Kwame", duration: "1 hour" },
          classroom: "Room 103"
        },
        {
          id: 6,
          day: "Tuesday",
          time: "10:30 - 11:30",
          subject: { id: 6, name: "Physical Education", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Playground"
        },
        {
          id: 7,
          day: "Tuesday",
          time: "13:00 - 14:00",
          subject: { id: 7, name: "Mathematics", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Room 103"
        },
        {
          id: 8,
          day: "Wednesday",
          time: "09:00 - 10:00",
          subject: { id: 8, name: "English", teacher: "Ms. Adjei", duration: "1 hour" },
          classroom: "Room 103"
        },
        {
          id: 9,
          day: "Wednesday",
          time: "10:30 - 11:30",
          subject: { id: 9, name: "Science", teacher: "Ms. Asante", duration: "1 hour" },
          classroom: "Lab 2"
        },
        {
          id: 10,
          day: "Wednesday",
          time: "13:00 - 14:00",
          subject: { id: 10, name: "Creative Arts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        },
        {
          id: 11,
          day: "Thursday",
          time: "09:00 - 10:00",
          subject: { id: 11, name: "Mathematics", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Room 103"
        },
        {
          id: 12,
          day: "Thursday",
          time: "10:30 - 11:30",
          subject: { id: 12, name: "English", teacher: "Ms. Adjei", duration: "1 hour" },
          classroom: "Room 103"
        },
        {
          id: 13,
          day: "Friday",
          time: "09:00 - 10:00",
          subject: { id: 13, name: "Science", teacher: "Ms. Asante", duration: "1 hour" },
          classroom: "Lab 2"
        },
        {
          id: 14,
          day: "Friday",
          time: "10:30 - 11:30",
          subject: { id: 14, name: "Music", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Music Room"
        }
      ]
    },
    {
      id: 9,
      className: "Grade 4",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "09:00 - 10:00",
          subject: { id: 1, name: "English", teacher: "Ms. Adjei", duration: "1 hour" },
          classroom: "Room 104"
        },
        {
          id: 2,
          day: "Monday",
          time: "10:30 - 11:30",
          subject: { id: 2, name: "Mathematics", teacher: "Mr. Mensah", duration: "1 hour" },
          classroom: "Room 104"
        },
        {
          id: 3,
          day: "Monday",
          time: "13:00 - 14:00",
          subject: { id: 3, name: "Science", teacher: "Ms. Asante", duration: "1 hour" },
          classroom: "Lab 2"
        },
        {
          id: 4,
          day: "Monday",
          time: "14:30 - 15:30",
          subject: { id: 4, name: "French", teacher: "Ms. Nkrumah", duration: "1 hour" },
          classroom: "Room 104"
        },
        {
          id: 5,
          day: "Tuesday",
          time: "09:00 - 10:00",
          subject: { id: 5, name: "Social Studies", teacher: "Mr. Asare", duration: "1 hour" },
          classroom: "Room 104"
        },
        {
          id: 6,
          day: "Tuesday",
          time: "10:30 - 11:30",
          subject: { id: 6, name: "Physical Education", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Playground"
        },
        {
          id: 7,
          day: "Tuesday",
          time: "13:00 - 14:00",
          subject: { id: 7, name: "English", teacher: "Ms. Adjei", duration: "1 hour" },
          classroom: "Room 104"
        },
        {
          id: 8,
          day: "Wednesday",
          time: "09:00 - 10:00",
          subject: { id: 8, name: "Mathematics", teacher: "Mr. Mensah", duration: "1 hour" },
          classroom: "Room 104"
        },
        {
          id: 9,
          day: "Wednesday",
          time: "10:30 - 11:30",
          subject: { id: 9, name: "Science", teacher: "Ms. Asante", duration: "1 hour" },
          classroom: "Lab 2"
        },
        {
          id: 10,
          day: "Wednesday",
          time: "13:00 - 14:00",
          subject: { id: 10, name: "ICT", teacher: "Mr. Boateng", duration: "1 hour" },
          classroom: "Computer Lab"
        },
        {
          id: 11,
          day: "Thursday",
          time: "09:00 - 10:00",
          subject: { id: 11, name: "English", teacher: "Ms. Adjei", duration: "1 hour" },
          classroom: "Room 104"
        },
        {
          id: 12,
          day: "Thursday",
          time: "10:30 - 11:30",
          subject: { id: 12, name: "Mathematics", teacher: "Mr. Mensah", duration: "1 hour" },
          classroom: "Room 104"
        },
        {
          id: 13,
          day: "Friday",
          time: "09:00 - 10:00",
          subject: { id: 13, name: "Science", teacher: "Ms. Asante", duration: "1 hour" },
          classroom: "Lab 2"
        },
        {
          id: 14,
          day: "Friday",
          time: "10:30 - 11:30",
          subject: { id: 14, name: "Creative Arts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        }
      ]
    },
    {
      id: 10,
      className: "Grade 5",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "09:00 - 10:30",
          subject: { id: 1, name: "Mathematics", teacher: "Mr. Mensah", duration: "1.5 hours" },
          classroom: "Room 105"
        },
        {
          id: 2,
          day: "Monday",
          time: "11:00 - 12:00",
          subject: { id: 2, name: "English", teacher: "Mrs. Appiah", duration: "1 hour" },
          classroom: "Room 105"
        },
        {
          id: 3,
          day: "Monday",
          time: "13:00 - 14:00",
          subject: { id: 3, name: "Science", teacher: "Ms. Asante", duration: "1 hour" },
          classroom: "Lab 2"
        },
        {
          id: 4,
          day: "Monday",
          time: "14:30 - 15:30",
          subject: { id: 4, name: "French", teacher: "Ms. Nkrumah", duration: "1 hour" },
          classroom: "Room 105"
        },
        {
          id: 5,
          day: "Tuesday",
          time: "09:00 - 10:00",
          subject: { id: 5, name: "Social Studies", teacher: "Mr. Asare", duration: "1 hour" },
          classroom: "Room 105"
        },
        {
          id: 6,
          day: "Tuesday",
          time: "10:30 - 11:30",
          subject: { id: 6, name: "Physical Education", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Playground"
        },
        {
          id: 7,
          day: "Tuesday",
          time: "13:00 - 14:00",
          subject: { id: 7, name: "Mathematics", teacher: "Mr. Mensah", duration: "1 hour" },
          classroom: "Room 105"
        },
        {
          id: 8,
          day: "Wednesday",
          time: "09:00 - 10:00",
          subject: { id: 8, name: "English", teacher: "Mrs. Appiah", duration: "1 hour" },
          classroom: "Room 105"
        },
        {
          id: 9,
          day: "Wednesday",
          time: "10:30 - 11:30",
          subject: { id: 9, name: "Science", teacher: "Ms. Asante", duration: "1 hour" },
          classroom: "Lab 2"
        },
        {
          id: 10,
          day: "Wednesday",
          time: "13:00 - 14:00",
          subject: { id: 10, name: "ICT", teacher: "Mr. Boateng", duration: "1 hour" },
          classroom: "Computer Lab"
        },
        {
          id: 11,
          day: "Thursday",
          time: "09:00 - 10:30",
          subject: { id: 11, name: "Mathematics", teacher: "Mr. Mensah", duration: "1.5 hours" },
          classroom: "Room 105"
        },
        {
          id: 12,
          day: "Thursday",
          time: "11:00 - 12:00",
          subject: { id: 12, name: "English", teacher: "Mrs. Appiah", duration: "1 hour" },
          classroom: "Room 105"
        },
        {
          id: 13,
          day: "Friday",
          time: "09:00 - 10:00",
          subject: { id: 13, name: "Science", teacher: "Ms. Asante", duration: "1 hour" },
          classroom: "Lab 2"
        },
        {
          id: 14,
          day: "Friday",
          time: "10:30 - 11:30",
          subject: { id: 14, name: "Creative Arts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        }
      ]
    },
    {
      id: 11,
      className: "Grade 6",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "09:00 - 10:00",
          subject: { id: 1, name: "English", teacher: "Mrs. Appiah", duration: "1 hour" },
          classroom: "Room 106"
        },
        {
          id: 2,
          day: "Monday",
          time: "10:30 - 11:30",
          subject: { id: 2, name: "Mathematics", teacher: "Mr. Owusu", duration: "1 hour" },
          classroom: "Room 106"
        },
        {
          id: 3,
          day: "Monday",
          time: "13:00 - 14:30",
          subject: { id: 3, name: "Integrated Science", teacher: "Mr. Agyeman", duration: "1.5 hours" },
          classroom: "Lab 2"
        },
        {
          id: 4,
          day: "Monday",
          time: "15:00 - 16:00",
          subject: { id: 4, name: "French", teacher: "Ms. Nkrumah", duration: "1 hour" },
          classroom: "Room 106"
        },
        {
          id: 5,
          day: "Tuesday",
          time: "09:00 - 10:00",
          subject: { id: 5, name: "Social Studies", teacher: "Mr. Asare", duration: "1 hour" },
          classroom: "Room 106"
        },
        {
          id: 6,
          day: "Tuesday",
          time: "10:30 - 11:30",
          subject: { id: 6, name: "Physical Education", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Playground"
        },
        {
          id: 7,
          day: "Tuesday",
          time: "13:00 - 14:00",
          subject: { id: 7, name: "English", teacher: "Mrs. Appiah", duration: "1 hour" },
          classroom: "Room 106"
        },
        {
          id: 8,
          day: "Wednesday",
          time: "09:00 - 10:00",
          subject: { id: 8, name: "Mathematics", teacher: "Mr. Owusu", duration: "1 hour" },
          classroom: "Room 106"
        },
        {
          id: 9,
          day: "Wednesday",
          time: "10:30 - 11:30",
          subject: { id: 9, name: "Integrated Science", teacher: "Mr. Agyeman", duration: "1 hour" },
          classroom: "Lab 2"
        },
        {
          id: 10,
          day: "Wednesday",
          time: "13:00 - 14:00",
          subject: { id: 10, name: "ICT", teacher: "Ms. Danso", duration: "1 hour" },
          classroom: "Computer Lab"
        },
        {
          id: 11,
          day: "Thursday",
          time: "09:00 - 10:00",
          subject: { id: 11, name: "English", teacher: "Mrs. Appiah", duration: "1 hour" },
          classroom: "Room 106"
        },
        {
          id: 12,
          day: "Thursday",
          time: "10:30 - 11:30",
          subject: { id: 12, name: "Mathematics", teacher: "Mr. Owusu", duration: "1 hour" },
          classroom: "Room 106"
        },
        {
          id: 13,
          day: "Friday",
          time: "09:00 - 10:00",
          subject: { id: 13, name: "Integrated Science", teacher: "Mr. Agyeman", duration: "1 hour" },
          classroom: "Lab 2"
        },
        {
          id: 14,
          day: "Friday",
          time: "10:30 - 11:30",
          subject: { id: 14, name: "Creative Arts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        }
      ]
    },
    {
      id: 12,
      className: "Grade 7",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "09:00 - 10:30",
          subject: { id: 1, name: "Mathematics", teacher: "Mr. Owusu", duration: "1.5 hours" },
          classroom: "Room 201"
        },
        {
          id: 2,
          day: "Monday",
          time: "11:00 - 12:00",
          subject: { id: 2, name: "English", teacher: "Mrs. Ampofo", duration: "1 hour" },
          classroom: "Room 201"
        },
        {
          id: 3,
          day: "Monday",
          time: "13:00 - 14:00",
          subject: { id: 3, name: "Integrated Science", teacher: "Mr. Agyeman", duration: "1 hour" },
          classroom: "Lab 3"
        },
        {
          id: 4,
          day: "Monday",
          time: "14:30 - 15:30",
          subject: { id: 4, name: "ICT", teacher: "Ms. Danso", duration: "1 hour" },
          classroom: "Computer Lab"
        },
        {
          id: 5,
          day: "Tuesday",
          time: "09:00 - 10:00",
          subject: { id: 5, name: "Social Studies", teacher: "Mr. Asare", duration: "1 hour" },
          classroom: "Room 201"
        },
        {
          id: 6,
          day: "Tuesday",
          time: "10:30 - 11:30",
          subject: { id: 6, name: "French", teacher: "Ms. Nkrumah", duration: "1 hour" },
          classroom: "Room 201"
        },
        {
          id: 7,
          day: "Tuesday",
          time: "13:00 - 14:00",
          subject: { id: 7, name: "Mathematics", teacher: "Mr. Owusu", duration: "1 hour" },
          classroom: "Room 201"
        },
        {
          id: 8,
          day: "Wednesday",
          time: "09:00 - 10:00",
          subject: { id: 8, name: "English", teacher: "Mrs. Ampofo", duration: "1 hour" },
          classroom: "Room 201"
        },
        {
          id: 9,
          day: "Wednesday",
          time: "10:30 - 11:30",
          subject: { id: 9, name: "Integrated Science", teacher: "Mr. Agyeman", duration: "1 hour" },
          classroom: "Lab 3"
        },
        {
          id: 10,
          day: "Wednesday",
          time: "13:00 - 14:00",
          subject: { id: 10, name: "Physical Education", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Playground"
        },
        {
          id: 11,
          day: "Thursday",
          time: "09:00 - 10:30",
          subject: { id: 11, name: "Mathematics", teacher: "Mr. Owusu", duration: "1.5 hours" },
          classroom: "Room 201"
        },
        {
          id: 12,
          day: "Thursday",
          time: "11:00 - 12:00",
          subject: { id: 12, name: "English", teacher: "Mrs. Ampofo", duration: "1 hour" },
          classroom: "Room 201"
        },
        {
          id: 13,
          day: "Friday",
          time: "09:00 - 10:00",
          subject: { id: 13, name: "Integrated Science", teacher: "Mr. Agyeman", duration: "1 hour" },
          classroom: "Lab 3"
        },
        {
          id: 14,
          day: "Friday",
          time: "10:30 - 11:30",
          subject: { id: 14, name: "Creative Arts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        }
      ]
    },
    {
      id: 13,
      className: "Grade 8",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "09:00 - 10:30",
          subject: { id: 1, name: "English", teacher: "Mrs. Ampofo", duration: "1.5 hours" },
          classroom: "Room 202"
        },
        {
          id: 2,
          day: "Monday",
          time: "11:00 - 12:30",
          subject: { id: 2, name: "Social Studies", teacher: "Mr. Asare", duration: "1.5 hours" },
          classroom: "Room 202"
        },
        {
          id: 3,
          day: "Monday",
          time: "13:00 - 14:00",
          subject: { id: 3, name: "Mathematics", teacher: "Mr. Ofori", duration: "1 hour" },
          classroom: "Room 202"
        },
        {
          id: 4,
          day: "Monday",
          time: "14:30 - 15:30",
          subject: { id: 4, name: "ICT", teacher: "Ms. Danso", duration: "1 hour" },
          classroom: "Computer Lab"
        },
        {
          id: 5,
          day: "Tuesday",
          time: "09:00 - 10:00",
          subject: { id: 5, name: "Integrated Science", teacher: "Ms. Agyepong", duration: "1 hour" },
          classroom: "Lab 3"
        },
        {
          id: 6,
          day: "Tuesday",
          time: "10:30 - 11:30",
          subject: { id: 6, name: "French", teacher: "Ms. Nkrumah", duration: "1 hour" },
          classroom: "Room 202"
        },
        {
          id: 7,
          day: "Tuesday",
          time: "13:00 - 14:30",
          subject: { id: 7, name: "English", teacher: "Mrs. Ampofo", duration: "1.5 hours" },
          classroom: "Room 202"
        },
        {
          id: 8,
          day: "Wednesday",
          time: "09:00 - 10:00",
          subject: { id: 8, name: "Mathematics", teacher: "Mr. Ofori", duration: "1 hour" },
          classroom: "Room 202"
        },
        {
          id: 9,
          day: "Wednesday",
          time: "10:30 - 11:30",
          subject: { id: 9, name: "Social Studies", teacher: "Mr. Asare", duration: "1 hour" },
          classroom: "Room 202"
        },
        {
          id: 10,
          day: "Wednesday",
          time: "13:00 - 14:00",
          subject: { id: 10, name: "Physical Education", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Playground"
        },
        {
          id: 11,
          day: "Thursday",
          time: "09:00 - 10:30",
          subject: { id: 11, name: "English", teacher: "Mrs. Ampofo", duration: "1.5 hours" },
          classroom: "Room 202"
        },
        {
          id: 12,
          day: "Thursday",
          time: "11:00 - 12:00",
          subject: { id: 12, name: "Mathematics", teacher: "Mr. Ofori", duration: "1 hour" },
          classroom: "Room 202"
        },
        {
          id: 13,
          day: "Friday",
          time: "09:00 - 10:00",
          subject: { id: 13, name: "Integrated Science", teacher: "Ms. Agyepong", duration: "1 hour" },
          classroom: "Lab 3"
        },
        {
          id: 14,
          day: "Friday",
          time: "10:30 - 11:30",
          subject: { id: 14, name: "Creative Arts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        }
      ]
    },
    {
      id: 14,
      className: "Grade 9",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "09:00 - 11:00",
          subject: { id: 1, name: "Mathematics", teacher: "Mr. Ofori", duration: "2 hours" },
          classroom: "Room 203"
        },
        {
          id: 2,
          day: "Monday",
          time: "11:30 - 12:30",
          subject: { id: 2, name: "English", teacher: "Mrs. Ampofo", duration: "1 hour" },
          classroom: "Room 203"
        },
        {
          id: 3,
          day: "Monday",
          time: "13:00 - 14:00",
          subject: { id: 3, name: "Integrated Science", teacher: "Ms. Agyepong", duration: "1 hour" },
          classroom: "Lab 3"
        },
        {
          id: 4,
          day: "Monday",
          time: "14:30 - 15:30",
          subject: { id: 4, name: "ICT", teacher: "Ms. Danso", duration: "1 hour" },
          classroom: "Computer Lab"
        },
        {
          id: 5,
          day: "Tuesday",
          time: "09:00 - 10:30",
          subject: { id: 5, name: "Social Studies", teacher: "Mr. Asare", duration: "1.5 hours" },
          classroom: "Room 203"
        },
        {
          id: 6,
          day: "Tuesday",
          time: "11:00 - 12:00",
          subject: { id: 6, name: "French", teacher: "Ms. Nkrumah", duration: "1 hour" },
          classroom: "Room 203"
        },
        {
          id: 7,
          day: "Tuesday",
          time: "13:00 - 14:00",
          subject: { id: 7, name: "Mathematics", teacher: "Mr. Ofori", duration: "1 hour" },
          classroom: "Room 203"
        },
        {
          id: 8,
          day: "Wednesday",
          time: "09:00 - 10:00",
          subject: { id: 8, name: "English", teacher: "Mrs. Ampofo", duration: "1 hour" },
          classroom: "Room 203"
        },
        {
          id: 9,
          day: "Wednesday",
          time: "10:30 - 11:30",
          subject: { id: 9, name: "Integrated Science", teacher: "Ms. Agyepong", duration: "1 hour" },
          classroom: "Lab 3"
        },
        {
          id: 10,
          day: "Wednesday",
          time: "13:00 - 14:00",
          subject: { id: 10, name: "Physical Education", teacher: "Mr. Osei", duration: "1 hour" },
          classroom: "Playground"
        },
        {
          id: 11,
          day: "Thursday",
          time: "09:00 - 11:00",
          subject: { id: 11, name: "Mathematics", teacher: "Mr. Ofori", duration: "2 hours" },
          classroom: "Room 203"
        },
        {
          id: 12,
          day: "Thursday",
          time: "11:30 - 12:30",
          subject: { id: 12, name: "English", teacher: "Mrs. Ampofo", duration: "1 hour" },
          classroom: "Room 203"
        },
        {
          id: 13,
          day: "Friday",
          time: "09:00 - 10:00",
          subject: { id: 13, name: "Integrated Science", teacher: "Ms. Agyepong", duration: "1 hour" },
          classroom: "Lab 3"
        },
        {
          id: 14,
          day: "Friday",
          time: "10:30 - 11:30",
          subject: { id: 14, name: "Creative Arts", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room"
        }
      ]
    },
  ];

   const initialExamTimetables = [
      
    {
      id: 1,
      className: "Creche",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "09:00 - 10:00",
          subject: { id: 1, name: "Play Skills", teacher: "Ms. Ama", duration: "1 hour" },
          classroom: "Play Room",
          invigilator: "Ms. Ama"
        },
        {
          id: 2,
          day: "Monday",
          time: "10:30 - 11:30",
          subject: { id: 2, name: "Social Interaction", teacher: "Ms. Esi", duration: "1 hour" },
          classroom: "Main Room",
          invigilator: "Ms. Esi"
        },
        {
          id: 3,
          day: "Tuesday",
          time: "09:00 - 10:00",
          subject: { id: 3, name: "Fine Motor Skills", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room",
          invigilator: "Ms. Afia"
        },
        {
          id: 4,
          day: "Tuesday",
          time: "10:30 - 11:30",
          subject: { id: 4, name: "Listening Skills", teacher: "Ms. Adwoa", duration: "1 hour" },
          classroom: "Reading Corner",
          invigilator: "Ms. Adwoa"
        },
        {
          id: 5,
          day: "Wednesday",
          time: "09:00 - 10:00",
          subject: { id: 5, name: "Gross Motor Skills", teacher: "Ms. Adwoa", duration: "1 hour" },
          classroom: "Playground",
          invigilator: "Ms. Adwoa"
        }
      ]
    },
    {
      id: 2,
      className: "Nursery 1",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "08:00 - 09:00",
          subject: { id: 1, name: "Phonics", teacher: "Ms. Akosua", duration: "1 hour" },
          classroom: "Main Room",
          invigilator: "Ms. Akosua"
        },
        {
          id: 2,
          day: "Monday",
          time: "10:00 - 11:00",
          subject: { id: 2, name: "Numbers", teacher: "Ms. Abena", duration: "1 hour" },
          classroom: "Main Room",
          invigilator: "Ms. Abena"
        },
        {
          id: 3,
          day: "Tuesday",
          time: "08:00 - 09:00",
          subject: { id: 3, name: "Story Comprehension", teacher: "Ms. Esi", duration: "1 hour" },
          classroom: "Reading Corner",
          invigilator: "Ms. Esi"
        },
        {
          id: 4,
          day: "Tuesday",
          time: "10:00 - 11:00",
          subject: { id: 4, name: "Art Skills", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Art Room",
          invigilator: "Ms. Afia"
        },
        {
          id: 5,
          day: "Wednesday",
          time: "08:00 - 09:00",
          subject: { id: 5, name: "Music Skills", teacher: "Ms. Afia", duration: "1 hour" },
          classroom: "Music Room",
          invigilator: "Ms. Afia"
        }
      ]
    },
    {
      id: 3,
      className: "Nursery 2",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "08:00 - 09:30",
          subject: { id: 1, name: "Phonics", teacher: "Ms. Akosua", duration: "1.5 hours" },
          classroom: "Main Room",
          invigilator: "Ms. Akosua"
        },
        {
          id: 2,
          day: "Monday",
          time: "10:30 - 12:00",
          subject: { id: 2, name: "Numbers", teacher: "Ms. Abena", duration: "1.5 hours" },
          classroom: "Main Room",
          invigilator: "Ms. Abena"
        },
        {
          id: 3,
          day: "Tuesday",
          time: "08:00 - 09:30",
          subject: { id: 3, name: "Story Writing", teacher: "Ms. Esi", duration: "1.5 hours" },
          classroom: "Reading Corner",
          invigilator: "Ms. Esi"
        },
        {
          id: 4,
          day: "Tuesday",
          time: "10:30 - 12:00",
          subject: { id: 4, name: "Creative Arts", teacher: "Ms. Afia", duration: "1.5 hours" },
          classroom: "Art Room",
          invigilator: "Ms. Afia"
        },
        {
          id: 5,
          day: "Wednesday",
          time: "08:00 - 09:30",
          subject: { id: 5, name: "Science Exploration", teacher: "Ms. Efia", duration: "1.5 hours" },
          classroom: "Science Corner",
          invigilator: "Ms. Efia"
        }
      ]
    },
    {
      id: 4,
      className: "KG 1",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "08:00 - 10:00",
          subject: { id: 1, name: "English", teacher: "Ms. Akua", duration: "2 hours" },
          classroom: "KG Room 1",
          invigilator: "Ms. Akua"
        },
        {
          id: 2,
          day: "Monday",
          time: "11:00 - 13:00",
          subject: { id: 2, name: "Mathematics", teacher: "Ms. Ama", duration: "2 hours" },
          classroom: "KG Room 1",
          invigilator: "Ms. Ama"
        },
        {
          id: 3,
          day: "Tuesday",
          time: "08:00 - 10:00",
          subject: { id: 3, name: "Science", teacher: "Ms. Efia", duration: "2 hours" },
          classroom: "Science Corner",
          invigilator: "Ms. Efia"
        },
        {
          id: 4,
          day: "Tuesday",
          time: "11:00 - 13:00",
          subject: { id: 4, name: "Creative Arts", teacher: "Ms. Afia", duration: "2 hours" },
          classroom: "Art Room",
          invigilator: "Ms. Afia"
        },
        {
          id: 5,
          day: "Wednesday",
          time: "08:00 - 10:00",
          subject: { id: 5, name: "Social Studies", teacher: "Mr. Kwame", duration: "2 hours" },
          classroom: "KG Room 1",
          invigilator: "Mr. Kwame"
        }
      ]
    },
    {
      id: 5,
      className: "KG 2",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "08:00 - 10:00",
          subject: { id: 1, name: "English", teacher: "Ms. Yaa", duration: "2 hours" },
          classroom: "KG Room 2",
          invigilator: "Ms. Yaa"
        },
        {
          id: 2,
          day: "Monday",
          time: "11:00 - 13:00",
          subject: { id: 2, name: "Mathematics", teacher: "Ms. Ama", duration: "2 hours" },
          classroom: "KG Room 2",
          invigilator: "Ms. Ama"
        },
        {
          id: 3,
          day: "Tuesday",
          time: "08:00 - 10:00",
          subject: { id: 3, name: "Science", teacher: "Ms. Efia", duration: "2 hours" },
          classroom: "Science Corner",
          invigilator: "Ms. Efia"
        },
        {
          id: 4,
          day: "Tuesday",
          time: "11:00 - 13:00",
          subject: { id: 4, name: "Creative Arts", teacher: "Ms. Afia", duration: "2 hours" },
          classroom: "Art Room",
          invigilator: "Ms. Afia"
        },
        {
          id: 5,
          day: "Wednesday",
          time: "08:00 - 10:00",
          subject: { id: 5, name: "Social Studies", teacher: "Mr. Kwame", duration: "2 hours" },
          classroom: "KG Room 2",
          invigilator: "Mr. Kwame"
        }
      ]
    },
    {
      id: 6,
      className: "Grade 1",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "08:00 - 10:00",
          subject: { id: 1, name: "Mathematics", teacher: "Mr. Smith", duration: "2 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Smith"
        },
        {
          id: 2,
          day: "Monday",
          time: "11:00 - 13:00",
          subject: { id: 2, name: "English", teacher: "Mrs. Brown", duration: "2 hours" },
          classroom: "Exam Hall 2",
          invigilator: "Mrs. Brown"
        },
        {
          id: 3,
          day: "Tuesday",
          time: "08:00 - 10:00",
          subject: { id: 3, name: "Science", teacher: "Ms. Johnson", duration: "2 hours" },
          classroom: "Lab 1",
          invigilator: "Ms. Johnson"
        },
        {
          id: 4,
          day: "Tuesday",
          time: "11:00 - 13:00",
          subject: { id: 4, name: "Social Studies", teacher: "Mr. Kwame", duration: "2 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Kwame"
        },
        {
          id: 5,
          day: "Wednesday",
          time: "08:00 - 10:00",
          subject: { id: 5, name: "Creative Arts", teacher: "Ms. Afia", duration: "2 hours" },
          classroom: "Art Room",
          invigilator: "Ms. Afia"
        }
      ]
    },
    {
      id: 7,
      className: "Grade 2",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "08:00 - 10:30",
          subject: { id: 1, name: "Mathematics", teacher: "Mr. Osei", duration: "2.5 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Osei"
        },
        {
          id: 2,
          day: "Monday",
          time: "11:30 - 14:00",
          subject: { id: 2, name: "English", teacher: "Mrs. Brown", duration: "2.5 hours" },
          classroom: "Exam Hall 2",
          invigilator: "Mrs. Brown"
        },
        {
          id: 3,
          day: "Tuesday",
          time: "08:00 - 10:30",
          subject: { id: 3, name: "Science", teacher: "Ms. Johnson", duration: "2.5 hours" },
          classroom: "Lab 1",
          invigilator: "Ms. Johnson"
        },
        {
          id: 4,
          day: "Tuesday",
          time: "11:30 - 14:00",
          subject: { id: 4, name: "Social Studies", teacher: "Mr. Kwame", duration: "2.5 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Kwame"
        },
        {
          id: 5,
          day: "Wednesday",
          time: "08:00 - 10:30",
          subject: { id: 5, name: "Creative Arts", teacher: "Ms. Afia", duration: "2.5 hours" },
          classroom: "Art Room",
          invigilator: "Ms. Afia"
        }
      ]
    },
    {
      id: 8,
      className: "Grade 3",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "08:00 - 10:30",
          subject: { id: 1, name: "Mathematics", teacher: "Mr. Osei", duration: "2.5 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Osei"
        },
        {
          id: 2,
          day: "Monday",
          time: "11:30 - 14:00",
          subject: { id: 2, name: "English", teacher: "Ms. Adjei", duration: "2.5 hours" },
          classroom: "Exam Hall 2",
          invigilator: "Ms. Adjei"
        },
        {
          id: 3,
          day: "Tuesday",
          time: "08:00 - 10:30",
          subject: { id: 3, name: "Science", teacher: "Ms. Asante", duration: "2.5 hours" },
          classroom: "Lab 2",
          invigilator: "Ms. Asante"
        },
        {
          id: 4,
          day: "Tuesday",
          time: "11:30 - 14:00",
          subject: { id: 4, name: "Social Studies", teacher: "Mr. Kwame", duration: "2.5 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Kwame"
        },
        {
          id: 5,
          day: "Wednesday",
          time: "08:00 - 10:30",
          subject: { id: 5, name: "ICT", teacher: "Mr. Boateng", duration: "2.5 hours" },
          classroom: "Computer Lab",
          invigilator: "Mr. Boateng"
        }
      ]
    },
    {
      id: 9,
      className: "Grade 4",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "08:00 - 11:00",
          subject: { id: 1, name: "Mathematics", teacher: "Mr. Mensah", duration: "3 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Mensah"
        },
        {
          id: 2,
          day: "Monday",
          time: "12:00 - 15:00",
          subject: { id: 2, name: "English", teacher: "Ms. Adjei", duration: "3 hours" },
          classroom: "Exam Hall 2",
          invigilator: "Ms. Adjei"
        },
        {
          id: 3,
          day: "Tuesday",
          time: "08:00 - 11:00",
          subject: { id: 3, name: "Science", teacher: "Ms. Asante", duration: "3 hours" },
          classroom: "Lab 2",
          invigilator: "Ms. Asante"
        },
        {
          id: 4,
          day: "Tuesday",
          time: "12:00 - 15:00",
          subject: { id: 4, name: "Social Studies", teacher: "Mr. Asare", duration: "3 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Asare"
        },
        {
          id: 5,
          day: "Wednesday",
          time: "08:00 - 11:00",
          subject: { id: 5, name: "French", teacher: "Ms. Nkrumah", duration: "3 hours" },
          classroom: "Exam Hall 2",
          invigilator: "Ms. Nkrumah"
        }
      ]
    },
    {
      id: 10,
      className: "Grade 5",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "08:00 - 11:00",
          subject: { id: 1, name: "Mathematics", teacher: "Mr. Mensah", duration: "3 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Mensah"
        },
        {
          id: 2,
          day: "Monday",
          time: "12:00 - 15:00",
          subject: { id: 2, name: "English", teacher: "Mrs. Appiah", duration: "3 hours" },
          classroom: "Exam Hall 2",
          invigilator: "Mrs. Appiah"
        },
        {
          id: 3,
          day: "Tuesday",
          time: "08:00 - 11:00",
          subject: { id: 3, name: "Science", teacher: "Ms. Asante", duration: "3 hours" },
          classroom: "Lab 2",
          invigilator: "Ms. Asante"
        },
        {
          id: 4,
          day: "Tuesday",
          time: "12:00 - 15:00",
          subject: { id: 4, name: "Social Studies", teacher: "Mr. Asare", duration: "3 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Asare"
        },
        {
          id: 5,
          day: "Wednesday",
          time: "08:00 - 11:00",
          subject: { id: 5, name: "French", teacher: "Ms. Nkrumah", duration: "3 hours" },
          classroom: "Exam Hall 2",
          invigilator: "Ms. Nkrumah"
        }
      ]
    },
    {
      id: 11,
      className: "Grade 6",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "08:00 - 11:00",
          subject: { id: 1, name: "Mathematics", teacher: "Mr. Owusu", duration: "3 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Owusu"
        },
        {
          id: 2,
          day: "Monday",
          time: "12:00 - 15:00",
          subject: { id: 2, name: "English", teacher: "Mrs. Appiah", duration: "3 hours" },
          classroom: "Exam Hall 2",
          invigilator: "Mrs. Appiah"
        },
        {
          id: 3,
          day: "Tuesday",
          time: "08:00 - 11:00",
          subject: { id: 3, name: "Integrated Science", teacher: "Mr. Agyeman", duration: "3 hours" },
          classroom: "Lab 2",
          invigilator: "Mr. Agyeman"
        },
        {
          id: 4,
          day: "Tuesday",
          time: "12:00 - 15:00",
          subject: { id: 4, name: "Social Studies", teacher: "Mr. Asare", duration: "3 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Asare"
        },
        {
          id: 5,
          day: "Wednesday",
          time: "08:00 - 11:00",
          subject: { id: 5, name: "French", teacher: "Ms. Nkrumah", duration: "3 hours" },
          classroom: "Exam Hall 2",
          invigilator: "Ms. Nkrumah"
        }
      ]
    },
    {
      id: 12,
      className: "Grade 7",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "08:00 - 11:00",
          subject: { id: 1, name: "Mathematics", teacher: "Mr. Owusu", duration: "3 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Owusu"
        },
        {
          id: 2,
          day: "Monday",
          time: "12:00 - 15:00",
          subject: { id: 2, name: "English", teacher: "Mrs. Ampofo", duration: "3 hours" },
          classroom: "Exam Hall 2",
          invigilator: "Mrs. Ampofo"
        },
        {
          id: 3,
          day: "Tuesday",
          time: "08:00 - 11:00",
          subject: { id: 3, name: "Integrated Science", teacher: "Mr. Agyeman", duration: "3 hours" },
          classroom: "Lab 3",
          invigilator: "Mr. Agyeman"
        },
        {
          id: 4,
          day: "Tuesday",
          time: "12:00 - 15:00",
          subject: { id: 4, name: "Social Studies", teacher: "Mr. Asare", duration: "3 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Asare"
        },
        {
          id: 5,
          day: "Wednesday",
          time: "08:00 - 11:00",
          subject: { id: 5, name: "French", teacher: "Ms. Nkrumah", duration: "3 hours" },
          classroom: "Exam Hall 2",
          invigilator: "Ms. Nkrumah"
        }
      ]
    },
    {
      id: 13,
      className: "Grade 8",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "08:00 - 11:00",
          subject: { id: 1, name: "Mathematics", teacher: "Mr. Ofori", duration: "3 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Ofori"
        },
        {
          id: 2,
          day: "Monday",
          time: "12:00 - 15:00",
          subject: { id: 2, name: "English", teacher: "Mrs. Ampofo", duration: "3 hours" },
          classroom: "Exam Hall 2",
          invigilator: "Mrs. Ampofo"
        },
        {
          id: 3,
          day: "Tuesday",
          time: "08:00 - 11:00",
          subject: { id: 3, name: "Integrated Science", teacher: "Ms. Agyepong", duration: "3 hours" },
          classroom: "Lab 3",
          invigilator: "Ms. Agyepong"
        },
        {
          id: 4,
          day: "Tuesday",
          time: "12:00 - 15:00",
          subject: { id: 4, name: "Social Studies", teacher: "Mr. Asare", duration: "3 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Asare"
        },
        {
          id: 5,
          day: "Wednesday",
          time: "08:00 - 11:00",
          subject: { id: 5, name: "French", teacher: "Ms. Nkrumah", duration: "3 hours" },
          classroom: "Exam Hall 2",
          invigilator: "Ms. Nkrumah"
        }
      ]
    },
    {
      id: 14,
      className: "Grade 9",
      timetable: [
        {
          id: 1,
          day: "Monday",
          time: "08:00 - 11:00",
          subject: { id: 1, name: "Mathematics", teacher: "Mr. Ofori", duration: "3 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Ofori"
        },
        {
          id: 2,
          day: "Monday",
          time: "12:00 - 15:00",
          subject: { id: 2, name: "English", teacher: "Mrs. Ampofo", duration: "3 hours" },
          classroom: "Exam Hall 2",
          invigilator: "Mrs. Ampofo"
        },
        {
          id: 3,
          day: "Tuesday",
          time: "08:00 - 11:00",
          subject: { id: 3, name: "Integrated Science", teacher: "Ms. Agyepong", duration: "3 hours" },
          classroom: "Lab 3",
          invigilator: "Ms. Agyepong"
        },
        {
          id: 4,
          day: "Tuesday",
          time: "12:00 - 15:00",
          subject: { id: 4, name: "Social Studies", teacher: "Mr. Asare", duration: "3 hours" },
          classroom: "Exam Hall 1",
          invigilator: "Mr. Asare"
        },
        {
          id: 5,
          day: "Wednesday",
          time: "08:00 - 11:00",
          subject: { id: 5, name: "French", teacher: "Ms. Nkrumah", duration: "3 hours" },
          classroom: "Exam Hall 2",
          invigilator: "Ms. Nkrumah"
        }
      ]
    }
  ];

   setClassTimetables(initialClassTimetables);
    setExamTimetables(initialExamTimetables);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("subject.")) {
      const subjectField = name.split(".")[1];
      setNewEntry({
        ...newEntry,
        subject: {
          ...newEntry.subject,
          [subjectField]: value
        }
      });
    } else {
      setNewEntry({
        ...newEntry,
        [name]: value
      });
    }
  };

  const handleAddOrUpdateEntry = () => {
    if (!selectedClass) return;

    const selectedTimetables = selectedTab === 0 ? classTimetables : examTimetables;
    const selectedClassIndex = selectedTimetables.findIndex(c => c.id === selectedClass);
    if (selectedClassIndex === -1) return;

    const classTimetable = selectedTimetables[selectedClassIndex];

    if (isEditing && editingId) {
      const updatedTimetable = classTimetable.timetable.map(entry => 
        entry.id === editingId ? { ...newEntry, id: editingId } : entry
      );
      
      const updatedTimetables = [...selectedTimetables];
      updatedTimetables[selectedClassIndex] = {
        ...classTimetable,
        timetable: updatedTimetable
      };

      if (selectedTab === 0) {
        setClassTimetables(updatedTimetables);
      } else {
        setExamTimetables(updatedTimetables);
      }
      setIsEditing(false);
      setEditingId(null);
    } else {
      const newId = Math.max(0, ...classTimetable.timetable.map(e => e.id)) + 1;
      const updatedTimetable = [...classTimetable.timetable, { ...newEntry, id: newId }];
      
      const updatedTimetables = [...selectedTimetables];
      updatedTimetables[selectedClassIndex] = {
        ...classTimetable,
        timetable: updatedTimetable
      };

      if (selectedTab === 0) {
        setClassTimetables(updatedTimetables);
      } else {
        setExamTimetables(updatedTimetables);
      }
    }

    setNewEntry({
      day: "",
      time: "",
      subject: { id: 0, name: "", teacher: "", duration: "" },
      classroom: "",
      invigilator: ""
    });
  };

  const handleEdit = (entryId: number) => {
    if (!selectedClass) return;

    const selectedTimetables = selectedTab === 0 ? classTimetables : examTimetables;
    const classTimetable = selectedTimetables.find(c => c.id === selectedClass);
    if (!classTimetable) return;

    const entry = classTimetable.timetable.find(e => e.id === entryId);
    if (!entry) return;

    setNewEntry(entry);
    setIsEditing(true);
    setEditingId(entryId);
  };

  const handleDelete = (entryId: number) => {
    if (!selectedClass) return;

    if (selectedTab === 0) {
      const updatedClassTimetables = classTimetables.map(classTimetable => {
        if (classTimetable.id === selectedClass) {
          return {
            ...classTimetable,
            timetable: classTimetable.timetable.filter(entry => entry.id !== entryId)
          };
        }
        return classTimetable;
      });
      setClassTimetables(updatedClassTimetables);
    } else {
      const updatedExamTimetables = examTimetables.map(examTimetable => {
        if (examTimetable.id === selectedClass) {
          return {
            ...examTimetable,
            timetable: examTimetable.timetable.filter(entry => entry.id !== entryId)
          };
        }
        return examTimetable;
      });
      setExamTimetables(updatedExamTimetables);
    }
  };

  const toggleViewAllGrades = async () => {
    setIsViewAllLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setViewAllGrades(!viewAllGrades);
    setSearchClicked(false);
    if (!viewAllGrades) {
      setSelectedClass(null);
    }
    setIsViewAllLoading(false);
  };

  const handleSearch = async () => {
    if (selectedClass) {
      setIsSearching(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setSearchClicked(true);
      setIsSearching(false);
    }
  };

  const selectedTimetableData = searchClicked && selectedClass 
    ? (selectedTab === 0 ? classTimetables : examTimetables).find(c => c.id === selectedClass)?.timetable || [] 
    : [];

  return (
    <ProtectedRoute>
      <div className="p-5 bg-green-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-green-800">Timetable Management</h1>
        
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-4 mb-6 border-b border-green-200">
            <Tab
              className={({ selected }) =>
                `px-4 py-2 text-sm font-medium rounded-t-lg ${
                  selected
                    ? 'bg-green-600 text-white'
                    : 'text-green-700 hover:text-green-800'
                }`
              }
            >
              Class Timetable
            </Tab>
            <Tab
              className={({ selected }) =>
                `px-4 py-2 text-sm font-medium rounded-t-lg ${
                  selected
                    ? 'bg-green-600 text-white'
                    : 'text-green-700 hover:text-green-800'
                }`
              }
            >
              Exams Timetable
            </Tab>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-green-700">Select Class</label>
                    <select
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={selectedClass || ""}
                      onChange={(e) => {
                        setSelectedClass(Number(e.target.value));
                        setViewAllGrades(false);
                        setSearchClicked(false);
                      }}
                      disabled={viewAllGrades || isViewAllLoading}
                    >
                      <option value="">Select a class</option>
                      <option value="1">Creche</option>
                      <option value="2">Nursery 1</option>
                      <option value="3">Nursery 2</option>
                      <option value="4">KG 1</option>
                      <option value="5">KG 2</option>
                      {[...Array(9).keys()].map((grade) => (
                        <option key={grade + 6} value={grade + 6}>
                          Grade {grade + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleSearch}
                      className={`px-4 py-2 text-white rounded w-full flex items-center justify-center ${
                        !selectedClass || viewAllGrades || isSearching
                          ? 'bg-green-300 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      } transition-colors`}
                      disabled={!selectedClass || viewAllGrades || isSearching}
                    >
                      {isSearching ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Searching...
                        </>
                      ) : (
                        "Search"
                      )}
                    </button>
                  </div>
                  <div className="flex items-end justify-end">
                    <button
                      onClick={toggleViewAllGrades}
                      className={`px-4 py-2 text-white rounded w-full flex items-center justify-center ${
                        isViewAllLoading
                          ? 'bg-green-300 cursor-not-allowed'
                          : viewAllGrades
                          ? 'bg-green-700 hover:bg-green-800'
                          : 'bg-green-600 hover:bg-green-700'
                      } transition-colors`}
                      disabled={isViewAllLoading}
                    >
                      {isViewAllLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </>
                      ) : viewAllGrades ? (
                        "View Single Grade"
                      ) : (
                        "View All Grades"
                      )}
                    </button>
                  </div>
                </div>

                {selectedClass && !viewAllGrades && (
                  <>
                    <h2 className="text-xl font-semibold mb-4 text-green-800">{isEditing ? "Edit Timetable Entry" : "Add Timetable Entry"}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-green-700">Day</label>
                        <select
                          name="day"
                          value={newEntry.day}
                          onChange={handleChange}
                          className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select Day</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-green-700">Time</label>
                        <input
                          type="text"
                          name="time"
                          placeholder="e.g. 08:00 - 09:00"
                          value={newEntry.time}
                          onChange={handleChange}
                          className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-green-700">Subject Name</label>
                        <input
                          type="text"
                          name="subject.name"
                          placeholder="Subject name"
                          value={newEntry.subject.name}
                          onChange={handleChange}
                          className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-green-700">Teacher</label>
                        <input
                          type="text"
                          name="subject.teacher"
                          placeholder="Teacher name"
                          value={newEntry.subject.teacher}
                          onChange={handleChange}
                          className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-green-700">Duration</label>
                        <input
                          type="text"
                          name="subject.duration"
                          placeholder="e.g. 1 hour"
                          value={newEntry.subject.duration}
                          onChange={handleChange}
                          className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-green-700">Classroom</label>
                        <input
                          type="text"
                          name="classroom"
                          placeholder="Room number"
                          value={newEntry.classroom}
                          onChange={handleChange}
                          className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    
                    <button
                      className={`mt-6 px-4 py-2 text-white rounded hover:bg-green-700 flex items-center justify-center ${
                        !newEntry.day || !newEntry.time || !newEntry.subject.name || !newEntry.subject.teacher || !newEntry.subject.duration || !newEntry.classroom
                          ? 'bg-green-300 cursor-not-allowed'
                          : 'bg-green-600'
                      } transition-colors`}
                      onClick={handleAddOrUpdateEntry}
                      disabled={!newEntry.day || !newEntry.time || !newEntry.subject.name || !newEntry.subject.teacher || !newEntry.subject.duration || !newEntry.classroom}
                    >
                      {isEditing ? "Update Entry" : "Add Entry"}
                    </button>
                  </>
                )}
              </div>

              {viewAllGrades ? (
                <div className="space-y-6">
                  {classTimetables.map((classTimetable) => {
                    const timetableByDay: Record<string, TimetableEntry[]> = {};
                    classTimetable.timetable.forEach((entry) => {
                      if (!timetableByDay[entry.day]) {
                        timetableByDay[entry.day] = [];
                      }
                      timetableByDay[entry.day].push(entry);
                    });

                    return (
                      <div key={classTimetable.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-green-200">
                        <h2 className="text-xl font-semibold p-4 border-b bg-green-100 text-green-800">
                          Timetable for {classTimetable.className}
                        </h2>
                        {classTimetable.timetable.length === 0 ? (
                          <div className="p-4 text-center text-green-700">
                            No timetable entries available for this class.
                          </div>
                        ) : (
                          <div>
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
                              const dayEntries = timetableByDay[day] || [];
                              if (dayEntries.length === 0) return null;

                              return (
                                <div key={day} className="mb-6">
                                  <h3 className="text-lg font-medium p-2 bg-green-50 text-green-800">{day}</h3>
                                  <table className="min-w-full divide-y divide-green-200">
                                    <thead className="bg-green-100">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Time</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Subject</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Teacher</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Duration</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Classroom</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-green-200">
                                      {dayEntries.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-green-50">
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">{entry.time}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">{entry.subject.name}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">{entry.subject.teacher}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">{entry.subject.duration}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">{entry.classroom}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : selectedClass && searchClicked ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-green-200">
                  <h2 className="text-xl font-semibold p-4 border-b bg-green-100 text-green-800">
                    Timetable for {classTimetables.find(c => c.id === selectedClass)?.className}
                  </h2>
                  
                  {selectedTimetableData.length === 0 ? (
                    <div className="p-4 text-center text-green-700">
                      No timetable entries available for this class.
                    </div>
                  ) : (
                    <div>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
                        const dayEntries = selectedTimetableData.filter(entry => entry.day === day);
                        if (dayEntries.length === 0) return null;
                        
                        return (
                          <div key={day} className="mt-6">
                            <h3 className="text-lg font-medium p-2 bg-green-50 text-green-800">{day}</h3>
                            <table className="min-w-full divide-y divide-green-200">
                              <thead className="bg-green-100">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Time</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Subject</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Teacher</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Duration</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Classroom</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-green-200">
                                {dayEntries.map((entry) => (
                                  <tr key={entry.id} className="hover:bg-green-50">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-700">{entry.time}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-700">{entry.subject.name}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-700">{entry.subject.teacher}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-700">{entry.subject.duration}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-700">{entry.classroom}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() => handleEdit(entry.id)}
                                          className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition-colors"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDelete(entry.id)}
                                          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-4 text-center text-green-700 border border-green-200">
                  {selectedClass && !searchClicked 
                    ? "Please click the Search button to view the timetable" 
                    : "Please select a class or click 'View All Grades' to see timetables"}
                </div>
              )}
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-green-700">Select Class</label>
                    <select
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={selectedClass || ""}
                      onChange={(e) => {
                        setSelectedClass(Number(e.target.value));
                        setViewAllGrades(false);
                        setSearchClicked(false);
                      }}
                      disabled={viewAllGrades || isViewAllLoading}
                    >
                      <option value="">Select a class</option>
                      <option value="1">Creche</option>
                      <option value="2">Nursery 1</option>
                      <option value="3">Nursery 2</option>
                      <option value="4">KG 1</option>
                      <option value="5">KG 2</option>
                      {[...Array(9).keys()].map((grade) => (
                        <option key={grade + 6} value={grade + 6}>
                          Grade {grade + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleSearch}
                      className={`px-4 py-2 text-white rounded w-full flex items-center justify-center ${
                        !selectedClass || viewAllGrades || isSearching
                          ? 'bg-green-300 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      } transition-colors`}
                      disabled={!selectedClass || viewAllGrades || isSearching}
                    >
                      {isSearching ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Searching...
                        </>
                      ) : (
                        "Search"
                      )}
                    </button>
                  </div>
                  <div className="flex items-end justify-end">
                    <button
                      onClick={toggleViewAllGrades}
                      className={`px-4 py-2 text-white rounded w-full flex items-center justify-center ${
                        isViewAllLoading
                          ? 'bg-green-300 cursor-not-allowed'
                          : viewAllGrades
                          ? 'bg-green-700 hover:bg-green-800'
                          : 'bg-green-600 hover:bg-green-700'
                      } transition-colors`}
                      disabled={isViewAllLoading}
                    >
                      {isViewAllLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </>
                      ) : viewAllGrades ? (
                        "View Single Grade"
                      ) : (
                        "View All Grades"
                      )}
                    </button>
                  </div>
                </div>

                {selectedClass && !viewAllGrades && (
                  <>
                    <h2 className="text-xl font-semibold mb-4 text-green-800">{isEditing ? "Edit Exam Entry" : "Add Exam Entry"}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-green-700">Day</label>
                        <select
                          name="day"
                          value={newEntry.day}
                          onChange={handleChange}
                          className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select Day</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-green-700">Time</label>
                        <input
                          type="text"
                          name="time"
                          placeholder="e.g. 08:00 - 10:00"
                          value={newEntry.time}
                          onChange={handleChange}
                          className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-green-700">Subject Name</label>
                        <input
                          type="text"
                          name="subject.name"
                          placeholder="Subject name"
                          value={newEntry.subject.name}
                          onChange={handleChange}
                          className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-green-700">Duration</label>
                        <input
                          type="text"
                          name="subject.duration"
                          placeholder="e.g. 2 hours"
                          value={newEntry.subject.duration}
                          onChange={handleChange}
                          className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-green-700">Classroom</label>
                        <input
                          type="text"
                          name="classroom"
                          placeholder="Exam location"
                          value={newEntry.classroom}
                          onChange={handleChange}
                          className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-green-700">Invigilator</label>
                        <input
                          type="text"
                          name="invigilator"
                          placeholder="Invigilator name"
                          value={newEntry.invigilator || ""}
                          onChange={handleChange}
                          className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    
                    <button
                      className={`mt-6 px-4 py-2 text-white rounded hover:bg-green-700 flex items-center justify-center ${
                        !newEntry.day || !newEntry.time || !newEntry.subject.name || !newEntry.classroom || !newEntry.invigilator || !newEntry.subject.duration
                          ? 'bg-green-300 cursor-not-allowed'
                          : 'bg-green-600'
                      } transition-colors`}
                      onClick={handleAddOrUpdateEntry}
                      disabled={!newEntry.day || !newEntry.time || !newEntry.subject.name || !newEntry.classroom || !newEntry.invigilator || !newEntry.subject.duration}
                    >
                      {isEditing ? "Update Entry" : "Add Entry"}
                    </button>
                  </>
                )}
              </div>

              {viewAllGrades ? (
                <div className="space-y-6">
                  {examTimetables.map((examTimetable) => {
                    const timetableByDay: Record<string, TimetableEntry[]> = {};
                    examTimetable.timetable.forEach((entry) => {
                      if (!timetableByDay[entry.day]) {
                        timetableByDay[entry.day] = [];
                      }
                      timetableByDay[entry.day].push(entry);
                    });

                    return (
                      <div key={examTimetable.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-green-200">
                        <h2 className="text-xl font-semibold p-4 border-b bg-green-100 text-green-800">
                          Exam Timetable for {examTimetable.className}
                        </h2>
                        {examTimetable.timetable.length === 0 ? (
                          <div className="p-4 text-center text-green-700">
                            No exam timetable entries available for this class.
                          </div>
                        ) : (
                          <div>
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
                              const dayEntries = timetableByDay[day] || [];
                              if (dayEntries.length === 0) return null;

                              return (
                                <div key={day} className="mb-6">
                                  <h3 className="text-lg font-medium p-2 bg-green-50 text-green-800">{day}</h3>
                                  <table className="min-w-full divide-y divide-green-200">
                                    <thead className="bg-green-100">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Time</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Subject</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Duration</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Classroom</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Invigilator</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-green-200">
                                      {dayEntries.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-green-50">
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">{entry.time}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">{entry.subject.name}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">{entry.subject.duration}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">{entry.classroom}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">{entry.invigilator}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : selectedClass && searchClicked ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-green-200">
                  <h2 className="text-xl font-semibold p-4 border-b bg-green-100 text-green-800">
                    Exam Timetable for {examTimetables.find(c => c.id === selectedClass)?.className}
                  </h2>
                  
                  {selectedTimetableData.length === 0 ? (
                    <div className="p-4 text-center text-green-700">
                      No exam timetable entries available for this class.
                    </div>
                  ) : (
                    <div>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
                        const dayEntries = selectedTimetableData.filter(entry => entry.day === day);
                        if (dayEntries.length === 0) return null;
                        
                        return (
                          <div key={day} className="mt-6">
                            <h3 className="text-lg font-medium p-2 bg-green-50 text-green-800">{day}</h3>
                            <table className="min-w-full divide-y divide-green-200">
                              <thead className="bg-green-100">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Time</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Subject</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Duration</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Classroom</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Invigilator</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-green-200">
                                {dayEntries.map((entry) => (
                                  <tr key={entry.id} className="hover:bg-green-50">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-700">{entry.time}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-700">{entry.subject.name}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-700">{entry.subject.duration}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-700">{entry.classroom}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-700">{entry.invigilator}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() => handleEdit(entry.id)}
                                          className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition-colors"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDelete(entry.id)}
                                          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-4 text-center text-green-700 border border-green-200">
                  {selectedClass && !searchClicked 
                    ? "Please click the Search button to view the exam timetable" 
                    : "Please select a class or click 'View All Grades' to see exam timetables"}
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </ProtectedRoute>
  );
}