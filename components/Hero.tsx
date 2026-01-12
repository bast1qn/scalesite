
import React, { useEffect, useState, useRef } from 'react';
import { ArrowRightIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  setCurrentPage: (page: string) => void;
}

const guarantees = [
  { text: '48h Lieferung', icon: '⚡' },
  { text: '30 Tage Geld-zurück', icon: '🛡️' },
  { text: 'Alles inklusive', icon: '✨' },
];

// Enhanced floating particle with variety
const FloatingParticle: React.FC<{
  delay: number;
  duration: number;
  left: string;
  size: string;
  variant?: 'orb' | 'sparkle' | 'glow' | 'ring' | 'diamond';
  color?: string;
}> = ({ delay, duration, left, size, variant = 'orb', color }) => {
  const getParticleStyle = () => {
    switch (variant) {
      case 'sparkle':
        return {
          background: `radial-gradient(circle, ${color || '#8b5cf6'} 0%, transparent 70%)`,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          filter: 'drop-shadow(0 0 6px currentColor)',
        };
      case 'glow':
        return {
          background: `radial-gradient(circle, ${color || '#3b82f6'} 0%, transparent 70%)`,
          filter: 'blur(10px)',
        };
      case 'ring':
        return {
          background: 'transparent',
          border: `2px solid ${color || 'rgba(139, 92, 246, 0.5)'}`,
          boxShadow: `0 0 10px ${color || 'rgba(139, 92, 246, 0.3)'}`,
        };
      case 'diamond':
        return {
          background: `linear-gradient(135deg, ${color || 'rgba(59, 130, 246, 0.4)'} 0%, ${color || 'rgba(139, 92, 246, 0.2)'} 100%)`,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        };
      default:
        return {
          background: `linear-gradient(135deg, ${color || 'rgba(59, 130, 246, 0.4)'} 0%, ${color || 'rgba(139, 92, 246, 0.2)'} 100%)`,
          boxShadow: `0 0 20px ${color || 'rgba(59, 130, 246, 0.2)'}`,
        };
    }
  };

  return (
    <div
      className="absolute pointer-events-none will-change-transform"
      style={{
        left,
        animation: `float-up ${duration}s ease-in-out ${delay}s infinite`,
      }}
    >
      <div
        className="rounded-full"
        style={{ width: size, height: size, ...getParticleStyle() }}
      />
    </div>
  );
};

