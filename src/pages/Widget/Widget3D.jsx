/* eslint-disable react/no-unknown-property */
import { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, RoundedBox } from '@react-three/drei';
import { motion } from 'framer-motion';
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

// Switch widget component
const SwitchWidget = ({ config, isActive, scale }) => {
  const switchRef = useRef();
  const handleRef = useRef();
  
  const colors = config?.appearance?.colors || {};
  const baseColor = colors.base || '#303F9F';
  const handleColor = colors.handle || '#E0E0E0';
  const activeColor = colors.switch_on || '#4CAF50';
  const inactiveColor = colors.switch_off || '#F44336';
  
  // Animate the switch handle position
  useFrame(() => {
    if (handleRef.current) {
      const targetPosition = isActive ? 0.5 : -0.5;
      handleRef.current.position.x += (targetPosition - handleRef.current.position.x) * 0.15;
    }
  });
  
  return (
    <group ref={switchRef} scale={scale}>
      {/* Switch base */}
      <RoundedBox args={[2, 0.8, 0.4]} radius={0.2}>
        <meshStandardMaterial color={baseColor} />
      </RoundedBox>
      
      {/* Switch track */}
      <RoundedBox position={[0, 0, 0.21]} args={[1.6, 0.6, 0.05]} radius={0.3}>
        <meshStandardMaterial color={isActive ? activeColor : inactiveColor} />
      </RoundedBox>
      
      {/* Switch handle */}
      <Sphere ref={handleRef} position={[isActive ? 0.5 : -0.5, 0, 0.3]} args={[0.35, 32, 32]}>
        <meshStandardMaterial color={handleColor} metalness={0.7} roughness={0.2} />
      </Sphere>
    </group>
  );
};

SwitchWidget.propTypes = {
  config: PropTypes.shape({
    appearance: PropTypes.shape({
      colors: PropTypes.object
    })
  }),
  isActive: PropTypes.bool,
  scale: PropTypes.number
};

// Slider widget component
const SliderWidget = ({ config, value = 50, scale }) => {
  const sliderRef = useRef();
  const handleRef = useRef();
  
  const colors = config?.appearance?.colors || {};
  const trackColor = colors.track || '#616161';
  const activeTrackColor = colors.active_track || '#2196F3';
  const handleColor = colors.handle || '#E0E0E0';
  
  // Calculate handle position based on value
  const minValue = config?.state?.min_value || 0;
  const maxValue = config?.state?.max_value || 100;
  const normalizedValue = (value - minValue) / (maxValue - minValue); // 0 to 1 range
  const handlePosition = (normalizedValue * 1.6) - 0.8; // Scaled to fit track width
  
  useEffect(() => {
    if (handleRef.current) {
      handleRef.current.position.x = handlePosition;
    }
  }, [handlePosition]);
  
  return (
    <group ref={sliderRef} scale={scale}>
      {/* Slider base */}
      <RoundedBox args={[2.2, 0.8, 0.2]} radius={0.1}>
        <meshStandardMaterial color="#424242" />
      </RoundedBox>
      
      {/* Slider track background */}
      <RoundedBox position={[0, 0, 0.11]} args={[1.8, 0.2, 0.05]} radius={0.1}>
        <meshStandardMaterial color={trackColor} />
      </RoundedBox>
      
      {/* Active track */}
      <RoundedBox 
        position={[handlePosition / 2 - 0.4, 0, 0.12]} 
        args={[(normalizedValue * 1.8), 0.2, 0.05]} 
        radius={0.1}
      >
        <meshStandardMaterial color={activeTrackColor} />
      </RoundedBox>
      
      {/* Slider handle */}
      <Sphere ref={handleRef} position={[handlePosition, 0, 0.2]} args={[0.2, 16, 16]}>
        <meshStandardMaterial color={handleColor} metalness={0.5} roughness={0.2} />
      </Sphere>
      
      {/* Value display */}
      <Text
        position={[0, -0.5, 0.3]}
        fontSize={0.45}  // Ensure it's big enough
        color="white"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
        backgroundColor="#00000033"
        padding={0.05}
      >
        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
      </Text>
    </group>
  );
};

