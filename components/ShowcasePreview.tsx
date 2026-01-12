import React, { useState } from 'react';
import { ArrowTopRightOnSquareIcon, DevicePhoneMobileIcon, ComputerDesktopIcon } from './Icons';
import { motion } from 'framer-motion';

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
    features: ['Speisekarte', 'Reservierung', 'Galerie'],
  },
  {
    id: 'architecture',
    title: 'Richter Architects',
    category: 'Portfolio',
    description: 'Projekt-Galerie mit Filtern, Team-Sektion',
    gradient: 'from-slate-600 to-slate-800',
    icon: '🏗️',
    features: ['Galerie', 'Filter', 'Team'],
  },
  {
    id: 'realestate',
    title: 'Premium Properties',
    category: 'Immobilien',
    description: 'Immobiliensuche, Detailansichten, Anfragen',
    gradient: 'from-blue-500 to-blue-700',
    icon: '🏠',
    features: ['Suche', 'Details', 'Kontakt'],
  }
];

// Enhanced Device Mockup Component
const DeviceMockup: React.FC<{
  gradient: string;
  icon: string;
  index: number;
}> = ({ gradient, icon, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-3 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 transition-opacity duration-500 ${isHovered ? 'opacity-30' : ''}`}></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-3 opacity-10" style={{
        backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
        backgroundSize: '12px 12px',
      }}></div>

      {/* Laptop frame */}
      <div className="absolute inset-x-4 top-4 bottom-8 bg-white dark:bg-slate-950 rounded-lg shadow-2xl overflow-hidden border border-slate-300 dark:border-slate-700">
        {/* Laptop screen */}
        <div className="absolute inset-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-slate-200 dark:border-slate-700">
            <div className="flex gap-1">
              <div className={`w-1.5 h-1.5 rounded-full bg-red-400 transition-transform duration-300 ${isHovered ? 'scale-125' : ''}`}></div>
              <div className={`w-1.5 h-1.5 rounded-full bg-yellow-400 transition-transform duration-300 ${isHovered ? 'scale-125' : ''}`} style={{ transitionDelay: '50ms' }}></div>
              <div className={`w-1.5 h-1.5 rounded-full bg-green-400 transition-transform duration-300 ${isHovered ? 'scale-125' : ''}`} style={{ transitionDelay: '100ms' }}></div>
            </div>
            <div className="flex-1 mx-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500 ${isHovered ? 'w-3/4' : 'w-1/2'}`}></div>
            </div>
          </div>

          {/* Mock content */}
          <div className="p-2 space-y-1.5">
            <div className={`h-1.5 bg-slate-300 dark:bg-slate-600 rounded transition-all duration-500 ${isHovered ? 'w-3/4' : 'w-1/2'}`}></div>
            <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className={`h-12 bg-gradient-to-br ${gradient} rounded-md mt-2 transition-all duration-500 ${isHovered ? 'opacity-40' : 'opacity-20'}`}></div>
          </div>

          {/* Floating icon on hover */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0 scale-75'}`}>
            <span className="text-4xl drop-shadow-2xl">{icon}</span>
          </div>
        </div>
      </div>

      {/* Laptop base */}
      <div className="absolute bottom-2 left-8 right-8 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-b-lg"></div>

      {/* Shine effect */}
      <div className={`absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
    </div>
  );
};

export const ShowcasePreview: React.FC<ShowcasePreviewProps> = ({ setCurrentPage }) => {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-blue-400/4 to-violet-400/4 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/3 to-teal-400/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-[60%] left-[30%] w-[300px] h-[300px] bg-gradient-to-br from-amber-400/2 to-orange-400/2 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '5s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 border border-blue-200/60 dark:border-blue-800/30 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Showcase
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-gradient">
              Beispiel-Websites
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            Sieh dir unsere Live-Demos an – verschiedene Branchen, gleiche Qualität.
          </motion.p>
        </div>

        {/* Device switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center gap-4 mb-12"
        >
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium text-sm shadow-lg shadow-blue-500/20">
            <ComputerDesktopIcon className="w-4 h-4" />
            Desktop
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium text-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
            <DevicePhoneMobileIcon className="w-4 h-4" />
            Mobil
          </button>
        </motion.div>

        {/* Showcase Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {showcases.map((showcase, index) => (
            <motion.div
              key={showcase.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <button
                onClick={() => setCurrentPage(showcase.id as any)}
                className="group w-full text-left"
              >
                <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-700/60 hover:shadow-2xl hover:-translate-y-2 hover:shadow-blue-500/10 transition-all duration-500">
                  {/* Animated gradient border */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${showcase.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl`}></div>

                  {/* Device mockup */}
                  <div className="relative p-6 pb-4">
                    <DeviceMockup gradient={showcase.gradient} icon={showcase.icon} index={index} />
                  </div>

                  {/* Content */}
                  <div className="p-6 pt-2 relative z-10 bg-white/50 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-violet-500 group-hover:text-white transition-all duration-500">
                        {showcase.category}
                      </span>
                      {/* Icon that appears on hover */}
                      <span className={`text-2xl transition-all duration-500 ${index % 2 === 0 ? 'rotate-12' : '-rotate-12'} ${index % 2 === 0 ? 'group-hover:rotate-0' : 'group-hover:rotate-0'}`}>
                        {showcase.icon}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-violet-600 transition-colors duration-300">
                      {showcase.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug mb-4">
                      {showcase.description}
                    </p>

                    {/* Feature tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {showcase.features.map((feature, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700/30 text-xs text-slate-600 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-600 transition-colors duration-300"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span>Ansehen</span>
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
