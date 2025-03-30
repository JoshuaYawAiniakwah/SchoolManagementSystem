"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Adjust the path as needed

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth(); // Use authentication state from context
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login"); // Redirect to login if not authenticated
    } else if (!isLoading) {
      setIsCheckingAuth(false); // Allow access if authenticated
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isCheckingAuth) {
    return <div>Loading...</div>; // Loading state while checking authentication
  }

  if (!isAuthenticated) {
    return null; // Do not render children if not authenticated
  }

  return <>{children}</>; // Render children if authenticated
}