
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

// ===========================================
// WORLD CLASS FLOATING PARTICLE SYSTEM
// ===========================================
const FloatingParticle: React.FC<{
  delay: number;
  duration: number;
  left: string;
  size: string;
  variant?: 'orb' | 'sparkle' | 'glow' | 'ring' | 'diamond' | 'star' | 'cross';
  color?: string;
}> = ({ delay, duration, left, size, variant = 'orb', color }) => {
  const getParticleStyle = () => {
    switch (variant) {
      case 'sparkle':
        return {
          background: `radial-gradient(circle, ${color || '#8b5cf6'} 0%, transparent 70%)`,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          filter: 'drop-shadow(0 0 8px currentColor)',
        };
      case 'glow':
        return {
          background: `radial-gradient(circle, ${color || '#3b82f6'} 0%, transparent 70%)`,
          filter: 'blur(12px)',
        };
      case 'ring':
        return {
          background: 'transparent',
          border: `2px solid ${color || 'rgba(139, 92, 246, 0.6)'}`,
          boxShadow: `0 0 15px ${color || 'rgba(139, 92, 246, 0.4)'}`,
        };
      case 'diamond':
        return {
          background: `linear-gradient(135deg, ${color || 'rgba(59, 130, 246, 0.5)'} 0%, ${color || 'rgba(139, 92, 246, 0.3)'} 100%)`,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        };
      case 'star':
        return {
          background: `radial-gradient(circle, ${color || '#f59e0b'} 0%, transparent 70%)`,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        };
      case 'cross':
        return {
          background: color || 'rgba(59, 130, 246, 0.5)',
          clipPath: 'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
        };
      default:
        return {
          background: `linear-gradient(135deg, ${color || 'rgba(59, 130, 246, 0.5)'} 0%, ${color || 'rgba(139, 92, 246, 0.3)'} 100%)`,
          boxShadow: `0 0 25px ${color || 'rgba(59, 130, 246, 0.3)'}`,
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

// ===========================================
// WORLD CLASS 3D TILT CARD WITH SPOTLIGHT
// ===========================================
const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glowColor?: string;
}> = ({ children, className = '', intensity = 20, glowColor = 'rgba(59, 130, 246, 0.2)' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: -100, y: -100 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity * 0.15;
    const rotateY = ((x - centerX) / centerX) * intensity * 0.15;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`);
    setGlowPosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
    setRipplePosition({ x, y });
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
      {/* Multi-layer spotlight effect */}
      <div
        className="absolute inset-0 rounded-inherit opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor}, rgba(139, 92, 246, 0.1), transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {/* Ripple effect */}
      {isHovered && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripplePosition.x,
            top: ripplePosition.y,
            width: 0,
            height: 0,
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            animation: 'ripple-expand 0.6s ease-out forwards',
          }}
        />
      )}
      {children}
    </div>
  );
};

// ===========================================
// WORLD CLASS MAGNETIC BUTTON
// ===========================================
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
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Enhanced magnetic effect
    setPosition({ x: x * 0.3, y: y * 0.3 });

    // Track glow position
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
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
    ? 'group relative px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-500/40 dark:hover:shadow-white/30'
    : 'group px-10 py-4 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400/70 dark:hover:border-violet-500/70 hover:bg-slate-50/90 dark:hover:bg-slate-800/70 hover:shadow-xl hover:shadow-blue-500/15 transition-all duration-300';

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`${baseStyle} ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.2s cubic-bezier(0.25, 0.4, 0.25, 1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {variant === 'primary' ? (
        <>
          {/* Gradient overlay */}
          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          {/* Shimmer animation */}
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 animate-gradient-shimmer opacity-0 group-hover:opacity-50"></span>
          {/* Dynamic glow */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(200px circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.3), transparent 60%)`,
            }}
          ></span>
          {/* Ripple effect */}
          {ripplePos && (
            <span
              className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
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
        <>
          {/* Subtle glow for secondary */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
            style={{
              background: `radial-gradient(200px circle at ${glowPos.x}% ${glowPos.y}%, rgba(59, 130, 246, 0.1), transparent 60%)`,
            }}
          ></span>
          <span className="relative z-10">{children}</span>
        </>
      )}
    </button>
  );
};

export const Hero: React.FC<HeroProps> = ({ setCurrentPage }) => {
  const { t } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [time, setTime] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Add subtle time-based animation
    const animateTime = () => {
      setTime(Date.now() / 1000);
      requestAnimationFrame(animateTime);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    animateTime();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* =========================================== */}
      {/* WORLD CLASS BACKGROUND LAYERS */}
      {/* =========================================== */}

      {/* Noise texture overlay for depth */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none noise-bg"></div>

      {/* Base gradient with enhanced colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/40"></div>

      {/* Animated gradient mesh with aurora effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-violet-500/6 to-indigo-500/4 dark:from-blue-500/12 dark:via-violet-500/8 dark:to-indigo-500/6 animate-aurora opacity-60"></div>
      </div>

      {/* =========================================== */}
      {/* WORLD CLASS GRADIENT ORBS WITH PHYSICS */}
      {/* =========================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary orb - large and dramatic */}
        <div
          className="absolute top-[10%] left-[0%] w-[800px] h-[800px] bg-gradient-to-br from-blue-500/25 via-violet-500/18 to-indigo-500/12 rounded-full blur-3xl will-change-transform animate-morph-shape"
          style={{
            transform: `translate(${mousePosition.x * -1.8 - scrollY * 0.12}px, ${mousePosition.y * -1.8 - scrollY * 0.06}px)`,
          }}
        ></div>

        {/* Secondary orb - balancing */}
        <div
          className="absolute bottom-[5%] right-[0%] w-[700px] h-[700px] bg-gradient-to-br from-violet-500/18 via-purple-500/14 to-pink-500/10 rounded-full blur-3xl will-change-transform animate-morph-shape"
          style={{
            transform: `translate(${mousePosition.x * 1.8 + scrollY * 0.1}px, ${mousePosition.y * 1.8 + scrollY * 0.05}px)`,
            animationDelay: '3s',
          }}
        ></div>

        {/* Tertiary orb - accent */}
        <div
          className="absolute top-[45%] left-[25%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/12 to-teal-400/10 rounded-full blur-3xl will-change-transform animate-morph-shape"
          style={{
            transform: `translate(${mousePosition.x * 1 - scrollY * 0.08}px, ${mousePosition.y * 1 - scrollY * 0.04}px)`,
            animationDelay: '6s',
          }}
        ></div>

        {/* Quaternary orb - warm accent */}
        <div
          className="absolute top-[25%] right-[15%] w-[400px] h-[400px] bg-gradient-to-br from-rose-400/10 to-pink-400/8 rounded-full blur-3xl will-change-transform animate-morph-shape"
          style={{
            transform: `translate(${mousePosition.x * -0.7 + scrollY * 0.06}px, ${mousePosition.y * -0.7 + scrollY * 0.03}px)`,
            animationDelay: '9s',
          }}
        ></div>

        {/* Small accent orb */}
        <div
          className="absolute bottom-[30%] left-[15%] w-[300px] h-[300px] bg-gradient-to-br from-cyan-400/10 to-blue-400/8 rounded-full blur-3xl will-change-transform animate-morph-shape"
          style={{
            transform: `translate(${mousePosition.x * 0.5 - scrollY * 0.04}px, ${mousePosition.y * 0.5 - scrollY * 0.02}px)`,
            animationDelay: '12s',
          }}
        ></div>
      </div>

      {/* =========================================== */}
      {/* WORLD CLASS PARTICLE SYSTEM */}
      {/* =========================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Layer 1 - Small orbs */}
        <FloatingParticle delay={0} duration={16} left="3%" size="6px" variant="orb" color="rgba(59, 130, 246, 0.6)" />
        <FloatingParticle delay={2} duration={18} left="12%" size="5px" variant="glow" color="rgba(139, 92, 246, 0.7)" />
        <FloatingParticle delay={4} duration={20} left="22%" size="7px" variant="ring" color="rgba(99, 102, 241, 0.5)" />
        <FloatingParticle delay={1} duration={15} left="35%" size="6px" variant="diamond" color="rgba(236, 72, 153, 0.5)" />
        <FloatingParticle delay={3} duration={22} left="48%" size="8px" variant="sparkle" color="rgba(139, 92, 246, 0.8)" />
        <FloatingParticle delay={5} duration={17} left="62%" size="5px" variant="glow" color="rgba(59, 130, 246, 0.7)" />
        <FloatingParticle delay={2.5} duration={19} left="75%" size="7px" variant="ring" color="rgba(168, 85, 247, 0.5)" />
        <FloatingParticle delay={1.5} duration={16} left="88%" size="6px" variant="diamond" color="rgba(14, 165, 233, 0.6)" />
        <FloatingParticle delay={0.5} duration={21} left="97%" size="9px" variant="star" color="rgba(245, 158, 11, 0.5)" />

        {/* Layer 2 - Medium particles */}
        <FloatingParticle delay={3.5} duration={20} left="55%" size="5px" variant="cross" color="rgba(99, 102, 241, 0.6)" />
        <FloatingParticle delay={4.5} duration={18} left="30%" size="6px" variant="orb" color="rgba(16, 185, 129, 0.5)" />
        <FloatingParticle delay={6} duration={22} left="42%" size="8px" variant="glow" color="rgba(245, 158, 11, 0.4)" />
        <FloatingParticle delay={1.8} duration={19} left="68%" size="5px" variant="sparkle" color="rgba(236, 72, 153, 0.6)" />
        <FloatingParticle delay={3.2} duration={17} left="8%" size="7px" variant="ring" color="rgba(59, 130, 246, 0.5)" />
        <FloatingParticle delay={5.5} duration={23} left="92%" size="6px" variant="diamond" color="rgba(139, 92, 246, 0.7)" />

        {/* Layer 3 - Extra particles for richness */}
        <FloatingParticle delay={0.8} duration={24} left="18%" size="4px" variant="glow" color="rgba(14, 165, 233, 0.5)" />
        <FloatingParticle delay={2.2} duration={16} left="78%" size="5px" variant="orb" color="rgba(168, 85, 247, 0.6)" />
        <FloatingParticle delay={4.8} duration={20} left="58%" size="6px" variant="sparkle" color="rgba(99, 102, 241, 0.5)" />
        <FloatingParticle delay={6.5} duration={18} left="28%" size="7px" variant="ring" color="rgba(16, 185, 129, 0.4)" />
      </div>

      {/* =========================================== */}
      {/* ENHANCED GRID PATTERN WITH ANIMATION */}
      {/* =========================================== */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          animation: 'grid-pan 80s linear infinite',
        }}
      ></div>

      {/* =========================================== */}
      {/* WORLD CLASS VIGNETTE EFFECT */}
      {/* =========================================== */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.4)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,23,42,0.5)_100%)]"></div>

      {/* Scanline effect for added depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)',
        }}
      ></div>

      {/* =========================================== */}
      {/* WORLD CLASS CONTENT */}
      {/* =========================================== */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge with premium effects */}
        <TiltCard className="inline-block mb-16 animate-zoom-fade" glowColor="rgba(16, 185, 129, 0.15)">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/70 dark:border-slate-700/60 shadow-2xl shadow-slate-200/60 dark:shadow-black/40 hover:shadow-3xl hover:shadow-emerald-500/15 dark:hover:shadow-emerald-500/10 transition-all duration-500 group cursor-default overflow-hidden">
            {/* Shimmer effect */}
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse shadow-lg shadow-emerald-500/50 animate-breathing-glow"></div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 relative z-10 tracking-wide">
              {t('hero.guarantee_badge')}
            </span>
          </div>
        </TiltCard>

        {/* World class headline */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-8 animate-zoom-fade" style={{ animationDelay: '0.1s', letterSpacing: '-0.025em' }}>
          {t('hero.title_prefix')}{' '}
          <span className="relative inline-block px-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-[length:300%_auto] animate-gradient-shimmer drop-shadow-sm">
              {t('hero.title_highlight')}
            </span>
            {/* Animated underline with glow */}
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 400 20" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="hero-underline-enhanced" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0">
                    <animate attributeName="offset" values="-1;0" dur="3s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="20%" stopColor="#3b82f6" stopOpacity="0.6"></stop>
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9"></stop>
                  <stop offset="80%" stopColor="#6366f1" stopOpacity="0.6"></stop>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0">
                    <animate attributeName="offset" values="0;1" dur="3s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
              </defs>
              <path
                d="M0 16C50 4 150 4 200 10C250 16 350 16 400 4"
                stroke="url(#hero-underline-enhanced)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                className="drop-shadow-lg"
                style={{ filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))' }}
              />
            </svg>
          </span>
        </h1>

        {/* Enhanced subtitle */}
        <p className="max-w-2xl mx-auto text-xl sm:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed mb-12 animate-zoom-fade" style={{ animationDelay: '0.2s', letterSpacing: '-0.015em' }}>
          {t('hero.subtitle')}
        </p>

        {/* World class CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20 animate-zoom-fade" style={{ animationDelay: '0.3s' }}>
          <MagneticButton onClick={() => setCurrentPage('preise')} variant="primary" className="text-base">
            <span>Projekt starten</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
          </MagneticButton>
          <MagneticButton onClick={() => setCurrentPage('projekte')} variant="secondary" className="group text-base">
            <span className="flex items-center gap-2">
              Beispiele ansehen
              <ArrowRightIcon className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </span>
          </MagneticButton>
        </div>

        {/* Enhanced guarantees with premium styling */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-slate-600 dark:text-slate-500 animate-zoom-fade" style={{ animationDelay: '0.4s' }}>
          {guarantees.map((g, i) => (
            <TiltCard key={i} className="inline-block" intensity={8} glowColor="rgba(59, 130, 246, 0.12)">
              <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md hover:bg-slate-100/90 dark:hover:bg-slate-700/80 transition-all duration-300 cursor-default border border-slate-200/70 dark:border-slate-700/60 hover:border-blue-300/50 dark:hover:border-violet-600/50 hover:shadow-lg hover:shadow-blue-500/10 group">
                <span
                  className="text-xl filter drop-shadow-sm animate-float"
                  style={{
                    animationDelay: `${i * 0.25}s`,
                    animationDuration: `${3 + i * 0.5}s`,
                  }}
                >
                  {g.icon}
                </span>
                <span className="font-semibold tracking-wide group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors">{g.text}</span>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* World class price hint */}
        <TiltCard className="mt-14 inline-block animate-zoom-fade" intensity={10} glowColor="rgba(139, 92, 246, 0.2)">
          <div className="relative flex items-center gap-6 px-10 py-5 rounded-3xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/70 dark:border-slate-700/60 shadow-2xl shadow-slate-200/60 dark:shadow-black/40 hover:shadow-3xl hover:shadow-blue-500/20 dark:hover:shadow-violet-500/15 transition-all duration-500 group overflow-hidden" style={{ animationDelay: '0.5s' }}>
            {/* Shimmer overlay */}
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            {/* Animated gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-violet-500/15 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-shimmer"></div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-tl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-violet-500/20 to-transparent rounded-br-3xl"></div>

            <div className="flex items-center gap-2 relative z-10">
              <span className="text-slate-400 dark:text-slate-500 line-through text-lg">99€ - 299€</span>
              <ArrowRightIcon className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-shimmer drop-shadow-sm">
                29€
              </span>
            </div>
            <div className="w-px h-10 bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 relative z-10"></div>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold tracking-wide relative z-10">Startpreis</span>
          </div>
        </TiltCard>
      </div>

      {/* =========================================== */}
      {/* WORLD CLASS BOTTOM FADE */}
      {/* =========================================== */}
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 to-transparent pointer-events-none"></div>

      {/* =========================================== */}
      {/* WORLD CLASS SCROLL INDICATOR */}
      {/* =========================================== */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          {/* Pulsing glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 to-violet-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow"></div>

          {/* Container */}
          <div className="relative w-7 h-12 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-start justify-center p-2 group-hover:border-blue-400 dark:group-hover:border-violet-500 transition-all duration-500 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            {/* Animated dot */}
            <div className="w-1.5 h-3 rounded-full bg-gradient-to-b from-blue-500 to-violet-500 animate-scroll-indicator shadow-lg shadow-blue-500/50"></div>
          </div>

          {/* Scroll hint text */}
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
};
