"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
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

  // Sample Data for Charts (Moved back inside the component)
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
      {/* Header with Admin and School Logo */}
      <div className="flex justify-between items-center mb-6">
        <div></div> {/* Empty div to maintain space */}
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-semibold">Admin</span>
          <img 
            src="/OAIS NEW LOGO.png" // Replace with your actual image path
            alt="School Logo" 
            className="h-32 w-auto" // Adjust height as needed
          />
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