SliderWidget.propTypes = {
  config: PropTypes.shape({
    appearance: PropTypes.shape({
      colors: PropTypes.object
    }),
    state: PropTypes.shape({
      min_value: PropTypes.number,
      max_value: PropTypes.number
    })
  }),
  value: PropTypes.number,
  scale: PropTypes.number
};

// Button widget component
const ButtonWidget = ({ config, isPressed, scale }) => {
  const buttonRef = useRef();
  
  const colors = config?.appearance?.colors || {};
  const buttonColor = colors.button || '#2196F3';
  const textColor = colors.text || '#FFFFFF';
  
  // Use useFrame to animate button press
  useFrame(() => {
    if (buttonRef.current) {
      const targetPosition = isPressed ? -0.1 : 0;
      buttonRef.current.position.z += (targetPosition - buttonRef.current.position.z) * 0.15;
    }
  });
  
  return (
    <group scale={scale}>
      {/* Button shadow */}
      <RoundedBox position={[0, 0, -0.1]} args={[1.8, 1.8, 0.2]} radius={0.2}>
        <meshStandardMaterial color="#263238" />
      </RoundedBox>
      
      {/* Button base */}
      <RoundedBox ref={buttonRef} args={[1.7, 1.7, 0.3]} radius={0.2}>
        <meshStandardMaterial color={buttonColor} />
      </RoundedBox>
      
      {/* Button label */}
      <Text
        position={[0, 0, 0.21]}
        fontSize={0.4}  // Keep this size
        color={textColor}
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        {config?.state?.label || 'BUTTON'}
      </Text>
    </group>
  );
};

ButtonWidget.propTypes = {
  config: PropTypes.shape({
    appearance: PropTypes.shape({
      colors: PropTypes.object
    }),
    state: PropTypes.shape({
      label: PropTypes.string
    })
  }),
  isPressed: PropTypes.bool,
  scale: PropTypes.number
};

