"use client";
import React from "react";
import "@/globals.css";
import Menu from "../components/Menu";
import { AuthProvider } from "@/context/AuthContext";
import { EventsProvider } from "@/context/EventsContext"; // Import EventsProvider

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex">
        <AuthProvider>
          <EventsProvider> {/* Wrap with EventsProvider */}
            <Menu />
            <main className="flex-1 p-4">
              {children}
            </main>
          </EventsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}