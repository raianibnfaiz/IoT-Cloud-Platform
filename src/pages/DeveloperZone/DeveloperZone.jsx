import React, { useState } from 'react';

const DeveloperZone = () => {
    const [templateName, setTemplateName] = useState('');
    const [loading, setLoading] = useState(false); // State to show loading spinner
    const [message, setMessage] = useState(''); // State to handle success or error messages
    const getTokenFromSessionStorage = () => {
        return sessionStorage.getItem('authToken');
    };

    const token = getTokenFromSessionStorage();
    console.log('Token:', token);
    

    const handleTemplateNameChange = (e) => {
        setTemplateName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loading spinner
        setMessage(''); // Clear any existing messages
    
        try {
            // API call to submit the template
            const response = await fetch('https://cloud-platform-server-for-bjit.onrender.com/users/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add your API token here
                },
                body: JSON.stringify({
                    template_name: templateName,
                    widget_list: [],
                }),
            });
    
            if (!response.ok) {
                // Fetch additional details on the error
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to create the template (401 Unauthorized).');
            }
    
            const data = await response.json();
    
            // API response, assuming the response format is as given in the prompt
            console.log('API Response:', data);
    
            if (data.status === 'success') {
                setMessage(`✅ Template created successfully: ${data.template.template_name}`);
            } else {
                throw new Error(data.message || 'An unknown error occurred.');
            }
        } catch (err) {
            console.error(err);
            setMessage(`❌ Error: ${err.message}`);
        } finally {
            setLoading(false); // Hide loading spinner
            handleCloseModal(); // Close modal after submission
        }
    };

    const handleCloseModal = () => {
        const modal = document.getElementById('templateModal');
        modal.close(); // Close the modal
        setTemplateName(''); // Clear input field after closing modal
    };

    const handleOpenModal = () => {
        const modal = document.getElementById('templateModal');
        modal.showModal(); // Open the modal
    };

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl">Developer Zone</h1>
                <button onClick={handleOpenModal} className="btn btn-primary">
                    Add a Template
                </button>
            </div>

            {/* Success/Error Message */}
            {message && (
                <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-error'} mb-4`}>
                    {message}
                </div>
            )}

            {/* Modal for Template Creation */}
            <dialog id="templateModal" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <h2 className="text-2xl mb-4 font-bold text-center">Create a Template</h2>
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
                            disabled={loading} // Disable button when loading
                        >
                            {loading ? 'Creating...' : 'Add'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="btn w-full mt-2 p-2 text-red-500 border-red-500 rounded-lg hover:bg-red-500 hover:text-white"
                            disabled={loading} // Disable button when loading
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default DeveloperZone;