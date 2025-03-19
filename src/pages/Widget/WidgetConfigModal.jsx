import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { API_ENDPOINTS } from '../../config/apiEndpoints';

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
    const response = await fetch(API_ENDPOINTS.TEMPLATE_DETAILS(templateId), {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch template with ID: ${templateId}`);
    }
    console.log('Fetched Response:', response);
    
    const data = await response.json();
    console.log('Fetched virtual pins:', data);
    
    if (data && data.template && data.template.virtual_pins) {
      return data.template.virtual_pins;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching virtual pins:', error);
    return [];
  }
};

const WidgetConfigModal = ({ widget, isOpen, onClose, onSave, templateId, onReset, onVirtualPinUpdate }) => {
  const [config, setConfig] = useState(null);
  const [virtualPins, setVirtualPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPin, setSelectedPin] = useState('');
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [currentValue, setCurrentValue] = useState(50);
  const [isPinAlreadySelected, setIsPinAlreadySelected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Get widget configuration on mount
  useEffect(() => {
    if (widget) {
      console.log('Widget:', widget);
      const widgetConfig = parseWidgetConfig(widget);
      setConfig(widgetConfig);
      setErrorMessage(''); // Clear any previous errors
      console.log('Widget Config:', widgetConfig);
            
      // Load virtual pins from the current template
      const loadPins = async () => {
        setLoading(true);
        const pins = await fetchTemplateVirtualPins(templateId);
        console.log('Fetched Pins:', pins);
        setVirtualPins(pins);

        if(widget && widget.pinConfig && widget.pinConfig.length > 0) {
          console.log("Setting pin from existing config:", widget.pinConfig[0]);
          widget.pinConfig.map((pin) => {
            if(pin.id|| pin._id) {
              widgetConfig.pinConfig ={id: pin.id || pin._id};
              widgetConfig.state.min_value = pin.min_value;
              widgetConfig.state.max_value = pin.max_value;
              widgetConfig.state.default_value = pin.value;
              setConfig(widgetConfig);
            }
          });
        }

              // Set default values from configuration if available
      if (widgetConfig && widgetConfig.state) {
        setMinValue(widgetConfig.state.min_value || 0);
        setMaxValue(widgetConfig.state.max_value || 100);
        setCurrentValue(widgetConfig.state.default_value || 0);
      }

        
        // If widget already has a pin configured, select that pin and mark as selected
        if (widgetConfig && widgetConfig.pinConfig && widgetConfig.pinConfig.id) {
          console.log("Setting pin from existing config:", widgetConfig.pinConfig.id);
          setSelectedPin(widgetConfig.pinConfig.id);
          setIsPinAlreadySelected(true);
          console.log("check");
          console.log(widgetConfig)
        } else {
          // For new widgets, find the smallest available pin number
          setIsPinAlreadySelected(false);
          const availablePins = pins.filter(pin => !pin.is_used);
          if (availablePins.length > 0) {
            const sortedPins = [...availablePins].sort((a, b) => {
              return parseInt(a.pin_id) - parseInt(b.pin_id);
            });
            console.log("Auto-selecting smallest pin:", sortedPins[0]._id);
            setSelectedPin(sortedPins[0]._id || sortedPins[0].pin_id);
          } else {
            console.log("No available pins found");
            setSelectedPin('');
          }
        }
        
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

  useEffect(() => {
    // Notify parent component about pin usage changes
    if (virtualPins.length > 0) {
      const availablePinsCount = virtualPins.filter(pin => !pin.is_used).length;
      onVirtualPinUpdate && onVirtualPinUpdate(availablePinsCount, virtualPins.length);
    }
  }, [virtualPins]);
  
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
  
  const handleSave = async () => {
    console.log('Saving configuration...');
    if (!config) return;
    
    // Check if the widget requires a pin but none is selected
    if (widget.pinRequired > 0 && !selectedPin) {
      setErrorMessage(`This widget requires ${widget.pinRequired} pin(s). Please select a pin before saving.`);
      return;
    }
    
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
    
    // If a pin is selected, update its information in the backend
    if (selectedPin) {
      try {
        const token = sessionStorage.getItem('authToken');
        const selectedPinData = virtualPins.find(pin => (pin._id || pin.pin_id) === selectedPin);
        
        if (selectedPinData) {
          const response = await fetch(
            API_ENDPOINTS.UPDATE_VIRTUAL_PIN(selectedPin, templateId),
            {
              method: 'PUT',
              headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                pin_id: selectedPinData.pin_id,
                pin_name: selectedPinData.pin_name || `virtual pin ${selectedPinData.pin_id}`,
                value: parseFloat(currentValue),
                min_value: parseFloat(minValue),
                max_value: parseFloat(maxValue),
                is_used: true
              })
            }
          );
          
          if (!response.ok) {
            console.error('Failed to update virtual pin:', await response.text());
          } else {
            console.log('Virtual pin updated successfully');
            // Update local state to reflect pin usage
            setVirtualPins(prevPins => 
              prevPins.map(pin => 
                (pin._id || pin.pin_id) === selectedPin 
                  ? { ...pin, is_used: true } 
                  : pin
              )
            );
          }
        }
      } catch (error) {
        console.error('Error updating virtual pin:', error);
      }
    }
    console.log('Updated Config:', updatedConfig);
    // Call onSave with the updated widget
    onSave({
      ...widget,
      image: JSON.stringify(updatedConfig)
    });
    
    // Close the modal
    onClose();
  };

  // Update the resetSelectedPin function to make a DELETE API call
  const resetSelectedPin = async () => {

    const updatedConfig = {
      ...config,
      state: {
        ...config.state,
        min_value: parseFloat(0),
        max_value: parseFloat(100),
        default_value: parseFloat(50)
      },
      pinConfig: undefined
    };

    onReset({
      ...widget,
      image: JSON.stringify(updatedConfig)
    });

    // If a pin is currently selected, attempt to delete it first
    if (selectedPin) {
      try {
        const token = sessionStorage.getItem('authToken');
        
        // Make the DELETE request to free up the virtual pin
        const response = await fetch(
          API_ENDPOINTS.DELETE_VIRTUAL_PIN(selectedPin, templateId),
          {
            method: 'DELETE',
            headers: {
              'accept': '*/*',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (response.ok) {
          let newPins  = await response.json();
          console.log(`Successfully reset virtual pin with ID: ${selectedPin}`);
          //console.log("virtual pins", virtualPins);
          console.log("V pin", newPins);
          // Update the local virtualPins state to reflect the pin is now available
          // setVirtualPins(prevPins => 
          //   prevPins.map(pin => 
          //     (pin._id || pin.pin_id) === selectedPin 
          //       ? { ...pin, is_used: false } 
          //       : pin
          //   )
          // );

          
         // console.log("new pins 1", newPins);
          // widgetConfig && widgetConfig.pinConfig && widgetConfig.pinConfig.id && widgetConfig.pinConfig.id == selectedPin && (widgetConfig.pinConfig = {});
          //setConfig(null);
        
          setVirtualPins(newPins);
          //console.log("virtual pins 2", virtualPins);
          // If pin was previously assigned, it's no longer considered "already selected"
          setIsPinAlreadySelected(false);
          
          // Now find and select the smallest available pin
          const updatedPins = [...virtualPins].map(pin => 
            (pin._id || pin.pin_id) === selectedPin ? { ...pin, is_used: false } : pin
          );
          
          const availablePins = updatedPins.filter(pin => !pin.is_used);
          if (availablePins.length > 0) {
            const sortedPins = [...availablePins].sort((a, b) => {
              return parseInt(a.pin_id) - parseInt(b.pin_id);
            });
            console.log("Reset to smallest available pin:", sortedPins[0]._id);
            setSelectedPin(sortedPins[0]._id || sortedPins[0].pin_id);
          } else {
            setSelectedPin('');
          }

          // Notify parent about pin usage change
          onVirtualPinUpdate && onVirtualPinUpdate(availablePins.length, newPins.length);
        } else {
          console.error('Failed to reset virtual pin:', await response.text());
        }
      } catch (error) {
        console.error('Error resetting virtual pin:', error);
      }
    } else {
      // If no pin was selected, just find the smallest available pin
      const availablePins = virtualPins.filter(pin => !pin.is_used);
      if (availablePins.length > 0) {
        const sortedPins = [...availablePins].sort((a, b) => {
          return parseInt(a.pin_id) - parseInt(b.pin_id);
        });
        setSelectedPin(sortedPins[0]._id || sortedPins[0].pin_id);
      }
    }
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
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-lg w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="space-y-6 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Configure {widget.name || 'Widget'}
              </h3>
              
              {errorMessage && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                  <span className="font-medium">Error:</span> {errorMessage}
                </div>
              )}
              
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
                      Virtual Pin {widget.pinRequired > 0 ? 
                        <span className="text-red-500">*</span> : 
                        ''}
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={selectedPin}
                        onChange={(e) => !isPinAlreadySelected && setSelectedPin(e.target.value)}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          isPinAlreadySelected ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        disabled={!templateId || virtualPins.length === 0 || isPinAlreadySelected}
                      >
                        <option value="">
                          {isPinAlreadySelected ? `Pin ${virtualPins.find(p => (p._id || p.pin_id) === selectedPin)?.pin_id || ''} (Already used)` : "-- Select Pin --"}
                        </option>
                        {!isPinAlreadySelected && virtualPins.map((pin) => (
                          <option 
                            key={pin._id || pin.pin_id} 
                            value={pin._id || pin.pin_id}
                            disabled={pin.is_used && pin._id !== selectedPin}
                          >
                            Pin {pin.pin_id} {pin.is_used && pin._id !== selectedPin ? "(Already in use)" : ""}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => resetSelectedPin()}
                        className="flex-shrink-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        title="Reset pin selection"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* {widget.pinRequired > 0 && (
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        This widget requires {widget.pinRequired} pin(s) to function properly.
                      </p>
                    )} */}
                    
                    {isPinAlreadySelected && (
                      <p className="text-sm text-amber-500">
                        Pin already assigned and cannot be changed
                      </p>
                    )}
                    
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
                      className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        widget.pinRequired > 0 && !selectedPin ? 
                        'bg-blue-300 cursor-not-allowed' : 
                        'bg-blue-500 hover:bg-blue-600'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700`}
                      disabled={widget.pinRequired > 0 && !selectedPin}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
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
    instanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    pinRequired: PropTypes.number
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  templateId: PropTypes.string,
  onReset: PropTypes.func.isRequired,
  onVirtualPinUpdate: PropTypes.func,
};

export default WidgetConfigModal;