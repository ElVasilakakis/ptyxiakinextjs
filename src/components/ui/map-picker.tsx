'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import MapComponent from '../map-component';

// Dynamically import map component with SSR disabled
const MapWithNoSSR = dynamic(
  () => import('../map-component'),
  { ssr: false }
);
export default function MapPicker({ onChange, initialValue, color = '#4CAF50' }) {
  const [mode, setMode] = useState('polygon');
  const [position, setPosition] = useState(null);
  const [polygonPositions, setPolygonPositions] = useState([]);
  const [mapCenter] = useState([37.9838, 23.7275]); // Athens coordinates
  const initialLoadRef = useRef(true);
  const [isClient, setIsClient] = useState(false);

  // Enable client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Initialize from existing value if provided
  useEffect(() => {
    if (!initialValue) return;
    
    try {
      const data = typeof initialValue === 'string' 
        ? JSON.parse(initialValue) 
        : initialValue;
        
      if (data?.type === 'Point' && data?.coordinates) {
        setPosition([data.coordinates[1], data.coordinates[0]]);
        setMode('point');
      } else if (data?.type === 'Polygon' && data?.coordinates && data.coordinates[0]) {
        // Convert GeoJSON format to Leaflet format
        setPolygonPositions(data.coordinates[0].map(coord => [coord[1], coord[0]]));
        setMode('polygon');
      }
    } catch (e) {
      console.error("Failed to parse initial value:", e);
    }
  }, [initialValue]);

  // Memoize the update function to avoid recreating it on every render
  const updateParent = useCallback((mode, position, polygonPositions) => {
    if (mode === 'point' && position) {
      const geoJson = {
        type: 'Point',
        coordinates: [position[1], position[0]]
      };
      onChange(geoJson);
    } else if (mode === 'polygon' && polygonPositions.length > 2) {
      // Close the polygon if needed
      let coords = [...polygonPositions];
      if (coords.length > 2 && (coords[0][0] !== coords[coords.length-1][0] || coords[0][1] !== coords[coords.length-1][1])) {
        coords.push(coords[0]);
      }
      
      const geoJson = {
        type: 'Polygon',
        coordinates: [coords.map(pos => [pos[1], pos[0]])]
      };
      onChange(geoJson);
    }
  }, [onChange]);

  // Handle position changes
  const handlePositionChange = useCallback((newPosition) => {
    setPosition(newPosition);
    if (!initialLoadRef.current && mode === 'point') {
      updateParent('point', newPosition, polygonPositions);
    }
  }, [mode, polygonPositions, updateParent]);

  // Handle polygon changes
  const handlePolygonChange = useCallback((newPositions) => {
    setPolygonPositions(newPositions);
    if (!initialLoadRef.current && mode === 'polygon' && newPositions.length > 2) {
      updateParent(mode, position, newPositions);
    }
  }, [mode, position, updateParent]);

  // Reset initial load flag after component mounts
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
    }
  }, []);

  const resetPolygon = () => {
    setPolygonPositions([]);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2 mb-2">
        <button
          type="button"
          className={`px-3 py-1 rounded-md text-sm ${mode === 'point' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setMode('point')}
        >
          Point Mode
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded-md text-sm ${mode === 'polygon' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setMode('polygon')}
        >
          Polygon Mode
        </button>
        {mode === 'polygon' && (
          <button
            type="button"
            className="px-3 py-1 rounded-md text-sm bg-red-500 text-white"
            onClick={resetPolygon}
          >
            Reset Polygon
          </button>
        )}
      </div>
      
      <div style={{ height: '400px', width: '100%' }}>
        {isClient && (
          <MapWithNoSSR
            position={position}
            setPosition={handlePositionChange}
            polygonPositions={polygonPositions}
            setPolygonPositions={handlePolygonChange}
            mode={mode}
            mapCenter={mapCenter}
            color={color}
          />
        )}
      </div>
      
      <div className="text-sm text-gray-500">
        {mode === 'point' ? 
          'Click on the map to set a location point' : 
          'Click on the map to create polygon vertices. Click at least 3 points to form a polygon.'}
      </div>
    </div>
  );
}
