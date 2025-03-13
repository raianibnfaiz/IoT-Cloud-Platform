import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import Widget3D from '../Widget/Widget3D';
import WidgetConfigModal from '../Widget/WidgetConfigModal';
import { API_ENDPOINTS } from '../../config/apiEndpoints';

// Helper function to parse widget configuration from image property
const parseWidgetConfig = (imageProperty) => {
  if (!imageProperty) return null;

  // If imageProperty is already an object, return it
  if (typeof imageProperty === 'object') return imageProperty;

  // Try to parse the JSON string
  try {
    return JSON.parse(imageProperty);
  } catch (error) {
    console.error('Error parsing widget configuration:', error);
    // Return a default configuration object
    return {
      type: 'unknown',
      state: {
        default: false,
        default_value: 50,
        default_text: '',
        default_color: '#2196F3'
      },
      appearance: {
        color: '#2196F3',
        size: 'medium'
      }
    };
  }
};

const DraggableComponent = ({ component, onValueChanged, onDelete, onConfigClick, onDrag }) => {
  const [position, setPosition] = useState({ x: component.position.x, y: component.position.y });
  const [isDragging, setIsDragging] = useState(false);
  const [wasDragged, setWasDragged] = useState(false);

  const style = {
    zIndex: isDragging ? 999 : 1,
    position: 'absolute',
  };

  // Framer Motion variants for smooth animations
  const variants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    hover: { scale: 1.02 },
    drag: { scale: 1.1, cursor: 'grabbing' }
  };

  return (
    <motion.div
      style={style}
      className="group relative"
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      whileDrag="drag"
      variants={variants}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragTransition={{
        power: 0,
        timeConstant: 0,
        modifyTarget: target => target
      }}
      onDragStart={() => {
        setIsDragging(true);
        setWasDragged(false);
      }}
      onDrag={(event, info) => {
        const newPosition = {
          x: position.x + info.delta.x,
          y: position.y + info.delta.y
        };
        setPosition(newPosition);
        setWasDragged(true); // Mark that actual movement occurred
        onDrag(component, newPosition);
      }}
      onDragEnd={() => {
        setIsDragging(false);
        // Keep track that this component was recently dragged
        // This flag will be used to prevent the config modal from opening
      }}
    >
      <Widget3D
        widget={component}
        isPreviewMode={false}
        onValueChanged={(value) => onValueChanged(component.instanceId, value)}
        onConfigClick={(widget) => {
          // Only open the config modal if the component wasn't being dragged
          if (!wasDragged) {
            onConfigClick(widget);
          }
          // Reset the dragged state after a short delay
          setTimeout(() => setWasDragged(false), 300);
        }}
      />
      <motion.button
        onClick={() => onDelete(component.instanceId)}
        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        ×
      </motion.button>
    </motion.div>
  );
};

// Update PropTypes
DraggableComponent.propTypes = {
  component: PropTypes.shape({
    instanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    position: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }).isRequired,
    name: PropTypes.string,
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  }).isRequired,
  onValueChanged: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onConfigClick: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired
};

