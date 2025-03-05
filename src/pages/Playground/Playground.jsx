import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import Interactive3DWidget from '../../pages/DeveloperZone/Interactive3DWidget';


const DraggableComponent = ({ component, onValueChanged, onDelete }) => {
  const { setNodeRef, transform, listeners, isDragging } = useSortable({
    id: component.instanceId.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 999 : undefined,
    cursor: 'grab',
    position: 'absolute',
    left: component.position.x,
    top: component.position.y,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners}
      className="group relative"
    >
      <Interactive3DWidget 
        widget={component} 
        isPreviewMode={true}
        onValueChanged={(value) => onValueChanged(component.instanceId, value)}
      />
      <div className="text-center font-semibold text-xs text-white mt-2">
        {component.name}
      </div>
      <button 
        onClick={() => onDelete(component.instanceId)}
        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>
  );
};

const Playground = () => {
  const [components, setComponents] = useState([]);
  const [activeSidebarTab, setActiveSidebarTab] = useState('components');
  const [availableWidgets, setAvailableWidgets] = useState([]);
  const [loadingWidgets, setLoadingWidgets] = useState(false);
  const [widgetStates, setWidgetStates] = useState({});
  const gridRef = useRef(null);

  const token = sessionStorage.getItem('authToken');

  useEffect(() => {
    fetchAvailableWidgets();
  }, []);

  const fetchAvailableWidgets = async () => {
    setLoadingWidgets(true);
    try {
      const response = await fetch(
        "https://cloud-platform-server-for-bjit.onrender.com/widgets",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAvailableWidgets(data);
    } catch (error) {
      console.error("Failed to fetch available widgets:", error);
      // Optional: Add toast or error notification
    } finally {
      setLoadingWidgets(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, delta } = event;
    setComponents((components) =>
      components.map((component) =>
        component.instanceId.toString() === active.id
          ? {
              ...component,
              position: {
                x: component.position.x + delta.x,
                y: component.position.y + delta.y,
              },
            }
          : component
      )
    );
  };

  const handleAddComponent = (widget) => {
    const newComponent = {
      ...widget,
      position: { 
        x: Math.random() * (gridRef.current.offsetWidth - 100), 
        y: Math.random() * (gridRef.current.offsetHeight - 100) 
      },
      instanceId: Date.now(),
    };
    
    setComponents([...components, newComponent]);
    
    // Initialize state for the new widget
    setWidgetStates(prev => ({
      ...prev,
      [newComponent.instanceId]: widget.state?.default ?? 
        (widget.type === '3d_switch' ? false : 50)
    }));
  };

  const handleDeleteComponent = (instanceId) => {
    setComponents(components.filter(c => c.instanceId !== instanceId));
    
    // Remove the widget state
    setWidgetStates(prev => {
      const newStates = {...prev};
      delete newStates[instanceId];
      return newStates;
    });
  };

  const handleValueChanged = (instanceId, newValue) => {
    // Update the state for the specific widget
    setWidgetStates(prev => ({
      ...prev,
      [instanceId]: newValue
    }));
  };

  const handleExportPlayground = () => {
    const exportData = {
      components: components.map(component => ({
        id: component.id,
        type: component.type,
        name: component.name,
        position: component.position,
        state: widgetStates[component.instanceId]
      })),
      timestamp: new Date().toISOString()
    };

    // Create a downloadable JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `playground_export_${new Date().toISOString().replace(/:/g, '-')}.json`;
    link.click();
  };

  const createGridPattern = () => {
    const dots = [];
    const gridSize = 20;
    const gridContainer = gridRef.current;
    if (!gridContainer) return dots;

    const width = gridContainer.offsetWidth;
    const height = gridContainer.offsetHeight;

    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        dots.push(
          <div
            key={`${x}-${y}`}
            className="h-1 w-1 bg-indigo-200 rounded-full absolute opacity-30"
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
            <h2 className="text-lg font-bold mb-4 text-gray-100">Components</h2>
            {loadingWidgets ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : availableWidgets.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No components available
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {availableWidgets.map((widget) => (
                  <div
                    key={widget.id}
                    onClick={() => handleAddComponent(widget)}
                    className="cursor-pointer border border-gray-300 rounded-md overflow-hidden hover:border-blue-400 transition-colors"
                  >
                    <div className="w-full h-16 flex items-center justify-center bg-gray-100">
                      <Interactive3DWidget 
                        widget={widget} 
                        isPreviewMode={true}
                      />
                    </div>
                    <div className="text-center font-bold py-1 text-sm text-gray-300">
                      {widget.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 text-sm text-gray-800">
              <p>Click components to add to the grid.</p>
              <p className="mt-2">Components will snap to the dotted grid.</p>
            </div>
          </>
        );
      case 'states':
        return (
          <div>
            <h2 className="text-lg font-bold mb-4 text-gray-100">Widget States</h2>
            {Object.entries(widgetStates).map(([instanceId, value]) => {
              const component = components.find(c => c.instanceId.toString() === instanceId);
              return (
                <div 
                  key={instanceId} 
                  className="bg-gray-700 rounded-md p-3 mb-2 flex justify-between items-center"
                >
                  <span className="text-white">{component?.name}</span>
                  <span className="text-blue-300">{JSON.stringify(value)}</span>
                </div>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div className="flex flex-col h-screen">
      {/* Header remains the same */}
      <div className="h-16 bg-gray-800 border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-10">
        <div className="flex-shrink-0 flex items-center">
          <Link
            to="/"
            className="h-10 w-10 rounded bg-emerald-500 flex items-center justify-center text-white font-bold"
          >
            BJIT
          </Link>
          <span className="ml-2 text-lg font-semibold text-slate-800 dark:text-white transition-colors duration-200">
            Cloud.Playground
          </span>
        </div>
        <div className="flex space-x-4">
          <button className="px-3 py-1 bg-indigo-900 text-white rounded hover:bg-indigo-700">
            Preview
          </button>
          <button 
            onClick={handleExportPlayground}
            className="px-3 py-1 bg-gray-900 border border-gray-300 rounded hover:bg-gray-200"
          >
            Export
          </button>
          <button className="px-3 py-1 bg-gray-700 border border-gray-300 rounded hover:bg-gray-200">
            Settings
          </button>
          <button
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={fetchAvailableWidgets}
          >
            Refresh Components
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden p-4">
        {/* Sidebar navigation remains the same */}
        <div className="w-16 bg-gray-800 flex flex-col items-center py-4">
          <button
            className={`p-3 rounded-md mb-2 ${
              activeSidebarTab === 'components'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveSidebarTab('components')}
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
          </button>
          <button
            className={`p-3 rounded-md mb-2 ${
              activeSidebarTab === 'states'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveSidebarTab('states')}
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
          </button>
        </div>
        
        <div className="flex-1 relative bg-gray-900 p-4" ref={gridRef}>
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <SortableContext items={components.map((c) => c.instanceId.toString())}>
              <div className="relative h-full w-full">
                {createGridPattern()}
                {components.map((component) => (
                  <DraggableComponent
                    key={component.instanceId}
                    component={component}
                    onValueChanged={handleValueChanged}
                    onDelete={handleDeleteComponent}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="w-64 bg-gray-800 p-4 overflow-y-auto">
          {renderSidebarContent()}
        </div>
      </div>

      <footer className="bg-gray-800 text-white text-center py-2">
        <p>&copy; 2024 Cloud.Playground by BJIT</p>
      </footer>
    </div>
  );
};

export default Playground;