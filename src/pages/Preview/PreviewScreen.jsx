import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Widget3D from '../Widget/Widget3D';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const PreviewScreen = () => {
  const { templateId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State variables
  const [components, setComponents] = useState([]);
  const [widgetStates, setWidgetStates] = useState({});
  const [templateName, setTemplateName] = useState('Preview');
  const [isLoading, setIsLoading] = useState(true);
  const [wsStatus, setWsStatus] = useState('disconnected'); // WebSocket connection status
  
  // WebSocket ref to keep reference across renders
  const webSocketRef = useRef(null);

  // Get template data from the location state or fetch it
  useEffect(() => {
    setIsLoading(true);
    
    // If state was passed directly via navigation
    if (location.state?.components && location.state?.widgetStates) {
      // Process components to ensure consistent IDs
      const processedComponents = location.state.components.map(comp => {
        // Make sure each component has a consistent ID
        const id = comp.id || comp.instanceId || comp._id;
        return { ...comp, id };
      });
      
      // Create normalized widget states object that uses the component IDs
      const normalizedStates = {};
      processedComponents.forEach(comp => {
        const id = comp.id;
        const oldId = comp.instanceId || comp._id;
        
        if (location.state.widgetStates[id]) {
          normalizedStates[id] = location.state.widgetStates[id];
        } else if (location.state.widgetStates[oldId]) {
          normalizedStates[id] = location.state.widgetStates[oldId];
        }
      });
      
      console.log('Processed components:', processedComponents);
      console.log('Normalized widget states:', normalizedStates);
      
      setComponents(processedComponents);
      setWidgetStates(normalizedStates);
      setTemplateName(location.state.templateName || 'Preview');
      setIsLoading(false);
    } else {
      // Fetch template data if not passed in location state
      fetchTemplatesById(templateId)
        .then(data => {
          if (data) {
            // Apply the same ID normalization to fetched data
            const processedComponents = (data.components || []).map(comp => {
              const id = comp.id || comp.instanceId || comp._id;
              return { ...comp, id };
            });
            
            setComponents(processedComponents);
            setWidgetStates(data.widgetStates || {});
            setTemplateName(data.name || 'Preview');
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching template:', error);
          setIsLoading(false);
        });
    }
  }, [templateId, location.state]);
  
  // Initialize WebSocket connection
  useEffect(() => {
    // Only connect WebSocket when we have components loaded
    if (!isLoading && components.length > 0 && templateId) {
      const token = sessionStorage.getItem('authToken');
      
      // Create WebSocket connection
      // You would need to replace this URL with your actual WebSocket server URL
      // Format might be something like: wss://your-api-domain.com/ws/template/${templateId}
      //const wsUrl = `wss://api.example.com/ws/template/${templateId}?token=${token}`;
      const wsUrl = `ws://localhost:8083`;
      console.log('Connecting to WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      webSocketRef.current = ws;
      
      // WebSocket event handlers
      ws.onopen = () => {
        console.log('WebSocket connection established');
        setWsStatus('connected');
        
        // Send initial handshake with template ID
        ws.send(JSON.stringify({
          type: 'init',
          templateId: templateId
        }));
      };
      
      ws.onmessage = (event) => {
        try {
          console.log('WebSocket message received:', event.data);
          const message = JSON.parse(event.data);
          console.log('WebSocket message received:', message);
          
          // Handle different message types
          if (message.type === 'widget_update') {
            // Update the widget state when we receive updates from the server
            setWidgetStates(prevStates => ({
              ...prevStates,
              [message.widgetId]: message.value
            }));
          } else if (message.type === 'bulk_update') {
            // Handle bulk widget state updates
            setWidgetStates(prevStates => ({
              ...prevStates,
              ...message.states
            }));
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsStatus('error');
      };
      
      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        setWsStatus('disconnected');
      };
      
      // Clean up the WebSocket connection when the component unmounts
      return () => {
        console.log('Closing WebSocket connection');
        if (webSocketRef.current) {
          webSocketRef.current.close();
          webSocketRef.current = null;
        }
      };
    }
  }, [isLoading, components, templateId]);
  
  // Handle widget value changes - now also sends updates via WebSocket
  const handleWidgetValueChange = (widgetId, newValue) => {
    console.log(`Widget ${widgetId} value changed to:`, newValue);
    
    // Update local state
    setWidgetStates(prevStates => {
      // Create a new object to avoid reference issues
      const updatedStates = { ...prevStates };
      // Only update the specific widget's state
      updatedStates[widgetId] = newValue;
      
      // Log all widget states for debugging
      console.log('All widget states after update:', updatedStates);
      
      // Send update to WebSocket after state is updated
      if (webSocketRef.current && wsStatus === 'connected') {
        // Get authentication token from session storage
        const token = sessionStorage.getItem('authToken');
        
        // Find the component to get its virtual pin
        const component = components.find(comp => comp.id === widgetId);
        //console.log('Component:', component);
        const virtualPin = component?.pinConfig && component.pinConfig.length > 0 && component.pinConfig[0].pin_id || 0; // Default to 0 if not found
        console.log("virtualPin", virtualPin);
        // Create message in the required format
        const message = {
          token: token,
          V_P: virtualPin, // Use the component's virtual pin instead of hardcoded 2
          data: newValue,
          templateId: templateId,
          widgetId: widgetId,
          timestamp: new Date().toISOString()
        };
        
        // Send update via WebSocket
        webSocketRef.current.send(JSON.stringify(message));
        console.log('Sending widget update to server:', message);
      }
      
      return updatedStates;
    });
  };
  
  // Navigate back to the playground
  const handleBackToEdit = () => {
    navigate(`/playground/${templateId}`, { 
      state: { 
        components, 
        widgetStates,
        templateName
      }
    });
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Header with back button */}
      <header className="flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
        <button 
          onClick={handleBackToEdit}
          className="flex items-center mr-4 text-blue-400 hover:text-blue-300"
        >
          <AiOutlineArrowLeft className="mr-1" />
          Back to Editor
        </button>
        <h1 className="text-xl font-semibold text-white">{templateName} - Preview Mode</h1>
        
        {/* WebSocket connection status indicator */}
        <div className="ml-auto flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            wsStatus === 'connected' ? 'bg-green-500' : 
            wsStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
          }`}></div>
          <span className="text-sm text-gray-300">
            {wsStatus === 'connected' ? 'Live' : 
             wsStatus === 'error' ? 'Connection Error' : 'Offline'}
          </span>
        </div>
      </header>
      
      {/* Main preview area */}
      <div 
        className="flex-grow p-6 overflow-hidden relative"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(30, 30, 30, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 30, 30, 0.5) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      >
        {/* Components */}
        {components.map((component) => {
          // Ensure we have a valid ID for the component
          const componentId = component.id || component.instanceId || component._id;
          
          return (
            <motion.div
              key={componentId}
              className="absolute"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                left: `${component.position.x}px`,
                top: `${component.position.y}px`,
                width: '220px',
                height: '220px',
              }}
            >
              <Widget3D
                widget={component}
                isPreviewMode={true}
                isInteractive={true}
                currentValue={widgetStates[componentId]}
                onValueChanged={(newValue) => handleWidgetValueChange(componentId, newValue)}
                scale={2.5}
              />
            </motion.div>
          );
        })}
        
        {/* Empty state */}
        {components.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-xl">No components to preview</p>
            <p className="mt-2">Add components in the editor first</p>
          </div>
        )}
      </div>
      
      {/* Footer with information */}
      <footer className="px-4 py-3 bg-gray-800 border-t border-gray-700 text-gray-400 text-sm">
        <p className="font-medium">
          Preview Mode - Interactive controls are enabled 
          {wsStatus === 'connected' && <span className="ml-2 text-green-400">• Real-time updates active</span>}
        </p>
      </footer>
    </div>
  );
};

export default PreviewScreen;