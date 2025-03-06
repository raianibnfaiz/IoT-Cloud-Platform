import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

// Parse the JSON configuration from the widget image property
const parseWidgetConfig = (widget) => {
  if (!widget || !widget.image) return null;
  
  try {
    return typeof widget.image === 'string' ? JSON.parse(widget.image) : widget.image;
  } catch (error) {
    console.error('Failed to parse widget configuration:', error);
    return null;
  }
};

// Fetch virtual pins from a specific template
const fetchTemplateVirtualPins = async (templateId) => {
  try {
    if (!templateId) {
      console.warn('No template ID provided for fetching virtual pins');
      return [];
    }
    
    const token = sessionStorage.getItem('authToken');
    const response = await fetch(`https://cloud-platform-server-for-bjit.onrender.com/users/templates/${templateId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch template with ID: ${templateId}`);
    }
    
    const data = await response.json();
    
    if (data && data.template && data.template.virtual_pins) {
      return data.template.virtual_pins;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching virtual pins:', error);
    return [];
  }
};

const WidgetConfigModal = ({ widget, isOpen, onClose, onSave, templateId }) => {
  const [config, setConfig] = useState(null);
  const [virtualPins, setVirtualPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPin, setSelectedPin] = useState('');
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [currentValue, setCurrentValue] = useState(50);
  
  // Get widget configuration on mount
  useEffect(() => {
    if (widget) {
      const widgetConfig = parseWidgetConfig(widget);
      setConfig(widgetConfig);
      
      // Set default values from configuration if available
      if (widgetConfig && widgetConfig.state) {
        setMinValue(widgetConfig.state.min_value || 0);
        setMaxValue(widgetConfig.state.max_value || 100);
        setCurrentValue(widgetConfig.state.default_value || 50);
      }
      
      // If there's already a pin set in the config, select it
      if (widgetConfig && widgetConfig.pinConfig && widgetConfig.pinConfig.id) {
        setSelectedPin(widgetConfig.pinConfig.id);
      }
      
      // Load virtual pins from the current template
      const loadPins = async () => {
        setLoading(true);
        const pins = await fetchTemplateVirtualPins(templateId);
        setVirtualPins(pins);
        setLoading(false);
      };
      
      if (templateId) {
        loadPins();
      } else {
        setLoading(false);
        console.warn('No template ID provided for widget configuration');
      }
    }
  }, [widget, templateId]);
  
  const getNormalizedType = () => {
    if (!config) return 'unknown';
    
    const type = (config.type || '').toLowerCase().replace('3d_', '');
    
    // Map similar types to a standard type
    switch (type) {
      case 'switch':
      case 'toggle':
        return 'switch';
      case 'slider':
      case 'range':
        return 'slider';
      case 'gauge':
      case 'meter':
        return 'gauge';
      case 'number_input':
      case 'numberinput':
      case 'number':
        return 'number_input';
      default:
        return type;
    }
  };
  
  const handleSave = () => {
    if (!config) return;
    
    // Create updated configuration
    const updatedConfig = {
      ...config,
      state: {
        ...config.state,
        min_value: parseFloat(minValue),
        max_value: parseFloat(maxValue),
        default_value: parseFloat(currentValue)
      },
      pinConfig: selectedPin ? { id: selectedPin } : undefined
    };
    
    // Call onSave with the updated widget
    onSave({
      ...widget,
      image: JSON.stringify(updatedConfig)
    });
    
    // Close the modal
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Configure {widget.name || 'Widget'}
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Show message if no template selected */}
                {!templateId && (
                  <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-700 mb-4">
                    No template selected. Please select a template to configure virtual pins.
                  </div>
                )}
                
                {/* Virtual Pin Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Virtual Pin
                  </label>
                  <select
                    value={selectedPin}
                    onChange={(e) => setSelectedPin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    disabled={!templateId || virtualPins.length === 0}
                  >
                    <option value="">-- Select Pin --</option>
                    {virtualPins.map((pin) => (
                      <option key={pin._id || pin.pin_id} value={pin._id || pin.pin_id}>
                        Pin {pin.pin_id}
                      </option>
                    ))}
                  </select>
                  {templateId && virtualPins.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      No virtual pins available in this template.
                    </p>
                  )}
                </div>
                
                {/* Min Value */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Min Value
                  </label>
                  <input
                    type="number"
                    value={minValue}
                    onChange={(e) => setMinValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                {/* Max Value */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Value
                  </label>
                  <input
                    type="number"
                    value={maxValue}
                    onChange={(e) => setMaxValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                {/* Current Value */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Value
                  </label>
                  <input
                    type="number"
                    value={currentValue}
                    min={minValue}
                    max={maxValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                {/* Show different config options based on widget type */}
                {getNormalizedType() === 'switch' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Default State
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={currentValue === 1}
                          onChange={() => setCurrentValue(1)}
                          className="form-radio text-blue-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">On</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={currentValue === 0}
                          onChange={() => setCurrentValue(0)}
                          className="form-radio text-blue-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Off</span>
                      </label>
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

WidgetConfigModal.propTypes = {
  widget: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    instanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  templateId: PropTypes.string
};

export default WidgetConfigModal;