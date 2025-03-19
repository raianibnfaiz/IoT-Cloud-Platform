import { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  const [isDragging, setIsDragging] = useState(false);
  // Keep track of exactly when drag ended to completely disable config clicks
  const [dragEndTime, setDragEndTime] = useState(0);
  
  // Calculate if enough time has passed since last drag (1 second cooldown)
  const isClickDisabled = () => {
    return Date.now() - dragEndTime < 1000; 
  };

  const style = {
    zIndex: isDragging ? 999 : 1,
    position: 'absolute',
  };

  // Framer Motion variants for smooth animations
  const variants = {
    exit: { scale: 0.8, opacity: 0 },
    hover: { scale: 1.02 },
    drag: { scale: 1.1, cursor: 'grabbing' }
  };
  
  // Safely handles widget click events - completely blocks during cooldown
  const handleWidgetClick = (widget) => {
    // If dragging recently happened, block ALL clicks for a full second
    if (isClickDisabled()) {
      console.log("Config click blocked - too soon after drag");
      return;
    }
    
    // Only if sufficient time has passed, allow the config click
    onConfigClick(widget);
  };

  return (
    <motion.div
      style={{
        ...style,
        filter: isDragging ? 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))' : 'none',
      }}
      className="group relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: component.position.x,
        y: component.position.y,
      }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 350,
        mass: 0.5
      }}
      exit="exit"
      whileHover={isClickDisabled() ? {} : "hover"} // Disable hover effect during cooldown
      whileDrag="drag"
      variants={variants}
      drag={true}
      dragMomentum={false}
      dragElastic={0}
      dragTransition={{
        power: 0.1,
        timeConstant: 0,
        modifyTarget: target => target
      }}
      onDragStart={() => {
        setIsDragging(true);
        // Reset the drag end time while dragging
        setDragEndTime(0);
      }}
      onDrag={() => {
        // Continuously update drag end time during drag to ensure cooldown starts from latest drag
        setDragEndTime(Date.now());
      }}
      onDragEnd={(event, info) => {
        // Calculate the final position at drag end
        const newPosition = {
          x: component.position.x + info.offset.x,
          y: component.position.y + info.offset.y
        };
        
        // Update parent state with new position
        onDrag(component, newPosition);
        
        // Set the drag end time to now to start the cooldown
        setDragEndTime(Date.now());
        
        // Reset the dragging state
        setIsDragging(false);
      }}
    >
      {/* Use a pointer-events-none overlay during cooldown to visually indicate and block all clicks */}
      {isClickDisabled() && (
        <div 
          className="absolute inset-0 bg-transparent z-10" 
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => {
            e.stopPropagation();
            console.log("Interaction blocked during cooldown");
          }}
        />
      )}
      
      <Widget3D
        widget={component}
        isPreviewMode={false}
        onValueChanged={(value) => onValueChanged(component.instanceId, value)}
        onConfigClick={handleWidgetClick}
      />
      
      <motion.button
        onClick={() => onDelete(component.instanceId)}
        className="absolute top-0 right-0 bg-red-600 hover:bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100"
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
  // Add this theme override style to ensure dark theme consistency
  useEffect(() => {
    // Add a style tag to enforce dark theme
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .playground-dark-theme {
        --bg-primary: #0f1419;
        --bg-secondary: #1a1e26;
        --bg-tertiary: #242a33;
        --text-primary: #ffffff;
        --text-secondary: #e1e5ea;
        --text-muted: #b0b8c1;
        --accent-blue: #3b82f6;
        --accent-emerald: #10b981;
        --accent-indigo: #6366f1;
        --accent-amber: #f59e0b;
        --danger: #ef4444;
        --border-color: rgba(75, 85, 99, 0.4);
      }
      
      /* Force color scheme to dark */
      @media (prefers-color-scheme: light) {
        .force-dark-theme {
          color-scheme: dark !important;
        }
      }
    `;
    document.head.appendChild(styleElement);
    
    // Add classes to body to enforce dark theme
    document.body.classList.add('force-dark-theme', 'playground-dark-theme');
    
    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleElement);
      document.body.classList.remove('force-dark-theme', 'playground-dark-theme');
    }
  }, []);
  
  const { templateId } = useParams();
  const navigate = useNavigate();
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
      
      // Debug: Log the position data from server response
      if (data.template && data.template.widget_list) {
        console.log("Server response widget_list positions:", 
          data.template.widget_list.map(widget => ({
            id: widget.widget_id?._id || widget._id,
            position: widget.position
          }))
        );
      }
      
      setTemplateDetails(data);
      
      // If template has widgets, add them to the playground
      if (data.template && data.template.widget_list && data.template.widget_list.length > 0) {
        console.log("Loading template with widget_list:", JSON.stringify(data.template.widget_list, null, 2));
        
        // Check if we need to fetch widget details separately (if widget_id is null)
        if (data.template.widget_list.some(widget => widget.widget_id === null)) {
          // First, get all widgets for reference
          await fetchAvailableWidgets();
          console.log("Creating components from template widgets widget_id == null :", data.template.widget_list);
          
          // Map the widget list to components, using availableWidgets for widget details
          const templateComponents = data.template.widget_list.map((widget, index) => {
            // Try to find the widget in availableWidgets using the _id from pinConfig or other means
            // For now, just create a placeholder component
            
            // Ensure position data is properly extracted and formatted
            const position = widget.position && typeof widget.position === 'object' && 
                           typeof widget.position.x === 'number' && 
                           typeof widget.position.y === 'number' 
                           ? widget.position 
                           : { x: 100 + index * 50, y: 100 + index * 50 };
            
            console.log(`Loading placeholder widget ${index} position:`, position);
            
            return {
              _id: widget._id || `placeholder_${index}`,
              name: `Widget ${index + 1}`,
              type: "unknown",
              instanceId: `template_${widget._id}_${index}`,
              position: position,
              // Store pinConfig for later use
              pinConfig: widget.pinConfig
            };
          });
          
          setComponents(templateComponents);
          console.log("Created placeholder components widget_id_exists:", templateComponents);
        } else {
          // Convert template widgets to playground components
          const templateComponents = data.template.widget_list.map((widget, index) => {
            // Ensure position data is properly extracted and formatted
            const position = widget.position && typeof widget.position === 'object' && 
                            typeof widget.position.x === 'number' && 
                            typeof widget.position.y === 'number' 
                            ? widget.position 
                            : { x: 100 + index * 50, y: 100 + index * 50 };
            
            console.log(`Loading widget ${index} position:`, position);
            
            return {
              ...widget.widget_id,
              instanceId: `template_${widget.widget_id?._id || widget._id}_${index}`,
              position: position,
              // Store pinConfig for reference
              pinConfig: widget.pinConfig
            };
          });
          
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
    // Store the last component position for grid highlighting
    setLastComponentPosition(newPosition);
    
    // Ensure position values are always numbers
    const validPosition = {
      x: parseFloat(newPosition.x) || 0,
      y: parseFloat(newPosition.y) || 0
    };
    
    // Update components state - using functional update to avoid stale state issues
    setComponents(prevComponents => 
      prevComponents.map(c => 
        c.instanceId === component.instanceId
          ? { ...c, position: validPosition }
          : c
      )
    );
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
    console.log('Resetting widget:', updatedWidget);
    updatedWidget.pinConfig = [];
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
        // Check if the component has a direct pinConfig property
        else if (component.pinConfig && component.pinConfig.id) {
          pinConfigId = component.pinConfig.id;
        }
        // Check if the component has a direct pinConfig as an array
        else if (component.pinConfig && Array.isArray(component.pinConfig) && component.pinConfig.length > 0) {
          pinConfigId = component.pinConfig[0];
        }
        
        console.log("Extracted pinConfigId:", pinConfigId, "Component requires pins:", component.pinRequired);
        
        // Fix: Use _id as the primary identifier, then fall back to widget_id or id
        // Ensure it's always a string to prevent toString() errors
        let widgetId = component._id || component.widget_id || component.id || null;

        // Handle cases where widgetId might be an object with an _id property
        if (widgetId && typeof widgetId === 'object' && widgetId._id) {
          widgetId = widgetId._id;
        }
        
        // Ensure it's a string or null
        widgetId = widgetId ? String(widgetId) : null;
        
        // Debug: Log position data being saved
        console.log(`Widget ${widgetId} position:`, component.position);
        
        // Ensure position has valid x and y values
        const validPosition = {
          x: component.position && typeof component.position.x === 'number' ? component.position.x : 0,
          y: component.position && typeof component.position.y === 'number' ? component.position.y : 0
        };
        
        // Mark if this widget has missing required pins
        const hasMissingRequiredPins = component.pinRequired > 0 && !pinConfigId;
        if (hasMissingRequiredPins) {
          console.warn(`Widget ${component.name || widgetId} requires pins but none are configured!`);
        }
        
        return {
          instance_id: component.instanceId,
          widget_id: widgetId,
          pinConfig: pinConfigId ? [pinConfigId] : [],
          position: validPosition,
          _hasMissingRequiredPins: hasMissingRequiredPins // This flag will be used to filter out invalid widgets
        };
      });
      
      // Filter out widgets that are missing required pins
      const validWidgetList = widgetList
        .filter(widget => !widget._hasMissingRequiredPins)
        .map(widget => {
          // Remove the temporary flag we used for filtering
          const { _hasMissingRequiredPins, ...cleanWidget } = widget;
          return cleanWidget;
        });
      
      if (validWidgetList.length !== widgetList.length) {
        const skippedCount = widgetList.length - validWidgetList.length;
        console.warn(`Skipped ${skippedCount} widgets that require pins but don't have them configured.`);
        if (validWidgetList.length === 0) {
          // Show alert if no valid widgets are left
          alert(`Cannot save template: All widgets (${skippedCount}) require pin configuration. Please configure pins for your widgets using the settings (gear) icon on each widget before saving.`);
          return; // Exit the function early
        } else {
          // Show warning but continue with valid widgets
          alert(`Warning: ${skippedCount} widgets were skipped because they require pin configuration. Configure pins using the settings (gear) icon on each widget.`);
        }
      }
  
      // Prepare request payload - fix the format to exactly match API expectations
      const updateData = {
        template_name: templateDetails?.template?.template_name || "Unnamed Template",
        widget_list: validWidgetList
      };
  
      console.log("Saving template with payload:", updateData);
  
      // Make API call to update template - ensure we're using the correct ID format
      console.log("Using template ID for update:", templateId);
      
      // Filter out any widgets with null widget_id to prevent errors
      const finalWidgetList = validWidgetList.filter(widget => widget.widget_id !== null);
      
      if (finalWidgetList.length !== validWidgetList.length) {
        console.warn(`Filtered out ${validWidgetList.length - finalWidgetList.length} widgets with null IDs`);
      }
      
      // Update the request data with final validated widget list
      updateData.widget_list = finalWidgetList;
      
      // Debug: Log final payload before sending to server
      console.log("Final template update payload:", JSON.stringify(updateData, null, 2));
      
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

      //fetch the template details again to update the widget list
      fetchTemplateDetails();
  
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
      
      // Provide more detailed error information to help debugging
      let errorMessage = error.message || "Unknown error occurred";
      
      // If there's a specific API error message in the error, try to extract and display it
      if (errorMessage.includes("{") && errorMessage.includes("}")) {
        try {
          const errorJson = JSON.parse(errorMessage.substring(
            errorMessage.indexOf("{"), 
            errorMessage.lastIndexOf("}") + 1
          ));
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {
          // If parsing fails, keep the original error message
          console.warn("Failed to parse error JSON:", e);
        }
      }
      
      alert(`Failed to save template: ${errorMessage}`);
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
            <h2 className="text-lg font-bold mb-4 text-white">Available Widgets</h2>

            {/* Show template information if template is loaded */}
            {templateDetails && (
              <div className="mb-6 p-3 bg-gray-700/60 border border-gray-600/50 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-2">Template Details</h3>
                <p className="text-gray-200 text-sm">Name: {templateDetails.template.template_name}</p>
                <p className="text-gray-200 text-sm">ID: {templateDetails.template.template_id}</p>
                <p className="text-gray-200 text-sm">
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

  // Function to navigate to preview screen
  const handlePreviewClick = () => {
    // Navigate to preview screen with all necessary data
    navigate(`/preview/${templateId}`, {
      state: {
        components: components,
        widgetStates: widgetStates,
        templateName: templateDetails?.template?.template_name || "Template Preview"
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header - Updated with consistent colors */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
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
            <div className="px-3 py-1 bg-gray-700 text-white rounded flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Loading Template...
            </div>
          ) : (
            <>
              <button 
                onClick={handlePreviewClick}
                className="px-3 py-1 bg-indigo-700 hover:bg-indigo-600 text-white font-medium rounded transition-colors"
              >
                Preview
              </button>
              <button
                onClick={handleExportPlayground}
                className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white font-medium rounded transition-colors"
              >
                Save
              </button>
              
              <button 
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded transition-colors"
              >
                Settings
              </button>
              <button
                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded transition-colors"
                onClick={fetchAvailableWidgets}
              >
                Refresh Widgets
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden p-4">
        {/* Sidebar - Updated to use consistent dark theme colors */}
        <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4">
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

        <div className="flex-1 relative bg-[#0f1419] p-2 m-2 overflow-hidden" ref={gridRef}>
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

        <div className="w-64 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
          {renderSidebarContent()}
        </div>
      </div>

      <footer className="bg-gray-800 border-t border-gray-700 text-gray-300 text-center py-2">
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
        darkThemeOverride={true} // Pass prop to enforce dark theme in the modal
      />
    </div>
  );
};

export default Playground;