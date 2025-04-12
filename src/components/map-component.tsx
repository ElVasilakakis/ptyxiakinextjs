'use client'
import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from 'react-leaflet';

// Set up Leaflet default icon
const setupLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/marker-icon-2x.png',
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
  });
};

// Location marker component
const LocationMarker = ({ position, setPosition, mode }) => {
  const map = useMapEvents({
    click(e) {
      if (mode === 'point') {
        setPosition([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  return position ? <Marker position={position} /> : null;
};

// Polygon creator component
const PolygonCreator = ({ positions, setPositions, mode, color }) => {
  const map = useMapEvents({
    click(e) {
      if (mode === 'polygon') {
        setPositions([...positions, [e.latlng.lat, e.latlng.lng]]);
      }
    },
  });

  return positions.length > 2 ? (
    <Polygon positions={positions} pathOptions={{ color }} />
  ) : null;
};

// Main map component
const MapComponent = ({ 
  position, 
  setPosition, 
  polygonPositions, 
  setPolygonPositions, 
  mode, 
  mapCenter, 
  color = '#4CAF50' 
}) => {
  useEffect(() => {
    setupLeafletIcons();
  }, []);

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} setPosition={setPosition} mode={mode} />
      <PolygonCreator 
        positions={polygonPositions} 
        setPositions={setPolygonPositions} 
        mode={mode}
        color={color}
      />
    </MapContainer>
  );
};

export default MapComponent;
