import React from 'react';
import { ArrowTopRightOnSquareIcon } from './Icons';

interface ShowcasePreviewProps {
  setCurrentPage: (page: string) => void;
}

const showcases = [
  {
    id: 'restaurant',
    title: 'The Coffee House',
    category: 'Restaurant',
    description: 'Interaktive Speisekarte, Reservierungen, Galerie',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'architecture',
    title: 'Richter Architects',
    category: 'Portfolio',
    description: 'Projekt-Galerie mit Filtern, Team-Sektion',
    gradient: 'from-slate-600 to-slate-800',
  },
  {
    id: 'realestate',
    title: 'Premium Properties',
    category: 'Immobilien',
    description: 'Immobiliensuche, Detailansichten, Anfragen',
    gradient: 'from-blue-500 to-blue-700',
  }
];

export const ShowcasePreview: React.FC<ShowcasePreviewProps> = ({ setCurrentPage }) => {
  return (
    <section className="py-28 bg-white dark:bg-slate-900 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Beispiel-Websites
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Sieh dir unsere Live-Demos an – verschiedene Branchen, gleiche Qualität.
          </p>
        </div>

        {/* Showcase Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {showcases.map((showcase) => (
            <button
              key={showcase.id}
              onClick={() => setCurrentPage(showcase.id as any)}
              className="group text-left"
            >
              <div className="relative bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Preview */}
                <div className={`aspect-video bg-gradient-to-br ${showcase.gradient} relative p-4`}>
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
                    </div>
                  </div>
                  {/* Mock content */}
                  <div className="space-y-1.5 opacity-20">
                    <div className="h-1.5 bg-white/40 rounded w-20"></div>
                    <div className="h-1.5 bg-white/30 rounded w-32"></div>
                    <div className="h-16 bg-white/10 rounded mt-3"></div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <ArrowTopRightOnSquareIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                      {showcase.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {showcase.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                    {showcase.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
