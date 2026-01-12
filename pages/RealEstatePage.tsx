import React, { useState } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import {
  ChevronLeftIcon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '../components/Icons';

// Custom Calendar Icon
const CalendarIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

interface RealEstatePageProps {
  setCurrentPage: (page: string) => void;
}

// Custom Icons
const MapPinIconLocal: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

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

// Properties data
const properties = [
  {
    id: 1,
    title: 'Moderne Villa in Bestlage',
    type: 'haus',
    location: 'München-Bogenhausen',
    price: 1250000,
    rooms: 6,
    area: 280,
    bathrooms: 3,
    year: 2019,
    description: 'Exklusive Villa mit Pool, großem Garten und hochwertiger Ausstattung. Offener Wohnbereich mit Deckenhohen Fenstern und direktem Gartenzugang.',
    features: ['Pool', 'Garage', 'Garten', 'Terrasse', 'Kamin', 'Smart Home'],
    images: ['from-emerald-200 to-emerald-400', 'from-slate-200 to-slate-400', 'from-amber-100 to-amber-300'],
    highlighted: true
  },
  {
    id: 2,
    title: 'Charme-Altbau Downtown',
    type: 'wohnung',
    location: 'Berlin-Mitte',
    price: 685000,
    rooms: 3,
    area: 95,
    bathrooms: 1,
    year: 1920,
    description: 'Wunderschön renovierte Altbauwohnung mit Stuck, Dielenboden und moderner Einbauküche. Hohe Räume und viel Tageslicht.',
    features: ['Balkon', 'Einbauküche', 'Kellerraum', 'Fahrradkeller'],
    images: ['from-blue-200 to-blue-400', 'from-slate-300 to-slate-500', 'from-cyan-200 to-cyan-400'],
    highlighted: false
  },
  {
    id: 3,
    title: 'Familienhaus im Grünen',
    type: 'haus',
    location: 'Hamburg-Norderstedt',
    price: 720000,
    rooms: 5,
    area: 165,
    bathrooms: 2,
    year: 2005,
    description: 'Geräumiges Einfamilienhaus in ruhiger Wohnlage. Großzügiger Garten, ideale Wohnlage für Familien mit Schulen und Einkaufsmöglichkeiten in der Nähe.',
    features: ['Garten', 'Garage', 'Keller', 'Terrasse', 'Einbauküche'],
    images: ['from-green-200 to-green-400', 'from-lime-100 to-lime-300', 'from-emerald-100 to-emerald-300'],
    highlighted: false
  },
  {
    id: 4,
    title: 'Penthouse mit Dachterrasse',
    type: 'wohnung',
    location: 'Frankfurt-Westend',
    price: 890000,
    rooms: 4,
    area: 145,
    bathrooms: 2,
    year: 2021,
    description: 'Luxuriöses Penthouse auf dem Dachstadt mit spektakulärem Blick. Hochwertige Ausstattung, große Dachterrasse und zwei Parkplätze.',
    features: ['Dachterrasse', '2 Parkplätze', 'Aufzug', 'Klimaanlage', 'Smart Home'],
    images: ['from-violet-200 to-violet-400', 'from-purple-200 to-purple-400', 'from-fuchsia-200 to-fuchsia-400'],
    highlighted: true
  },
  {
    id: 5,
    title: 'Reihenhaus Neubau',
    type: 'haus',
    location: 'Köln-Mülheim',
    price: 595000,
    rooms: 4,
    area: 135,
    bathrooms: 2,
    year: 2023,
    description: 'Neu errichtetes Reihenhaus mit modernem Grundriss und energiesparender Bauweise. Large Terrasse und privater Garten.',
    features: ['Garten', 'Terrasse', 'Energy Plus', 'Garage', 'Einbauküche'],
    images: ['from-orange-200 to-orange-400', 'from-amber-200 to-amber-400', 'from-yellow-200 to-yellow-400'],
    highlighted: false
  },
  {
    id: 6,
    title: 'Loft-Wohnung Industriestyle',
    type: 'wohnung',
    location: 'Leipzig-Plagwitz',
    price: 420000,
    rooms: 2,
    area: 85,
    bathrooms: 1,
    year: 2018,
    description: 'Industrielles Loft in umgebauter Fabrik mit hohen Decken, offenen Wohnbereichen und viel Platz für Kreatives.',
    features: ['Industriestyle', 'Offene Küche', 'Bodenheizung', 'Fahrradkeller'],
    images: ['from-zinc-200 to-zinc-400', 'from-stone-200 to-stone-400', 'from-gray-200 to-gray-400'],
    highlighted: false
  },
  {
    id: 7,
    title: 'Landhaus mit Weitblick',
    type: 'haus',
    location: 'Freiburg im Breisgau',
    price: 880000,
    rooms: 5,
    area: 190,
    bathrooms: 2,
    year: 2015,
    description: 'Traditionelles Landhaus mit modernem Komfort. Großzügige Räume, schöner Garten und herrlicher Blick auf die Schwarzwaldberge.',
    features: ['Bergblick', 'Garten', 'Terrasse', 'Kamin', 'Garage'],
    images: ['from-rose-200 to-rose-400', 'from-red-200 to-red-400', 'from-pink-200 to-pink-400'],
    highlighted: true
  },
  {
    id: 8,
    title: 'Junggesellenabsolut',
    type: 'wohnung',
    location: 'Stuttgart-Mitte',
    price: 355000,
    rooms: 1,
    area: 45,
    boundaries: 1,
    year: 2022,
    description: 'Moderne 1-Zimmer-Wohnung im Zentrum von Stuttgart. Ideal für Singles und Berufseinsteiger mit guter Anbindung.',
    features: ['Zentral', 'Aufzug', 'Einbauküche', 'Kellerabteil'],
    images: ['from-teal-200 to-teal-400', 'from-cyan-200 to-cyan-400', 'from-sky-200 to-sky-400'],
    highlighted: false
  }
];

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const RealEstatePage: React.FC<RealEstatePageProps> = ({ setCurrentPage }) => {
  const [filters, setFilters] = useState({
    type: 'alle',
    priceRange: 'alle',
    rooms: 'alle'
  });
  const [selectedProperty, setSelectedProperty] = useState<typeof properties[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewingForm, setViewingForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  // Filter properties
  const filteredProperties = properties.filter(property => {
    if (filters.type !== 'alle' && property.type !== filters.type) return false;
    if (filters.priceRange !== 'alle') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (max && (property.price < min || property.price > max)) return false;
      if (!max && property.price < min) return false;
    }
    if (filters.rooms !== 'alle') {
      const roomFilter = parseInt(filters.rooms);
      if (roomFilter === 4 && property.rooms < 4) return false;
      if (roomFilter !== 4 && property.rooms !== roomFilter) return false;
    }
    return true;
  });

  const handleViewingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setViewingForm({ name: '', email: '', phone: '', message: '' });
      setShowContactForm(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Back Button */}
      <button
        onClick={() => setCurrentPage('home')}
        className="fixed top-20 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full shadow-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <ChevronLeftIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Zurück</span>
      </button>

      {/* Hero Section with Search */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-6">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
                Finden Sie Ihr Traumhaus
              </h1>
              <p class="text-xl text-white/90 mb-12">
                Exklusive Immobilien in ganz Deutschland
              </p>
            </AnimatedSection>

            {/* Search Filters */}
            <AnimatedSection>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl">
                <div className="grid md:grid-cols-4 gap-4">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Immobilientyp
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="alle">Alle Typen</option>
                      <option value="haus">Häuser</option>
                      <option value="wohnung">Wohnungen</option>
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Preis
                    </label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="alle">Alle Preise</option>
                      <option value="0-400000">bis 400.000 €</option>
                      <option value="400000-700000">400.000 - 700.000 €</option>
                      <option value="700000-1000000">700.000 - 1.000.000 €</option>
                      <option value="1000000">über 1.000.000 €</option>
                    </select>
                  </div>

                  {/* Rooms Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Zimmer
                    </label>
                    <select
                      value={filters.rooms}
                      onChange={(e) => setFilters({ ...filters, rooms: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="alle">Alle Zimmer</option>
                      <option value="1">1 Zimmer</option>
                      <option value="2">2 Zimmer</option>
                      <option value="3">3 Zimmer</option>
                      <option value="4">4+ Zimmer</option>
                    </select>
                  </div>

                  {/* Results Count */}
                  <div className="flex items-end">
                    <div className="w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {filteredProperties.length}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Immobilien</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDownIcon className="w-8 h-8" />
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
                {filters.type === 'alle' ? 'Alle Immobilien' : filters.type === 'haus' ? 'Häuser' : 'Wohnungen'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {filteredProperties.length} Ergebnisse
              </p>
            </div>

            {/* Properties Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <button
                  key={property.id}
                  onClick={() => { setSelectedProperty(property); setCurrentImageIndex(0); setShowContactForm(false); }}
                  className="group text-left bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  {/* Image */}
                  <div className={`aspect-video bg-gradient-to-br ${property.images[0]} relative`}>
                    {property.highlighted && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
                        Highlights
                      </span>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white font-bold text-xl">
                        {formatPrice(property.price)}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <MapPinIconLocal className="w-4 h-4" />
                      {property.location}
                    </p>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3 line-clamp-1">
                      {property.title}
                    </h3>

                    {/* Specs */}
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <BedIconLocal className="w-4 h-4" />
                        {property.rooms} Zi.
                      </span>
                      <span className="flex items-center gap-1">
                        <BuildingIconLocal className="w-4 h-4" />
                        {property.area} m²
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  Keine Immobilien gefunden. Passen Sie Ihre Filter an.
                </p>
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl overflow-hidden my-8">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                {selectedProperty.title}
              </h2>
              <button
                onClick={() => setSelectedProperty(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Image Gallery */}
            <div className={`aspect-video bg-gradient-to-br ${selectedProperty.images[currentImageIndex]} relative`}>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : selectedProperty.images.length - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev < selectedProperty.images.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {selectedProperty.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-8">
              {/* Price and Location */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(selectedProperty.price)}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
                    <MapPinIconLocal className="w-4 h-4" />
                    {selectedProperty.location}
                  </p>
                </div>
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  Besichtigung anfragen
                </button>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
                  <BedIconLocal className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedProperty.rooms}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Zimmer</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
                  <BuildingIconLocal className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedProperty.area} m²</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Wohnfläche</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
                  <svg className="w-6 h-6 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedProperty.bathrooms}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Bäder</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
                  <CalendarIcon className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedProperty.year}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Baujahr</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-3">Beschreibung</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedProperty.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-3">Ausstattung</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProperty.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              {showContactForm && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6">
                  {formSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Anfrage gesendet!
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Wir melden uns schnellstmöglich für einen Besichtigungstermin.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleViewingSubmit} className="space-y-4">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">
                        Besichtigung anfragen
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={viewingForm.name}
                            onChange={(e) => setViewingForm({ ...viewingForm, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ihr Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Telefon *
                          </label>
                          <input
                            type="tel"
                            required
                            value={viewingForm.phone}
                            onChange={(e) => setViewingForm({ ...viewingForm, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ihre Telefonnummer"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          E-Mail *
                        </label>
                        <input
                          type="email"
                          required
                          value={viewingForm.email}
                          onChange={(e) => setViewingForm({ ...viewingForm, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="ihre@email.de"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Nachricht (optional)
                        </label>
                        <textarea
                          rows={3}
                          value={viewingForm.message}
                          onChange={(e) => setViewingForm({ ...viewingForm, message: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                          placeholder="Fragen oder Wünsche für die Besichtigung..."
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        Anfrage absenden
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
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Noch nicht das Richtige gefunden?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Wir informieren Sie gerne über neue Angebote, die zu Ihren Kriterien passen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+493012345678" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                <PhoneIcon className="w-5 h-5" />
                +49 30 123 456 78
              </a>
              <a href="mailto:info@immobilien.de" className="px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                <EnvelopeIcon className="w-5 h-5" />
                E-Mail schreiben
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};
