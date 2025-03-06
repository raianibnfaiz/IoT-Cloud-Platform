// Main 3D Widget component
const Widget3D = ({ 
  widget, 
  isPreviewMode = true, 
  onValueChanged,
  onConfigClick,
  scale = 1
}) => {
  const [value, setValue] = useState(null);
  const config = parseWidgetConfig(widget);
  
  // Extract the normalized type from the widget configuration
  const getNormalizedType = () => {
    if (!widget) return 'unsupported';
    
    if (config && config.type) {
      return config.type.toLowerCase().replace('3d_', '');
    }
    
    return widget.type?.toLowerCase().replace('3d_', '') || 'unsupported';
  };
  
  const normalizedType = getNormalizedType();
  
  // Initialize widget value from configuration
  useEffect(() => {
    if (config && config.state) {
      let defaultValue;
      
      switch (normalizedType) {
        case 'switch':
        case 'togglebutton':
          defaultValue = config.state.default === 'on' || config.state.default === true;
          break;
        case 'slider':
        case 'gauge':
          defaultValue = config.state.default_value || 50;
          break;
        case 'number_input':
          defaultValue = config.state.default_value || 0;
          break;
        case 'text_input':
          defaultValue = config.state.default_text || '';
          break;
        case 'button':
          defaultValue = false;
          break;
        case 'color_picker':
          defaultValue = config.state.default_color || '#2196F3';
          break;
        default:
          defaultValue = null;
      }
      
      setValue(defaultValue);
    }
  }, [config, normalizedType]);
  
  // Handle widget interaction
  const handleInteraction = () => {
    // If in preview mode or no onConfigClick handler, do nothing
    if (isPreviewMode) return;
    
    // If we have a configuration handler, open the config modal
    if (onConfigClick) {
      onConfigClick(widget);
      return;
    }
    
    // Only handle state changes if no config handler is provided
    let newValue;
    
    switch (normalizedType) {
      case 'switch':
      case 'togglebutton':
        newValue = !value;
        break;
      case 'button':
        newValue = true;
        // Reset button state after a short delay
        setTimeout(() => {
          setValue(false);
          if (onValueChanged) onValueChanged(false);
        }, 300);
        break;
      default:
        return; // Other types need specific UI for interaction
    }
    
    setValue(newValue);
    if (onValueChanged) onValueChanged(newValue);
  };
  
  return (
    <motion.div
      className="relative"
      style={{ 
        width: isPreviewMode ? '120px' : '180px', 
        height: isPreviewMode ? '120px' : '180px' 
      }}
      whileHover={{ 
        scale: config?.animation?.hover?.scale || 1.05,
        transition: { 
          duration: config?.animation?.hover?.duration ? config.animation.hover.duration / 1000 : 0.2 
        }
      }}
      onClick={handleInteraction}
    >
      {/* ... rest of the component ... */}
    </motion.div>
  );
};