import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TemplatesList from './TemplatesList'; // Adjust the import path as necessary

const DeveloperZone = () => {
    const [templateName, setTemplateName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [templates, setTemplates] = useState([]); // State for templates

    const token = sessionStorage.getItem('authToken');

    const handleTemplateNameChange = (e) => {
        setTemplateName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('https://cloud-platform-server-for-bjit.onrender.com/users/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    template_name: templateName,
                    widget_list: [],
                }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to create the template.');
            }

            const data = await response.json();
            setTemplates([...templates, data.template]); // Add the new template to the state
            setMessage(`✅ Template created successfully: ${data.template.template_name}`);
        } catch (err) {
            console.error(err);
            setMessage(`❌ Error: ${err.message}`);
        } finally {
            setLoading(false);
            handleCloseModal();
            
            // Display message for 3 seconds
            setTimeout(() => {
                setMessage('');
            }, 3000);
            
            fetchTemplates(); // Refresh the template list
        }
    };

    const handleCloseModal = () => {
        const modal = document.getElementById('templateModal');
        modal.close(); // Close the modal
        setTemplateName(''); // Clear input field
    };

    const handleOpenModal = () => {
        const modal = document.getElementById('templateModal');
        modal.showModal(); // Open the modal
    };

    const fetchTemplates = async () => {
        try {
            const response = await axios.get('https://cloud-platform-server-for-bjit.onrender.com/users/templates', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTemplates(response.data); // Adjust according to your response structure
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    useEffect(() => {
        fetchTemplates(); // Fetch templates when the component mounts
    }, []);

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl">Developer Zone</h1>
                <button onClick={handleOpenModal} className="btn btn-primary">
                    Add a Template
                </button>
            </div>

            {message && (
                <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-error'} mb-4`}>
                    {message}
                </div>
            )}

            <dialog id="templateModal" className="modal">
                <div className="modal-box w-1/4 max-w-sm rounded-lg ">
                    <h2 className="text-2xl mb-6 font-bold text-center">Create a Template</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Template Name"
                            value={templateName}
                            onChange={handleTemplateNameChange}
                            className="input w-full mb-4 p-2 border-b-2 border-gray-300 rounded-lg"
                            required
                        />
                        <button
                            type="submit"
                            className="btn btn-success w-full p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Add'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="btn w-full mt-4 p-2 text-red-500 border-red-500 rounded-lg hover:bg-red-500 hover:text-white"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </dialog>

            {/* Render the Templates List */}
            <TemplatesList templates={templates} />
        </div>
    );
};

export default DeveloperZone;