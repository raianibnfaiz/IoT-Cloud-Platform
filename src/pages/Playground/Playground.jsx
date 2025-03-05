import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

const DEFAULT_IMAGE = '/path/to/default/image.png'; // Replace with your actual placeholder image path

const DraggableComponent = ({ component }) => {
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
    <div ref={setNodeRef} style={style} {...listeners}>
      <img
        src={component.image || DEFAULT_IMAGE}
        alt={component.name}
        className="w-16 h-16 object-cover"
      />
      <div className="text-center font-semibold text-xs text-white">
        {component.name}
      </div>
    </div>
  );
};

const Playground = () => {
  const [components, setComponents] = useState([]);
  const [activeSidebarTab, setActiveSidebarTab] = useState('components');
  const [availableWidgets, setAvailableWidgets] = useState([]);
  const [loadingWidgets, setLoadingWidgets] = useState(false);
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
    setComponents([
      ...components,
      {
        ...widget,
        position: { x: 10, y: 10 },
        instanceId: Date.now(),
      },
    ]);
  };

  const createGridPattern = () => {
    const dots = [];
    const gridSize = 20; // Adjust this value to control the dot spacing
    const gridContainer = gridRef.current;
    if (!gridContainer) return dots;

    const width = gridContainer.offsetWidth;
    const height = gridContainer.offsetHeight;

    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        dots.push(
          <div
            key={`${x}-${y}`}
            className="h-1 w-1 bg-indigo-200 rounded-full absolute"
            style={{ left: x, top: y }}
          />
        );
      }
    }
    return dots;
  };

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div className="flex flex-col h-screen">
      <div className="h-16 bg-gray-800 border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-10">
        <div className="flex-shrink-0 flex items-center">
          <Link
            to="/"
            className="h-10 w-10 rounded bg-emerald-500 flex items-center justify-center text-white font-bold"
          >
            BJIT
          </Link>
          <span className="ml-2 text-lg font-semibold text-slate-800 dark:text-white">
            Cloud.Playground
          </span>
        </div>
        <div className="flex space-x-4">
          <button className="px-3 py-1 bg-indigo-900 text-white rounded hover:bg-indigo-700">
            Preview
          </button>
          <button className="px-3 py-1 bg-gray-900 border border-gray-300 rounded hover:bg-gray-200">
            Export
          </button>
          <Link to ='/dashboard'><button className="px-3 py-1 bg-gray-700 border border-gray-300 rounded hover:bg-gray-200">
            Dashboard
          </button></Link>
          <button
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={fetchAvailableWidgets}
          >
            Refresh Components
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden p-4">
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
        </div>

        <div className="flex-1 relative bg-gray-900 p-2 m-2 overflow-hidden" ref={gridRef}>
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <SortableContext items={components.map((c) => c.instanceId.toString())}>
              <div className="relative h-full w-full" style={{ padding: '10px' }}>
                {createGridPattern()}
                {components.map((component) => (
                  <DraggableComponent key={component.instanceId} component={component} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="w-64 bg-gray-800 p-4 overflow-y-auto">
          {activeSidebarTab === 'components' && (
            <div>
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
                      <img
                        src={widget.image || DEFAULT_IMAGE}
                        alt={widget.name}
                        className="w-full h-16 object-cover bg-gray-100"
                      />
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
            </div>
          )}
        </div>

      </div>

      <footer className="bg-gray-800 text-white text-center py-2">
        <p>&copy; 2023 Cloud.Playground by BJIT</p>
      </footer>
    </div>
  );
};

export default Playground;