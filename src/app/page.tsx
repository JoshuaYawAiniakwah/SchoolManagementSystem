// app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // Check if the user is logged in
  const isLoggedIn = false; // Replace with your authentication logic

  if (!isLoggedIn) {
    redirect("/login"); // Redirect to the login page
  }

  return null; // This page does not render anything
}