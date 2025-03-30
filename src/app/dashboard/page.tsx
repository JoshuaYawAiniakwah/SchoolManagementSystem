"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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

const Dashboard = ({ events }) => {
  const [date, setDate] = useState(new Date());
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [avatarSettings, setAvatarSettings] = useState({
    name: "Guest",
    color: "#FF0000",
  });

  // Initialize from localStorage or auth user
  useEffect(() => {
    const savedSettings = localStorage.getItem("avatarSettings");
    if (savedSettings) {
      setAvatarSettings(JSON.parse(savedSettings));
    } else if (user?.username) {
      setAvatarSettings({
        name: user.username,
        color: generateColorFromName(user.username),
      });
    }
  }, [user]);

  // Generate consistent color from name
  const generateColorFromName = (name) => {
    const hash = name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return `hsl(${Math.abs(hash % 360)}, 70%, 50%)`;
  };

  // Get initials (supports multiple names)
  const getInitials = (name) => {
    if (!name) return "G";
    const names = name.trim().split(/\s+/);
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

  const handleAvatarClick = () => {
    setIsEditing(true);
    setTempName(avatarSettings.name);
  };

  const handleSave = () => {
    const newName = tempName.trim();
    if (!newName) return;

    const newSettings = {
      name: newName,
      color: avatarSettings.color, // Keep current color unless changed
    };

    localStorage.setItem("avatarSettings", JSON.stringify(newSettings));
    setAvatarSettings(newSettings);
    setIsEditing(false);
  };

  const handleColorChange = (e) => {
    const newSettings = {
      ...avatarSettings,
      color: e.target.value,
    };
    localStorage.setItem("avatarSettings", JSON.stringify(newSettings));
    setAvatarSettings(newSettings);
  };

  // Sample Data for Charts
  const studentGenderData = [
    { name: "Boys", value: 1234, color: "#FFCC00" },
    { name: "Girls", value: 1134, color: "#C0E0FF" },
  ];

  const attendanceData = [
    { day: "Mon", present: 50, absent: 30 },
    { day: "Tue", present: 70, absent: 40 },
    { day: "Wed", present: 90, absent: 80 },
    { day: "Thu", present: 65, absent: 60 },
    { day: "Fri", present: 55, absent: 50 },
  ];

  const financeData = [
    { month: "Jan", income: 2000 },
    { month: "Feb", income: 2500 },
    { month: "Mar", income: 2800 },
    { month: "Apr", income: 3000 },
    { month: "May", income: 3200 },
    { month: "Jun", income: 3600 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header with Editable Avatar */}
      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  placeholder="Enter your name"
                />
                <input
                  type="color"
                  value={avatarSettings.color}
                  onChange={handleColorChange}
                  className="w-8 h-8 cursor-pointer rounded-full border"
                  title="Choose color"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <span className="text-gray-700 font-semibold">{avatarSettings.name}</span>
              <div
                className="w-10 h-10 text-white flex items-center justify-center rounded-full cursor-pointer hover:opacity-80 transition select-none"
                style={{ backgroundColor: avatarSettings.color }}
                onClick={handleAvatarClick}
                title="Click to edit name and color"
              >
                {getInitials(avatarSettings.name)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { title: "Students", value: "1,218", color: "bg-purple-300" },
          { title: "Teachers", value: "124", color: "bg-yellow-300" },
          { title: "Parents", value: "960", color: "bg-purple-300" },
          { title: "Staffs", value: "30", color: "bg-yellow-300" },
        ].map((stat, index) => (
          <div key={index} className={`p-4 ${stat.color} rounded-lg shadow-md`}>
            <p className="text-lg font-semibold">{stat.value}</p>
            <p className="text-gray-700">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Students & Attendance */}
        <div className="col-span-2">
          {/* Student Gender Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-2">Students</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={studentGenderData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {studentGenderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Attendance</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={attendanceData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#FFD700" name="Present" />
                <Bar dataKey="absent" fill="#87CEEB" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calendar & Events */}
        <div>
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-2">📅 Calendar</h2>
            <Calendar onChange={setDate} value={date} />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Events</h2>
            {events &&
              events.map((event, index) => (
                <div key={index} className="border-b py-2">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.time}</p>
                  <p className="text-sm">{event.description}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Finance Chart */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Finance</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={financeData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#00BFFF"
              name="Income"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function ProtectedDashboard({ events }) {
  return (
    <ProtectedRoute>
      <Dashboard events={events} />
    </ProtectedRoute>
  );
}