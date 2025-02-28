import React, { useState, useRef } from 'react';

const Playground = () => {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [activeSidebarTab, setActiveSidebarTab] = useState('components');
  const gridRef = useRef(null);

  // Sample component data
  const availableComponents = [
    { id: 1, name: 'Button', image: '/api/placeholder/100/80' },
    { id: 2, name: 'Card', image: '/api/placeholder/100/80' },
    { id: 3, name: 'Input', image: '/api/placeholder/100/80' },
    { id: 4, name: 'Dropdown', image: '/api/placeholder/100/80' },
    { id: 5, name: 'Modal', image: '/api/placeholder/100/80' },
    { id: 6, name: 'Toggle', image: '/api/placeholder/100/80' },
  ];

  const handleMouseDown = (componentId) => {
    setSelectedComponent(componentId);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !gridRef.current) return;
    
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Snap to grid (20px grid)
    const snappedX = Math.floor(x / 20) * 20;
    const snappedY = Math.floor(y / 20) * 20;
    
    setDragPosition({ x: snappedX, y: snappedY });
  };

  const handleMouseUp = () => {
    if (isDragging && selectedComponent) {
      // Add component to the grid
      const component = availableComponents.find(c => c.id === selectedComponent);
      if (component) {
        setComponents([
          ...components,
          {
            ...component,
            position: { ...dragPosition },
            instanceId: Date.now() // Create a unique ID for this instance
          }
        ]);
      }
      setIsDragging(false);
      setSelectedComponent(null);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Create the dotted grid background
  const createGridPattern = () => {
    const dots = [];
    const gridSize = 20;
    const width = 800;
    const height = 600;
    
    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        dots.push(
          <div 
            key={`${x}-${y}`} 
            className="h-1 w-1 bg-gray-300 rounded-full absolute" 
            style={{ left: x, top: y }}
          />
        );
      }
    }
    return dots;
  };

  const renderSidebarContent = () => {
    switch (activeSidebarTab) {
      case 'components':
        return (
          <>
            <h2 className="text-lg font-bold mb-4">Components</h2>
            <div className="grid grid-cols-2 gap-4">
              {availableComponents.map((component) => (
                <div 
                  key={component.id}
                  className="cursor-grab border border-gray-200 rounded-md overflow-hidden hover:border-blue-400 transition-colors"
                  onMouseDown={() => handleMouseDown(component.id)}
                >
                  <img 
                    src={component.image} 
                    alt={component.name} 
                    className="w-full h-16 object-cover bg-gray-100" 
                  />
                  <div className="text-center py-1 text-sm">{component.name}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-sm text-gray-500">
              <p>Drag components onto the grid.</p>
              <p className="mt-2">Components will snap to the dotted grid.</p>
            </div>
          </>
        );
      case 'properties':
        return (
          <>
            <h2 className="text-lg font-bold mb-4">Properties</h2>
            <div className="p-2">
              <p className="text-sm text-gray-500">Select a component to edit its properties.</p>
            </div>
          </>
        );
      case 'layers':
        return (
          <>
            <h2 className="text-lg font-bold mb-4">Layers</h2>
            <div className="p-2">
              {components.length === 0 ? (
                <p className="text-sm text-gray-500">No components added yet.</p>
              ) : (
                <ul className="space-y-2">
                  {components.map((comp) => (
                    <li key={comp.instanceId} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                      <span className="text-sm">{comp.name}</span>
                      <span className="text-xs text-gray-500">ID: {comp.instanceId.toString().slice(-4)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-10">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Design Playground</h1>
        </div>
        <div className="flex space-x-4">
          <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Preview</button>
          <button className="px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">Export</button>
          <button className="px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">Settings</button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-16 bg-gray-800 flex flex-col items-center py-4">
          <button 
            className={`p-3 rounded-md mb-2 ${activeSidebarTab === 'components' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveSidebarTab('components')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <button 
            className={`p-3 rounded-md mb-2 ${activeSidebarTab === 'properties' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveSidebarTab('properties')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button 
            className={`p-3 rounded-md mb-2 ${activeSidebarTab === 'layers' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveSidebarTab('layers')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </button>
        </div>
        
        {/* Main grid area */}
        <div 
          className="flex-1 relative bg-gray-100 overflow-auto p-8 flex justify-center items-center"
        >
          <div 
            className="relative bg-white shadow-lg rounded-lg w-full max-w-4xl h-full max-h-full overflow-hidden"
            ref={gridRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {/* Dotted grid */}
            {createGridPattern()}
            
            {/* Placed components */}
            {components.map((comp) => (
              <div 
                key={comp.instanceId}
                className="absolute bg-white shadow-md p-2 rounded-md"
                style={{ 
                  left: comp.position.x, 
                  top: comp.position.y,
                  width: '120px'
                }}
              >
                <img src={comp.image} alt={comp.name} className="w-full h-20 object-cover bg-gray-200" />
                <div className="text-center mt-1 text-sm font-medium">{comp.name}</div>
              </div>
            ))}
            
            {/* Component being dragged */}
            {isDragging && selectedComponent && (
              <div 
                className="absolute bg-white shadow-md p-2 rounded-md opacity-70 pointer-events-none"
                style={{ 
                  left: dragPosition.x, 
                  top: dragPosition.y,
                  width: '120px'
                }}
              >
                <img 
                  src={availableComponents.find(c => c.id === selectedComponent)?.image} 
                  alt="Component" 
                  className="w-full h-20 object-cover bg-gray-200" 
                />
                <div className="text-center mt-1 text-sm font-medium">
                  {availableComponents.find(c => c.id === selectedComponent)?.name}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right panel */}
        <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          {renderSidebarContent()}
        </div>
      </div>
    </div>
  );
};

export default Playground;