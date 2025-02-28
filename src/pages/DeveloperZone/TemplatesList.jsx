import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa'; // Import the hamburger icon
import Sidebar from './Sidebar'; // Make sure the path is correct

const TemplatesList = ({ templates, setTemplates }) => {
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(-1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
    const token = sessionStorage.getItem('authToken');

    useEffect(() => {
        const fetchData = async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-4 border-t-blue-500 border-r-green-500 border-b-yellow-500 border-l-red-500 rounded-full" role="status"></div>
            </div>
        );
    }

    const handleDelete = async (template_id) => {
        try {
            const response = await fetch(`https://cloud-platform-server-for-bjit.onrender.com/users/templates/${template_id}?template_id=${template_id}`, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (response.ok) {
                console.log(`Template ${template_id} deleted successfully`);
                setTemplates(prevTemplates => prevTemplates.filter(template => template.template_id !== template_id));
            } else {
                console.error('Failed to delete the template');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setShowDeleteModal(false);
        }
    };

    const confirmDelete = (template_id) => {
        setTemplateToDelete(template_id);
        setShowDeleteModal(true);
    };

    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setTemplateToDelete(null);
    };

    const closeDropdown = () => {
        setDropdownOpen(-1);
    };

    const toggleDropdown = (index) => {
        setDropdownOpen(dropdownOpen === index ? -1 : index);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex">
            <Sidebar isOpen={isSidebarOpen} closeSidebar={toggleSidebar} /> {/* Adding Sidebar */}
            <div className={`flex-grow p-5 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <button onClick={toggleSidebar} className="bg-gray-800 text-white p-2 rounded-md mb-4">
                    <FaBars className="text-xl" />
                </button>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {templates.length > 0 ? (
                        templates.map((template, index) => (
                            <div key={index} className={`border rounded-lg p-4 ${index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}`}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-300">{template.template_name}</h3>
                                        <p className="text-sm text-gray-400">Widgets: {template.widgets_count || 0}</p>
                                    </div>
                                    <div className="relative">
                                        <button
                                            className="btn bg-transparent text-white p-2 rounded-full hover:bg-gray-600"
                                            onClick={() => toggleDropdown(index)}
                                        >
                                            {/* Vertical Three Dot Icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15h.01M12 9h.01M12 12h.01" />
                                            </svg>
                                        </button>
                                        {dropdownOpen === index && (
                                            <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg z-10">
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition duration-300"
                                                    onClick={() => {
                                                        console.log(`Update template ${template.template_id}`);
                                                        closeDropdown();
                                                    }}
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-red-600 transition duration-300"
                                                    onClick={() => {
                                                        confirmDelete(template.template_id);
                                                        closeDropdown();
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center text-gray-500 py-4">No templates created yet.</div>
                    )}

                    {/* Deletion Confirmation Modal */}
                    {showDeleteModal && (
                        <dialog open className="modal">
                            <div className="modal-box w-1/4 max-w-sm rounded-lg">
                                <h2 className="text-2xl mb-6 font-bold text-center">Confirm Deletion</h2>
                                <p className="mb-4">Are you sure you want to delete this template?</p>
                                <div className="flex justify-end mt-6">
                                    <button
                                        className="btn btn-success w-1/2 p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 mr-2"
                                        onClick={() => handleDelete(templateToDelete)}
                                    >
                                        Yes, Delete
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="btn w-1/2 p-2 text-red-500 border-red-500 rounded-lg hover:bg-red-500 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </dialog>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TemplatesList;