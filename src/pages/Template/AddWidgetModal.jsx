import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../config/apiEndpoints";

const AddWidgetModal = ({ templateId, templateDetails, availableWidgets }) => {
  const [selectedWidget, setSelectedWidget] = useState("");
  const [selectedPins, setSelectedPins] = useState([]);
  const [posX, setPosX] = useState(100);
  const [posY, setPosY] = useState(100);
  const [message, setMessage] = useState("");
  const [requiredPinCount, setRequiredPinCount] = useState(0);
  const [addingWidget, setAddingWidget] = useState(false);
  const temp_id = templateDetails.template.template_id;
  const token = sessionStorage.getItem("authToken");
  // Reset selected pins when widget changes
  useEffect(() => {
    if (selectedWidget) {
      const widget = availableWidgets?.find(w => w._id === selectedWidget);
      setRequiredPinCount(widget ? widget.pinRequired : 0);
      setSelectedPins(Array(widget ? widget.pinRequired : 0).fill(""));
    } else {
      setRequiredPinCount(0);
      setSelectedPins([]);
    }
  }, [selectedWidget, availableWidgets]);

  // Get available pins from template details
  const getAvailablePins = () => {
    return templateDetails?.template?.virtual_pins || [];  // Assuming you might want to filter by `is_used` or any other logic
  };

  // Function to add a widget to a template
  const addWidgetToTemplate = async (templateId, widgetData) => {
    setAddingWidget(true);
    try {
      const response = await fetch(
        API_ENDPOINTS.UPDATE_TEMPLATE(temp_id),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            widget_list: [widgetData]
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to add widget to template:", error);
      throw error;
    } finally {
      setAddingWidget(false);
    }
  };

  // Handle form submission
  const handleAddWidget = async (e) => {
    e.preventDefault();
    
    if (!selectedWidget || selectedPins.some(pin => !pin)) {
      setMessage("Please select a widget and specify all required pins.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const widgetData = {
        widget_id: selectedWidget,
        pinConfig: selectedPins,
        position: { x: parseInt(posX), y: parseInt(posY) }
      };
      await addWidgetToTemplate(templateId, widgetData);
      setMessage("Widget added successfully!");
      setTimeout(() => setMessage(""), 3000);

      setTimeout(() => {
        setSelectedWidget("");
        setSelectedPins([]);
        setPosX(100);
        setPosY(100);
        const modal = document.getElementById("addWidgetModal");
        if (modal) modal.close();
      }, 1500);
      
    } catch (error) {
      console.error("Error in handleAddWidget:", error);
      setMessage("Failed to add widget to template. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("addWidgetModal");
    if (modal) modal.close();
    setSelectedWidget("");
    setSelectedPins([]);
    setPosX(100);
    setPosY(100);
    setMessage("");
  };

  return (
    <dialog id="addWidgetModal" className="modal">
      <div className="modal-box w-1/3 max-w-md rounded-lg">
        <h2 className="text-2xl mb-6 font-bold text-center">
          Add Widget to Template
        </h2>
        
        {message && (
          <div className="alert mb-4 p-2 rounded bg-blue-100 border-blue-300 text-center">
            {message}
          </div>
        )}
        
        <form onSubmit={handleAddWidget}>
          
          {/* Widget Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Select Widget
            </label>
            <select
              value={selectedWidget}
              onChange={(e) => setSelectedWidget(e.target.value)}
              className="select w-full p-2 border-2 border-gray-300 rounded-lg"
              required
            >
              <option value="">-- Select a Widget --</option>
              {availableWidgets?.map(widget => (
                <option key={widget._id} value={widget._id}>
                  {widget.name} (Requires {widget.pinRequired} pins)
                </option>
              ))}
            </select>
          </div>

          {/* Show pin selection only if a widget is selected */}
          {selectedWidget && (
            <>
              {/* Virtual Pin Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Select Virtual Pins
                </label>
                {Array.from({ length: requiredPinCount }).map((_, index) => (
                  <div key={index} className="mb-2">
                    <label className="block text-xs mb-1">
                      Pin {index + 1}:
                    </label>
                    <select
                      value={selectedPins[index]}
                      onChange={(e) => {
                        const newPins = [...selectedPins];
                        newPins[index] = e.target.value;
                        setSelectedPins(newPins);
                      }}
                      className="select w-full p-2 border-2 border-gray-300 rounded-lg"
                      required
                    >
                      <option value="">-- Select Virtual Pin --</option>
                      {getAvailablePins().map(pin => (
                        <option key={pin._id} value={pin._id}>
                          {`Virtual Pin ${pin.pin_id}`} (ID: {pin.pin_id})
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Position */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    X Position
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={posX}
                    onChange={(e) => setPosX(e.target.value)}
                    className="input w-full p-2 border-2 border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Y Position
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={posY}
                    onChange={(e) => setPosY(e.target.value)}
                    className="input w-full p-2 border-2 border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit and Cancel buttons */}
          <button
            type="submit"
            className="btn btn-success w-full p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 mt-4"
            disabled={addingWidget || !selectedWidget || selectedPins.some(pin => !pin)}
          >
            {addingWidget ? "Adding..." : "Add Widget"}
          </button>
          
          <button
            type="button"
            onClick={handleCloseModal}
            className="btn w-full mt-4 p-2 text-red-500 border-red-500 rounded-lg hover:bg-red-500 hover:text-white"
            disabled={addingWidget}
          >
            Cancel
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default AddWidgetModal;