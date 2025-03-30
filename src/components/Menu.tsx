"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react"; // Added useState and useEffect

export default function Menu() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [pendingCount, setPendingCount] = useState(0); // Added for notification count

  // Added useEffect to fetch pending applications count
  useEffect(() => {
    if (isAuthenticated) {
      const fetchPendingCount = async () => {
        try {
          const response = await fetch(
            'https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/admissions/status?status=PENDING'
          );
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
              setPendingCount(data.length);
            }
          }
        } catch (error) {
          console.error('Error fetching pending applications:', error);
        }
      };
      
      fetchPendingCount();
      const interval = setInterval(fetchPendingCount, 3000000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { 
      name: "Applications", 
      path: "/applications",
      notificationCount: pendingCount // Added notification count
    },
    { name: "Communication Portal", path: "/communication" },
    { name: "Fee Management", path: "/fee-management" },
    { name: "Attendance & Grades", path: "/attendance" },
    { name: "Teacher Profiles", path: "/teacher-profile" },
    { name: "Student Profile Management", path: "/student-profile" },
    { name: "Timetable Section", path: "/timetable-management" },
    { name: "Parental Involvement", path: "/parental-involvement" },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <nav className="p-4 bg-[#0074ff] text-white fixed top-0 left-0 h-full w-64 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path} className="relative"> {/* Added relative positioning */}
              <Link
                href={item.path}
                className={`block px-4 py-2 rounded-lg transition duration-200 ${
                  pathname === item.path
                    ? "bg-[#005bb5] text-white font-semibold"
                    : "text-white hover:bg-[#005bb5] hover:text-white"
                }`}
              >
                {item.name}
                {/* Added notification badge */}
                {item.notificationCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full -translate-y-1/2 translate-x-1/2">
                    {item.notificationCount}
                  </span>
                )}
              </Link>
            </li>
          ))}

          {!isAuthenticated ? (
            <>
              <li>
                <Link href="/signup" className="block px-4 py-2 rounded-lg text-white hover:bg-[#005bb5] hover:text-white">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/login" className="block px-4 py-2 rounded-lg text-white hover:bg-[#005bb5] hover:text-white">
                  Login
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>

      <main className="flex-1 p-6 ml-64 min-h-screen">
        {/* Add your main content here */}
      </main>
    </div>
  );
}