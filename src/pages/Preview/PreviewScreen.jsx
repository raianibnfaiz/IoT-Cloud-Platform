import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Widget3D from '../Widget/Widget3D';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { BASE_URL } from '../../config/apiEndpoints';
import { io } from 'socket.io-client'; // Import socket.io-client
import { fetchTemplatesById } from '../../services/templateService'; // Import the template service

const PreviewScreen = () => {
  const { templateId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State variables
  const [components, setComponents] = useState([]);
  const [widgetStates, setWidgetStates] = useState({});
  const [templateName, setTemplateName] = useState('Preview');
  const [isLoading, setIsLoading] = useState(true);
  const [wsStatus, setWsStatus] = useState('disconnected'); // Socket connection status
  
  // Socket.io ref to keep reference across renders
  const socketRef = useRef(null);

  // Get template data from the location state or fetch it
  useEffect(() => {
    setIsLoading(true);
    console.log('Location state:', location.state);
    // If state was passed directly via navigation
    if (location.state?.components && location.state?.widgetStates && false) {
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
            const processedComponents = (data.template.widget_list || []).map((comp, index) => {
              const _id = comp.widget_id._id || comp.widget_id.instanceId || comp.widget_id.id;
              const name = comp.widget_id.name;
              const position = comp.position || { x: 0, y: 0 };
              const image = comp.widget_id.image;
              const pinRequired = comp.widget_id.pinRequired;
              const pinConfig = comp.pinConfig;
              const instanceId = `template_${comp.widget_id._id}_${index}`;

              return { _id, name, image, pinRequired, pinConfig, position, instanceId };
            });

            console.log('Fetched components:', processedComponents);
            
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
  
  // Initialize Socket.io connection instead of WebSocket
  useEffect(() => {
    // Only connect Socket.io when we have components loaded
    if (!isLoading && components.length > 0 && templateId) {
      const token = sessionStorage.getItem('authToken');
      
      // Create Socket.io connection
      // Using the correct format for Socket.io URL
      console.log('Connecting to Socket.io:', BASE_URL);
      
      // Initialize socket connection with the proper path
      const socket = io(BASE_URL, {
        path: '/socket.io',
        query: { 
          token,
          templateId 
        },
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
      
      socketRef.current = socket;
      
      // Debug socket connection
      console.log('Socket instance:', socket);
      
      // Socket.io event handlers
      socket.on('connect', () => {
        console.log('Socket.io connection established with ID:', socket.id);
        setWsStatus('connected');
        
        // Send initial handshake with template ID
        socket.emit('join_template', { templateId });
        console.log('Sent join_template event with:', { templateId });
      });
      
      // Listen for specific events from server
      socket.on('widget_update', (message) => {
        try {
          console.log('Socket.io widget_update received:', message);
          
          // Update the widget state when we receive updates from the server
          setWidgetStates(prevStates => ({
            ...prevStates,
            [message.widgetId]: message.data // Make sure this matches the server's message format
          }));
        } catch (error) {
          console.error('Error processing Socket.io message:', error);
        }
      });
      
      // Listen for all events (for debugging)
      socket.onAny((event, ...args) => {
        console.log('Socket.io received event:', event, args);
      });
      
      socket.on("widget_update", (message) => {
        console.log("Received widget_update message:", message);
      });

      socket.on('connect_error', (error) => {
        console.error('Socket.io connection error:', error);
        setWsStatus('error');
      });
      
      socket.on('disconnect', (reason) => {
        console.log('Socket.io disconnected reason:', reason);
        setWsStatus('disconnected');
        
        // Attempt to reconnect if not closed intentionally
        if (reason === 'io server disconnect') {
          // The disconnection was initiated by the server, reconnect manually
          socket.connect();
        }
      });

      // Listen for acknowledgment of updates sent from client to server
      socket.on('widget_updated', (ack) => {
        try {
          console.log('Widget update acknowledgment received:', ack);
          
          if (ack.success) {
            console.log(`Update to widget ${ack.widgetId} was successful for template ${ack.topic}`);
            
            // Optional: You could add visual feedback here, like a brief animation
            // on the widget to show the update was successful
            
            // For example, you could maintain a state of recently updated widgets
            // and show a brief "success" indicator on them
          } else {
            console.error('Widget update failed:', ack.error || 'Unknown error');
            // Optionally handle the error, maybe revert the widget state
          }
        } catch (error) {
          console.error('Error processing widget update acknowledgment:', error);
        }
      });
      
      // Clean up the Socket.io connection when the component unmounts
      return () => {
        console.log('Disconnecting Socket.io');
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [isLoading, components, templateId]);
  
  // Handle widget value changes - now also sends updates via Socket.io
  const handleWidgetValueChange = (widgetId, newValue) => {
    console.log(`Widget ${widgetId} value changed to:`, newValue);
    
    // Update local state
    setWidgetStates(prevStates => {
      // Create a new object to avoid reference issues
      const updatedStates = { ...prevStates };
      // Only update the specific widget's state
      updatedStates[widgetId] = newValue;
      
      // Send update to Socket.io after state is updated
      if (socketRef.current && socketRef.current.connected) {
        // Get authentication token from session storage
        const token = sessionStorage.getItem('authToken');
        console.log("Component for widget: all: ", components);
        console.log("Component for widget: widgetId: ", widgetId);
        
        // Find the component to get its virtual pin
        const component = components.find(comp => comp.instanceId === widgetId);
        console.log('Component for widget:', component);
        const virtualPin = component?.pinConfig && component.pinConfig.length > 0 && component.pinConfig[0].pin_id || 0;
        console.log("Sending update for virtualPin:", virtualPin);
        
        // Create message and emit to server
        const message = {
          token,
          V_P: virtualPin,
          data: newValue,
          templateId,
          widgetId,
          timestamp: new Date().toISOString()
        };
        
        socketRef.current.emit('update_widget', message, (response) => {
          // This callback will be called if the server sends an acknowledgment directly
          if (response) {
            console.log('Direct acknowledgment received:', response);
          }
        });
        console.log('Sent update_widget event:', message);
      }
      
      return updatedStates;
    });
    console.log('Updated widget states:', widgetStates);
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
          const componentId = component.id || component.instanceId || component._id; // Fixed comp._id to component._id
          
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