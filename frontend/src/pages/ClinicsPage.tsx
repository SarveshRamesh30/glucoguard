import React, { useState, useEffect } from 'react';
import { clinicsAPI } from '../services/api';
import { Clinic } from '../types';
import { ClinicMap } from '../components/ClinicMap';
import { AppointmentModal } from '../components/AppointmentModal';
import {
  MapPin,
  Search,
  Navigation,
  Phone,
  Clock,
  Star,
  Calendar,
  Building2,
  Stethoscope,
  Loader2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const ClinicsPage: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState<boolean>(false);
  const [bookingClinicId, setBookingClinicId] = useState<number | null>(null);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async (lat?: number, lng?: number, search?: string) => {
    try {
      setLoading(true);
      const data = await clinicsAPI.getClinics(lat, lng, search);
      setClinics(data);
      if (data.length > 0 && !selectedClinic) {
        setSelectedClinic(data[0]);
      }
    } catch (err) {
      console.error('Failed to load clinics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClinics(userCoords?.lat, userCoords?.lng, searchQuery);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserCoords(coords);
        fetchClinics(coords.lat, coords.lng, searchQuery);
        setLocating(false);
      },
      (error) => {
        // Fallback to default demo coordinates in Chennai, Tamil Nadu
        const defaultChennai = { lat: 13.0827, lng: 80.2707 };
        setUserCoords(defaultChennai);
        fetchClinics(defaultChennai.lat, defaultChennai.lng, searchQuery);
        setLocating(false);
      }
    );
  };

  const handleBookClinic = (clinic: Clinic) => {
    setBookingClinicId(clinic.id);
    setAppointmentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-2">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span>Interactive Healthcare Map</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Nearby Diabetes & Endocrine Clinics
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Find accredited diabetes screening centers, view specialized doctors, and book appointments.
            </p>
          </div>

          {/* Location & Search Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleUseMyLocation}
              disabled={locating}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 text-sky-700 text-xs font-bold flex items-center gap-2 shadow-2xs transition-colors"
            >
              {locating ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
              ) : (
                <Navigation className="w-4 h-4 text-sky-600" />
              )}
              <span>{userCoords ? 'Location Active' : 'Use My Location'}</span>
            </button>
          </div>
        </div>

        {/* Search Input Filter Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by clinic name, address, or diagnostic services (e.g., CGM, HbA1c)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm bg-white shadow-2xs font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition-colors"
          >
            Search
          </button>
        </form>

        {/* Main Grid: Map & Clinic Cards List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Map */}
          <div className="lg:col-span-7 h-[580px] sticky top-24">
            <ClinicMap
              clinics={clinics}
              selectedClinic={selectedClinic}
              userCoords={userCoords}
              onSelectClinic={(c) => setSelectedClinic(c)}
              onBookAppointment={handleBookClinic}
            />
          </div>

          {/* Right: Clinic Cards List */}
          <div className="lg:col-span-5 space-y-4 max-h-[580px] overflow-y-auto pr-1">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
                <p className="text-xs text-slate-500 font-semibold">Loading clinics...</p>
              </div>
            ) : clinics.length > 0 ? (
              clinics.map((clinic) => {
                const isSelected = selectedClinic?.id === clinic.id;
                return (
                  <div
                    key={clinic.id}
                    onClick={() => setSelectedClinic(clinic)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer text-xs space-y-3 ${
                      isSelected
                        ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base leading-tight">
                          {clinic.name}
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{clinic.address}</span>
                        </p>
                      </div>

                      {clinic.distance_km !== undefined && clinic.distance_km !== null && (
                        <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 font-bold text-[11px] shrink-0">
                          {clinic.distance_km} km away
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-slate-600 text-[11px]">
                      <span className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {clinic.rating} ({clinic.review_count})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {clinic.opening_hours}
                      </span>
                    </div>

                    {clinic.services_offered && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-[11px] font-medium leading-relaxed">
                        <strong>Services:</strong> {clinic.services_offered}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      {clinic.phone && (
                        <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {clinic.phone}
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookClinic(clinic);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Slot</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center text-xs text-slate-400">
                No clinics match your query. Try searching for "diabetes" or clear search.
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => {
          setAppointmentModalOpen(false);
          setBookingClinicId(null);
        }}
        initialClinicId={bookingClinicId}
      />
    </div>
  );
};
