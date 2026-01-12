
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
  { name: "Cipher", color: "#F43F5E" },
  { name: "Quantum", color: "#8B5CF6" },
  { name: "Nova", color: "#06B6D4" },
];

export const LogoWall: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-dark-bg border-b border-slate-200/60 dark:border-slate-800/50 overflow-hidden relative">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-5 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        color: 'rgb(148 163 184)'
      }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center relative z-10">
          <p className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-400 uppercase tracking-[0.25em]">
            {t('logo_wall.title')}
          </p>
      </div>

      {/* Enhanced Gradient Masks for Fade Effect */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-40 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-dark-bg dark:via-dark-bg/80 z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-40 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-dark-bg dark:via-dark-bg/80 z-10"></div>

      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-12 items-center px-8">
          {[...logos, ...logos, ...logos].map((logo, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-3 transition-all duration-500 cursor-default grayscale hover:grayscale-0 hover:scale-105"
            >
              <div
                className="w-8 h-8 rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-110"
                style={{ backgroundColor: logo.color }}
              ></div>
              <span className="text-xl font-bold text-slate-700 dark:text-slate-200 font-serif tracking-tight transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:to-slate-600 dark:group-hover:from-white dark:group-hover:to-slate-300">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
};