// src/context/EventsContext.tsx
import React, { createContext, useContext, useState } from "react";

const EventsContext = createContext(null);

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([
    { id: 1, title: "Summer Camp Trip", time: "12:00 PM - 3:00 PM", description: "Outdoor activities and games for all students." },
    { id: 2, title: "Music Concert", time: "12:00 PM - 3:00 PM", description: "Cluster music concert for all students and teachers." },
    { id: 3, title: "Science Fair", time: "10:00 AM - 2:00 PM", description: "Showcase of student science projects." },
  ]);

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => useContext(EventsContext);