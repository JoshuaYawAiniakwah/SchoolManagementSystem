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
    "All Students",
    "All Teachers",
    "Specific Teacher",
    "Pre School (Creche, Nursery 1, Nursery 2, KG1, KG2)",
    "Lower Primary (Grade 1 - Grade 3)",
    "Upper Primary (Grade 4 - Grade 6)",
    "JHS (Grade 7 - Grade 9)",
    "Specific Class"
  ];

  // Class options for specific class selection
  const classOptions = [
    "Creche",
    "Nursery 1",
    "Nursery 2",
    "KG 1",
    "KG 2",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9"
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
      if (selectedRecipient === "Specific Class") {
        // Filter class options based on search query
        const filtered = classOptions.filter(option => 
          option.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredResults(filtered);
        return;
      } else if (selectedRecipient === "All Students") {
        response = await fetch(`https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/students/search?name=${encodeURIComponent(searchQuery)}`);
      }

      if (response && !response.ok) {
        throw new Error('Failed to fetch search results');
      }

      if (response) {
        const data = await response.json();
        setFilteredResults(data);
        setSelectedResult(null);
      }
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
    } else if (selectedRecipient === "Specific Class") {
      if (!selectedResult) {
        alert("Please select a class first");
        setIsSending(false);
        return;
      }
      requestBody.className = selectedResult;
    } else if (selectedRecipient === "Pre School (Creche, Nursery 1, Nursery 2, KG1, KG2)") {
      requestBody.educationLevel = "Pre School";
    } else if (selectedRecipient === "Lower Primary (Grade 1 - Grade 3)") {
      requestBody.educationLevel = "Lower Primary";
    } else if (selectedRecipient === "Upper Primary (Grade 4 - Grade 6)") {
      requestBody.educationLevel = "Upper Primary";
    } else if (selectedRecipient === "JHS (Grade 7 - Grade 9)") {
      requestBody.educationLevel = "Senior Level";
    } else if (selectedRecipient === "All Teachers") {
      requestBody.toAllTeachers = true;
    } else if (selectedRecipient === "Specific Teacher") {
      if (!searchQuery) {
        alert("Please enter a teacher name");
        setIsSending(false);
        return;
      }
      requestBody.teacherName = searchQuery;
    }

    try {
      const response = await fetch("https://xpnnkh6h-8082.uks1.devtunnels.ms/admin/v1/api/messages/send", {
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
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-700 bg-gray-200 hover:bg-gray-300"
                }`
              }
            >
              {title}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-6">
          {/* Notifications Tab */}
          <Tab.Panel>
            <motion.div
              className="p-6 bg-green-50 border-2 border-green-200 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-green-800 mb-4">📢 Send a Notification</h2>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 mb-4">
                <label className="block text-lg font-medium text-green-700 mb-2">Subject:</label>
                <input
                  type="text"
                  className="w-full bg-white border border-green-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter message subject"
                />
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 mb-4">
                <label className="block text-lg font-medium text-green-700 mb-2">Select Recipient:</label>
                <div className="flex gap-2">
                  <select
                    className="w-full bg-white border border-green-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap transition-colors shadow-md"
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

              {(selectedRecipient === "Specific Class" || selectedRecipient === "Specific Teacher") && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 mb-4">
                  <label className="block text-lg font-medium text-green-700 mb-2">
                    {selectedRecipient === "Specific Class" ? "Search Class:" : "Enter Teacher Name:"}
                  </label>
                  <div className="relative flex">
                    <input
                      type="text"
                      className="w-full border border-green-200 rounded-lg py-2 px-3 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        selectedRecipient === "Specific Class" 
                          ? "Type to search for a class..." 
                          : "Enter teacher name"
                      }
                      disabled={isSearching && selectedRecipient === "Specific Class"}
                    />
                    {selectedRecipient === "Specific Class" && (
                      <button
                        className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px] transition-colors shadow-md"
                        onClick={handleSearch}
                        disabled={isSearching || searchQuery.trim() === ""}
                      >
                        {isSearching ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Searching
                          </>
                        ) : (
                          "Search"
                        )}
                      </button>
                    )}
                  </div>

                  {isSearching && selectedRecipient === "Specific Class" && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                      <p className="text-green-700">Loading results...</p>
                    </div>
                  )}

                  {!isSearching && filteredResults.length > 0 && selectedRecipient === "Specific Class" && (
                    <div className="mt-4 bg-green-50 rounded-lg border border-green-200 p-4">
                      <h3 className="font-medium text-green-700 mb-2">Search Results:</h3>
                      <ul className="space-y-2">
                        {filteredResults.map((result, index) => (
                          <li 
                            key={index} 
                            className={`p-2 rounded cursor-pointer transition-colors ${
                              selectedResult === result 
                                ? 'bg-green-600 text-white' 
                                : 'bg-white hover:bg-green-100 text-green-800'
                            }`}
                            onClick={() => handleSelectResult(result)}
                          >
                            {result}
                          </li>
                        ))}
                      </ul>
                      <button
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors shadow-md"
                        onClick={handleConfirmSelection}
                        disabled={!selectedResult}
                      >
                        Select
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 mb-4">
                <ReactQuill
                  className="bg-white rounded-md"
                  style={{ backgroundColor: "white" }}
                  value={announcement}
                  onChange={setAnnouncement}
                />
              </div>
              
              <button
                className="w-full px-5 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center justify-center transition-colors disabled:bg-green-400 disabled:cursor-not-allowed shadow-md"
                onClick={sendAnnouncement}
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Notification...
                  </>
                ) : (
                  "Send Notification"
                )}
              </button>
            </motion.div>
          </Tab.Panel>

          {/* Messages Tab */}
          <Tab.Panel>
            <motion.div
              className="p-6 bg-green-50 border-2 border-green-200 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-green-800 mb-4">💬 Messages</h2>

              <div className="space-y-4">
                {parentMessages.map((msg) => (
                  <div key={msg.id} className="p-4 bg-white rounded-lg shadow-sm border border-green-100">
                    <h3 className="text-xl font-semibold text-green-700">{msg.from}</h3>
                    <p className="text-gray-800 mt-1">{msg.message}</p>
                    <div className="mt-3">
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
                        onClick={() => handleReply(msg.id)}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {replyingTo && (
                <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-green-100">
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Replying to {replyingTo.from}</h3>
                  <textarea
                    className="w-full p-3 mt-2 border border-green-200 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={4}
                    placeholder="Type your reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <button
                    className="mt-3 px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
                    onClick={sendReply}
                  >
                    Send Reply
                  </button>
                </div>
              )}
            </motion.div>
          </Tab.Panel>

          {/* Events Tab */}
          <Tab.Panel>
            <motion.div
              className="p-6 bg-green-50 border-2 border-green-200 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-green-800 mb-4">📅 Events</h2>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 mb-6">
                <h3 className="text-xl font-semibold text-green-700 mb-4">
                  {editingEvent ? "✏️ Edit Event" : "➕ Add New Event"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-lg font-medium text-green-700 mb-1">Title:</label>
                    <input
                      type="text"
                      className="w-full border border-green-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-green-700 mb-1">Time:</label>
                    <input
                      type="text"
                      className="w-full border border-green-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      placeholder="Enter event time (e.g., 10th March, 10:00 AM)"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-green-700 mb-1">Description:</label>
                    <textarea
                      className="w-full border border-green-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      rows={3}
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Enter event description"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
                      onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                    >
                      {editingEvent ? "Update Event" : "Add Event"}
                    </button>
                    {editingEvent && (
                      <button
                        className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-md"
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
              </div>

              <div className="space-y-4">
                {events && events.map((event) => (
                  <div key={event.id} className="p-4 bg-white rounded-lg shadow-sm border border-green-100">
                    <h3 className="text-xl font-semibold text-green-700">{event.title}</h3>
                    <p className="text-gray-600 mt-1">{event.time}</p>
                    <p className="text-gray-800 mt-2">{event.description}</p>
                    <div className="mt-3 flex space-x-2">
                      <button
                        className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors shadow-md"
                        onClick={() => handleEditEvent(event)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
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