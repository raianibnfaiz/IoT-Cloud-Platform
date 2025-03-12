// TemplateProvider.jsx
import { useState, useContext } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import WidgetContext from './WidgetContext';
import { API_ENDPOINTS } from '../../config/apiEndpoints';

const WidgetProvider = ({ children }) => {
    const [widgets, setWidgets] = useState([]);
    const [selectedWidget, setSelectedWidget] = useState(null);

    const fetchWidgets = async () => {
        try {
            const response = await axios.get(
                API_ENDPOINTS.WIDGETS
            );
            setWidgets(response.data);
        } catch (error) {
            console.error('Error fetching widgets:', error);
        }
    };

    useEffect(() => {
        fetchWidgets();
    }, []);

    return (
        <WidgetContext.Provider value={{ widgets, selectedWidget, setSelectedWidget }}>
            {children}
        </WidgetContext.Provider>
    );
};

export default WidgetProvider;