// 3D Tilt Card Component - Premium
const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}> = ({ children, className = '', intensity = 15 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity * 0.1;
    const rotateY = ((x - centerX) / centerX) * intensity * 0.1;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlowPosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)');
    setGlowPosition({ x: 50, y: 50 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => setIsHovered(true);

  return (
    <div
      ref={cardRef}
      className={`relative transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div
        className="absolute inset-0 rounded-inherit opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(500px circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.1), transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {children}
    </div>
  );
};

// Magnetic Button Component - Premium
const MagneticButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}> = ({ children, onClick, className = '', variant = 'primary' }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [ripplePos, setRipplePos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Magnetic effect - button moves slightly towards cursor
    setPosition({ x: x * 0.25, y: y * 0.25 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setRipplePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const baseStyle = variant === 'primary'
    ? 'group relative px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-white/25'
    : 'group px-10 py-4 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400/60 dark:hover:border-violet-500/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300';

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`${baseStyle} ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.15s ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {variant === 'primary' ? (
        <>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 animate-gradient-shimmer opacity-0 group-hover:opacity-40"></span>
          {/* Ripple effect */}
          {ripplePos && (
            <span
              className="absolute rounded-full bg-white/20 animate-ripple"
              style={{
                left: ripplePos.x,
                top: ripplePos.y,
                width: 0,
                height: 0,
              }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export const Hero: React.FC<HeroProps> = ({ setCurrentPage }) => {
  const { t } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] pointer-events-none noise-bg"></div>

      {/* Enhanced background gradient with mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/30"></div>

      {/* Animated gradient mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 dark:from-blue-500/10 dark:via-transparent dark:to-violet-500/10 animate-gradient-mesh"></div>
      </div>

      {/* Enhanced animated gradient orbs with mouse tracking and parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[15%] left-[5%] w-[700px] h-[700px] bg-gradient-to-br from-blue-500/20 via-violet-500/15 to-indigo-500/10 rounded-full blur-3xl transition-transform duration-700 ease-out will-change-transform"
          style={{
            transform: `translate(${mousePosition.x * -1.5 - scrollY * 0.1}px, ${mousePosition.y * -1.5 - scrollY * 0.05}px)`,
            animation: 'gradient-orb-1 8s ease-in-out infinite alternate',
          }}
        ></div>
        <div
          className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-gradient-to-br from-violet-500/15 via-purple-500/12 to-pink-500/10 rounded-full blur-3xl transition-transform duration-700 ease-out will-change-transform"
          style={{
            transform: `translate(${mousePosition.x * 1.5 + scrollY * 0.08}px, ${mousePosition.y * 1.5 + scrollY * 0.04}px)`,
            animation: 'gradient-orb-2 10s ease-in-out infinite alternate',
          }}
        ></div>
        <div
          className="absolute top-[50%] left-[30%] w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/10 to-teal-400/8 rounded-full blur-3xl transition-transform duration-700 ease-out will-change-transform"
          style={{
            transform: `translate(${mousePosition.x * 0.8 - scrollY * 0.06}px, ${mousePosition.y * 0.8 - scrollY * 0.03}px)`,
            animation: 'gradient-orb-3 12s ease-in-out infinite alternate',
          }}
        ></div>
        {/* Additional ambient orb */}
        <div
          className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-gradient-to-br from-rose-400/8 to-pink-400/6 rounded-full blur-3xl transition-transform duration-1000 ease-out will-change-transform"
          style={{
            transform: `translate(${mousePosition.x * -0.5 + scrollY * 0.04}px, ${mousePosition.y * -0.5 + scrollY * 0.02}px)`,
            animation: 'gradient-orb-3 15s ease-in-out infinite alternate-reverse',
          }}
        ></div>
      </div>

      {/* Enhanced floating particles with variety */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingParticle delay={0} duration={18} left="5%" size="8px" variant="orb" color="rgba(59, 130, 246, 0.5)" />
        <FloatingParticle delay={2} duration={20} left="15%" size="6px" variant="glow" color="rgba(139, 92, 246, 0.6)" />
        <FloatingParticle delay={4} duration={22} left="28%" size="10px" variant="ring" color="rgba(99, 102, 241, 0.5)" />
        <FloatingParticle delay={1} duration={16} left="40%" size="7px" variant="diamond" color="rgba(236, 72, 153, 0.4)" />
        <FloatingParticle delay={3} duration={24} left="52%" size="9px" variant="sparkle" color="rgba(139, 92, 246, 0.7)" />
        <FloatingParticle delay={5} duration={19} left="65%" size="5px" variant="glow" color="rgba(59, 130, 246, 0.6)" />
        <FloatingParticle delay={2.5} duration={21} left="75%" size="8px" variant="ring" color="rgba(168, 85, 247, 0.4)" />
        <FloatingParticle delay={1.5} duration={17} left="85%" size="6px" variant="diamond" color="rgba(14, 165, 233, 0.5)" />
        <FloatingParticle delay={0.5} duration={23} left="95%" size="12px" variant="glow" color="rgba(236, 72, 153, 0.4)" />
        <FloatingParticle delay={3.5} duration={18} left="60%" size="5px" variant="sparkle" color="rgba(99, 102, 241, 0.6)" />
        <FloatingParticle delay={4.5} duration={20} left="35%" size="7px" variant="orb" color="rgba(16, 185, 129, 0.4)" />
        <FloatingParticle delay={6} duration={25} left="45%" size="9px" variant="ring" color="rgba(245, 158, 11, 0.3)" />
      </div>

      {/* Enhanced grid pattern overlay with subtle animation */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          animation: 'grid-pan 60s linear infinite',
        }}
      ></div>

      {/* Radial gradient vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.3)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.4)_100%)]"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Enhanced Badge with shimmer effect */}
        <TiltCard className="inline-block mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group cursor-default overflow-hidden">
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse shadow-lg shadow-emerald-500/30"></div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 relative z-10">
              {t('hero.guarantee_badge')}
            </span>
          </div>
        </TiltCard>

        {/* Enhanced Headline with gradient text */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-8 animate-fade-in" style={{ animationDelay: '0.1s', letterSpacing: '-0.02em' }}>
          {t('hero.title_prefix')}{' '}
          <span className="relative inline-block px-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-gradient-shimmer drop-shadow-sm">
              {t('hero.title_highlight')}
            </span>
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 400 20" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path
                d="M0 16C50 4 150 4 200 10C250 16 350 16 400 4"
                stroke="url(#hero-underline)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                className="drop-shadow-lg"
              />
              <defs>
                <linearGradient id="hero-underline" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                  <stop offset="20%" stopColor="#3b82f6" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="80%" stopColor="#6366f1" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        {/* Enhanced Subtitle with better typography */}
        <p className="max-w-2xl mx-auto text-xl sm:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed mb-12 animate-fade-in" style={{ animationDelay: '0.2s', letterSpacing: '-0.01em' }}>
          {t('hero.subtitle')}
        </p>

        {/* Enhanced CTAs with magnetic buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <MagneticButton onClick={() => setCurrentPage('preise')} variant="primary">
            <span>Projekt starten</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </MagneticButton>
          <MagneticButton onClick={() => setCurrentPage('projekte')} variant="secondary" className="group">
            <span className="flex items-center gap-2">
              Beispiele ansehen
              <ArrowRightIcon className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </span>
          </MagneticButton>
        </div>

        {/* Enhanced Guarantees with better hover states */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-600 dark:text-slate-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {guarantees.map((g, i) => (
            <TiltCard key={i} className="inline-block" intensity={5}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-all duration-300 cursor-default border border-transparent hover:border-slate-300 dark:hover:border-slate-600">
                <span className="text-lg filter drop-shadow-sm animate-float" style={{ animationDelay: `${i * 0.2}s` }}>{g.icon}</span>
                <span className="font-medium tracking-wide">{g.text}</span>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Enhanced Price hint with glow effect */}
        <TiltCard className="mt-12 inline-block animate-fade-in" intensity={8}>
          <div className="relative items-center gap-6 px-8 py-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/50 dark:shadow-black/30 hover:shadow-2xl hover:shadow-blue-500/15 dark:hover:shadow-violet-500/10 transition-all duration-500 group overflow-hidden" style={{ animationDelay: '0.5s' }}>
            {/* Shimmer overlay */}
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-violet-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="flex items-center gap-2 relative z-10">
              <span className="text-slate-400 dark:text-slate-500 line-through text-lg">99€ - 299€</span>
              <ArrowRightIcon className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-shimmer">
                29€
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 relative z-10"></div>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide relative z-10">Startpreis</span>
          </div>
        </TiltCard>
      </div>

      {/* Enhanced bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 to-transparent pointer-events-none"></div>

      {/* Enhanced scroll indicator with pulse */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="w-6 h-10 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-start justify-center p-1.5 relative z-10 group-hover:border-blue-400 dark:group-hover:border-violet-500 transition-colors duration-300">
            <div className="w-1 h-2 rounded-full bg-gradient-to-b from-blue-500 to-violet-500 animate-scroll-indicator"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
