import React, { useState, useEffect } from "react";
import AddWidgetModal from "./AddWidgetModal";

const TemplateEditor = () => {
  const [templateDetails, setTemplateDetails] = useState(null);
  const [availableWidgets, setAvailableWidgets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingWidgets, setLoadingWidgets] = useState(false);
  const [message, setMessage] = useState("");
  
  // Get template ID from URL or props
  const templateId = "temp_7c9e3de880"; // Replace with your actual template ID source
  
  // Get token from localStorage or context
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhaWFuaWJuZmFpekBnbWFpbC5jb20iLCJ1c2VyX2lkIjoidXNyX2MxYzhiNThmMGIiLCJpYXQiOjE3Mzk1MjQ0MTJ9.7OV0FSmG0K_vGhPvYMrthJkQFGGnQVFAGRCXS5qkumk";

  // Fetch template details
  useEffect(() => {
    const fetchTemplateDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://cloud-platform-server-for-bjit.onrender.com/users/templates/${templateId}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Template details:", data);
        setTemplateDetails(data);
      } catch (error) {
        console.error("Failed to fetch template details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplateDetails();
    fetchAvailableWidgets();
  }, [templateId, token]);

  // Fetch available widgets
  const fetchAvailableWidgets = async () => {
    setLoadingWidgets(true);
    try {
      const response = await fetch(
        "https://cloud-platform-server-for-bjit.onrender.com/widgets",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAvailableWidgets(data);
      console.log("Available widgets:", data);
    } catch (error) {
      console.error("Failed to fetch available widgets:", error);
    } finally {
      setLoadingWidgets(false);
    }
  };

  // Open the add widget modal
  const handleOpenAddWidgetModal = () => {
    const modal = document.getElementById("addWidgetModal");
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Template Editor</h1>
      
      {message && (
        <div className="alert p-2 rounded bg-blue-100 border-blue-300 mb-4">
          {message}
        </div>
      )}
      
      {loading ? (
        <p>Loading template details...</p>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl">{templateDetails?.template?.template_name}</h2>
            <button
              onClick={handleOpenAddWidgetModal}
              className="btn bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              disabled={loadingWidgets}
            >
              Add Widget
            </button>
          </div>
          
          {/* Display widgets */}
          <div className="border rounded p-4">
            <h3 className="text-lg mb-2">Current Widgets</h3>
            {templateDetails?.template?.widget_list && 
             templateDetails.template.widget_list.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templateDetails.template.widget_list.map((widget, index) => (
                  <div key={index} className="border rounded p-3">
                    <p><strong>Widget ID:</strong> {widget.widget_id._id || widget.widget_id}</p>
                    <p><strong>Position:</strong> X: {widget.position.x}, Y: {widget.position.y}</p>
                    <p><strong>Pins:</strong> {widget.pinConfig.length} pins configured</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No widgets added to this template yet.</p>
            )}
          </div>
          
          {/* Add Widget Modal */}
          <AddWidgetModal
            templateId={templateId}
            templateDetails={templateDetails}
            availableWidgets={availableWidgets}
            token={token}
          />
        </>
      )}
    </div>
  );
};

export default TemplateEditor;