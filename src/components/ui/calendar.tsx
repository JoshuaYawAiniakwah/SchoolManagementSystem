"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CustomCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg flex justify-center">
      <Calendar
        onChange={setDate}
        value={date}
        className="border-none"
        tileClassName={({ date, view }) =>
          view === "month" && date.toDateString() === new Date().toDateString()
            ? "bg-blue-500 text-white rounded-md"
            : ""
        }
      />
    </div>
  );
}
