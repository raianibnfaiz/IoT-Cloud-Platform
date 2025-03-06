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

const WidgetConfigModal = ({ widget, isOpen, onClose, onSave }) => {
  // ... existing code ...
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
  onSave: PropTypes.func.isRequired
};

export default WidgetConfigModal;