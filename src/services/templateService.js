import axios from 'axios';
import { BASE_URL } from '../config/apiEndpoints';
import { API_ENDPOINTS } from '../config/apiEndpoints';

/**
 * Fetches a template by its ID
 * @param {string} templateId - The ID of the template to fetch
 * @returns {Promise<Object>} - The template data
 */
export const fetchTemplatesById = async (templateId) => {
    // Get the authentication token from session storage
    const token = sessionStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication token not found');
    }
    try {
        const response = await fetch(
            API_ENDPOINTS.TEMPLATE_DETAILS(templateId),
            {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch template with ID: ${templateId}`);
        }

        const data = await response.json();
        console.log("Template details:", data);
        return data;
    } catch (error) {
        console.error('Error fetching template:', error);
        throw error;
    }
};
