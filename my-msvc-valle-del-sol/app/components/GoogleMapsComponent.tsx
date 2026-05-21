'use client';

import React, { useCallback, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapMarker } from '@/types/reporte';

interface GoogleMapsComponentProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string;
}

const GoogleMapsComponent: React.FC<GoogleMapsComponentProps> = ({
  markers,
  center = { lat: 3.4372, lng: -76.5343 }, // Coordenadas default (Cali, Colombia)
  zoom = 13,
  onMarkerClick,
  onMapClick,
  height = '400px',
}) => {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [mapInstance, setMapInstance] = useState(null);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const containerStyle = {
    width: '100%',
    height: height,
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  const handleMapClick = useCallback(
    (e: any) => {
      if (onMapClick) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        onMapClick(lat, lng);
      }
    },
    [onMapClick]
  );

  const handleMarkerClick = useCallback(
    (marker: MapMarker) => {
      setSelectedMarker(marker);
      if (onMarkerClick) {
        onMarkerClick(marker);
      }
    },
    [onMarkerClick]
  );

  const getMarkerColor = (severidad: number): string => {
    if (severidad <= 2) return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    if (severidad <= 3) return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    if (severidad <= 4) return 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
    return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  };

  if (!googleMapsApiKey) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p className="font-semibold">Error: Google Maps API Key no configurada</p>
        <p className="text-sm mt-1">
          Por favor, configura la variable de entorno NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        </p>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onClick={handleMapClick}
        onLoad={(map) => setMapInstance(map as any)}
        options={{
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        {/* Markers de reportes */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.latitud, lng: marker.longitud }}
            icon={getMarkerColor(marker.severidad)}
            title={marker.titulo}
            onClick={() => handleMarkerClick(marker)}
          />
        ))}

        {/* Info Window del marker seleccionado */}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.latitud, lng: selectedMarker.longitud }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="bg-white rounded-lg shadow-lg p-3 max-w-xs">
              <h3 className="font-bold text-gray-800 text-sm mb-1">{selectedMarker.titulo}</h3>
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-semibold">ID:</span> {selectedMarker.id}
              </p>
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-semibold">Severidad:</span>
                <span
                  className={`ml-1 px-2 py-1 rounded text-white text-xs font-semibold ${
                    selectedMarker.severidad <= 2
                      ? 'bg-green-500'
                      : selectedMarker.severidad <= 3
                      ? 'bg-yellow-500'
                      : selectedMarker.severidad <= 4
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                >
                  {selectedMarker.severidad}/5
                </span>
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Estado:</span>
                <span
                  className={`ml-1 px-2 py-1 rounded text-white text-xs font-semibold ${
                    selectedMarker.estado === 'PENDIENTE'
                      ? 'bg-gray-500'
                      : selectedMarker.estado === 'CONFIRMADO'
                      ? 'bg-blue-500'
                      : selectedMarker.estado === 'EN_PROCESO'
                      ? 'bg-purple-500'
                      : selectedMarker.estado === 'RESUELTO'
                      ? 'bg-green-600'
                      : 'bg-red-600'
                  }`}
                >
                  {selectedMarker.estado}
                </span>
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapsComponent;
