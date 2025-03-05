import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

// Interactive 3D Widget Component
const Interactive3DWidget = ({ 
  widget, 
  isPreviewMode = true, 
  onValueChanged 
}) => {
  // Ensure widget is not null or undefined
  if (!widget) {
    return <div className="text-red-500">Invalid Widget</div>;
  }

  // Normalize widget type to lowercase and remove any prefixes
  const normalizedType = widget.type?.toLowerCase().replace('3d_', '') || 'unsupported';

  const [value, setValue] = useState(
    widget.state?.default ?? (normalizedType === 'switch' ? false : 50)
  );
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const widgetRef = useRef(null);

  // Utility function to convert hex to rgba
  const hexToRgba = (hex, alpha = 1) => {
    try {
      const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
      return `rgba(${r},${g},${b},${alpha})`;
    } catch (error) {
      console.warn('Invalid hex color:', hex);
      return 'rgba(33,33,33,1)'; // default color
    }
  };

  // Render Unsupported Widget Type
  const renderUnsupportedWidget = () => {
    return (
      <div 
        className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center"
        title={`Unsupported Widget Type: ${widget.type}`}
      >
        <span className="text-gray-600 text-xs text-center">
          Unsupported
          <br />
          Widget Type
        </span>
      </div>
    );
  };

  // Render Switch Widget
  const renderSwitch = () => {
    const colors = widget.appearance?.colors || {};
    const onColor = colors.switch_on || '#4CAF50';
    const offColor = colors.switch_off || '#F44336';

    const handleToggle = () => {
      if (!isPreviewMode) return;
      
      const newValue = !value;
      setValue(newValue);
      onValueChanged?.(newValue);
      
      // Trigger animation
      controls.start({
        rotate: newValue ? 360 : 0,
        scale: [1, 1.1, 1],
        transition: { duration: 0.3 }
      });
    };

    return (
      <motion.div
        ref={widgetRef}
        className="w-24 h-24 rounded-xl flex items-center justify-center cursor-pointer"
        style={{ 
          backgroundColor: value ? onColor : offColor,
          boxShadow: isHovered ? '0 4px 8px rgba(0,0,0,0.2)' : 'none'
        }}
        whileHover={{ scale: 1.05 }}
        animate={controls}
        onClick={handleToggle}
      >
        <motion.div 
          animate={{ rotate: value ? 360 : 0 }}
        >
          {value ? '✓' : '✗'}
        </motion.div>
      </motion.div>
    );
  };

  // Render Slider Widget
  const renderSlider = () => {
    const state = widget.state || {};
    const minValue = state.min_value ?? 0;
    const maxValue = state.max_value ?? 100;
    const step = state.step ?? 1;

    const handleSliderChange = (e) => {
      if (!isPreviewMode) return;
      
      const newValue = Number(e.target.value);
      setValue(newValue);
      onValueChanged?.(newValue);
    };

    return (
      <div className="w-48 p-4 bg-white rounded-xl">
        <input 
          type="range"
          min={minValue}
          max={maxValue}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full"
        />
        <div className="text-center mt-2">{value}</div>
      </div>
    );
  };

  // Render Button Widget
  const renderButton = () => {
    const state = widget.state || {};
    const label = state.label || 'PRESS';
    const colors = widget.appearance?.colors || {};
    const buttonColor = colors.button || '#2196F3';
    const textColor = colors.text || '#FFFFFF';

    const handleButtonPress = () => {
      if (!isPreviewMode) return;
      
      const newValue = !value;
      setValue(newValue);
      onValueChanged?.(newValue);
      
      // Trigger animation
      controls.start({
        scale: [1, 0.9, 1],
        transition: { duration: 0.2 }
      });
    };

    return (
      <motion.button
        className="w-24 h-24 rounded-xl text-center"
        style={{ 
          backgroundColor: buttonColor, 
          color: textColor 
        }}
        whileHover={{ scale: 1.05 }}
        animate={controls}
        onClick={handleButtonPress}
      >
        {label}
      </motion.button>
    );
  };

  // Render Toggle Button Widget
  const renderToggleButton = () => {
    const state = widget.state || {};
    const labels = state.labels || { on: 'ON', off: 'OFF' };
    const colors = widget.appearance?.colors || {};
    const activeColor = colors.active || '#4CAF50';
    const inactiveColor = colors.inactive || '#F44336';

    const handleToggle = () => {
      if (!isPreviewMode) return;
      
      const newValue = !value;
      setValue(newValue);
      onValueChanged?.(newValue);
    };

    return (
      <div 
        className="w-24 h-24 rounded-xl flex flex-col items-center justify-center cursor-pointer"
        style={{ 
          backgroundColor: value ? activeColor : inactiveColor,
          color: colors.text || '#FFFFFF'
        }}
        onClick={handleToggle}
      >
        <div>{value ? '✓' : '✗'}</div>
        <div className="mt-2 font-bold">
          {value ? labels.on : labels.off}
        </div>
      </div>
    );
  };

  // Render Text Input Widget
  const renderTextInput = () => {
    const state = widget.state || {};
    const placeholder = state.placeholder || 'Enter text...';
    const colors = widget.appearance?.colors || {};

    const handleTextChange = (e) => {
      if (!isPreviewMode) return;
      
      const newValue = e.target.value;
      setValue(newValue);
      onValueChanged?.(newValue);
    };

    return (
      <div className="w-48 p-2 bg-white rounded-xl">
        <input 
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleTextChange}
          disabled={!isPreviewMode}
          className="w-full p-2 border rounded"
          style={{
            backgroundColor: colors.background || '#FFFFFF',
            color: colors.text || '#212121',
            borderColor: colors.border || '#BDBDBD'
          }}
        />
      </div>
    );
  };

  // Render Number Input Widget
  const renderNumberInput = () => {
    const state = widget.state || {};
    const minValue = state.min_value ?? -100;
    const maxValue = state.max_value ?? 100;
    const step = state.step ?? 1;
    const colors = widget.appearance?.colors || {};

    const handleIncrement = () => {
      if (!isPreviewMode) return;
      
      const newValue = Math.min(value + step, maxValue);
      setValue(newValue);
      onValueChanged?.(newValue);
    };

    const handleDecrement = () => {
      if (!isPreviewMode) return;
      
      const newValue = Math.max(value - step, minValue);
      setValue(newValue);
      onValueChanged?.(newValue);
    };

    return (
      <div 
        className="w-48 h-24 flex rounded-xl overflow-hidden"
        style={{ backgroundColor: colors.background || '#FFFFFF' }}
      >
        <button 
          onClick={handleDecrement}
          className="w-1/4 bg-blue-500 text-white"
          style={{ backgroundColor: colors.buttons || '#2196F3' }}
        >
          -
        </button>
        <div 
          className="flex-grow flex items-center justify-center font-bold"
          style={{ color: colors.text || '#212121' }}
        >
          {value}
        </div>
        <button 
          onClick={handleIncrement}
          className="w-1/4 bg-blue-500 text-white"
          style={{ backgroundColor: colors.buttons || '#2196F3' }}
        >
          +
        </button>
      </div>
    );
  };

  // Render Color Picker Widget
  const renderColorPicker = () => {
    const interaction = widget.interaction || {};
    const presets = interaction.presets?.colors || [
      '#F44336', '#2196F3', '#4CAF50', '#FFEB3B', '#9C27B0', '#FF9800'
    ];
    const colors = widget.appearance?.colors || {};

    const handleColorSelect = (color) => {
      if (!isPreviewMode) return;
      
      setValue(color);
      onValueChanged?.(color);
    };

    return (
      <div 
        className="w-48 p-4 rounded-xl flex flex-col items-center"
        style={{ 
          backgroundColor: colors.background || '#FFFFFF',
          borderColor: colors.border || '#BDBDBD'
        }}
      >
        <div 
          className="w-16 h-16 rounded-full mb-4"
          style={{ 
            backgroundColor: value || '#2196F3',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)' 
          }}
        />
        <div className="flex flex-wrap justify-center gap-2">
          {presets.slice(0, 6).map((color, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full cursor-pointer"
              style={{ 
                backgroundColor: color,
                border: '1px solid #E0E0E0'
              }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>
      </div>
    );
  };

  // Render Gauge Widget
  const renderGauge = () => {
    const state = widget.state || {};
    const minValue = state.min_value ?? 0;
    const maxValue = state.max_value ?? 100;
    const colors = widget.appearance?.colors || {};

    // Calculate gauge angle (0 to 270 degrees)
    const angle = ((value - minValue) / (maxValue - minValue)) * 270;

    return (
      <div 
        className="w-48 h-48 rounded-full relative flex items-center justify-center"
        style={{ 
          backgroundColor: colors.dial || '#FAFAFA',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)' 
        }}
      >
        <div 
          className="absolute w-1 h-20 origin-bottom"
          style={{ 
            backgroundColor: colors.needle || '#F44336',
            transform: `rotate(${angle - 135}deg)`,
            transformOrigin: 'bottom center'
          }}
        />
        <div 
          className="absolute w-4 h-4 rounded-full"
          style={{ backgroundColor: colors.needle || '#F44336' }}
        />
        <div className="mt-24 text-xl font-bold">
          {value}
        </div>
      </div>
    );
  };

  // Handle different widget types
  const renderWidgetByType = () => {
    switch (normalizedType) {
      case 'switch':
        return renderSwitch();
      case 'slider':
        return renderSlider();
      case 'button':
        return renderButton();
      case 'toggle_button':
        return renderToggleButton();
      case 'text_input':
        return renderTextInput();
      case 'number_input':
        return renderNumberInput();
      case 'color_picker':
        return renderColorPicker();
      case 'gauge':
        return renderGauge();
      default:
        return renderUnsupportedWidget();
    }
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative transition-all duration-300 ${isPreviewMode ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {renderWidgetByType()}
      {!isPreviewMode && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <span className="text-white font-bold">Configure</span>
        </div>
      )}
    </div>
  );
};

export default Interactive3DWidget;