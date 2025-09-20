import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Location, UserLocation } from "../types";
import Header from "../components/Header";

// Interface for dropped pins
interface DroppedPin {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  note?: string;
}

// Mock data for heritage locations
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockLocations: Location[] = [
  {
    id: "1",
    name: "Old Fort Gate",
    description:
      "Built in the 16 m century by the Qutb Shahi dynasty, this gate once guarded the northern approach to the city.",
    latitude: 28.6139,
    longitude: 77.209,
    imageUrl: "/api/placeholder/400/300",
    audioUrl: "/api/audio/old-fort-gate.mp3",
    audioTitle: "Watch 305 Story",
    audioDuration: "0:42",
    category: "heritage",
    distance: "550 m • 45 m",
  },
  {
    id: "2",
    name: "Heritage Museum",
    description: "A collection of ancient artifacts and cultural treasures.",
    latitude: 28.6129,
    longitude: 77.21,
    imageUrl: "/api/placeholder/400/300",
    audioUrl: "/api/audio/heritage-museum.mp3",
    audioTitle: "Museum History",
    audioDuration: "1:15",
    category: "museum",
    distance: "750 m • 12 m",
  },
];

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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
      setError("Geolocation is not supported");
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
  const useReverseLocation = false; // Toggle this to switch between user location and hardcoded location
  const {
    location: userLocation,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error,
    loading,
    getCurrentLocation,
  } = useUserLocation();
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    28.6139, 77.209,
  ]); // Default to Delhi
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [droppedPins, setDroppedPins] = useState<DroppedPin[]>([]);
  const [pinDropMode, setPinDropMode] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  // Custom icon for user location
  const userLocationIcon = L.divIcon({
    html: `<div style="background: #5dade2; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
    className: "user-location-marker",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  // Custom icon for heritage locations
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const heritageIcon = L.divIcon({
    html: `<div style="background: #e74c3c; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">📍</div>`,
    className: "heritage-location-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  // Custom icon for dropped pins
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const droppedPinIcon = L.divIcon({
    html: `<div style="background: #f39c12; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">📌</div>`,
    className: "dropped-pin-marker",
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
        name: "My Dropped Pin",
        description: `Pin dropped on ${timestamp.toLocaleDateString()} at ${timestamp.toLocaleTimeString()}. Coordinates: ${lat.toFixed(
          6
        )}, ${lng.toFixed(6)}`,
        latitude: lat,
        longitude: lng,
        imageUrl:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", // Default pin image
        category: "other",
        distance: "Just dropped",
      };

      setDroppedPins((prev) => [...prev, newPin]);
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removePin = (pinId: string) => {
    setDroppedPins((prev) => prev.filter((pin) => pin.id !== pinId));
  };

  // Handle clicking on an existing dropped pin
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePinClick = (pin: DroppedPin) => {
    const pinLocation: Location = {
      id: pin.id,
      name: "My Dropped Pin",
      description: `Pin dropped on ${pin.timestamp.toLocaleDateString()} at ${pin.timestamp.toLocaleTimeString()}. Coordinates: ${pin.latitude.toFixed(
        6
      )}, ${pin.longitude.toFixed(6)}`,
      latitude: pin.latitude,
      longitude: pin.longitude,
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", // Default pin image
      category: "other",
      distance: `Dropped ${pin.timestamp.toLocaleDateString()}`,
    };
    onLocationSelect(pinLocation);
  };

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.latitude, userLocation.longitude]);

      // Call reverse geocode API
      const fetchAddress = async () => {
        try {
          const latitude = useReverseLocation
            ? userLocation.latitude
            : "17.361602400000002";
          const longitude = useReverseLocation
            ? userLocation.longitude
            : "78.47464213773966";

          const response = await fetch(
            `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=68c902de50ab1923467488otk14fbfa`,
            {
              method: "POST",
              // headers: {
              //   "User-Agent": "insomnia/11.6.0",
              // },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch address");
          const data = await response.json();
          setAddress(data.display_name || null);
        } catch (err) {
          setAddress(null);
        }
      };
      fetchAddress();
    }
  }, [userLocation, useReverseLocation]);

  const getCurrentLocationButton = (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      {/* Pin Drop Mode Toggle Button */}
      <button
        onClick={togglePinDropMode}
        style={{
          background: pinDropMode ? "#f39c12" : "rgba(255, 255, 255, 0.9)",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          color: pinDropMode ? "white" : "#f39c12",
          fontSize: "16px",
        }}
        title={pinDropMode ? "Exit pin drop mode" : "Drop a pin"}
      >
        📌
      </button>

      {/* Current Location Button */}
      <button
        onClick={handleCurrentLocationClick}
        disabled={loading}
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          border: "none",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          color: "#5dade2",
        }}
      >
        {loading ? (
          <div
            className="spinner"
            style={{ width: "20px", height: "20px" }}
          ></div>
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
        <div
          className="map-container"
          style={{ height: "calc(100vh - 140px)", borderRadius: 0 }}
        >
          <MapContainer
            center={mapCenter}
            zoom={15}
            style={{
              height: "100%",
              width: "100%",
              cursor: pinDropMode ? "crosshair" : "grab",
            }}
            zoomControl={false}
          >
            <MapController center={mapCenter} />
            <MapClickHandler
              onMapClick={handleMapClick}
              pinDropMode={pinDropMode}
            />
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
                    {address && (
                      <>
                        <br />
                        <span style={{ fontSize: "0.85em", color: "#666" }}>
                          Address: {address}
                        </span>
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            )}
            {/* ...existing code... */}
          </MapContainer>
        </div>
        {/* ...existing code... */}
      </div>
    </div>
  );
};

export default HomeScreen;
