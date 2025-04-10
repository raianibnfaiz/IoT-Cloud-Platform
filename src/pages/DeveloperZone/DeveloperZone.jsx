import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TemplatesList from './TemplatesList'; // Adjust the import path as necessary
import { API_ENDPOINTS } from '../../config/apiEndpoints';

const DeveloperZone = () => {
    const [templateName, setTemplateName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [templates, setTemplates] = useState([]); 

    const token = localStorage.getItem('authToken');

    const handleTemplateNameChange = (e) => {
        setTemplateName(e.target.value);
    };

    const fetchTemplates = useCallback(async () => {
        if (!token) {
            setMessage('❌ Authentication token is missing');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(API_ENDPOINTS.TEMPLATES, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Ensure response data is an array
            const templatesData = Array.isArray(response.data) ? response.data : [];
            setTemplates(templatesData);
        } catch (error) {
            console.error('Error fetching templates:', error);
            setMessage(`❌ Failed to fetch templates: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!token) {
            setMessage('❌ Authentication token is missing');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(API_ENDPOINTS.TEMPLATES, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    template_name: templateName.trim(), // Trim whitespace
                    widget_list: [],
                }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to create the template.');
            }

            const data = await response.json();
            
            // Validate the new template before adding
            if (data.template && data.template.template_name) {
                setTemplates(prevTemplates => [...prevTemplates, data.template]);
                setMessage(`✅ Template created successfully: ${data.template.template_name}`);
                handleCloseModal();
            } else {
                throw new Error('Invalid template response');
            }
        } catch (err) {
            console.error(err);
            setMessage(`❌ Error: ${err.message}`);
        } finally {
            setLoading(false);
            
            // Clear message after 3 seconds
            const messageTimeout = setTimeout(() => {
                setMessage('');
            }, 3000);

            // Refresh templates
            fetchTemplates();

            // Cleanup timeout
            return () => clearTimeout(messageTimeout);
        }
    };

    const handleCloseModal = () => {
        const modal = document.getElementById('templateModal');
        if (modal) {
            modal.close(); // Close the modal
            setTemplateName(''); // Clear input field
        }
    };

    const handleOpenModal = () => {
        const modal = document.getElementById('templateModal');
        if (modal) {
            modal.showModal(); // Open the modal
        }
    };

    useEffect(() => {
        fetchTemplates(); // Fetch templates when the component mounts
    }, [fetchTemplates]);

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
                            maxLength={50} // Prevent overly long template names
                        />
                        <button
                            type="submit"
                            className="btn btn-success w-full p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700"
                            disabled={loading || !templateName.trim()}
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
            <TemplatesList 
                templates={templates} 
                loading={loading}
            />
        </div>
    );
};

export default DeveloperZone;