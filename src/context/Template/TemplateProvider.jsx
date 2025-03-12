// TemplateProvider.jsx
import { useState, useContext } from 'react';
import TemplateContext from './TemplateContext';
import axios from 'axios';
import { useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/apiEndpoints';

const TemplateProvider = ({ children }) => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const fetchTemplates = async () => {
        try {
            const response = await axios.get(
                API_ENDPOINTS.TEMPLATES
            );
            setTemplates(response.data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    return (
        <TemplateContext.Provider value={{ templates, selectedTemplate, setSelectedTemplate }}>
            {children}
        </TemplateContext.Provider>
    );
};

export default TemplateProvider;