// Gauge widget component
const GaugeWidget = ({ config, value = 0, scale }) => {
  const gaugeRef = useRef();
  const needleRef = useRef();
  
  const colors = config?.appearance?.colors || {};
  const dialColor = colors.dial || '#E0E0E0';
  const needleColor = colors.needle || '#FF5722';
  const ticksColor = colors.ticks || '#757575';
  
  // Calculate the needle rotation based on the current value
  const minValue = config?.state?.min_value || 0;
  const maxValue = config?.state?.max_value || 100;
  const normalizedValue = (value - minValue) / (maxValue - minValue);
  const needleRotation = (-Math.PI / 4) + (normalizedValue * (Math.PI * 1.5));
  
  useEffect(() => {
    if (needleRef.current) {
      needleRef.current.rotation.z = needleRotation;
    }
  }, [needleRotation]);
  
  return (
    <group ref={gaugeRef} scale={scale}>
      {/* Gauge dial */}
      <Cylinder args={[1, 1, 0.1, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color={dialColor} />
      </Cylinder>
      
      {/* Gauge center cap */}
      <Cylinder args={[0.15, 0.15, 0.12, 16]} position={[0, 0, 0.06]}>
        <meshStandardMaterial color="#424242" />
      </Cylinder>
      
      {/* Gauge needle */}
      <group ref={needleRef} position={[0, 0, 0.11]}>
        <Box args={[0.8, 0.08, 0.04]} position={[0.4, 0, 0]}>
          <meshStandardMaterial color={needleColor} />
        </Box>
        
        <Sphere args={[0.1, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color={needleColor} />
        </Sphere>
      </group>
      
      {/* Value display */}
      <Text
        position={[0, -0.5, 0.2]}
        fontSize={0.45}  // Increased
        color="white"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
        backgroundColor="#00000033"
        padding={0.05}
      >
        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
      </Text>
      
      {/* Gauge ticks */}
      {/* For simplicity, just show min and max ticks */}
      <Text
        position={[-0.75, 0.3, 0.06]}
        fontSize={0.2}
        color={ticksColor}
        anchorX="center"
        anchorY="middle"
      >
        {minValue}
      </Text>
      
      <Text
        position={[0.75, 0.3, 0.06]}
        fontSize={0.2}
        color={ticksColor}
        anchorX="center"
        anchorY="middle"
      >
        {maxValue}
      </Text>
    </group>
  );
};

GaugeWidget.propTypes = {
  config: PropTypes.shape({
    appearance: PropTypes.shape({
      colors: PropTypes.object
    }),
    state: PropTypes.shape({
      min_value: PropTypes.number,
      max_value: PropTypes.number
    })
  }),
  value: PropTypes.number,
  scale: PropTypes.number
};

// Text input widget component
const TextInputWidget = ({ config, value = '', scale }) => {
  const inputRef = useRef();
  
  const colors = config?.appearance?.colors || {};
  const backgroundColor = colors.background || '#FFFFFF';
  const textColor = colors.text || '#212121';
  
  // Format value for display
  let displayValue = '';
  if (typeof value === 'object') {
    displayValue = JSON.stringify(value).length > 8 ? 
      JSON.stringify(value).substring(0, 8) + '...' : 
      JSON.stringify(value) || '';
  } else {
    displayValue = String(value).length > 8 ? 
      String(value).substring(0, 8) + '...' : 
      String(value) || '';
  }
  
  return (
    <group ref={inputRef} scale={scale}>
      {/* Input base */}
      <RoundedBox args={[2.2, 1, 0.2]} radius={0.1}>
        <meshStandardMaterial color="#424242" />
      </RoundedBox>
      
      {/* Input field */}
      <RoundedBox position={[0, 0, 0.11]} args={[2, 0.8, 0.1]} radius={0.1}>
        <meshStandardMaterial color={backgroundColor} />
      </RoundedBox>
      
      {/* Value display */}
      <Text
        position={[0, 0, 0.22]}
        fontSize={0.4}  // Increased from 0.3
        color={textColor}
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        {displayValue || config?.state?.placeholder || 'Text...'}
      </Text>
    </group>
  );
};

TextInputWidget.propTypes = {
  config: PropTypes.shape({
    appearance: PropTypes.shape({
      colors: PropTypes.object
    }),
    state: PropTypes.shape({
      placeholder: PropTypes.string
    })
  }),
  value: PropTypes.string,
  scale: PropTypes.number
};

// Number input widget component
const NumberInputWidget = ({ config, value = 0, scale }) => {
  const inputRef = useRef();
  
  const colors = config?.appearance?.colors || {};
  const backgroundColor = colors.background || '#FFFFFF';
  const textColor = colors.text || '#212121';
  const buttonColor = colors.buttons || '#2196F3';
  
  return (
    <group ref={inputRef} scale={scale}>
      {/* Input base */}
      <RoundedBox args={[2.2, 1, 0.2]} radius={0.1}>
        <meshStandardMaterial color="#424242" />
      </RoundedBox>
      
      {/* Input field */}
      <RoundedBox position={[0, 0, 0.11]} args={[1.4, 0.8, 0.1]} radius={0.1}>
        <meshStandardMaterial color={backgroundColor} />
      </RoundedBox>
      
      {/* Decrement button */}
      <RoundedBox position={[-0.9, 0, 0.11]} args={[0.4, 0.8, 0.1]} radius={0.1}>
        <meshStandardMaterial color={buttonColor} />
      </RoundedBox>
      
      {/* Increment button */}
      <RoundedBox position={[0.9, 0, 0.11]} args={[0.4, 0.8, 0.1]} radius={0.1}>
        <meshStandardMaterial color={buttonColor} />
      </RoundedBox>
      
      {/* Button symbols */}
      <Text
        position={[-0.9, 0, 0.22]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        -
      </Text>
      
      <Text
        position={[0.9, 0, 0.22]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        +
      </Text>
      
      {/* Value display */}
      <Text
        position={[0, 0, 0.22]}
        fontSize={0.5}
        color={textColor}
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
    </group>
  );
};

NumberInputWidget.propTypes = {
  config: PropTypes.shape({
    appearance: PropTypes.shape({
      colors: PropTypes.object
    })
  }),
  value: PropTypes.number,
  scale: PropTypes.number
};

// Toggle button widget component
const ToggleButtonWidget = ({ config, isActive, scale }) => {
  const buttonRef = useRef();
  
  const colors = config?.appearance?.colors || {};
  const activeColor = colors.active || '#4CAF50';
  const inactiveColor = colors.inactive || '#F44336';
  const textColor = colors.text || '#FFFFFF';
  
  return (
    <group ref={buttonRef} scale={scale}>
      {/* Button base */}
      <RoundedBox args={[1.8, 1.8, 0.4]} radius={0.2}>
        <meshStandardMaterial color={isActive ? activeColor : inactiveColor} />
      </RoundedBox>
      
      {/* Status icon */}
      <Text
        position={[0, 0.3, 0.21]}
        fontSize={0.5}  // Increased from 0.4
        color={textColor}
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        {isActive ? '✓' : '✗'}
      </Text>
      
      {/* Button label */}
      <Text
        position={[0, -0.3, 0.21]}
        fontSize={0.4}  // Keep this size
        color={textColor}
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        {isActive 
          ? (config?.state?.labels?.on || 'ON') 
          : (config?.state?.labels?.off || 'OFF')}
      </Text>
    </group>
  );
};

ToggleButtonWidget.propTypes = {
  config: PropTypes.shape({
    appearance: PropTypes.shape({
      colors: PropTypes.object
    }),
    state: PropTypes.shape({
      labels: PropTypes.shape({
        on: PropTypes.string,
        off: PropTypes.string
      })
    })
  }),
  isActive: PropTypes.bool,
  scale: PropTypes.number
};

// Color picker widget component
const ColorPickerWidget = ({ config, selectedColor, scale }) => {
  const pickerRef = useRef();
  
  const colors = config?.appearance?.colors || {};
  const backgroundColor = colors.background || '#FFFFFF';
  
  // Default color palette
  const colorPalette = ['#F44336', '#2196F3', '#4CAF50', '#FFEB3B', '#9C27B0', '#FF9800'];
  
  return (
    <group ref={pickerRef} scale={scale}>
      {/* Picker base */}
      <Cylinder args={[1.2, 1.2, 0.3, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#424242" />
      </Cylinder>
      
      {/* Picker surface */}
      <Cylinder args={[1.1, 1.1, 0.31, 32]} position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={backgroundColor} />
      </Cylinder>
      
      {/* Color segments */}
      {colorPalette.map((color, i) => {
        const angle = (i / colorPalette.length) * Math.PI * 2;
        const x = 0.7 * Math.cos(angle);
        const y = 0.7 * Math.sin(angle);
        return (
          <RoundedBox 
            key={i} 
            position={[x, y, 0.17]} 
            args={[0.3, 0.3, 0.1]}
            radius={0.05}
          >
            <meshStandardMaterial color={color} />
          </RoundedBox>
        );
      })}
      
      {/* Selected color display */}
      <Cylinder args={[0.4, 0.4, 0.1, 32]} position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={selectedColor || config?.state?.default_color || '#2196F3'} />
      </Cylinder>
      
      {/* Color value text */}
      <Text
        position={[0, 0.65, 0.22]}
        fontSize={0.25}  // Increased from 0.2
        color="#FFFFFF"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        {selectedColor || config?.state?.default_color || '#2196F3'}
      </Text>
    </group>
  );
};

ColorPickerWidget.propTypes = {
  config: PropTypes.shape({
    appearance: PropTypes.shape({
      colors: PropTypes.object
    }),
    state: PropTypes.shape({
      default_color: PropTypes.string
    })
  }),
  selectedColor: PropTypes.string,
  scale: PropTypes.number
};

// Widget label displayed below the 3D object
const WidgetLabel = ({ text }) => {
  return (
    <Text
      position={[0, -1.5, 0]}
      fontSize={0.4}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
};

WidgetLabel.propTypes = {
  text: PropTypes.string
};

// Main 3D Widget component
const Widget3D = ({ 
  widget, 
  isPreviewMode = true, 
  isInteractive = false,
  onValueChanged,
  onConfigClick,
  currentValue,
  scale = 1.5
}) => {
  const [value, setValue] = useState(null);
  const [isDragging, setIsDragging] = useState(false); // Add state to track dragging
  const [isSliderDragging, setIsSliderDragging] = useState(false); // Track slider dragging
  const config = parseWidgetConfig(widget);
  
  // Extract a consistent ID from the widget
  const widgetId = useMemo(() => {
    return widget.id || widget.instanceId || widget._id || `widget-${Date.now()}`;
  }, [widget]);
  
  // Helper function to safely convert values to strings for display
  const safeToString = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };
  
  // Extract the normalized type from the widget configuration
  const getNormalizedType = () => {
    if (!widget) return 'unsupported';
    
    if (config && config.type) {
      return config.type.toLowerCase().replace('3d_', '');
    }
    
    return widget.type?.toLowerCase().replace('3d_', '') || 'unsupported';
  };
  
  const normalizedType = getNormalizedType();
  
  // Initialize widget value based on config defaults or currentValue if provided
  useEffect(() => {
    let initialValue;
    const normalizedType = getNormalizedType();
    
    // Use currentValue if provided, otherwise use default from config
    if (currentValue !== undefined) {
      // Set value only if it's different to avoid unnecessary rerenders
      if (value !== currentValue) {
        setValue(currentValue);
      }
      return; // Skip setting default values if currentValue is provided
    } 
    
    // Only set default values when component is first mounted
    if (value === null && config && config.state) {
      switch (normalizedType) {
        case 'switch':
        case 'togglebutton':
          initialValue = config.state.default === true;
          break;
        case 'slider':
          initialValue = config.state.default_value !== undefined 
            ? config.state.default_value 
            : 50;
          break;
        case 'gauge':
          initialValue = config.state.default_value !== undefined 
            ? config.state.default_value 
            : 0;
          break;
        case 'text_input':
          initialValue = config.state.default_text || '';
          break;
        case 'number_input':
          initialValue = config.state.default_value || 0;
          break;
        case 'color_picker':
          initialValue = config.state.default_color || '#2196F3';
          break;
        case 'button':
          initialValue = false;
          break;
        default:
          initialValue = null;
      }
      
      setValue(initialValue);
    }
  }, [config, currentValue, value]);

  // Update method to use our consistent ID
  const updateParentValue = (newValue) => {
    if (onValueChanged) {
      // Use the consistent widget ID when notifying the parent
      console.log(`Widget ${widgetId} interaction: changing to ${newValue}`);
      onValueChanged(newValue);
    }
  };
  
  // Handle widget interaction
  const handleInteraction = () => {
    // Ignore interactions if dragging
    if (isDragging) return;
    
    const normalizedType = getNormalizedType();
    
    // Special handling for preview mode with interactivity
    if (isPreviewMode && isInteractive) {
      let newValue;
      
      switch (normalizedType) {
        case 'switch':
        case 'togglebutton':
          newValue = !value;
          // Set internal state first
          setValue(newValue);
          // Then notify parent
          updateParentValue(newValue);
          return;
        case 'button':
          newValue = true;
          setValue(newValue);
          updateParentValue(newValue);
          // Reset button state after a short delay - just internally
          setTimeout(() => {
            setValue(false);
            // Only notify parent about button release if callback exists
            updateParentValue(false);
          }, 300);
          return;
        case 'text_input':
          handleTextInput(isPreviewMode, isInteractive, value, setValue, updateParentValue);
          return;
        case 'number_input':
          handleNumberInput(isPreviewMode, isInteractive, config, value, setValue, updateParentValue);
          return;
        case 'color_picker':
          // Show color picker dialog
          const colors = ['#F44336', '#2196F3', '#4CAF50', '#FFEB3B', '#9C27B0', '#FF9800'];
          const colorIndex = Math.floor(Math.random() * colors.length);
          handleColorSelection(colors[colorIndex]);
          return;
        case 'slider':
          // Slider interactions are handled by the pointer events in getInteractionHandlers
          return;
        default:
          // Other interactive widgets will be handled by their specific handlers
          return;
      }
    }
    
    // In edit mode, clicking should open the config dialog
    if (!isPreviewMode && onConfigClick) {
      onConfigClick();
    }
  };

  // Create handlers for different widget types in preview mode
  const getInteractionHandlers = () => {
    if (!isPreviewMode || !isInteractive) return {};
    
    const normalizedType = getNormalizedType();
    
    switch (normalizedType) {
      case 'slider':
        return {
          // Use onPointerDown instead of onMouseDown for better cross-device support
          onPointerDown: (e) => {
            // Prevent default to avoid text selection
            e.preventDefault();
            
            // Mark as dragging
            setIsSliderDragging(true);
            
            // Get the container dimensions for calculations
            const container = e.currentTarget;
            const rect = container.getBoundingClientRect();
            
            // Initial value update on first click
            const updateSliderValue = (clientX) => {
              // Calculate the relative position (0-1)
              const relativeX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
              
              // Get range settings from config
              const minValue = config?.state?.min_value || 0;
              const maxValue = config?.state?.max_value || 100;
              
              // Calculate value based on position
              const newValue = minValue + relativeX * (maxValue - minValue);
              
              // Apply precision formatting if needed
              const roundedValue = config?.state?.precision 
                ? parseFloat(newValue.toFixed(config.state.precision))
                : Math.round(newValue);
              
              // Update internal state
              setValue(roundedValue);
              
              // Notify parent using our consistent method
              updateParentValue(roundedValue);
            };
            
            // Initial update
            updateSliderValue(e.clientX);
            
            // Set up pointer move handler
            const handlePointerMove = (moveEvent) => {
              if (isSliderDragging) {
                moveEvent.preventDefault();
                moveEvent.stopPropagation();
                updateSliderValue(moveEvent.clientX);
              }
            };
            
            // Set up pointer up handler
            const handlePointerUp = () => {
              setIsSliderDragging(false);
              document.removeEventListener('pointermove', handlePointerMove);
              document.removeEventListener('pointerup', handlePointerUp);
            };
            
            // Add global event listeners
            document.addEventListener('pointermove', handlePointerMove);
            document.addEventListener('pointerup', handlePointerUp);
          },
          // Prevent the click from opening a dialog or triggering other handlers
          onClick: (e) => {
            if (isSliderDragging) {
              e.preventDefault();
              e.stopPropagation();
            }
          }
        };
      case 'number_input':
        return {
          // Add custom handlers for number input buttons
          onMouseDown: (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relativeX = (e.clientX - rect.left) / rect.width;
            
            // Decrement button on left side, increment on right side
            if (relativeX < 0.3) {
              // Decrement
              const newValue = Math.max((config?.state?.min_value || 0), value - 1);
              setValue(newValue);
              updateParentValue(newValue);
            } else if (relativeX > 0.7) {
              // Increment
              const newValue = Math.min((config?.state?.max_value || 100), value + 1);
              setValue(newValue);
              updateParentValue(newValue);
            }
          }
        };
      default:
        // Use the default click handler for other types
        return {};
    }
  };

  // Handle color picker interaction in preview mode
  const handleColorSelection = (color) => {
    if (!isPreviewMode || !isInteractive) return;
    
    setValue(color);
    updateParentValue(color);
  };

  // Handle text input interactions in preview mode
  const handleTextInput = (isPreviewMode, isInteractive, value, setValue, onValueChanged) => {
    if (!isPreviewMode || !isInteractive) return;
    
    // Use our consistent update method (the one passed in might be stale)
    const valueUpdater = typeof onValueChanged === 'function' ? onValueChanged : updateParentValue;
    
    // Create an overlay input element
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value || '';
    input.style.position = 'fixed';
    input.style.left = '50%';
    input.style.top = '50%';
    input.style.transform = 'translate(-50%, -50%)';
    input.style.padding = '10px';
    input.style.width = '250px';
    input.style.backgroundColor = '#2c3e50';
    input.style.color = 'white';
    input.style.border = '2px solid #3498db';
    input.style.borderRadius = '5px';
    input.style.zIndex = '9999';
    
    // Handle input submission
    const handleInputSubmit = () => {
      const newValue = input.value;
      setValue(newValue);
      if (valueUpdater) valueUpdater(newValue);
      document.body.removeChild(input);
      document.body.removeChild(overlay);
      document.body.removeChild(button);
    };
    
    // Create overlay background
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '9998';
    
    // Handle overlay click to cancel
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(input);
        document.body.removeChild(overlay);
        document.body.removeChild(button);
      }
    });
    
    // Handle input keys
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleInputSubmit();
      } else if (e.key === 'Escape') {
        document.body.removeChild(input);
        document.body.removeChild(overlay);
        document.body.removeChild(button);
      }
    });
    
    // Add a button to submit
    const button = document.createElement('button');
    button.textContent = 'OK';
    button.style.position = 'fixed';
    button.style.left = '50%';
    button.style.top = 'calc(50% + 30px)';
    button.style.transform = 'translateX(-50%)';
    button.style.padding = '5px 15px';
    button.style.backgroundColor = '#3498db';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '3px';
    button.style.zIndex = '10000';
    button.addEventListener('click', handleInputSubmit);
    
    // Add to DOM
    document.body.appendChild(overlay);
    document.body.appendChild(input);
    document.body.appendChild(button);
    
    // Focus the input
    setTimeout(() => input.focus(), 0);
  };

  // Handle number input interactions for preview mode
  const handleNumberInput = (isPreviewMode, isInteractive, config, value, setValue, onValueChanged) => {
    if (!isPreviewMode || !isInteractive) return;
    
    // Use our consistent update method (the one passed in might be stale)
    const valueUpdater = typeof onValueChanged === 'function' ? onValueChanged : updateParentValue;
    
    // Get min and max values
    const minValue = config?.state?.min_value || 0;
    const maxValue = config?.state?.max_value || 100;
    const step = config?.state?.step || 1;
    
    // Create an overlay input element
    const input = document.createElement('input');
    input.type = 'number';
    input.value = value !== null ? value : (config?.state?.default_value || 0);
    input.min = minValue;
    input.max = maxValue;
    input.step = step;
    input.style.position = 'fixed';
    input.style.left = '50%';
    input.style.top = '50%';
    input.style.transform = 'translate(-50%, -50%)';
    input.style.padding = '10px';
    input.style.width = '250px';
    input.style.backgroundColor = '#2c3e50';
    input.style.color = 'white';
    input.style.border = '2px solid #3498db';
    input.style.borderRadius = '5px';
    input.style.zIndex = '9999';
    
    // Handle input submission
    const handleInputSubmit = () => {
      const newValue = parseFloat(input.value);
      setValue(newValue);
      if (valueUpdater) valueUpdater(newValue);
      document.body.removeChild(input);
      document.body.removeChild(overlay);
      document.body.removeChild(button);
    };
    
    // Create overlay background
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '9998';
    
    // Handle overlay click to cancel
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(input);
        document.body.removeChild(overlay);
        document.body.removeChild(button);
      }
    });
    
    // Handle input keys
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleInputSubmit();
      } else if (e.key === 'Escape') {
        document.body.removeChild(input);
        document.body.removeChild(overlay);
        document.body.removeChild(button);
      }
    });
    
    // Add a button to submit
    const button = document.createElement('button');
    button.textContent = 'OK';
    button.style.position = 'fixed';
    button.style.left = '50%';
    button.style.top = 'calc(50% + 30px)';
    button.style.transform = 'translateX(-50%)';
    button.style.padding = '5px 15px';
    button.style.backgroundColor = '#3498db';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '3px';
    button.style.zIndex = '10000';
    button.addEventListener('click', handleInputSubmit);
    
    // Add to DOM
    document.body.appendChild(overlay);
    document.body.appendChild(input);
    document.body.appendChild(button);
    
    // Focus the input
    setTimeout(() => input.focus(), 0);
  };

  // Render the appropriate widget based on type
  const renderWidget = () => {
    // Increase the scale for better visibility
    const widgetScale = isPreviewMode ? scale * 0.9 : scale * 1.2;
    
    // Enhanced colors for better visual appeal
    const enhanceColors = (config) => {
      if (!config || !config.appearance || !config.appearance.colors) return config;
      
      // Make colors more vibrant
      const enhancedConfig = { ...config };
      const colors = enhancedConfig.appearance.colors;
      
      // Enhance specific colors based on widget type
      switch (normalizedType) {
        case 'switch':
          colors.switch_on = colors.switch_on || '#4CAF50';
          colors.switch_off = colors.switch_off || '#F44336';
          colors.handle = '#FFFFFF';
          break;
        case 'slider':
          colors.handle = colors.handle || '#2196F3';
          colors.active_track = colors.active_track || '#64B5F6';
          break;
        case 'button':
          colors.button = colors.button || '#FF4081';
          colors.shadow = colors.shadow || '#C2185B';
          break;
        case 'gauge':
          colors.needle = colors.needle || '#FF5722';
          colors.dial = colors.dial || '#FAFAFA';
          break;
        case 'togglebutton':
          colors.active = colors.active || '#4CAF50';
          colors.inactive = colors.inactive || '#F44336';
          break;
        default:
          // No specific enhancements
          break;
      }
      
      return enhancedConfig;
    };
    
    const enhancedConfig = enhanceColors(config);
    
    switch (normalizedType) {
      case 'switch':
        return <SwitchWidget config={enhancedConfig} isActive={value} scale={widgetScale} />;
      case 'slider':
        return <SliderWidget config={enhancedConfig} value={value} scale={widgetScale} />;
      case 'button':
        return <ButtonWidget config={enhancedConfig} isPressed={value} scale={widgetScale} />;
      case 'gauge':
        return <GaugeWidget config={enhancedConfig} value={value} scale={widgetScale} />;
      case 'text_input':
        return <TextInputWidget config={enhancedConfig} value={safeToString(value)} scale={widgetScale} />;
      case 'number_input':
        return <NumberInputWidget config={enhancedConfig} value={Number(value) || 0} scale={widgetScale} />;
      case 'togglebutton':
        return <ToggleButtonWidget config={enhancedConfig} isActive={value} scale={widgetScale} />;
      case 'color_picker':
        return <ColorPickerWidget config={enhancedConfig} selectedColor={safeToString(value)} scale={widgetScale} />;
      default:
        // Fallback to a simple box for unsupported types with more vibrant color
        return (
          <RoundedBox args={[1.5, 1.5, 0.5]} scale={widgetScale} radius={0.2}>
            <meshStandardMaterial color="#FF4081" />
            <Text
              position={[0, 0, 0.26]}
              fontSize={0.3}  // Increased from 0.2
              color="white"
              fontWeight="bold"
              anchorX="center"
              anchorY="middle"
            >
              {safeToString(normalizedType)}
            </Text>
          </RoundedBox>
        );
    }
  };
  
  return (
    <motion.div
      className="relative"
      style={{ 
        width: isPreviewMode ? `${Math.max(150, 80 * scale)}px` : '180px', 
        height: isPreviewMode ? `${Math.max(150, 80 * scale)}px` : '180px',
        cursor: isPreviewMode && isInteractive ? 
          (normalizedType === 'slider' ? 'ew-resize' : 'pointer') : 'default'
      }}
      whileHover={{ 
        scale: config?.animation?.hover?.scale || 1.05,
        transition: { 
          duration: config?.animation?.hover?.duration ? config.animation.hover.duration / 1000 : 0.2 
        }
      }}
      onClick={handleInteraction}
      // Add drag event handlers to track when dragging starts and ends
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => {
        // Set a timeout to prevent the click handler from firing immediately
        setTimeout(() => setIsDragging(false), 100);
      }}
      {...getInteractionHandlers()}
    >
      {/* Remove the config button since clicking anywhere will open the config modal */}
      {/* {!isPreviewMode && isHovered && (
        <ConfigButton onConfigClick={() => onConfigClick(widget)} />
      )} */}
      
      <Canvas>
        <ambientLight intensity={config?.appearance?.lighting?.ambient || 0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.0} />
        <pointLight position={[-10, -10, -10]} intensity={0.7} />
        
        {renderWidget()}
        
        {!isPreviewMode && (
          <WidgetLabel text={config?.name || widget.name} />
        )}
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          enableRotate={false}
          autoRotate={false}
          autoRotateSpeed={0}
        />
      </Canvas>
    </motion.div>
  );
};

Widget3D.propTypes = {
  widget: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    instanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  isPreviewMode: PropTypes.bool,
  isInteractive: PropTypes.bool,
  onValueChanged: PropTypes.func,
  onConfigClick: PropTypes.func,
  currentValue: PropTypes.oneOfType([
    PropTypes.bool, 
    PropTypes.number, 
    PropTypes.string,
    PropTypes.object
  ]),
  scale: PropTypes.number
};

export default Widget3D;