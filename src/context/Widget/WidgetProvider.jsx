// TemplateProvider.jsx
import { useState, useContext } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import WidgetContext from './WidgetContext';
const WidgetProvider = ({ children }) => {
    const [widgets, setWidgets] = useState([]);
    const [selectedWidget, setSelectedWidget] = useState(null);

    const fetchWidgets = async () => {
        try {
            const response = await axios.get(
                'https://cloud-platform-server-for-bjit.onrender.com/widgets'
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