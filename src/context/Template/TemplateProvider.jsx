// TemplateProvider.jsx
import { useState, useContext } from 'react';
import TemplateContext from './TemplateContext';
import axios from 'axios';
import { useEffect } from 'react';

const TemplateProvider = ({ children }) => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const fetchTemplates = async () => {
        try {
            const response = await axios.get(
                'https://cloud-platform-server-for-bjit.onrender.com/templates'
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