import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa"; // Import the dropdown icon

const WidgetDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const response = await fetch(
          "https://cloud-platform-server-for-bjit.onrender.com/widgets",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhaWFuaWJuZmFpekBnbWFpbC5jb20iLCJ1c2VyX2lkIjoidXNyX2MxYzhiNThmMGIiLCJpYXQiOjE3Mzk1MjQ0MTJ9.7OV0FSmG0K_vGhPvYMrthJkQFGGnQVFAGRCXS5qkumk",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setWidgets(data);
      } catch (error) {
        console.error("Failed to fetch widgets:", error);
      }
    };

    fetchWidgets();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="mt-2 bg-gray-900 rounded-md shadow-lg p-2">
      {widgets.map((widget) => (
        <div
          key={widget._id}
          className="py-1 text-gray-200 hover:bg-gray-700 cursor-pointer"
        >
          {widget.name}
        </div>
      ))}
    </div>
  );
};

export default WidgetDropdown;
