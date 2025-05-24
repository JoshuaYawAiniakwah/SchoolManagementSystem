"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  
  // Student data state
  const [studentsData, setStudentsData] = useState({
    total: 0,
    male: 0,
    female: 0
  });
  
  // Teacher data state
  const [teachersData, setTeachersData] = useState({
    total: 0
  });

  // Events data state
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  
  // Loading states
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [error, setError] = useState(null);

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoadingStudents(true);
        const response = await fetch(
          "https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/students/approved"
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch students: ${response.status}`);
        }
        
        const data = await response.json();
        
        const totalStudents = data.length;
        const maleCount = data.filter((student) => 
          student.gender && student.gender.toLowerCase() === 'male'
        ).length;
        const femaleCount = data.filter((student) => 
          student.gender && student.gender.toLowerCase() === 'female'
        ).length;
        
        setStudentsData({
          total: totalStudents,
          male: maleCount,
          female: femaleCount
        });
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError(err.message || "Failed to fetch student data");
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudentData();
  }, []);

  // Fetch teacher data
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoadingTeachers(true);
        const response = await fetch(
          "https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/teachers/all",
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
              "Content-Type": "application/json"
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch teachers: ${response.status}`);
        }
        
        const data = await response.json();
        
        setTeachersData({
          total: data.length
        });
      } catch (err) {
        console.error("Error fetching teacher data:", err);
        setError(err.message || "Failed to fetch teacher data");
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeacherData();
  }, []);

  // Format event time for display
  const formatEventTime = (eventTime) => {
    if (!eventTime) return "No date set";
    
    try {
      const date = new Date(eventTime);
      if (isNaN(date.getTime())) return eventTime;
      
      return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return eventTime;
    }
  };

  // Fetch upcoming events with image handling
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const response = await fetch(
          "https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/events/upcoming",
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }
        
        const data = await response.json();
        setEvents(data.map(event => ({
          ...event,
          // Construct full image URL
          imageUrl: event.imageUrl 
            ? `https://xpnnkh6h-8082.uks1.devtunnels.ms${event.imageUrl}`
            : null,
          formattedTime: formatEventTime(event.eventTime || event.time)
        })));
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message || "Failed to fetch events");
      } finally {
        setLoadingEvents(false);
      }
    };
    
    fetchEvents();
  }, []);

  // Student Gender Data for Pie Chart
  const studentGenderData = [
    { name: "Boys", value: studentsData.male, color: "#4CAF50" },
    { name: "Girls", value: studentsData.female, color: "#81C784" },
  ];

  // Attendance Data (sample)
  const attendanceData = [
    { day: "Mon", present: 50, absent: 30 },
    { day: "Tue", present: 70, absent: 40 },
    { day: "Wed", present: 90, absent: 80 },
    { day: "Thu", present: 65, absent: 60 },
    { day: "Fri", present: 55, absent: 50 },
  ];

  // Finance Data (sample)
  const financeData = [
    { month: "Jan", income: 2000 },
    { month: "Feb", income: 2500 },
    { month: "Mar", income: 2800 },
    { month: "Apr", income: 3000 },
    { month: "May", income: 3200 },
    { month: "Jun", income: 3600 },
  ];

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span className="ml-2">Loading...</span>
    </div>
  );

  // Format event description with line breaks
  const formatEventDescription = (description) => {
    if (!description) return null;
    return description.split('\n').map((paragraph, i) => (
      <p key={i} className="mb-2">{paragraph}</p>
    ));
  };

  return (
    <ProtectedRoute>
      <div className="p-6 bg-green-50 min-h-screen">
        {/* Header with Styled Slogan, Admin and School Logo */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-3xl font-bold italic text-green-700 tracking-wide">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">
              QUINTESSENCE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-green-800 font-semibold">Admin</span>
            <img 
              src="/OAIS NEW LOGO.png"
              alt="School Logo" 
              className="h-32 w-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-school-logo.png";
              }}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Students Card */}
          <div className="p-4 bg-green-200 rounded-lg shadow-md border border-green-300">
            <p className="text-lg font-semibold text-green-800">
              {loadingStudents ? <LoadingSpinner /> : studentsData.total.toLocaleString()}
            </p>
            <p className="text-green-700">Students</p>
          </div>
          
          {/* Teachers Card */}
          <div className="p-4 bg-green-300 rounded-lg shadow-md border border-green-300">
            <p className="text-lg font-semibold text-green-800">
              {loadingTeachers ? <LoadingSpinner /> : teachersData.total.toLocaleString()}
            </p>
            <p className="text-green-700">Teachers</p>
          </div>
          
          {/* Parents Card */}
          <div className="p-4 bg-green-200 rounded-lg shadow-md border border-green-300">
            <p className="text-lg font-semibold text-green-800">960</p>
            <p className="text-green-700">Parents</p>
          </div>
          
          {/* Staff Card */}
          <div className="p-4 bg-green-300 rounded-lg shadow-md border border-green-300">
            <p className="text-lg font-semibold text-green-800">30</p>
            <p className="text-green-700">Staff</p>
          </div>
        </div>

        {/* Error Message */}
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

        {/* Main Content */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Data Visualizations */}
          <div>
            {/* Student Gender Chart */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-green-200">
              <h2 className="text-lg font-semibold mb-2 text-green-800">Students</h2>
              {loadingStudents ? (
                <div className="h-[200px] flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="w-1/2">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={studentGenderData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {studentGenderData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => [
                            value, 
                            `${name}: ${((props.payload.percent || 0) * 100).toFixed(1)}%`
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 pl-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-800">
                          Boys: {loadingStudents ? '...' : studentsData.male}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-300 rounded-full mr-2"></div>
                        <span className="text-green-800">
                          Girls: {loadingStudents ? '...' : studentsData.female}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Attendance Chart */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-green-200">
              <h2 className="text-lg font-semibold mb-2 text-green-800">Attendance</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={attendanceData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#4CAF50" name="Present" />
                  <Bar dataKey="absent" fill="#81C784" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column - Events and Finance */}
          <div className="flex flex-col">
            {/* Finance Chart */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-green-200">
              <h2 className="text-lg font-semibold mb-2 text-green-800">Finance</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={financeData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#2E7D32"
                    name="Income"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Events Section - Twitter-like feed */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-green-200 mt-6 flex-1">
              <h2 className="text-lg font-semibold mb-4 text-green-800">Upcoming Events</h2>
              
              {/* Scrollable events container */}
              <div className="overflow-y-auto max-h-[400px] pr-2">
                {loadingEvents ? (
                  <div className="flex items-center justify-center h-32">
                    <LoadingSpinner />
                  </div>
                ) : events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="p-4 border-b border-gray-200 last:border-0">
                        {/* Event header with time */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-bold text-green-800">School Event</h3>
                              <p className="text-gray-500 text-sm">@{event.formattedTime}</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{event.formattedTime}</span>
                        </div>
                        
                        {/* Event content */}
                        <div className="pl-12">
                          <h4 className="text-xl font-semibold text-green-700 mb-2">{event.title}</h4>
                          <div className="text-gray-800 mb-3">
                            {formatEventDescription(event.description)}
                          </div>
                          
                          {/* Event image if available */}
                          {event.imageUrl && (
                            <div className="mb-3 rounded-lg overflow-hidden border border-gray-200">
                              <img 
                                src={event.imageUrl} 
                                alt={event.title} 
                                className="w-full h-auto object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/placeholder-event.jpg";
                                }}
                              />
                            </div>
                          )}
                          
                          {/* Event actions */}
                          <div className="flex space-x-4 text-gray-500 text-sm">
                            <button className="flex items-center space-x-1 hover:text-green-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                              <span>Details</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-green-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span>Share</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-green-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                              <span>Save</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No upcoming events found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}