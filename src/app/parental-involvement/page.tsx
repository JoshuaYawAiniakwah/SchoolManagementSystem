"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";

function ParentalInvolvement() {
  // Initialize state with proper type checking
  const [forms, setForms] = useState<Array<{
    id: string;
    link: string;
    title: string;
    description: string;
    createdAt: number;
  }>>([]);
  
  const [newForm, setNewForm] = useState({
    link: "",
    title: "",
    description: ""
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Load forms from localStorage - runs only once on mount
  useEffect(() => {
    try {
      const savedForms = localStorage.getItem("parentalForms");
      if (savedForms) {
        const parsed = JSON.parse(savedForms);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setForms(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load forms:", err);
    }
  }, []);

  // Save forms to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("parentalForms", JSON.stringify(forms));
    } catch (err) {
      console.error("Failed to save forms:", err);
    }
  }, [forms]);

  const validateGoogleFormLink = (link: string) => {
    try {
      const url = new URL(link);
      return url.hostname.includes("google.com") && 
             url.pathname.includes("/forms/");
    } catch {
      return false;
    }
  };

  const handleAddForm = () => {
    // Clear previous messages
    setError("");
    setSuccess("");

    // Validation
    if (!newForm.title.trim()) {
      setError("Please enter a title for the form");
      return;
    }

    if (!newForm.link.trim()) {
      setError("Please enter a Google Form link");
      return;
    }

    if (!validateGoogleFormLink(newForm.link)) {
      setError("Please enter a valid Google Forms link");
      return;
    }

    if (isEditing) {
      // Update existing form
      setForms(forms.map(form => 
        form.id === isEditing ? { ...newForm, id: isEditing } : form
      ));
      setSuccess("Form updated successfully!");
    } else {
      // Add new form with unique ID and timestamp
      const newFormWithId = {
        ...newForm,
        id: crypto.randomUUID(),
        createdAt: Date.now()
      };
      setForms([...forms, newFormWithId]);
      setSuccess("Form added successfully!");
    }

    resetForm();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleRemoveForm = (id: string) => {
    setForms(forms.filter(form => form.id !== id));
    setSuccess("Form removed successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleEditForm = (id: string) => {
    const formToEdit = forms.find(form => form.id === id);
    if (formToEdit) {
      setNewForm({
        link: formToEdit.link,
        title: formToEdit.title,
        description: formToEdit.description
      });
      setIsEditing(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const resetForm = () => {
    setNewForm({
      link: "",
      title: "",
      description: ""
    });
    setError("");
    setIsEditing(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Parental Involvement Portal</h1>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="mb-6 p-6 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {isEditing ? "Edit Form" : "Add New Parent Form"}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Form Title *
            </label>
            <input
              type="text"
              placeholder="Parent Survey 2023"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              value={newForm.title}
              onChange={(e) => setNewForm({...newForm, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Form Link *
            </label>
            <input
              type="url"
              placeholder="https://docs.google.com/forms/..."
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              value={newForm.link}
              onChange={(e) => {
                setNewForm({...newForm, link: e.target.value});
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAddForm()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              placeholder="Brief description about this form..."
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              rows="3"
              value={newForm.description}
              onChange={(e) => setNewForm({...newForm, description: e.target.value})}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex justify-end space-x-3 mt-4">
          {isEditing && (
            <button
              onClick={resetForm}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleAddForm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isEditing ? "Update Form" : "Add Form"}
          </button>
        </div>
      </div>

      <div className="mb-6 p-6 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Active Parent Forms ({forms.length})
        </h2>
        
        {forms.length > 0 ? (
          <div className="space-y-4">
            {forms.map((form) => (
              <div key={form.id} className="border rounded-lg p-4 hover:shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg text-gray-800 mb-1">
                      {form.title}
                    </h3>
                    {form.description && (
                      <p className="text-gray-600 mb-2">{form.description}</p>
                    )}
                    <a 
                      href={form.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline inline-block break-all"
                    >
                      {form.link}
                    </a>
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {formatDate(form.createdAt)}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEditForm(form.id)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveForm(form.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">No forms added yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Add your first form above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProtectedParentalInvolvement() {
  return (
    <ProtectedRoute>
      <ParentalInvolvement />
    </ProtectedRoute>
  );
}