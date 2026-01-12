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
    icon: '☕',
  },
  {
    id: 'architecture',
    title: 'Richter Architects',
    category: 'Portfolio',
    description: 'Projekt-Galerie mit Filtern, Team-Sektion',
    gradient: 'from-slate-600 to-slate-800',
    icon: '🏗️',
  },
  {
    id: 'realestate',
    title: 'Premium Properties',
    category: 'Immobilien',
    description: 'Immobiliensuche, Detailansichten, Anfragen',
    gradient: 'from-blue-500 to-blue-700',
    icon: '🏠',
  }
];

export const ShowcasePreview: React.FC<ShowcasePreviewProps> = ({ setCurrentPage }) => {
  return (
    <section className="py-28 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-blue-400/4 to-violet-400/4 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/3 to-teal-400/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 border border-blue-200/60 dark:border-blue-800/30 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Showcase
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Beispiel-Websites
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Sieh dir unsere Live-Demos an – verschiedene Branchen, gleiche Qualität.
          </p>
        </div>

        {/* Showcase Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {showcases.map((showcase, index) => (
            <button
              key={showcase.id}
              onClick={() => setCurrentPage(showcase.id as any)}
              className="group text-left"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-700/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 card-hover">
                {/* Gradient border glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${showcase.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>

                {/* Preview */}
                <div className={`aspect-video bg-gradient-to-br ${showcase.gradient} relative p-4 overflow-hidden`}>
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }}></div>
                  </div>

                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 mb-3 relative z-10">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/40 group-hover:scale-125 transition-transform duration-300"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white/40 group-hover:scale-125 transition-transform duration-300" style={{ animationDelay: '50ms' }}></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white/40 group-hover:scale-125 transition-transform duration-300" style={{ animationDelay: '100ms' }}></div>
                    </div>
                  </div>

                  {/* Mock content */}
                  <div className="space-y-1.5 opacity-20 relative z-10">
                    <div className="h-1.5 bg-white/40 rounded w-20 group-hover:w-32 transition-all duration-500"></div>
                    <div className="h-1.5 bg-white/30 rounded w-32 group-hover:w-40 transition-all duration-500" style={{ transitionDelay: '50ms' }}></div>
                    <div className="h-16 bg-white/10 rounded mt-3 group-hover:h-20 transition-all duration-500" style={{ transitionDelay: '100ms' }}></div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                      <ArrowTopRightOnSquareIcon className="w-6 h-6 text-white transform translate-x-[-4px] group-hover:translate-x-0 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Icon badge */}
                  <div className="absolute top-4 right-4 text-2xl opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all duration-500 drop-shadow-lg">
                    {showcase.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-violet-500 group-hover:text-white transition-all duration-500">
                      {showcase.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-violet-600 transition-colors duration-300">
                    {showcase.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                    {showcase.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span>Ansehen</span>
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
