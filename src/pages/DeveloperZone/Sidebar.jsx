import React from 'react';
import { Link } from 'react-router-dom';
import WidgetDropdown from './WidgetDropDown';

const Sidebar = ({ isOpen, closeSidebar }) => {
    return (
        <div className={`bg-gray-800 w-64 min-h-screen p-5 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed z-30`}>
            <button onClick={closeSidebar} className="text-white text-xl float-right">
                &times; {/* Close (X) icon */}
            </button>
            <h2 className="text-white text-2xl font-bold mb-4">Widget List</h2>
            <ul className="space-y-2">
                <li>
                    <WidgetDropdown />
                </li>
               
                {/* Add more sidebar items as needed */}
            </ul>
        </div>
    );
};

export default Sidebar;