import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa'; // Import the dropdown icon

const WidgetDropdown = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const widgets = [
        { id: 1, name: 'Switch' },
        { id: 2, name: 'Button' },
        { id: 3, name: 'Slider' },
        { id: 4, name: 'Checkbox' },
        { id: 5, name: 'Text Input' },
        { id: 6, name: 'Dropdown' },
        { id: 7, name: 'Radio Button' },
        { id: 8, name: 'Date Picker' },
        { id: 9, name: 'Color Picker' },
        { id: 10, name: 'File Upload' },
    ];

    return (
        <div>
            <button onClick={toggleDropdown} className="text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded block w-full text-left flex items-center">
                Explore Widget Lists
                <FaChevronDown className={`ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            {isDropdownOpen && (
                <div className="mt-2 bg-gray-900 rounded-md shadow-lg p-2">
                    {widgets.map(widget => (
                        <div key={widget.id} className="py-1 text-gray-200 hover:bg-gray-700 cursor-pointer">
                            {widget.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WidgetDropdown;