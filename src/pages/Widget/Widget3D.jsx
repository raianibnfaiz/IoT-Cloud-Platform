/* eslint-disable react/no-unknown-property */
import { useState, useRef, useEffect } from 'react';
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
  const trackColor = colors.track || '#E0E0E0';
  const handleColor = colors.handle || '#2196F3';
  const activeTrackColor = colors.active_track || '#BBDEFB';
  
  // Calculate handle position based on value
  const minValue = config?.state?.min_value || 0;
  const maxValue = config?.state?.max_value || 100;
  const normalizedValue = (value - minValue) / (maxValue - minValue);
  
  useFrame(() => {
    if (handleRef.current) {
      // Position the handle based on the current value
      const targetPosition = -1 + normalizedValue * 2;
      handleRef.current.position.x = targetPosition;
    }
  });
  
  return (
    <group ref={sliderRef} scale={scale}>
      {/* Slider base */}
      <RoundedBox args={[2.5, 0.8, 0.4]} radius={0.2}>
        <meshStandardMaterial color="#424242" />
      </RoundedBox>
      
      {/* Slider track (inactive part) */}
      <RoundedBox position={[0, 0, 0.21]} args={[2.2, 0.3, 0.05]} radius={0.15}>
        <meshStandardMaterial color={trackColor} />
      </RoundedBox>
      
      {/* Slider track (active part) */}
      <RoundedBox 
        position={[-1.1 + normalizedValue * 1.1, 0, 0.22]} 
        args={[normalizedValue * 2.2, 0.3, 0.06]} 
        radius={0.15}
      >
        <meshStandardMaterial color={activeTrackColor} />
      </RoundedBox>
      
      {/* Slider handle */}
      <Cylinder 
        ref={handleRef} 
        position={[-1 + normalizedValue * 2, 0, 0.3]} 
        rotation={[Math.PI / 2, 0, 0]} 
        args={[0.25, 0.25, 0.2, 32]}
      >
        <meshStandardMaterial color={handleColor} metalness={0.6} roughness={0.3} />
      </Cylinder>
      
      {/* Value display */}
      <Text
        position={[0, -0.5, 0.3]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
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
  const shadowColor = colors.shadow || '#1976D2';
  
  useFrame(() => {
    if (buttonRef.current) {
      // Button press animation
      if (isPressed) {
        buttonRef.current.position.z = -0.1;
      } else {
        buttonRef.current.position.z += (0 - buttonRef.current.position.z) * 0.2;
      }
    }
  });
  
  return (
    <group scale={scale}>
      {/* Button shadow/base */}
      <RoundedBox args={[1.8, 1.8, 0.4]} radius={0.2}>
        <meshStandardMaterial color={shadowColor} />
      </RoundedBox>
      
      {/* Button surface */}
      <RoundedBox 
        ref={buttonRef} 
        position={[0, 0, 0.2]} 
        args={[1.6, 1.6, 0.3]} 
        radius={0.2}
      >
        <meshStandardMaterial color={buttonColor} />
      </RoundedBox>
      
      {/* Button label */}
      <Text
        position={[0, 0, 0.4]}
        fontSize={0.3}
        color={textColor}
        anchorX="center"
        anchorY="middle"
      >
        {config?.state?.label || 'PRESS'}
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
  const dialColor = colors.dial || '#FAFAFA';
  const needleColor = colors.needle || '#F44336';
  const ticksColor = colors.ticks || '#212121';
  
  // Calculate needle rotation based on value
  const minValue = config?.state?.min_value || 0;
  const maxValue = config?.state?.max_value || 100;
  const normalizedValue = (value - minValue) / (maxValue - minValue);
  const needleRotation = -Math.PI / 4 + normalizedValue * (Math.PI * 1.5);
  
  useFrame(() => {
    // Remove rotation
    // if (gaugeRef.current) {
    //   gaugeRef.current.rotation.y += 0.01;
    // }
    
    if (needleRef.current) {
      // Smoothly rotate the needle to the target position
      const targetRotation = needleRotation;
      needleRef.current.rotation.z += (targetRotation - needleRef.current.rotation.z) * 0.1;
    }
  });
  
  return (
    <group ref={gaugeRef} scale={scale}>
      {/* Gauge base */}
      <Cylinder args={[1.2, 1.2, 0.3, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#424242" />
      </Cylinder>
      
      {/* Gauge dial */}
      <Cylinder args={[1.1, 1.1, 0.31, 32]} position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={dialColor} />
      </Cylinder>
      
      {/* Gauge ticks */}
      {Array.from({ length: 11 }).map((_, i) => {
        const angle = -Math.PI / 4 + (i / 10) * (Math.PI * 1.5);
        const x = 0.8 * Math.cos(angle);
        const y = 0.8 * Math.sin(angle);
        return (
          <Box 
            key={i} 
            position={[x, y, 0.17]} 
            args={[i % 5 === 0 ? 0.1 : 0.05, 0.02, 0.02]}
            rotation={[0, 0, angle + Math.PI / 2]}
          >
            <meshStandardMaterial color={ticksColor} />
          </Box>
        );
      })}
      
      {/* Gauge needle */}
      <group ref={needleRef} position={[0, 0, 0.2]}>
        <Box args={[0.7, 0.05, 0.05]} position={[0.35, 0, 0]}>
          <meshStandardMaterial color={needleColor} />
        </Box>
        <Sphere args={[0.1, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color={needleColor} />
        </Sphere>
      </group>
      
      {/* Value display */}
      <Text
        position={[0, -0.5, 0.2]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
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
  const textColor = colors.text || '#212121'
  
  return (
    <group ref={inputRef} scale={scale}>
      {/* Input base */}
      <RoundedBox args={[2.5, 1, 0.2]} radius={0.1}>
        <meshStandardMaterial color="#424242" />
      </RoundedBox>
      
      {/* Input field */}
      <RoundedBox position={[0, 0, 0.11]} args={[2.3, 0.8, 0.1]} radius={0.1}>
        <meshStandardMaterial color={backgroundColor} />
      </RoundedBox>
      
      {/* Input text or placeholder */}
      <Text
        position={[0, 0, 0.22]}
        fontSize={0.2}
        color={value ? textColor : colors.placeholder || '#9E9E9E'}
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        {value || config?.state?.placeholder || 'Enter text...'}
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
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        +
      </Text>
      
      {/* Value display */}
      <Text
        position={[0, 0, 0.22]}
        fontSize={0.25}
        color={textColor}
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
        fontSize={0.4}
        color={textColor}
        anchorX="center"
        anchorY="middle"
      >
        {isActive ? '✓' : '✗'}
      </Text>
      
      {/* Button label */}
      <Text
        position={[0, -0.3, 0.21]}
        fontSize={0.25}
        color={textColor}
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
      fontSize={0.3}
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
  onValueChanged,
  onConfigClick,
  scale = 1.5
}) => {
  const [value, setValue] = useState(null);
  const [isDragging, setIsDragging] = useState(false); // Add state to track dragging
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
    
    // If we are or were recently dragging, don't open the config modal
    if (isDragging) {
      setIsDragging(false);
      return;
    }
    
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
        return <TextInputWidget config={enhancedConfig} value={value} scale={widgetScale} />;
      case 'number_input':
        return <NumberInputWidget config={enhancedConfig} value={value} scale={widgetScale} />;
      case 'togglebutton':
        return <ToggleButtonWidget config={enhancedConfig} isActive={value} scale={widgetScale} />;
      case 'color_picker':
        return <ColorPickerWidget config={enhancedConfig} selectedColor={value} scale={widgetScale} />;
      default:
        // Fallback to a simple box for unsupported types with more vibrant color
        return (
          <RoundedBox args={[1.5, 1.5, 0.5]} scale={widgetScale} radius={0.2}>
            <meshStandardMaterial color="#FF4081" />
            <Text
              position={[0, 0, 0.26]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {normalizedType}
            </Text>
          </RoundedBox>
        );
    }
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
      // Add drag event handlers to track when dragging starts and ends
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => {
        // Set a timeout to prevent the click handler from firing immediately
        setTimeout(() => setIsDragging(false), 100);
      }}
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
  onValueChanged: PropTypes.func,
  onConfigClick: PropTypes.func,
  scale: PropTypes.number
};

export default Widget3D;