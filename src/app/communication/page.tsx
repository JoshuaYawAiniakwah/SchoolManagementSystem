"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

function CommunicationPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Initialize events state
  const [events, setEvents] = useState([]);

  // State for adding a new event
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    description: "",
  });

  // State for editing an event
  const [editingEvent, setEditingEvent] = useState(null);

  // State for parent messages
  const [parentMessages, setParentMessages] = useState([
    { id: 1, from: "Parent 1", message: "Hello, how is my child doing?" },
    { id: 2, from: "Parent 2", message: "When is the next parent-teacher meeting?" },
  ]);

  // State for replying to a parent message
  const [reply, setReply] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  // Updated Options for Recipient
  const options = [
    "All",
    "Teachers",
    "Specific Teacher",
    "All Students",
    "Specific Student",
    "Lower Primary (Grade 1 - Grade 3)",
    "Upper Primary (Grade 4 - Grade 6)",
    "Senior Level (Grade 7 - Grade 9)",
    "Specific Grade"
  ];

  // Search Function (Triggered by Button Click)
  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setFilteredResults([]);
      return;
    }

    setIsSearching(true);
    setFilteredResults([]);

    try {
      let response;
      if (selectedRecipient === "Specific Student") {
        response = await fetch(`https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/students/search?name=${encodeURIComponent(searchQuery)}`);
      } else if (selectedRecipient === "Specific Teacher") {
        response = await fetch(`https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/teachers/search?name=${encodeURIComponent(searchQuery)}`);
      } else if (selectedRecipient === "Specific Grade") {
        response = await fetch(`https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/students/grade?grade=${encodeURIComponent(searchQuery)}`);
      }

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      setFilteredResults(data);
      setSelectedResult(null);
    } catch (error) {
      console.error("Error searching:", error);
      alert("Failed to search. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle selecting a search result
  const handleSelectResult = (result) => {
    setSelectedResult(result);
  };

  // Handle confirming the selection
  const handleConfirmSelection = () => {
    if (!selectedResult) {
      alert("Please select a result first");
      return;
    }
    setSearchQuery(selectedResult.name || selectedResult);
    setFilteredResults([]);
  };

  // Handle adding a new event
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time || !newEvent.description) {
      alert("Please fill in all fields.");
      return;
    }

    const newEventWithId = {
      id: (events?.length || 0) + 1,
      ...newEvent,
    };

    setEvents([...(events || []), newEventWithId]);
    setNewEvent({ title: "", time: "", description: "" });
  };

  // Handle editing an event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      time: event.time,
      description: event.description,
    });
  };

  // Handle updating an event
  const handleUpdateEvent = () => {
    if (!newEvent.title || !newEvent.time || !newEvent.description) {
      alert("Please fill in all fields.");
      return;
    }

    const updatedEvents = events.map((event) =>
      event.id === editingEvent.id ? { ...event, ...newEvent } : event
    );

    setEvents(updatedEvents);
    setEditingEvent(null);
    setNewEvent({ title: "", time: "", description: "" });
  };

  // Handle deleting an event
  const handleDeleteEvent = (id) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents);
  };

  // Function to handle sending an announcement
  const sendAnnouncement = async () => {
    if (!subject || !announcement) {
      alert("Please enter both subject and message");
      return;
    }

    setIsSending(true);

    let requestBody = {
      message: announcement,
      subject: subject
    };

    // Add recipient-specific fields based on selection
    if (selectedRecipient === "All Students") {
      requestBody.toAll = true;
    } else if (selectedRecipient === "Specific Grade") {
      if (!selectedResult) {
        alert("Please select a grade first");
        setIsSending(false);
        return;
      }
      requestBody.className = selectedResult;
    } else if (selectedRecipient === "Specific Student") {
      if (!selectedResult) {
        alert("Please select a student first");
        setIsSending(false);
        return;
      }
      requestBody.studentId = selectedResult.id;
    } else if (selectedRecipient === "Specific Teacher") {
      if (!selectedResult) {
        alert("Please select a teacher first");
        setIsSending(false);
        return;
      }
      requestBody.teacherId = selectedResult.id;
    }

    try {
      const response = await fetch("https://xpmnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_AUTH_TOKEN"
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to send announcement: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        console.log("✅ Announcement sent successfully:", result);
        alert("Announcement sent successfully!");
      } else {
        const text = await response.text();
        console.log("✅ Announcement sent successfully:", text);
        alert(text);
      }
      
      setAnnouncement("");
      setSubject("");
      setSearchQuery("");
      setSelectedResult(null);
      setFilteredResults([]);
    } catch (error) {
      console.error("❌ Error sending announcement:", error);
      alert(error.message || "Failed to send announcement. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Function to handle replying to a parent message
  const handleReply = (messageId) => {
    const messageToReply = parentMessages.find((msg) => msg.id === messageId);
    if (messageToReply) {
      setReplyingTo(messageToReply);
      setReply(`Replying to ${messageToReply.from}: `);
    }
  };

  // Function to send a reply
  const sendReply = () => {
    if (reply.trim() === "") {
      alert("Please enter a reply.");
      return;
    }

    console.log("Reply sent:", reply);
    alert("Reply sent successfully!");

    setReply("");
    setReplyingTo(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <motion.h1
        className="text-4xl font-bold text-gray-800 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📡 Communication Portal
      </motion.h1>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex justify-center space-x-4 bg-white p-3 rounded-lg shadow-md">
          {["📢 Notifications", "💬 Messages", "📅 Events"].map((title, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                `px-6 py-2 text-lg font-semibold rounded-lg transition-all ${
                  selected
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 bg-gray-200 hover:bg-gray-300"
                }`
              }
            >
              {title}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-6">
          <Tab.Panel>
            <motion.div
              className="p-6 bg-blue-100 border border-blue-300 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-blue-800">📢 Send a Notification</h2>

              <div className="mt-4">
                <label className="block text-lg font-medium text-blue-700">Subject:</label>
                <input
                  type="text"
                  className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter message subject"
                />
              </div>

              <div className="mt-4">
                <label className="block text-lg font-medium text-blue-700">Select Recipient:</label>
                <div className="flex gap-2">
                  <select
                    className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3"
                    value={selectedRecipient}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedRecipient(value);
                      setSearchQuery("");
                      setFilteredResults([]);
                      setSelectedResult(null);
                    }}
                  >
                    {options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 whitespace-nowrap"
                    onClick={() => {
                      if (selectedRecipient.includes("Specific")) {
                        setSearchQuery("");
                        setFilteredResults([]);
                      }
                    }}
                  >
                    Select
                  </button>
                </div>
              </div>

              {(selectedRecipient === "Specific Student" || selectedRecipient === "Specific Teacher" || selectedRecipient === "Specific Grade") && (
                <div className="mt-4">
                  <label className="block text-lg font-medium text-blue-700">Search:</label>
                  <div className="relative flex">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 bg-white disabled:bg-gray-100"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Type to search ${selectedRecipient.toLowerCase()}...`}
                      disabled={isSearching}
                    />
                    <button
                      className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                      onClick={handleSearch}
                      disabled={isSearching || searchQuery.trim() === ""}
                    >
                      {isSearching ? (
                        <>
                          <motion.span
                            className="inline-block mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            ⏳
                          </motion.span>
                          Searching
                        </>
                      ) : (
                        "Search"
                      )}
                    </button>
                  </div>

                  {isSearching && (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow-md text-center">
                      <p className="text-blue-700">Loading results...</p>
                    </div>
                  )}

                  {!isSearching && filteredResults.length > 0 && (
                    <div className="mt-4 bg-white rounded-lg shadow-md p-4">
                      <h3 className="font-medium text-blue-700 mb-2">Search Results:</h3>
                      <ul className="space-y-2">
                        {filteredResults.map((result, index) => (
                          <li 
                            key={index} 
                            className={`p-2 rounded cursor-pointer ${selectedResult === result ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                            onClick={() => handleSelectResult(result)}
                          >
                            {result.name || result}
                          </li>
                        ))}
                      </ul>
                      <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        onClick={handleConfirmSelection}
                        disabled={!selectedResult}
                      >
                        Select
                      </button>
                    </div>
                  )}
                </div>
              )}

              <ReactQuill
                className="mt-4 bg-white rounded-md"
                style={{ backgroundColor: "white" }}
                value={announcement}
                onChange={setAnnouncement}
              />
              <button
                className="mt-4 px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 flex items-center justify-center min-w-[160px]"
                onClick={sendAnnouncement}
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <motion.span
                      className="inline-block mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      ⏳
                    </motion.span>
                    Sending...
                  </>
                ) : (
                  "Send Notification"
                )}
              </button>
            </motion.div>
          </Tab.Panel>

          <Tab.Panel>
            <motion.div
              className="p-6 bg-green-100 border border-green-300 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-green-800">💬 Messages</h2>

              <div className="mt-4 space-y-4">
                {parentMessages.map((msg) => (
                  <div key={msg.id} className="p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-green-700">{msg.from}</h3>
                    <p className="text-gray-800">{msg.message}</p>
                    <button
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={() => handleReply(msg.id)}
                    >
                      Reply
                    </button>
                  </div>
                ))}
              </div>

              {replyingTo && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-green-700">Replying to {replyingTo.from}</h3>
                  <textarea
                    className="w-full p-3 mt-2 border rounded-md bg-white"
                    rows={4}
                    placeholder="Type your reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <button
                    className="mt-2 px-5 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                    onClick={sendReply}
                  >
                    Send Reply
                  </button>
                </div>
              )}
            </motion.div>
          </Tab.Panel>

          <Tab.Panel>
            <motion.div
              className="p-6 bg-purple-100 border border-purple-300 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-purple-800">📅 Events</h2>

              <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-purple-700 mb-4">
                  {editingEvent ? "Edit Event" : "Add New Event"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-lg font-medium text-purple-700">Title:</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg py-2 px-3"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-purple-700">Time:</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg py-2 px-3"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      placeholder="Enter event time (e.g., 10th March, 10:00 AM)"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-purple-700">Description:</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg py-2 px-3"
                      rows={3}
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Enter event description"
                    />
                  </div>
                  <button
                    className="px-5 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600"
                    onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                  >
                    {editingEvent ? "Update Event" : "Add Event"}
                  </button>
                  {editingEvent && (
                    <button
                      className="ml-2 px-5 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600"
                      onClick={() => {
                        setEditingEvent(null);
                        setNewEvent({ title: "", time: "", description: "" });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {events && events.map((event) => (
                  <div key={event.id} className="p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-purple-700">{event.title}</h3>
                    <p className="text-gray-600">{event.time}</p>
                    <p className="text-gray-800">{event.description}</p>
                    <div className="mt-2">
                      <button
                        className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        onClick={() => handleEditEvent(event)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default function ProtectedCommunicationPage() {
  return (
    <ProtectedRoute>
      <CommunicationPage />
    </ProtectedRoute>
  );
}