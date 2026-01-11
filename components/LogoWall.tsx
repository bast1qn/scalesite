
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const logos = [
  { name: "TechFlow", color: "#3B82F6" },
  { name: "NexaCorp", color: "#10B981" },
  { name: "Velox", color: "#F59E0B" },
  { name: "Lumina", color: "#8B5CF6" },
  { name: "Stratis", color: "#EC4899" },
  { name: "Apex", color: "#6366F1" },
  { name: "Orbit", color: "#14B8A6" },
];

export const LogoWall: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="w-full py-12 bg-white dark:bg-dark-bg border-b border-slate-100 dark:border-slate-800/50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{t('logo_wall.title')}</p>
      </div>
      
      {/* Gradient Masks for Fade Effect */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-white dark:from-dark-bg to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-white dark:from-dark-bg to-transparent z-10"></div>

      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
          {[...logos, ...logos, ...logos].map((logo, idx) => (
            <div key={idx} className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-all duration-500 cursor-default grayscale hover:grayscale-0 filter">
              <div className="w-6 h-6 rounded-md" style={{ backgroundColor: logo.color }}></div>
              <span className="text-xl font-bold text-slate-700 dark:text-slate-200 font-serif tracking-tight">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
};