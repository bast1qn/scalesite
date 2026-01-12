
import React, { useState } from 'react';
import { ChatBubbleBottomCenterTextIcon, CheckBadgeIcon, RocketLaunchIcon, SparklesIcon } from './Icons';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

const usps = [
  {
    icon: <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />,
    emoji: '💬',
    nameKey: 'usps.items.personal.name',
    descKey: 'usps.items.personal.desc',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <CheckBadgeIcon className="w-6 h-6" />,
    emoji: '✓',
    nameKey: 'usps.items.quality.name',
    descKey: 'usps.items.quality.desc',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: <SparklesIcon className="w-6 h-6" />,
    emoji: '⚡',
    nameKey: 'usps.items.tech.name',
    descKey: 'usps.items.tech.desc',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: <RocketLaunchIcon className="w-6 h-6" />,
    emoji: '🚀',
    nameKey: 'usps.items.goals.name',
    descKey: 'usps.items.goals.desc',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    gradient: 'from-orange-500 to-amber-500',
  },
];

// 3D Card Component with perspective tilt
const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}> = ({ children, className = '', gradient }) => {
  const [transform, setTransform] = useState('');
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)');
    setGlowPos({ x: 50, y: 50 });
  };

  return (
    <div
      className={`relative transition-transform duration-300 ease-out ${className}`}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient glow effect that follows cursor */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, ${gradient ? `${gradient.replace('from-', '').replace(' to-', ', ')} 0.15` : 'rgba(59, 130, 246, 0.15)'}, transparent 40%)`,
          opacity: transform !== '' ? 1 : 0,
        }}
      />
      {children}
    </div>
  );
};

export const UspSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-28 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] pointer-events-none noise-bg"></div>

      {/* Enhanced animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-400/8 to-violet-400/6 rounded-full blur-3xl animate-morph-blob"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/6 to-teal-400/4 rounded-full blur-3xl animate-morph-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      ></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnimatedSection>
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 tracking-tight-plus">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 animate-gradient-shimmer">
                {t('usps.title')}
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('usps.subtitle')}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection stagger>
          {/* Enhanced Grid with 3D cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-container">
            {usps.map((usp, index) => (
              <TiltCard
                key={index}
                className="group"
                gradient={`linear-gradient(to right, ${usp.gradient.split(' ')[0].replace('from-', '')}, ${usp.gradient.split(' ')[1].replace('to-', '')})`}
              >
                <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 h-full transition-all duration-300 shadow-premium hover:shadow-premium-lg overflow-hidden">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 card-shimmer"></div>

                  {/* Top gradient line */}
                  <div className={`absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r ${usp.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                  {/* Icon container with glow */}
                  <div className="relative mb-5">
                    <div className={`w-16 h-16 rounded-2xl ${usp.bg} ${usp.color} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                      <div className="icon-glow" style={{ background: usp.color }}>
                        {usp.icon}
                      </div>
                    </div>
                  </div>

                  {/* Floating emoji */}
                  <div className="absolute top-5 right-5 text-2xl opacity-20 group-hover:opacity-50 group-hover:scale-125 transition-all duration-300 animate-float" style={{ animationDelay: `${index * 0.3}s` }}>
                    {usp.emoji}
                  </div>

                  {/* Content */}
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300" style={{ backgroundImage: `linear-gradient(to right, ${usp.gradient.split(' ')[0].replace('from-', '#')}, ${usp.gradient.split(' ')[1].replace('to-', '#')})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {t(usp.nameKey)}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t(usp.descKey)}
                  </p>

                  {/* Decorative corner accent */}
                  <div className={`absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl ${usp.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-tl-3xl`}></div>
                </div>
              </TiltCard>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
