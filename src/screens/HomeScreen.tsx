import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Location, UserLocation } from '../types';
import Header from '../components/Header';

// Interface for dropped pins
interface DroppedPin {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  note?: string;
}

// Mock data for heritage locations
const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Old Fort Gate',
    description: 'Built in the 16 m century by the Qutb Shahi dynasty, this gate once guarded the northern approach to the city.',
    latitude: 28.6139,
    longitude: 77.2090,
    imageUrl: '/api/placeholder/400/300',
    audioUrl: '/api/audio/old-fort-gate.mp3',
    audioTitle: 'Watch 305 Story',
    audioDuration: '0:42',
    category: 'heritage',
    distance: '550 m • 45 m'
  },
  {
    id: '2',
    name: 'Heritage Museum',
    description: 'A collection of ancient artifacts and cultural treasures.',
    latitude: 28.6129,
    longitude: 77.2100,
    imageUrl: '/api/placeholder/400/300',
    audioUrl: '/api/audio/heritage-museum.mp3',
    audioTitle: 'Museum History',
    audioDuration: '1:15',
    category: 'museum',
    distance: '750 m • 12 m'
  }
];

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom hook for location services
const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return { location, error, loading, getCurrentLocation };
};

// Component to handle map centering
const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);

  return null;
};

// Component to handle map click events for pin dropping
const MapClickHandler: React.FC<{ 
  onMapClick: (lat: number, lng: number) => void;
  pinDropMode: boolean;
}> = ({ onMapClick, pinDropMode }) => {
  useMapEvents({
    click: (e) => {
      if (pinDropMode) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

interface HomeScreenProps {
  onLocationSelect: (location: Location) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onLocationSelect }) => {
  const { location: userLocation, error, loading, getCurrentLocation } = useUserLocation();
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]); // Default to Delhi
  const [droppedPins, setDroppedPins] = useState<DroppedPin[]>([]);
  const [pinDropMode, setPinDropMode] = useState(false);

  // Custom icon for user location
  const userLocationIcon = L.divIcon({
    html: `<div style="background: #5dade2; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
    className: 'user-location-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  // Custom icon for heritage locations
  const heritageIcon = L.divIcon({
    html: `<div style="background: #e74c3c; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">📍</div>`,
    className: 'heritage-location-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  // Custom icon for dropped pins
  const droppedPinIcon = L.divIcon({
    html: `<div style="background: #f39c12; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">📌</div>`,
    className: 'dropped-pin-marker',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

  const handleCurrentLocationClick = () => {
    getCurrentLocation();
  };

  // Handle pin dropping
  const handleMapClick = (lat: number, lng: number) => {
    if (pinDropMode) {
      const timestamp = new Date();
      const newPin: DroppedPin = {
        id: `pin-${Date.now()}`,
        latitude: lat,
        longitude: lng,
        timestamp: timestamp,
      };
      
      // Create a Location object for the dropped pin
      const pinLocation: Location = {
        id: newPin.id,
        name: 'My Dropped Pin',
        description: `Pin dropped on ${timestamp.toLocaleDateString()} at ${timestamp.toLocaleTimeString()}. Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        latitude: lat,
        longitude: lng,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Default pin image
        category: 'other',
        distance: 'Just dropped'
      };
      
      setDroppedPins(prev => [...prev, newPin]);
      setPinDropMode(false); // Exit pin drop mode after dropping a pin
      
      // Automatically select the dropped pin location
      onLocationSelect(pinLocation);
    }
  };

  // Toggle pin drop mode
  const togglePinDropMode = () => {
    setPinDropMode(!pinDropMode);
  };

  // Remove a dropped pin
  const removePin = (pinId: string) => {
    setDroppedPins(prev => prev.filter(pin => pin.id !== pinId));
  };

  // Handle clicking on an existing dropped pin
  const handlePinClick = (pin: DroppedPin) => {
    const pinLocation: Location = {
      id: pin.id,
      name: 'My Dropped Pin',
      description: `Pin dropped on ${pin.timestamp.toLocaleDateString()} at ${pin.timestamp.toLocaleTimeString()}. Coordinates: ${pin.latitude.toFixed(6)}, ${pin.longitude.toFixed(6)}`,
      latitude: pin.latitude,
      longitude: pin.longitude,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Default pin image
      category: 'other',
      distance: `Dropped ${pin.timestamp.toLocaleDateString()}`
    };
    onLocationSelect(pinLocation);
  };

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.latitude, userLocation.longitude]);
    }
  }, [userLocation]);

  const getCurrentLocationButton = (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {/* Pin Drop Mode Toggle Button */}
      <button
        onClick={togglePinDropMode}
        style={{
          background: pinDropMode ? '#f39c12' : 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          color: pinDropMode ? 'white' : '#f39c12',
          fontSize: '16px',
        }}
        title={pinDropMode ? 'Exit pin drop mode' : 'Drop a pin'}
      >
        📌
      </button>
      
      {/* Current Location Button */}
      <button
        onClick={handleCurrentLocationClick}
        disabled={loading}
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          color: '#5dade2',
        }}
      >
        {loading ? (
          <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />
          </svg>
        )}
      </button>
    </div>
  );

  return (
    <div className="app-container">
      <Header title="Home" rightAction={getCurrentLocationButton} />
      
      <div className="screen" style={{ padding: 0 }}>
        <div className="map-container" style={{ height: 'calc(100vh - 140px)', borderRadius: 0 }}>
          <MapContainer
            center={mapCenter}
            zoom={15}
            style={{ 
              height: '100%', 
              width: '100%',
              cursor: pinDropMode ? 'crosshair' : 'grab'
            }}
            zoomControl={false}
          >
            <MapController center={mapCenter} />
            <MapClickHandler onMapClick={handleMapClick} pinDropMode={pinDropMode} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* User location marker */}
            {userLocation && (
              <Marker
                position={[userLocation.latitude, userLocation.longitude]}
                icon={userLocationIcon}
              >
                <Popup>
                  <div>
                    <strong>Your Location</strong>
                    <br />
                    Accuracy: ±{userLocation.accuracy?.toFixed(0)}m
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Heritage location markers */}
            {mockLocations.map((location) => (
              <Marker
                key={location.id}
                position={[location.latitude, location.longitude]}
                icon={heritageIcon}
                eventHandlers={{
                  click: () => onLocationSelect(location),
                }}
              >
                <Popup>
                  <div style={{ minWidth: '200px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>
                      {location.name}
                    </h3>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem' }}>
                      {location.description.substring(0, 100)}...
                    </p>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>
                      {location.distance}
                    </div>
                    <button
                      onClick={() => onLocationSelect(location)}
                      style={{
                        marginTop: '8px',
                        padding: '6px 12px',
                        fontSize: '0.875rem',
                        minHeight: 'auto',
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Dropped pins */}
            {droppedPins.map((pin) => (
              <Marker
                key={pin.id}
                position={[pin.latitude, pin.longitude]}
                icon={droppedPinIcon}
                eventHandlers={{
                  click: () => handlePinClick(pin),
                }}
              >
                <Popup>
                  <div style={{ minWidth: '180px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      📌 My Pin
                    </h3>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: '#666' }}>
                      Dropped on {pin.timestamp.toLocaleDateString()} at {pin.timestamp.toLocaleTimeString()}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '8px' }}>
                      Lat: {pin.latitude.toFixed(6)}<br />
                      Lng: {pin.longitude.toFixed(6)}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handlePinClick(pin)}
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          fontSize: '0.875rem',
                          minHeight: 'auto',
                          background: '#f39c12',
                          border: 'none',
                          color: 'white',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => removePin(pin.id)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.875rem',
                          minHeight: 'auto',
                          background: '#e74c3c',
                          border: 'none',
                          color: 'white',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Current location button - positioned over map */}
        <div
          style={{
            position: 'absolute',
            bottom: '120px',
            right: '16px',
            zIndex: 1000,
          }}
        >
          <button
            onClick={handleCurrentLocationClick}
            disabled={loading}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              color: '#5dade2',
              fontSize: '24px',
            }}
          >
            {loading ? (
              <div className="spinner" style={{ width: '24px', height: '24px' }}></div>
            ) : (
              '🎯'
            )}
          </button>
        </div>

        {/* Pin drop mode indicator */}
        {pinDropMode && (
          <div
            style={{
              position: 'absolute',
              top: '80px',
              left: '16px',
              right: '16px',
              background: 'rgba(243, 156, 18, 0.95)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              textAlign: 'center',
              zIndex: 1000,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            📌 Tap anywhere on the map to drop a pin
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            style={{
              position: 'absolute',
              top: '80px',
              left: '16px',
              right: '16px',
              background: '#ff6b6b',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              zIndex: 1000,
            }}
          >
            Location Error: {error}
          </div>
        )}

        {/* Location list */}
        <div style={{ position: 'absolute', bottom: '100px', left: '16px', right: '16px' }}>
          <div className="card" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ marginBottom: '12px' }}>Nearby Heritage Sites</h3>
            {mockLocations.slice(0, 1).map((location) => (
              <div
                key={location.id}
                onClick={() => onLocationSelect(location)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ marginRight: '12px', fontSize: '24px' }}>🏛️</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{location.name}</h4>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>{location.distance}</div>
                </div>
                <svg viewBox="0 0 24 24" fill="#5dade2" width="20" height="20">
                  <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;