import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { AnimatedSection, ChevronLeftIcon, XMarkIcon, PhoneIcon, EnvelopeIcon, ChevronRightIcon, ChevronDownIcon, MapPinIcon } from '../components';

const BedIconLocal: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0-2.278-3.694-4.125-8.25-4.125s-8.25 1.847-8.25 4.125" />
  </svg>
);

const BuildingIconLocal: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

interface RealEstatePageProps {
  setCurrentPage: (page: string) => void;
}

const properties = [
  {
    id: 1,
    title: 'Modern Villa in Prime Location',
    type: 'house',
    location: 'Munich-Bogenhausen',
    price: 1250000,
    rooms: 6,
    area: 280,
    bathrooms: 3,
    year: 2019,
    description: 'Exclusive villa with pool, large garden and high-end amenities. Open living area with floor-to-ceiling windows and direct garden access.',
    features: ['Pool', 'Garage', 'Garden', 'Terrace', 'Fireplace', 'Smart Home'],
    images: ['from-emerald-200 to-emerald-400', 'from-slate-200 to-slate-400', 'from-amber-100 to-amber-300'],
    highlighted: true
  },
  {
    id: 2,
    title: 'Charming Altbau Downtown',
    type: 'apartment',
    location: 'Berlin-Mitte',
    price: 685000,
    rooms: 3,
    area: 95,
    bathrooms: 1,
    year: 1920,
    description: 'Beautifully renovated apartment with stucco, parquet floors and modern fitted kitchen. High rooms and plenty of natural light.',
    features: ['Balcony', 'Fitted Kitchen', 'Basement', 'Bike Storage'],
    images: ['from-blue-200 to-blue-400', 'from-slate-300 to-slate-500', 'from-cyan-200 to-cyan-400'],
    highlighted: false
  },
  {
    id: 3,
    title: 'Family Home in Green Area',
    type: 'house',
    location: 'Hamburg-Norderstedt',
    price: 720000,
    rooms: 5,
    area: 165,
    bathrooms: 2,
    year: 2005,
    description: 'Spacious single-family home in a quiet residential area. Large garden, ideal location for families with schools and shopping nearby.',
    features: ['Garden', 'Garage', 'Basement', 'Terrace', 'Fitted Kitchen'],
    images: ['from-green-200 to-green-400', 'from-lime-100 to-lime-300', 'from-emerald-100 to-emerald-300'],
    highlighted: false
  },
  {
    id: 4,
    title: 'Penthouse with Rooftop Terrace',
    type: 'apartment',
    location: 'Frankfurt-Westend',
    price: 890000,
    rooms: 4,
    area: 145,
    bathrooms: 2,
    year: 2021,
    description: 'Luxurious penthouse on the roof floor with spectacular view. High-end amenities, large rooftop terrace and two parking spaces.',
    features: ['Rooftop Terrace', '2 Parking', 'Elevator', 'A/C', 'Smart Home'],
    images: ['from-violet-200 to-violet-400', 'from-purple-200 to-purple-400', 'from-fuchsia-200 to-fuchsia-400'],
    highlighted: true
  },
  {
    id: 5,
    title: 'New Build Townhouse',
    type: 'house',
    location: 'Cologne-Mülheim',
    price: 595000,
    rooms: 4,
    area: 135,
    bathrooms: 2,
    year: 2023,
    description: 'Newly built townhouse with modern floor plan and energy-efficient construction. Large terrace and private garden.',
    features: ['Garden', 'Terrace', 'Energy Plus', 'Garage', 'Fitted Kitchen'],
    images: ['from-orange-200 to-orange-400', 'from-amber-200 to-amber-400', 'from-yellow-200 to-yellow-400'],
    highlighted: false
  },
  {
    id: 6,
    title: 'Industrial Style Loft',
    type: 'apartment',
    location: 'Leipzig-Plagwitz',
    price: 420000,
    rooms: 2,
    area: 85,
    bathrooms: 1,
    year: 2018,
    description: 'Industrial loft in converted factory with high ceilings, open living areas and plenty of space for creativity.',
    features: ['Industrial Style', 'Open Kitchen', 'Floor Heating', 'Bike Storage'],
    images: ['from-zinc-200 to-zinc-400', 'from-stone-200 to-stone-400', 'from-gray-200 to-gray-400'],
    highlighted: false
  },
  {
    id: 7,
    title: 'Country House with Mountain View',
    type: 'house',
    location: 'Freiburg im Breisgau',
    price: 880000,
    rooms: 5,
    area: 190,
    bathrooms: 2,
    year: 2015,
    description: 'Traditional country house with modern comfort. Spacious rooms, beautiful garden and stunning view of the Black Forest mountains.',
    features: ['Mountain View', 'Garden', 'Terrace', 'Fireplace', 'Garage'],
    images: ['from-rose-200 to-rose-400', 'from-red-200 to-red-400', 'from-pink-200 to-pink-400'],
    highlighted: true
  },
  {
    id: 8,
    title: 'Bachelor Apartment',
    type: 'apartment',
    location: 'Stuttgart-Mitte',
    price: 355000,
    rooms: 1,
    area: 45,
    bathrooms: 1,
    year: 2022,
    description: 'Modern 1-room apartment in the center of Stuttgart. Ideal for singles and young professionals with excellent connections.',
    features: ['Central', 'Elevator', 'Fitted Kitchen', 'Basement Compartment'],
    images: ['from-teal-200 to-teal-400', 'from-cyan-200 to-cyan-400', 'from-sky-200 to-sky-400'],
    highlighted: false
  }
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const RealEstatePage: React.FC<RealEstatePageProps> = ({ setCurrentPage }) => {
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: 'all',
    rooms: 'all'
  });
  const [selectedProperty, setSelectedProperty] = useState<typeof properties[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewingForm, setViewingForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  // ✅ FIX: Use ref to store timeout for proper cleanup on unmount
  const formTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ✅ PERFORMANCE: useMemo for expensive filter operation
  // Prevents recalculation on every render when filters haven't changed
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      if (filters.type !== 'all' && property.type !== filters.type) return false;
      if (filters.priceRange !== 'all') {
        const [minStr, maxStr] = filters.priceRange.split('-');
        const min = Number(minStr);
        const max = maxStr ? Number(maxStr) : undefined;

        if (max !== undefined) {
          if (property.price < min || property.price > max) return false;
        } else if (property.price < min) {
          return false;
        }
      }
      if (filters.rooms !== 'all') {
        const roomFilter = Number(filters.rooms);
        if (roomFilter === 4 && property.rooms < 4) return false;
        if (roomFilter !== 4 && property.rooms !== roomFilter) return false;
      }
      return true;
    });
  }, [filters.type, filters.priceRange, filters.rooms]);

  // ✅ FIX: Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (formTimeoutRef.current) {
        clearTimeout(formTimeoutRef.current);
      }
    };
  }, []);

  // ✅ PERFORMANCE: useCallback for stable handler reference
  // Prevents child components from re-rendering unnecessarily
  const handlePropertyClick = useCallback((property: typeof properties[0]) => {
    setSelectedProperty(property);
    setCurrentImageIndex(0);
    setShowContactForm(false);
  }, []);

  /**
   * ✅ FIX: Store timeout reference to prevent memory leak on component unmount
   */
  const handleViewingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear existing timeout if any
    if (formTimeoutRef.current) {
      clearTimeout(formTimeoutRef.current);
    }

    setFormSubmitted(true);
    formTimeoutRef.current = setTimeout(() => {
      setFormSubmitted(false);
      setViewingForm({ name: '', email: '', phone: '', message: '' });
      setShowContactForm(false);
      formTimeoutRef.current = null;
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <button
        onClick={() => setCurrentPage('home')}
        className="fixed top-20 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 min-h-11"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <section className="relative h-[80vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                Find Your Dream Home
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-12">
                Exclusive properties across Germany
              </p>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-xl">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Property Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 min-h-11"
                    >
                      <option value="all">All Types</option>
                      <option value="house">Houses</option>
                      <option value="apartment">Apartments</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Price Range
                    </label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 min-h-11"
                    >
                      <option value="all">All Prices</option>
                      <option value="0-400000">Under $400k</option>
                      <option value="400000-700000">$400k - $700k</option>
                      <option value="700000-1000000">$700k - $1M</option>
                      <option value="1000000">$1M+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Rooms
                    </label>
                    <select
                      value={filters.rooms}
                      onChange={(e) => setFilters({ ...filters, rooms: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 min-h-11"
                    >
                      <option value="all">All Rooms</option>
                      <option value="1">1 Room</option>
                      <option value="2">2 Rooms</option>
                      <option value="3">3 Rooms</option>
                      <option value="4">4+ Rooms</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <div className="w-full px-4 py-2.5 bg-primary-50 dark:bg-primary-950/30 rounded-lg text-center">
                      <p className="text-2xl font-semibold text-primary-600 dark:text-primary-400">
                        {filteredProperties.length}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Properties</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDownIcon className="w-8 h-8" />
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
                {filters.type === 'all' ? 'All Properties' : filters.type === 'house' ? 'Houses' : 'Apartments'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {filteredProperties.length} results
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProperties.map((property) => (
                <button
                  key={property.id}
                  onClick={() => handlePropertyClick(property)}
                  className="group text-left bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <div className={`aspect-video bg-gradient-to-br ${property.images?.[0] ?? 'from-gray-200 to-gray-400'} relative overflow-hidden`}>
                    {property.highlighted && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-amber-500/90 backdrop-blur-sm text-white text-[11px] font-medium rounded-md">
                        Featured
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white font-semibold text-base group-hover:text-lg transition-all duration-200">
                        {formatPrice(property.price)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      {property.location}
                    </p>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 text-sm leading-snug">
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <BedIconLocal className="w-3.5 h-3.5" />
                        {property.rooms} bed
                      </span>
                      <span className="flex items-center gap-1">
                        <BuildingIconLocal className="w-3.5 h-3.5" />
                        {property.area} m²
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-20">
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  No properties found. Adjust your filters.
                </p>
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedProperty(null)}>
          <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-xl overflow-hidden my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="font-serif text-base font-semibold text-slate-900 dark:text-white">
                {selectedProperty.title}
              </h2>
              <button
                onClick={() => setSelectedProperty(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 min-h-11"
              >
                <XMarkIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Image Gallery */}
            <div className={`aspect-video bg-gradient-to-br ${selectedProperty.images[currentImageIndex] ?? ''} relative`}>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : (selectedProperty.images?.length ?? 1) - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 min-h-11"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev < (selectedProperty.images?.length ?? 1) - 1 ? prev + 1 : 0))}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 min-h-11"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {selectedProperty.images?.map((_, idx) => (
                  <button
                    key={`property-image-${selectedProperty.id}-${idx}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 w-2 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* Price and Location */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <p className="text-3xl sm:text-4xl font-semibold text-primary-600 dark:text-primary-400">
                    {formatPrice(selectedProperty.price)}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1 text-sm">
                    <MapPinIcon className="w-4 h-4" />
                    {selectedProperty.location}
                  </p>
                </div>
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] min-h-11"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  Request Viewing
                </button>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-center hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  <BedIconLocal className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{selectedProperty.rooms ?? 0}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Rooms</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-center hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  <BuildingIconLocal className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{selectedProperty.area ?? 0} m²</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Living Space</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-center hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  <svg className="w-5 h-5 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{selectedProperty.bathrooms ?? 0}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Bathrooms</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-center hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  <CalendarIcon className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{selectedProperty.year ?? 0}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Year Built</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-semibold text-base text-slate-900 dark:text-white leading-snug mb-3">Description</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedProperty.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="font-semibold text-base text-slate-900 dark:text-white leading-snug mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProperty.features?.map((feature, idx) => (
                    <span
                      key={`feature-${selectedProperty.id}-${feature}`}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-sm hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              {showContactForm && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                  {formSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        Request Sent!
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        We'll contact you soon to schedule a viewing.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleViewingSubmit} className="space-y-4">
                      <h3 className="font-semibold text-base text-slate-900 dark:text-white mb-4">
                        Request a Viewing
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={viewingForm.name}
                            onChange={(e) => setViewingForm({ ...viewingForm, name: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            required
                            value={viewingForm.phone}
                            onChange={(e) => setViewingForm({ ...viewingForm, phone: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                            placeholder="Your phone number"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={viewingForm.email}
                          onChange={(e) => setViewingForm({ ...viewingForm, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Message (optional)
                        </label>
                        <textarea
                          rows={3}
                          value={viewingForm.message}
                          onChange={(e) => setViewingForm({ ...viewingForm, message: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 resize-none"
                          placeholder="Questions or requests for the viewing..."
                        />
                      </div>
                      <button
                        type="submit"
                        className="group w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] min-h-11"
                      >
                        <span>Send Request</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white leading-snug mb-4">
              Haven't Found What You're Looking For?
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              We'll keep you updated about new listings matching your criteria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+493012345678" className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] min-h-11">
                <PhoneIcon className="w-5 h-5" />
                +49 30 123 456 78
              </a>
              <a href="mailto:info@realestate.de" className="px-8 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] min-h-11">
                <EnvelopeIcon className="w-5 h-5" />
                Send Email
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default RealEstatePage;
