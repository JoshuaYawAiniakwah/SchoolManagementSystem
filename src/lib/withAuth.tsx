"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function withAuth(Component: any) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    }, [router]);

    if (isLoading) return <p>Loading...</p>;

    return <Component {...props} />;
  };
}
