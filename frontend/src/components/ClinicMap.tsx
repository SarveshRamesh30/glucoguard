import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Clinic } from '../types';
import { MapPin, Phone, Clock, Star, Calendar } from 'lucide-react';

// Custom colored SVG icons for Leaflet markers
const createClinicIcon = (isSelected: boolean = false) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: ${isSelected ? '#047857' : '#059669'};
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(5, 150, 105, 0.4);
        border: 2px solid white;
      ">
        <svg style="transform: rotate(45deg);" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const userLocationIcon = L.divIcon({
  className: 'user-map-pin',
  html: `
    <div style="
      background: #0284c7;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.3);
      border: 2px solid white;
    ">
      <div style="width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

// Helper component to auto-pan when clinic selected
const MapUpdater: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom || map.getZoom(), { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

interface ClinicMapProps {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  userCoords: { lat: number; lng: number } | null;
  onSelectClinic: (clinic: Clinic) => void;
  onBookAppointment: (clinic: Clinic) => void;
}

export const ClinicMap: React.FC<ClinicMapProps> = ({
  clinics,
  selectedClinic,
  userCoords,
  onSelectClinic,
  onBookAppointment,
}) => {
  const defaultCenter: [number, number] = userCoords
    ? [userCoords.lat, userCoords.lng]
    : selectedClinic
    ? [selectedClinic.latitude, selectedClinic.longitude]
    : [13.0524, 80.2508]; // Chennai, Tamil Nadu default center

  return (
    <div className="w-full h-full min-h-[420px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedClinic && (
          <MapUpdater
            center={[selectedClinic.latitude, selectedClinic.longitude]}
            zoom={14}
          />
        )}

        {/* User Current Location Pin */}
        {userCoords && (
          <Marker position={[userCoords.lat, userCoords.lng]} icon={userLocationIcon}>
            <Popup>
              <div className="p-1 font-sans">
                <p className="font-semibold text-xs text-sky-700">📍 Your Current Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Clinic Markers */}
        {clinics.map((clinic) => {
          const isSelected = selectedClinic?.id === clinic.id;
          return (
            <Marker
              key={clinic.id}
              position={[clinic.latitude, clinic.longitude]}
              icon={createClinicIcon(isSelected)}
              eventHandlers={{
                click: () => onSelectClinic(clinic),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2.5 max-w-[260px] font-sans">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">
                      {clinic.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-2 font-medium">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{clinic.rating} ({clinic.review_count} reviews)</span>
                    {clinic.distance_km !== undefined && clinic.distance_km !== null && (
                      <span className="text-slate-400 ml-auto font-normal">
                        {clinic.distance_km} km away
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mb-2 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{clinic.address}</span>
                  </p>

                  {clinic.phone && (
                    <p className="text-xs text-slate-600 mb-2 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{clinic.phone}</span>
                    </p>
                  )}

                  <p className="text-[11px] text-slate-500 mb-3 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{clinic.opening_hours}</span>
                  </p>

                  <button
                    onClick={() => onBookAppointment(clinic)}
                    className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Appointment</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