const Playground = () => {
  const { templateId } = useParams();
  const [components, setComponents] = useState([]);
  const [activeSidebarTab, setActiveSidebarTab] = useState('components');
  const [availableWidgets, setAvailableWidgets] = useState([]);
  const [loadingWidgets, setLoadingWidgets] = useState(false);
  const [widgetStates, setWidgetStates] = useState({});
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [gridPattern, setGridPattern] = useState([]);
  const gridRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lastComponentPosition, setLastComponentPosition] = useState(null);
  const [templateDetails, setTemplateDetails] = useState(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [availablePinsCount, setAvailablePinsCount] = useState(0);
  const [totalPinsCount, setTotalPinsCount] = useState(0);

  const token = sessionStorage.getItem('authToken');

  // Fetch template details if templateId is provided
  useEffect(() => {
    if (templateId) {
      fetchTemplateDetails();
    }
  }, [templateId]);

  // Function to fetch template details
  const fetchTemplateDetails = async () => {
    if (!templateId) return;

    setLoadingTemplate(true);
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
      setTemplateDetails(data);
      
      // If template has widgets, add them to the playground
      if (data.template && data.template.widget_list && data.template.widget_list.length > 0) {
        // Check if we need to fetch widget details separately (if widget_id is null)
        if (data.template.widget_list.some(widget => widget.widget_id === null)) {
          // First, get all widgets for reference
          await fetchAvailableWidgets();
          console.log("Creating components from template widgets widget_id == null :", data.template.widget_list);
          
          // Map the widget list to components, using availableWidgets for widget details
          const templateComponents = data.template.widget_list.map((widget, index) => {
            // Try to find the widget in availableWidgets using the _id from pinConfig or other means
            // For now, just create a placeholder component
            return {
              _id: widget._id || `placeholder_${index}`,
              name: `Widget ${index + 1}`,
              type: "unknown",
              instanceId: `template_${widget._id}_${index}`,
              position: widget.position || { x: 100 + index * 50, y: 100 + index * 50 },
              // Store pinConfig for later use
              pinConfig: widget.pinConfig
            };
          });
          
          setComponents(templateComponents);
          console.log("Created placeholder components widget_id_exists:", templateComponents);
        } else {
          // Convert template widgets to playground components
          console.log("widgets:", data.template.widget_list);
          const templateComponents = data.template.widget_list.map((widget, index) => ({
            ...widget.widget_id,
            instanceId: `template_${widget.widget_id?._id || widget._id}_${index}`,
            position: widget.position || { x: 100 + index * 50, y: 100 + index * 50 },
            // Store pinConfig for reference
            pinConfig: widget.pinConfig
          }));

          console.log("templateComponent:", templateComponents);
          
          setComponents(templateComponents);
        }
      }

      // Update pins counts
      if (data.template && data.template.virtual_pins) {
        const pins = data.template.virtual_pins;
        const availablePins = pins.filter(pin => !pin.is_used).length;
        setAvailablePinsCount(availablePins);
        setTotalPinsCount(pins.length);
      }
    } catch (error) {
      console.error('Error fetching template details:', error);
    } finally {
      setLoadingTemplate(false);
    }
  };

  useEffect(() => {
    fetchAvailableWidgets();
    
    // Add window resize listener to update grid
    const handleResize = () => {
      if (gridRef.current) {
        setGridPattern(createGridPattern());
      }
    };
    
    const handleMouseMove = (e) => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setGridPattern(createGridPattern());
      }
    };
    
    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('mousemove', handleMouseMove);
    }
    
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
      if (gridElement) {
        gridElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [gridRef.current]);

  // Update grid pattern when components change
  useEffect(() => {
    if (gridRef.current) {
      setGridPattern(createGridPattern());
    }
  }, [components]);

  // Update grid pattern when the grid container is first rendered
  useEffect(() => {
    if (gridRef.current) {
      setGridPattern(createGridPattern());
    }
  }, [gridRef.current]);

  const fetchAvailableWidgets = async () => {
    setLoadingWidgets(true);
    try {
      const response = await fetch(API_ENDPOINTS.WIDGETS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch widgets');
      }

      const data = await response.json();

      // Process the widget data to ensure image property is properly structured
      const processedWidgets = data.map(widget => {
        // Ensure the image property is parsed if it's a string
        if (widget.image && typeof widget.image === 'string') {
          try {
            widget.image = JSON.parse(widget.image);
          } catch (error) {
            // If parsing fails, keep the original string
            console.error(`Error parsing widget image for ${widget.name}:`, error);
          }
        }

        return widget;
      });

      setAvailableWidgets(processedWidgets);
    } catch (error) {
      console.error('Error fetching widgets:', error);
    } finally {
      setLoadingWidgets(false);
    }
  };

  const handleComponentDrag = (component, newPosition) => {
    setLastComponentPosition(newPosition);
    setComponents(components.map(c => {
      if (c.instanceId === component.instanceId) {
        return {
          ...c,
          position: newPosition
        };
      }
      return c;
    }));
  };

  const handleAddComponent = (widget) => {
    const widgetConfig = parseWidgetConfig(widget.image);
    const normalizedType = getNormalizedType(widgetConfig);

    // Generate a unique instance ID
    const instanceId = Date.now();

    // Set initial position in the center of the grid
    const gridContainer = gridRef.current;
    const centerX = gridContainer ? gridContainer.clientWidth / 2 : 300;
    const centerY = gridContainer ? gridContainer.clientHeight / 2 : 300;

    // Store this position for grid highlighting
    setLastComponentPosition({
      x: centerX,
      y: centerY
    });

    // Create new component with default values based on widget type
    const newComponent = {
      instanceId,
      widget_id: widget._id,
      name: widget.name,
      type: widget.type,
      image: widget.image,
      position: {
        x: centerX,
        y: centerY,
      },
      value: getDefaultValueForType(normalizedType),
    };

    setComponents([...components, newComponent]);

    // Update widget states
    setWidgetStates((prevStates) => ({
      ...prevStates,
      [instanceId]: {
        id: instanceId,
        name: widget.name,
        type: normalizedType,
        value: getDefaultValueForType(normalizedType),
      },
    }));

    // Update grid pattern to show highlight around new component
    setGridPattern(createGridPattern());
  };

  const handleDeleteComponent = async (instanceId) => {
    console.log('Deleting component widget:', instanceId);
    
    // Find the component to get its pinConfig
    const componentToDelete = components.find(c => c.instanceId === instanceId);
    
    if (componentToDelete) {
      // Check if the component has a pinConfig with an id
      let pinId = null;
      
      // Extract pinConfig from image if it's a string
      if (typeof componentToDelete.image === 'string') {
        try {
          const parsedConfig = JSON.parse(componentToDelete.image);
          if (parsedConfig.pinConfig && parsedConfig.pinConfig.id) {
            pinId = parsedConfig.pinConfig.id;
          }
        } catch (error) {
          console.error('Error parsing widget configuration for pin ID:', error);
        }
      } 
      // If the image is already an object
      else if (componentToDelete.image && componentToDelete.image.pinConfig) {
        pinId = componentToDelete.image.pinConfig.id;
      }
      
      // If we found a valid pin ID and have a template ID, delete the virtual pin
      if (pinId && templateId) {
        try {
          const token = sessionStorage.getItem('authToken');
          const response = await fetch(
            API_ENDPOINTS.DELETE_VIRTUAL_PIN(pinId, templateId),
            {
              method: 'DELETE',
              headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          if (response.ok) {
            console.log(`Successfully deleted virtual pin with ID: ${pinId}`);
          } else {
            console.error('Failed to delete virtual pin:', await response.text());
          }
        } catch (error) {
          console.error('Error deleting virtual pin:', error);
        }
      }
    }
    
    // Remove component from state
    setComponents(components.filter((c) => c.instanceId !== instanceId));
  
    // Remove from widget states
    setWidgetStates((prevStates) => {
      const newStates = { ...prevStates };
      delete newStates[instanceId];
      return newStates;
    });
  
    // Update grid pattern after component is removed
    setTimeout(() => setGridPattern(createGridPattern()), 50);
  };

  const handleValueChanged = (instanceId, newValue) => {
    // Update the state for the specific widget
    setWidgetStates(prev => ({
      ...prev,
      [instanceId]: newValue
    }));

    // Find the component to get its type
    const component = components.find(c => c.instanceId === instanceId);
    if (!component) return;

    const config = parseWidgetConfig(component);
    if (!config) return;

    // Log the state change for debugging
    console.log(`Widget ${component.name} (${config.type}) state changed:`, newValue);

    // Here you would typically send the state change to a server
    // For example:
    // sendStateToServer(instanceId, config.type, newValue);
  };

  const handleConfigClick = (widget) => {
    // Ensure we have the latest pin configuration from the template
    const widgetWithPinConfig = {...widget};
    let hasPinConfigId = false;
    console.log("Checking widget with pin data:", widget);
    // If the widget has image data as a string, parse it to extract pinConfig
    if (typeof widget.image === 'string') {
      try {
        const parsedConfig = JSON.parse(widget.image);
        if (parsedConfig.pinConfig && parsedConfig.pinConfig.id) {
          widgetWithPinConfig.pinConfig = parsedConfig.pinConfig;
          hasPinConfigId = true;
        }
      } catch (error) {
        console.error('Error parsing widget configuration:', error);
      }
    } 
    // If the image is already an object, check for pinConfig
    else if (widget.image && widget.image.pinConfig && widget.image.pinConfig.id) {
      widgetWithPinConfig.pinConfig = widget.image.pinConfig;
      hasPinConfigId = true;
    }
    
    // Add a flag to indicate if the widget already has a selected pin
    widgetWithPinConfig.hasPinAssigned = hasPinConfigId;
    
    console.log("Opening config for widget with pin data:", widgetWithPinConfig);
    setSelectedWidget(widgetWithPinConfig);
    setConfigModalOpen(true);
  };

  const handleReset = (updatedWidget) => {
    setComponents(components.map(component => {
      if (component.instanceId === updatedWidget.instanceId) {
        return {
          ...component,
          ...updatedWidget
        };
      }
      return component;
    }));
  };
  

  const handleSaveConfig = (updatedWidget) => {
    // Update the component with the new configuration
    setComponents(components.map(component => {
      if (component.instanceId === updatedWidget.instanceId) {
        return {
          ...component,
          ...updatedWidget
        };
      }
      return component;
    }));

    // Close the modal
    setConfigModalOpen(false);
    setSelectedWidget(null);
  };

  const handleExportPlayground = async () => {
    // Show loading indicator or disable button here if needed
    try {
      // Prepare widget list for API
      const widgetList = components.map(component => {
        console.log("Checking Widget ID",component)
        const config = parseWidgetConfig(component.image);
        let pinConfigId = null;
  
        // Extract pinConfig.id from component configuration
        if (config && config.pinConfig && config.pinConfig.id) {
          pinConfigId = config.pinConfig.id;
        }
      console.log("Checking Widget ID",component)
        // Fix: Format widget_id correctly and ensure all fields match API expectations
        return {
          widget_id: component.widget_id || component._id,
          pinConfig: pinConfigId ? [pinConfigId] : component.pinConfig || [],
          pinValue: {
            pinConfigId: {
              value: 100,
              min_value: 0,
              max_value: 255,
            },
          },
          position: component.position || { x: 0, y: 0 }
        };
      });
  
      // Prepare request payload - fix the format to exactly match API expectations
      const updateData = {
        template_name: templateDetails?.template?.template_name || "Unnamed Template",
        widget_list: widgetList
      };
  
      console.log("Saving template with payload:", updateData);
  
      // Make API call to update template - ensure we're using the correct ID format
      const response = await fetch(
        API_ENDPOINTS.UPDATE_TEMPLATE(templateId),
        {
          method: 'PUT',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        }
      );
  
      // If we get an error, log the full response text for debugging
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Failed to save template: ${errorText}`);
      }
  
      const result = await response.json();
      console.log("Template saved successfully:", result);
      
      // Show success message to user
      alert("Template saved successfully!");
  
      // Optional: Also download a local JSON copy
      // const exportData = {
      //   components: components.map(component => {
      //     const config = parseWidgetConfig(component.image);
      //     return {
      //       id: component._id || component.id,
      //       name: component.name,
      //       type: config?.type || component.type,
      //       position: component.position,
      //       state: widgetStates[component.instanceId],
      //       configuration: config
      //     };
      //   }),
      //   timestamp: new Date().toISOString()
      // };
  
      // const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      // const link = document.createElement('a');
      // link.href = URL.createObjectURL(blob);
      // link.download = `playground_export_${new Date().toISOString().replace(/:/g, '-')}.json`;
      // link.click();
      
    } catch (error) {
      console.error("Error saving template:", error);
      alert(`Failed to save template: ${error.message}`);
    }
  };

  const createGridPattern = () => {
    if (!gridRef.current) return [];

    const gridContainer = gridRef.current;
    const width = gridContainer.clientWidth;
    const height = gridContainer.clientHeight;

    // Make grid size responsive to container size
    const baseGridSize = 20;
    const gridSize = Math.max(baseGridSize, Math.min(width, height) / 50);

    const cols = Math.floor(width / gridSize);
    const rows = Math.floor(height / gridSize);

    const dots = [];

    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        const x = col * gridSize;
        const y = row * gridSize;

        // Calculate distance from mouse or last component position
        let distance = Infinity;
        let maxDistance = 150; // Maximum distance for effect

        if (mousePosition.x && mousePosition.y) {
          const dx = mousePosition.x - x;
          const dy = mousePosition.y - y;
          distance = Math.sqrt(dx * dx + dy * dy);
        }

        // Also consider distance from last placed component
        if (lastComponentPosition) {
          const dx = lastComponentPosition.x - x;
          const dy = lastComponentPosition.y - y;
          const componentDistance = Math.sqrt(dx * dx + dy * dy);
          distance = Math.min(distance, componentDistance);
        }

        // Calculate dot size and opacity based on distance
        const baseSize = 3;
        const maxSize = 6;
        const baseOpacity = 0.2;
        const maxOpacity = 0.6;

        let size = baseSize;
        let opacity = baseOpacity;

        if (distance < maxDistance) {
          // Scale size and opacity based on distance
          const factor = 1 - (distance / maxDistance);
          size = baseSize + (maxSize - baseSize) * factor;
          opacity = baseOpacity + (maxOpacity - baseOpacity) * factor;
        }

        dots.push(
          <div
            key={`${row}-${col}`}
            style={{
              height: `${size}px`,
              width: `${size}px`,
              backgroundColor: distance < 50 ? '#4f90f2' : '#ffffff',
              borderRadius: '50%',
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              opacity: opacity,
              transition: 'all 0.2s ease-out',
            }}
          />
        );
      }
    }

    return dots;
  };

  // Helper function to normalize widget types
  const getNormalizedType = (widgetConfig) => {
    if (!widgetConfig || !widgetConfig.type) return 'unknown';

    // Remove any '3d_' prefix and convert to lowercase
    const type = widgetConfig.type.toLowerCase().replace('3d_', '');

    // Map similar types to a standard type
    switch (type) {
      case 'switch':
      case 'toggle':
        return 'switch';
      case 'slider':
      case 'range':
        return 'slider';
      case 'button':
      case 'pushbutton':
        return 'button';
      case 'togglebutton':
        return 'togglebutton';
      case 'gauge':
      case 'meter':
        return 'gauge';
      case 'number_input':
      case 'numberinput':
      case 'number':
        return 'number_input';
      case 'text_input':
      case 'textinput':
      case 'text':
        return 'text_input';
      case 'color_picker':
      case 'colorpicker':
      case 'color':
        return 'color_picker';
      default:
        return type;
    }
  };

  // Helper function to get default values based on widget type
  const getDefaultValueForType = (type) => {
    switch (type) {
      case 'switch':
      case 'togglebutton':
        return false;
      case 'slider':
      case 'gauge':
        return 50;
      case 'button':
        return false;
      case 'number_input':
        return 0;
      case 'text_input':
        return '';
      case 'color_picker':
        return '#2196F3';
      default:
        return null;
    }
  };

  const renderSidebarContent = () => {
    switch (activeSidebarTab) {
      case 'components':
        return (
          <>
            <h2 className="text-lg font-bold mb-4 text-gray-100">Available Widgets</h2>

            {/* Show template information if template is loaded */}
            {templateDetails && (
              <div className="mb-6 p-3 bg-gray-700 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-2">Template Details</h3>
                <p className="text-gray-300 text-sm">Name: {templateDetails.template.template_name}</p>
                <p className="text-gray-300 text-sm">ID: {templateDetails.template.template_id}</p>
                <p className="text-gray-300 text-sm">
                  Available Pins: {availablePinsCount} / {totalPinsCount}
                </p>
                {availablePinsCount === 0 && totalPinsCount > 0 && (
                  <p className="text-xs text-red-400 mt-1">
                    No available pins. Reset widgets to free up pins.
                  </p>
                )}
              </div>
            )}

            {loadingWidgets ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {availableWidgets.map((widget) => (
                  <div
                    key={widget._id}
                    onClick={() => handleAddComponent(widget)}
                    className="cursor-pointer border border-gray-300 rounded-md overflow-hidden hover:border-blue-400 transition-colors"
                  >
                    <div className="w-full h-24 flex items-center justify-center bg-gray-700 p-2">
                      <Widget3D
                        widget={widget}
                        isPreviewMode={true}
                        scale={0.8}
                      />
                    </div>
                    <div className="text-center font-bold py-1 text-sm text-gray-300">
                      {widget.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        );
      case 'states':
        return (
          <div>
            <h2 className="text-lg font-bold mb-4 text-gray-100">Widget States</h2>
            {Object.entries(widgetStates).length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No active widgets
              </p>
            ) : (
              Object.entries(widgetStates).map(([instanceId, value]) => {
                const component = components.find(c => c.instanceId.toString() === instanceId);
                if (!component) return null;

                // Get the widget type for better display
                const config = parseWidgetConfig(component);
                const type = config?.type?.replace('3d_', '') || 'unknown';

                // Format the value based on type
                let displayValue;
                if (typeof value === 'boolean') {
                  displayValue = value ? 'ON' : 'OFF';
                } else if (typeof value === 'string' && value.startsWith('#')) {
                  // Color value
                  displayValue = (
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: value }}
                      ></div>
                      {value}
                    </div>
                  );
                } else {
                  displayValue = JSON.stringify(value);
                }

                return (
                  <div 
                    key={instanceId}
                    className="bg-gray-700 p-3 rounded-lg mb-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-200 font-medium truncate mr-2">
                        {component.name || `Widget ${instanceId}`}
                      </span>
                      <span className="text-xs text-gray-400">
                        {type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Value:</span>
                      <span className="bg-gray-600 px-2 py-1 rounded text-gray-200 text-sm">
                        {displayValue}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Handle virtual pin updates from modal
  const handleVirtualPinUpdate = (availableCount, totalCount) => {
    setAvailablePinsCount(availableCount);
    setTotalPinsCount(totalCount);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gray-700 p-4 flex justify-between items-center">
        <div className="flex-shrink-0 flex items-center">
          <Link
            to="/"
            className="h-10 w-10 rounded bg-emerald-500 flex items-center justify-center text-white font-bold"
          >
            BJIT
          </Link>
          <span className="ml-2 text-lg font-semibold text-white transition-colors duration-200">
            Cloud.Playground
            {templateDetails && (
              <span className="ml-2 text-sm bg-blue-600 px-2 py-1 rounded">
                Template: {templateDetails.template.template_name}
              </span>
            )}
          </span>
        </div>
        <div className="flex space-x-4">
          {loadingTemplate ? (
            <div className="px-3 py-1 bg-gray-600 text-white rounded flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Loading Template...
            </div>
          ) : (
            <>
              <button className="px-3 py-1 bg-indigo-900 text-white rounded hover:bg-indigo-700">
                Preview
              </button>
              <button
                onClick={handleExportPlayground}
                className="px-3 py-1 bg-gray-900 border border-gray-300 rounded hover:bg-gray-200"
              >
                Save
              </button>
              
              <button className="px-3 py-1 bg-gray-700 border border-gray-300 rounded hover:bg-gray-200">
                Settings
              </button>
              <button
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={fetchAvailableWidgets}
              >
                Refresh Widgets
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden p-4">
        {/* Sidebar navigation remains the same */}
        <div className="w-16 bg-gray-800 flex flex-col items-center py-4">
          {/* <button
            className={`p-3 rounded-md mb-2 ${activeSidebarTab === 'components'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white'
              }`}
            onClick={() => setActiveSidebarTab('components')}
            title="IoT Widgets"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button> */}
          {/* <button
            className={`p-3 rounded-md mb-2 ${activeSidebarTab === 'states'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white'
              }`}
            onClick={() => setActiveSidebarTab('states')}
            title="Widget States"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </button> */}
        </div>

        <div className="flex-1 relative bg-gray-900 p-2 m-2 overflow-hidden" ref={gridRef}>
          <div className="relative h-full w-full">
            {gridPattern}
            <AnimatePresence>
              {components.map((component) => (
                <DraggableComponent
                  key={component.instanceId}
                  component={component}
                  onValueChanged={handleValueChanged}
                  onDelete={handleDeleteComponent}
                  onConfigClick={() => handleConfigClick(component)}
                  onDrag={handleComponentDrag}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="w-64 bg-gray-800 p-4 overflow-y-auto">
          {renderSidebarContent()}
        </div>
      </div>

      <footer className="bg-gray-800 text-white text-center py-2">
        <p>&copy; 2024 Cloud.Playground by BJIT</p>
      </footer>

      {/* Configuration Modal */}
      <WidgetConfigModal
        widget={selectedWidget}
        isOpen={configModalOpen}
        onClose={() => {
          setConfigModalOpen(false);
          setSelectedWidget(null);
        }}
        onSave={handleSaveConfig}
        templateId={templateId}
        onReset={handleReset}
        onVirtualPinUpdate={handleVirtualPinUpdate}
      />
    </div>
  );
};

export default Playground;