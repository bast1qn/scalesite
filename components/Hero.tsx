
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
// TRANSCENDENT FLOATING PARTICLE SYSTEM
// ===========================================
const FloatingParticle: React.FC<{
  delay: number;
  duration: number;
  left: string;
  size: string;
  variant?: 'orb' | 'sparkle' | 'glow' | 'ring' | 'diamond' | 'star' | 'cross' | 'hexagon' | 'triangle' | 'pulse';
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
      case 'hexagon':
        return {
          background: color || 'rgba(16, 185, 129, 0.5)',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        };
      case 'triangle':
        return {
          background: color || 'rgba(245, 158, 11, 0.5)',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        };
      case 'pulse':
        return {
          background: `radial-gradient(circle, ${color || '#ec4899'} 0%, transparent 70%)`,
          animation: 'radial-pulse 2s ease-in-out infinite',
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
// TRANSCENDENT 3D TILT CARD WITH SPOTLIGHT
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
// TRANSCENDENT MAGNETIC BUTTON
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
      {/* TRANSCENDENT BACKGROUND LAYERS */}
      {/* =========================================== */}

      {/* Noise texture overlay for depth */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none noise-bg noise-bg-animated"></div>

      {/* Base gradient with enhanced colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/40"></div>

      {/* Animated gradient mesh with aurora effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/12 via-violet-500/10 to-indigo-500/8 dark:from-blue-500/16 dark:via-violet-500/12 dark:to-indigo-500/10 animate-aurora-deluxe opacity-70"></div>
        {/* Holographic overlay */}
        <div className="absolute inset-0 holographic-base opacity-30"></div>
        {/* Aurora waves */}
        <div className="absolute inset-0 animate-aurora-waves opacity-20"></div>
      </div>

      {/* =========================================== */}
      {/* TRANSCENDENT GRADIENT ORBS WITH PHYSICS */}
      {/* =========================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary orb - massive and dramatic */}
        <div
          className="absolute top-[10%] left-[0%] w-[900px] h-[900px] bg-gradient-to-br from-blue-500/30 via-violet-500/22 to-indigo-500/16 rounded-full blur-3xl will-change-transform animate-morph-deluxe shadow-glow-legendary-lg"
          style={{
            transform: `translate(${mousePosition.x * -2.2 - scrollY * 0.15}px, ${mousePosition.y * -2.2 - scrollY * 0.08}px)`,
          }}
        ></div>

        {/* Secondary orb - balancing with glow */}
        <div
          className="absolute bottom-[5%] right-[0%] w-[800px] h-[800px] bg-gradient-to-br from-violet-500/22 via-purple-500/18 to-pink-500/14 rounded-full blur-3xl will-change-transform animate-morph-deluxe"
          style={{
            transform: `translate(${mousePosition.x * 2.2 + scrollY * 0.12}px, ${mousePosition.y * 2.2 + scrollY * 0.06}px)`,
            animationDelay: '3s',
          }}
        ></div>

        {/* Tertiary orb - accent with teal */}
        <div
          className="absolute top-[45%] left-[25%] w-[600px] h-[600px] bg-gradient-to-br from-emerald-400/16 to-teal-400/14 rounded-full blur-3xl will-change-transform animate-morph-deluxe"
          style={{
            transform: `translate(${mousePosition.x * 1.2 - scrollY * 0.1}px, ${mousePosition.y * 1.2 - scrollY * 0.05}px)`,
            animationDelay: '6s',
          }}
        ></div>

        {/* Quaternary orb - warm accent with glow */}
        <div
          className="absolute top-[25%] right-[15%] w-[500px] h-[500px] bg-gradient-to-br from-rose-400/14 to-pink-400/12 rounded-full blur-3xl will-change-transform animate-morph-deluxe shadow-glow-legendary-md"
          style={{
            transform: `translate(${mousePosition.x * -0.9 + scrollY * 0.08}px, ${mousePosition.y * -0.9 + scrollY * 0.04}px)`,
            animationDelay: '9s',
          }}
        ></div>

        {/* Small accent orb */}
        <div
          className="absolute bottom-[30%] left-[15%] w-[400px] h-[400px] bg-gradient-to-br from-cyan-400/14 to-blue-400/12 rounded-full blur-3xl will-change-transform animate-morph-deluxe"
          style={{
            transform: `translate(${mousePosition.x * 0.7 - scrollY * 0.06}px, ${mousePosition.y * 0.7 - scrollY * 0.03}px)`,
            animationDelay: '12s',
          }}
        ></div>

        {/* Additional legendary orbs */}
        <div
          className="absolute top-[60%] right-[25%] w-[350px] h-[350px] bg-gradient-to-br from-amber-400/12 to-orange-400/10 rounded-full blur-3xl will-change-transform animate-float-deluxe shadow-glow-legendary-sm"
          style={{
            transform: `translate(${mousePosition.x * 0.5 + scrollY * 0.05}px, ${mousePosition.y * 0.5 + scrollY * 0.025}px)`,
            animationDelay: '1s',
          }}
        ></div>

        <div
          className="absolute top-[15%] left-[45%] w-[300px] h-[300px] bg-gradient-to-br from-fuchsia-400/12 to-pink-400/10 rounded-full blur-3xl will-change-transform animate-float-deluxe"
          style={{
            transform: `translate(${mousePosition.x * -0.4 - scrollY * 0.04}px, ${mousePosition.y * -0.4 - scrollY * 0.02}px)`,
            animationDelay: '4s',
          }}
        ></div>

        {/* Extra cosmic orbs */}
        <div
          className="absolute top-[75%] left-[40%] w-[250px] h-[250px] bg-gradient-to-br from-cyan-400/10 to-blue-400/8 rounded-full blur-3xl will-change-transform animate-float-deluxe animate-stardust"
          style={{
            transform: `translate(${mousePosition.x * -0.3 + scrollY * 0.03}px, ${mousePosition.y * -0.3 + scrollY * 0.015}px)`,
            animationDelay: '0.5s',
          }}
        ></div>

        <div
          className="absolute top-[35%] right-[35%] w-[200px] h-[200px] bg-gradient-to-br from-violet-400/12 to-purple-400/10 rounded-full blur-3xl will-change-transform animate-magnetic-field glow-violet"
          style={{
            transform: `translate(${mousePosition.x * 0.25 - scrollY * 0.025}px, ${mousePosition.y * 0.25 - scrollY * 0.012}px)`,
            animationDelay: '2.5s',
          }}
        ></div>
      </div>

      {/* =========================================== */}
      {/* COSMIC PARTICLE SYSTEM - MAXIMUM PARTICLES */}
      {/* =========================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* COSMIC LAYER 1 - Primary particle field */}
        <FloatingParticle delay={0} duration={16} left="2%" size="8px" variant="glow" color="rgba(59, 130, 246, 0.8)" />
        <FloatingParticle delay={0.5} duration={18} left="5%" size="6px" variant="orb" color="rgba(139, 92, 246, 0.9)" />
        <FloatingParticle delay={1} duration={20} left="8%" size="10px" variant="ring" color="rgba(99, 102, 241, 0.7)" />
        <FloatingParticle delay={1.5} duration={15} left="11%" size="8px" variant="diamond" color="rgba(236, 72, 153, 0.7)" />
        <FloatingParticle delay={2} duration={22} left="14%" size="12px" variant="sparkle" color="rgba(139, 92, 246, 1)" />
        <FloatingParticle delay={2.5} duration={17} left="17%" size="7px" variant="glow" color="rgba(59, 130, 246, 0.9)" />
        <FloatingParticle delay={3} duration={19} left="20%" size="10px" variant="ring" color="rgba(168, 85, 247, 0.7)" />
        <FloatingParticle delay={3.5} duration={16} left="23%" size="8px" variant="diamond" color="rgba(14, 165, 233, 0.8)" />
        <FloatingParticle delay={4} duration={21} left="26%" size="14px" variant="star" color="rgba(245, 158, 11, 0.7)" />
        <FloatingParticle delay={4.5} duration={18} left="29%" size="6px" variant="cross" color="rgba(99, 102, 241, 0.8)" />
        <FloatingParticle delay={5} duration={20} left="32%" size="8px" variant="orb" color="rgba(16, 185, 129, 0.7)" />
        <FloatingParticle delay={5.5} duration={22} left="35%" size="10px" variant="glow" color="rgba(245, 158, 11, 0.6)" />
        <FloatingParticle delay={6} duration={19} left="38%" size="7px" variant="sparkle" color="rgba(236, 72, 153, 0.8)" />
        <FloatingParticle delay={6.5} duration={17} left="41%" size="9px" variant="ring" color="rgba(59, 130, 246, 0.7)" />
        <FloatingParticle delay={7} duration={23} left="44%" size="8px" variant="diamond" color="rgba(139, 92, 246, 0.9)" />
        <FloatingParticle delay={7.5} duration={24} left="47%" size="5px" variant="glow" color="rgba(14, 165, 233, 0.7)" />
        <FloatingParticle delay={8} duration={16} left="50%" size="6px" variant="orb" color="rgba(168, 85, 247, 0.8)" />
        <FloatingParticle delay={8.5} duration={20} left="53%" size="7px" variant="sparkle" color="rgba(99, 102, 241, 0.7)" />
        <FloatingParticle delay={9} duration={18} left="56%" size="9px" variant="ring" color="rgba(16, 185, 129, 0.6)" />
        <FloatingParticle delay={9.5} duration={25} left="59%" size="5px" variant="glow" color="rgba(236, 72, 153, 0.7)" />
        <FloatingParticle delay={10} duration={21} left="62%" size="6px" variant="orb" color="rgba(245, 158, 11, 0.6)" />
        <FloatingParticle delay={10.5} duration={19} left="65%" size="7px" variant="diamond" color="rgba(139, 92, 246, 0.8)" />
        <FloatingParticle delay={11} duration={26} left="68%" size="8px" variant="sparkle" color="rgba(59, 130, 246, 0.7)" />
        <FloatingParticle delay={11.5} duration={23} left="71%" size="5px" variant="ring" color="rgba(14, 165, 233, 0.8)" />
        <FloatingParticle delay={12} duration={28} left="74%" size="4px" variant="glow" color="rgba(168, 85, 247, 0.6)" />
        <FloatingParticle delay={12.5} duration={24} left="77%" size="5px" variant="orb" color="rgba(99, 102, 241, 0.7)" />
        <FloatingParticle delay={13} duration={22} left="80%" size="6px" variant="diamond" color="rgba(236, 72, 153, 0.8)" />
        <FloatingParticle delay={13.5} duration={26} left="83%" size="4px" variant="sparkle" color="rgba(16, 185, 129, 0.6)" />
        <FloatingParticle delay={14} duration={30} left="86%" size="6px" variant="hexagon" color="rgba(16, 185, 129, 0.8)" />
        <FloatingParticle delay={14.5} duration={25} left="89%" size="5px" variant="triangle" color="rgba(245, 158, 11, 0.7)" />
        <FloatingParticle delay={15} duration={22} left="92%" size="7px" variant="pulse" color="rgba(236, 72, 153, 0.6)" />
        <FloatingParticle delay={15.5} duration={28} left="95%" size="4px" variant="hexagon" color="rgba(59, 130, 246, 0.7)" />
        <FloatingParticle delay={16} duration={24} left="98%" size="5px" variant="triangle" color="rgba(139, 92, 246, 0.8)" />

        {/* COSMIC LAYER 2 - Secondary cosmic field */}
        <FloatingParticle delay={0.3} duration={20} left="1%" size="6px" variant="glow" color="rgba(244, 63, 94, 0.6)" />
        <FloatingParticle delay={1.3} duration={22} left="4%" size="6px" variant="ring" color="rgba(168, 85, 247, 0.7)" />
        <FloatingParticle delay={2.3} duration={24} left="7%" size="7px" variant="sparkle" color="rgba(99, 102, 241, 0.8)" />
        <FloatingParticle delay={3.3} duration={20} left="10%" size="5px" variant="diamond" color="rgba(236, 72, 153, 0.7)" />
        <FloatingParticle delay={4.3} duration={26} left="13%" size="9px" variant="star" color="rgba(245, 158, 11, 0.6)" />
        <FloatingParticle delay={5.3} duration={18} left="16%" size="7px" variant="glow" color="rgba(244, 63, 94, 0.6)" />
        <FloatingParticle delay={6.3} duration={21} left="19%" size="8px" variant="ring" color="rgba(168, 85, 247, 0.7)" />
        <FloatingParticle delay={7.3} duration={23} left="22%" size="6px" variant="sparkle" color="rgba(99, 102, 241, 0.8)" />
        <FloatingParticle delay={8.3} duration={19} left="25%" size="7px" variant="diamond" color="rgba(236, 72, 153, 0.7)" />
        <FloatingParticle delay={9.3} duration={25} left="28%" size="10px" variant="star" color="rgba(245, 158, 11, 0.6)" />
        <FloatingParticle delay={10.3} duration={20} left="31%" size="5px" variant="glow" color="rgba(244, 63, 94, 0.6)" />
        <FloatingParticle delay={11.3} duration={22} left="34%" size="6px" variant="ring" color="rgba(168, 85, 247, 0.7)" />
        <FloatingParticle delay={12.3} duration={24} left="37%" size="7px" variant="sparkle" color="rgba(99, 102, 241, 0.8)" />
        <FloatingParticle delay={13.3} duration={21} left="40%" size="8px" variant="diamond" color="rgba(236, 72, 153, 0.7)" />
        <FloatingParticle delay={14.3} duration={27} left="43%" size="5px" variant="star" color="rgba(245, 158, 11, 0.6)" />
        <FloatingParticle delay={15.3} duration={19} left="46%" size="6px" variant="glow" color="rgba(244, 63, 94, 0.6)" />
        <FloatingParticle delay={16.3} duration={23} left="49%" size="7px" variant="ring" color="rgba(168, 85, 247, 0.7)" />
        <FloatingParticle delay={17.3} duration={25} left="52%" size="8px" variant="sparkle" color="rgba(99, 102, 241, 0.8)" />
        <FloatingParticle delay={18.3} duration={20} left="55%" size="6px" variant="diamond" color="rgba(236, 72, 153, 0.7)" />
        <FloatingParticle delay={19.3} duration={26} left="58%" size="9px" variant="star" color="rgba(245, 158, 11, 0.6)" />
        <FloatingParticle delay={20.3} duration={22} left="61%" size="7px" variant="glow" color="rgba(244, 63, 94, 0.6)" />
        <FloatingParticle delay={21.3} duration={24} left="64%" size="8px" variant="ring" color="rgba(168, 85, 247, 0.7)" />
        <FloatingParticle delay={22.3} duration={28} left="67%" size="5px" variant="sparkle" color="rgba(99, 102, 241, 0.8)" />
        <FloatingParticle delay={23.3} duration={21} left="70%" size="6px" variant="diamond" color="rgba(236, 72, 153, 0.7)" />
        <FloatingParticle delay={24.3} duration={27} left="73%" size="7px" variant="star" color="rgba(245, 158, 11, 0.6)" />
        <FloatingParticle delay={25.3} duration={23} left="76%" size="8px" variant="glow" color="rgba(244, 63, 94, 0.6)" />
        <FloatingParticle delay={26.3} duration={25} left="79%" size="5px" variant="ring" color="rgba(168, 85, 247, 0.7)" />
        <FloatingParticle delay={27.3} duration={29} left="82%" size="6px" variant="sparkle" color="rgba(99, 102, 241, 0.8)" />
        <FloatingParticle delay={28.3} duration={22} left="85%" size="7px" variant="diamond" color="rgba(236, 72, 153, 0.7)" />
        <FloatingParticle delay={29.3} duration={26} left="88%" size="9px" variant="star" color="rgba(245, 158, 11, 0.6)" />
        <FloatingParticle delay={30.3} duration={24} left="91%" size="5px" variant="glow" color="rgba(244, 63, 94, 0.6)" />
        <FloatingParticle delay={31.3} duration={28} left="94%" size="6px" variant="ring" color="rgba(168, 85, 247, 0.7)" />
        <FloatingParticle delay={32.3} duration={30} left="97%" size="7px" variant="sparkle" color="rgba(99, 102, 241, 0.8)" />
        <FloatingParticle delay={33.3} duration={25} left="99%" size="8px" variant="diamond" color="rgba(236, 72, 153, 0.7)" />

        {/* COSMIC LAYER 3 - Nebula particles */}
        <FloatingParticle delay={0.7} duration={32} left="3%" size="4px" variant="hexagon" color="rgba(138, 43, 226, 0.8)" />
        <FloatingParticle delay={1.7} duration={28} left="9%" size="5px" variant="triangle" color="rgba(186, 85, 211, 0.7)" />
        <FloatingParticle delay={2.7} duration={35} left="15%" size="7px" variant="pulse" color="rgba(255, 20, 147, 0.6)" />
        <FloatingParticle delay={3.7} duration={30} left="21%" size="6px" variant="hexagon" color="rgba(75, 0, 130, 0.7)" />
        <FloatingParticle delay={4.7} duration={26} left="27%" size="5px" variant="triangle" color="rgba(138, 43, 226, 0.8)" />
        <FloatingParticle delay={5.7} duration={33} left="33%" size="8px" variant="pulse" color="rgba(186, 85, 211, 0.7)" />
        <FloatingParticle delay={6.7} duration={29} left="39%" size="4px" variant="hexagon" color="rgba(255, 20, 147, 0.6)" />
        <FloatingParticle delay={7.7} duration={36} left="45%" size="6px" variant="triangle" color="rgba(75, 0, 130, 0.7)" />
        <FloatingParticle delay={8.7} duration={31} left="51%" size="5px" variant="pulse" color="rgba(138, 43, 226, 0.8)" />
        <FloatingParticle delay={9.7} duration={27} left="57%" size="7px" variant="hexagon" color="rgba(186, 85, 211, 0.7)" />
        <FloatingParticle delay={10.7} duration={34} left="63%" size="4px" variant="triangle" color="rgba(255, 20, 147, 0.6)" />
        <FloatingParticle delay={11.7} duration={30} left="69%" size="6px" variant="pulse" color="rgba(75, 0, 130, 0.7)" />
        <FloatingParticle delay={12.7} duration={26} left="75%" size="5px" variant="hexagon" color="rgba(138, 43, 226, 0.8)" />
        <FloatingParticle delay={13.7} duration={35} left="81%" size="8px" variant="triangle" color="rgba(186, 85, 211, 0.7)" />
        <FloatingParticle delay={14.7} duration={32} left="87%" size="4px" variant="pulse" color="rgba(255, 20, 147, 0.6)" />
        <FloatingParticle delay={15.7} duration={28} left="93%" size="6px" variant="hexagon" color="rgba(75, 0, 130, 0.7)" />
        <FloatingParticle delay={16.7} duration={25} left="96%" size="5px" variant="triangle" color="rgba(138, 43, 226, 0.8)" />

        {/* COSMIC LAYER 4 - Aurora particles */}
        <FloatingParticle delay={0.2} duration={28} left="6%" size="5px" variant="glow" color="rgba(0, 255, 127, 0.7)" />
        <FloatingParticle delay={1.2} duration={32} left="12%" size="6px" variant="orb" color="rgba(0, 191, 255, 0.8)" />
        <FloatingParticle delay={2.2} duration={26} left="18%" size="7px" variant="ring" color="rgba(138, 43, 226, 0.7)" />
        <FloatingParticle delay={3.2} duration={30} left="24%" size="5px" variant="diamond" color="rgba(255, 20, 147, 0.6)" />
        <FloatingParticle delay={4.2} duration={34} left="30%" size="8px" variant="sparkle" color="rgba(0, 255, 127, 0.8)" />
        <FloatingParticle delay={5.2} duration={28} left="36%" size="6px" variant="glow" color="rgba(0, 191, 255, 0.7)" />
        <FloatingParticle delay={6.2} duration={31} left="42%" size="7px" variant="orb" color="rgba(138, 43, 226, 0.8)" />
        <FloatingParticle delay={7.2} duration={27} left="48%" size="5px" variant="ring" color="rgba(255, 20, 147, 0.7)" />
        <FloatingParticle delay={8.2} duration={35} left="54%" size="6px" variant="diamond" color="rgba(0, 255, 127, 0.6)" />
        <FloatingParticle delay={9.2} duration={29} left="60%" size="8px" variant="sparkle" color="rgba(0, 191, 255, 0.8)" />
        <FloatingParticle delay={10.2} duration={33} left="66%" size="5px" variant="glow" color="rgba(138, 43, 226, 0.7)" />
        <FloatingParticle delay={11.2} duration={26} left="72%" size="7px" variant="orb" color="rgba(255, 20, 147, 0.8)" />
        <FloatingParticle delay={12.2} duration={30} left="78%" size="6px" variant="ring" color="rgba(0, 255, 127, 0.7)" />
        <FloatingParticle delay={13.2} duration={34} left="84%" size="8px" variant="diamond" color="rgba(0, 191, 255, 0.6)" />
        <FloatingParticle delay={14.2} duration={28} left="90%" size="5px" variant="sparkle" color="rgba(138, 43, 226, 0.8)" />
        <FloatingParticle delay={15.2} duration={32} left="96%" size="7px" variant="glow" color="rgba(255, 20, 147, 0.7)" />

        {/* COSMIC LAYER 5 - Plasma particles */}
        <FloatingParticle delay={0.4} duration={24} left="4%" size="6px" variant="glow" color="rgba(255, 0, 128, 0.7)" />
        <FloatingParticle delay={1.4} duration={28} left="13%" size="5px" variant="orb" color="rgba(128, 0, 255, 0.8)" />
        <FloatingParticle delay={2.4} duration={32} left="22%" size="7px" variant="ring" color="rgba(0, 128, 255, 0.7)" />
        <FloatingParticle delay={3.4} duration={26} left="31%" size="6px" variant="diamond" color="rgba(255, 0, 128, 0.8)" />
        <FloatingParticle delay={4.4} duration={30} left="40%" size="8px" variant="sparkle" color="rgba(128, 0, 255, 0.7)" />
        <FloatingParticle delay={5.4} duration={24} left="49%" size="5px" variant="glow" color="rgba(0, 128, 255, 0.8)" />
        <FloatingParticle delay={6.4} duration={28} left="58%" size="7px" variant="orb" color="rgba(255, 0, 128, 0.7)" />
        <FloatingParticle delay={7.4} duration={32} left="67%" size="6px" variant="ring" color="rgba(128, 0, 255, 0.8)" />
        <FloatingParticle delay={8.4} duration={26} left="76%" size="8px" variant="diamond" color="rgba(0, 128, 255, 0.7)" />
        <FloatingParticle delay={9.4} duration={30} left="85%" size="5px" variant="sparkle" color="rgba(255, 0, 128, 0.8)" />
        <FloatingParticle delay={10.4} duration={24} left="94%" size="7px" variant="glow" color="rgba(128, 0, 255, 0.7)" />

        {/* COSMIC LAYER 6 - Quantum particles */}
        <FloatingParticle delay={0.6} duration={36} left="7%" size="4px" variant="hexagon" color="rgba(59, 130, 246, 0.8)" />
        <FloatingParticle delay={1.6} duration={30} left="14%" size="5px" variant="triangle" color="rgba(139, 92, 246, 0.7)" />
        <FloatingParticle delay={2.6} duration={28} left="21%" size="6px" variant="pulse" color="rgba(236, 72, 153, 0.6)" />
        <FloatingParticle delay={3.6} duration={32} left="28%" size="4px" variant="hexagon" color="rgba(6, 182, 212, 0.7)" />
        <FloatingParticle delay={4.6} duration={26} left="35%" size="5px" variant="triangle" color="rgba(59, 130, 246, 0.8)" />
        <FloatingParticle delay={5.6} duration={34} left="42%" size="6px" variant="pulse" color="rgba(139, 92, 246, 0.7)" />
        <FloatingParticle delay={6.6} duration={30} left="49%" size="4px" variant="hexagon" color="rgba(236, 72, 153, 0.6)" />
        <FloatingParticle delay={7.6} duration={28} left="56%" size="5px" variant="triangle" color="rgba(6, 182, 212, 0.7)" />
        <FloatingParticle delay={8.6} duration={32} left="63%" size="6px" variant="pulse" color="rgba(59, 130, 246, 0.8)" />
        <FloatingParticle delay={9.6} duration={26} left="70%" size="4px" variant="hexagon" color="rgba(139, 92, 246, 0.7)" />
        <FloatingParticle delay={10.6} duration={34} left="77%" size="5px" variant="triangle" color="rgba(236, 72, 153, 0.6)" />
        <FloatingParticle delay={11.6} duration={30} left="84%" size="6px" variant="pulse" color="rgba(6, 182, 212, 0.7)" />
        <FloatingParticle delay={12.6} duration={28} left="91%" size="4px" variant="hexagon" color="rgba(59, 130, 246, 0.8)" />
        <FloatingParticle delay={13.6} duration={32} left="95%" size="5px" variant="triangle" color="rgba(139, 92, 246, 0.7)" />

        {/* COSMIC LAYER 7 - Stardust particles */}
        <FloatingParticle delay={0.1} duration={38} left="1%" size="3px" variant="glow" color="rgba(255, 255, 255, 0.9)" />
        <FloatingParticle delay={0.8} duration={35} left="3%" size="4px" variant="sparkle" color="rgba(255, 255, 255, 0.8)" />
        <FloatingParticle delay={1.5} duration={40} left="5%" size="3px" variant="glow" color="rgba(255, 255, 255, 0.9)" />
        <FloatingParticle delay={2.2} duration={36} left="8%" size="4px" variant="sparkle" color="rgba(255, 255, 255, 0.8)" />
        <FloatingParticle delay={2.9} duration={39} left="11%" size="3px" variant="glow" color="rgba(255, 255, 255, 0.9)" />
        <FloatingParticle delay={3.6} duration={37} left="15%" size="4px" variant="sparkle" color="rgba(255, 255, 255, 0.8)" />
        <FloatingParticle delay={4.3} duration={41} left="19%" size="3px" variant="glow" color="rgba(255, 255, 255, 0.9)" />
        <FloatingParticle delay={5.0} duration={38} left="24%" size="4px" variant="sparkle" color="rgba(255, 255, 255, 0.8)" />
        <FloatingParticle delay={5.7} duration={35} left="29%" size="3px" variant="glow" color="rgba(255, 255, 255, 0.9)" />
        <FloatingParticle delay={6.4} duration={40} left="34%" size="4px" variant="sparkle" color="rgba(255, 255, 255, 0.8)" />
        <FloatingParticle delay={7.1} duration={36} left="39%" size="3px" variant="glow" color="rgba(255, 255, 255, 0.9)" />
        <FloatingParticle delay={7.8} duration={39} left="44%" size="4px" variant="sparkle" color="rgba(255, 255, 255, 0.8)" />
        <FloatingParticle delay={8.5} duration={37} left="49%" size="3px" variant="glow" color="rgba(255, 255, 255, 0.9)" />
        <FloatingParticle delay={9.2} duration={41} left="54%" size="4px" variant="sparkle" color="rgba(255, 255, 255, 0.8)" />
        <FloatingParticle delay={9.9} duration={38} left="59%" size="3px" variant="glow" color="rgba(255, 255, 255, 0.9)" />
        <FloatingParticle delay={10.6} duration={35} left="64%" size="4px" variant="sparkle" color="rgba(255, 255, 255, 0.8)" />
        <FloatingParticle delay={11.3} duration={40} left="69%" size="3px" variant="glow" color="rgba(255, 255, 255, 0.9)" />
        <FloatingParticle delay={12.0} duration={36} left="74%" size="4px" variant="sparkle" color="rgba(255, 255, 255, 0.8)" />
        <FloatingParticle delay={12.7} duration={39} left="79%" size="3px" variant="glow" color="rgba(255, 255, 255, 0.9)" />
        <FloatingParticle delay={13.4} duration={37} left="84%" size="4px" variant="sparkle" color="rgba(255, 255, 255, 0.8)" />
        <FloatingParticle delay={14.1} duration={41} left="89%" size="3px" variant="glow" color="rgba(255, 255, 255, 0.9)" />
        <FloatingParticle delay={14.8} duration={38} left="93%" size="4px" variant="sparkle" color="rgba(255, 255, 255, 0.8)" />
        <FloatingParticle delay={15.5} duration={35} left="97%" size="3px" variant="glow" color="rgba(255, 255, 255, 0.9)" />
      </div>

      {/* =========================================== */}
      {/* COSMIC STARDUST FIELD */}
      {/* =========================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none stardust-field animate-starfield"></div>

      {/* =========================================== */}
      {/* COSMIC NEBULA OVERLAY */}
      {/* =========================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none animate-nebula-cloud opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 20% 30%, rgba(138, 43, 226, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(236, 72, 153, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
          animationDuration: '25s',
        }}
      ></div>

      {/* =========================================== */}
      {/* TRANSCENDENT GRID PATTERN */}
      {/* =========================================== */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          animation: 'grid-pan 100s linear infinite',
        }}
      ></div>

      {/* Legendary animated mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-animated-legendary opacity-20 pointer-events-none"></div>

      {/* Holographic wave overlay */}
      <div className="absolute inset-0 animate-aurora-curtain opacity-10 pointer-events-none"></div>

      {/* =========================================== */}
      {/* TRANSCENDENT VIGNETTE EFFECT */}
      {/* =========================================== */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.5)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,23,42,0.6)_100%)]"></div>

      {/* Enhanced scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)',
        }}
      ></div>

      {/* Legendary diagonal light rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div
          className="absolute top-0 left-1/4 w-[200%] h-full bg-gradient-to-r from-transparent via-blue-500/5 to-transparent transform -skew-x-12 animate-gradient-deluxe"
          style={{ animationDuration: '20s' }}
        ></div>
      </div>

      {/* Extra light rays with different angles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div
          className="absolute top-0 left-1/3 w-[200%] h-full bg-gradient-to-r from-transparent via-violet-500/5 to-transparent transform skew-x-12 animate-gradient-deluxe"
          style={{ animationDuration: '25s', animationDelay: '5s' }}
        ></div>
      </div>

      {/* =========================================== */}
      {/* TRANSCENDENT CONTENT */}
      {/* =========================================== */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge with transcendent effects */}
        <TiltCard className="inline-block mb-16 animate-zoom-fade" glowColor="rgba(16, 185, 129, 0.15)">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/70 dark:border-slate-700/60 shadow-2xl shadow-slate-200/60 dark:shadow-black/40 hover:shadow-3xl hover:shadow-emerald-500/15 dark:hover:shadow-emerald-500/10 transition-all duration-500 group cursor-default overflow-hidden holographic-base">
            {/* Shimmer effect */}
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            {/* Shimmer holographic */}
            <div className="absolute inset-0 shimmer-holographic opacity-0 group-hover:opacity-50 transition-opacity duration-700"></div>

            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse shadow-lg shadow-emerald-500/50 animate-breathing-glow relative z-10"></div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 relative z-10 tracking-wide">
              {t('hero.guarantee_badge')}
            </span>
          </div>
        </TiltCard>

        {/* Transcendent headline */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-8 animate-zoom-fade" style={{ animationDelay: '0.1s', letterSpacing: '-0.025em' }}>
          {t('hero.title_prefix')}{' '}
          <span className="relative inline-block px-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-[length:300%_auto] animate-gradient-deluxe drop-shadow-lg text-glow-md holographic-text">
              {t('hero.title_highlight')}
            </span>
            {/* Animated underline with glow */}
            <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 400 24" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
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

        {/* Transcendent CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 animate-zoom-fade" style={{ animationDelay: '0.3s' }}>
          <MagneticButton onClick={() => setCurrentPage('preise')} variant="primary" className="text-lg btn-legendary btn-holographic">
            <span>Projekt starten</span>
            <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-125" />
          </MagneticButton>
          <MagneticButton onClick={() => setCurrentPage('projekte')} variant="secondary" className="group text-lg px-10 py-5 hover:shadow-legendary-lg hover:shadow-blue-500/20 hover-shine-effect">
            <span className="flex items-center gap-3">
              Beispiele ansehen
              <ArrowRightIcon className="w-5 h-5 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
            </span>
          </MagneticButton>
        </div>

        {/* Enhanced guarantees with transcendent styling */}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5 text-sm text-slate-600 dark:text-slate-500 animate-zoom-fade" style={{ animationDelay: '0.4s' }}>
          {guarantees.map((g, i) => (
            <TiltCard key={i} className="inline-block" intensity={12} glowColor="rgba(59, 130, 246, 0.2)">
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl hover:bg-slate-100/95 dark:hover:bg-slate-700/85 transition-all duration-500 cursor-default border-2 border-slate-200/70 dark:border-slate-700/60 hover:border-blue-400/70 dark:hover:border-violet-600/70 hover:shadow-legendary hover:shadow-blue-500/20 group hover-3d-lift relative overflow-hidden">
                {/* Holographic shimmer */}
                <div className="absolute inset-0 shimmer-holographic opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>

                {/* Gradient glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-violet-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-deluxe"></div>

                <span
                  className="text-2xl filter drop-shadow-md animate-float-deluxe hover:animate-elastic-bounce relative z-10"
                  style={{
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${4 + i * 0.5}s`,
                  }}
                >
                  {g.icon}
                </span>
                <span className="font-bold tracking-wide group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors relative z-10">{g.text}</span>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Transcendent price hint */}
        <TiltCard className="mt-14 inline-block animate-zoom-fade" intensity={10} glowColor="rgba(139, 92, 246, 0.2)">
          <div className="relative flex items-center gap-6 px-10 py-5 rounded-3xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/70 dark:border-slate-700/60 shadow-2xl shadow-slate-200/60 dark:shadow-black/40 hover:shadow-3xl hover:shadow-blue-500/20 dark:hover:shadow-violet-500/15 transition-all duration-500 group overflow-hidden holographic-base hover:shadow-glow-legendary-md" style={{ animationDelay: '0.5s' }}>
            {/* Shimmer overlay */}
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            {/* Shimmer holographic */}
            <div className="absolute inset-0 shimmer-holographic opacity-0 group-hover:opacity-50 transition-opacity duration-700"></div>

            {/* Animated gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-violet-500/15 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-deluxe"></div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-tl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-violet-500/20 to-transparent rounded-br-3xl"></div>

            <div className="flex items-center gap-2 relative z-10">
              <span className="text-slate-400 dark:text-slate-500 line-through text-lg">99€ - 299€</span>
              <ArrowRightIcon className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-deluxe text-glow-sm drop-shadow-lg holographic-text">
                29€
              </span>
            </div>
            <div className="w-px h-10 bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 relative z-10"></div>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold tracking-wide relative z-10">Startpreis</span>
          </div>
        </TiltCard>
      </div>

      {/* =========================================== */}
      {/* TRANSCENDENT BOTTOM FADE */}
      {/* =========================================== */}
      <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-slate-950 dark:via-slate-950/95 to-transparent pointer-events-none"></div>

      {/* =========================================== */}
      {/* TRANSCENDENT SCROLL INDICATOR */}
      {/* =========================================== */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          {/* Legendary pulsing glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 via-violet-500/40 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-glow-breathe"></div>

          {/* Extra glow ring */}
          <div className="absolute -inset-2 rounded-full border border-blue-400/20 dark:border-violet-500/20 animate-pulse-ring opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Container with legendary effects */}
          <div className="relative w-8 h-14 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-start justify-center p-2 group-hover:border-blue-400 dark:group-hover:border-violet-500 transition-all duration-500 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-legendary group-hover:shadow-glow-legendary-sm hover:scale-110 transition-transform">
            {/* Animated dot */}
            <div className="w-2 h-4 rounded-full bg-gradient-to-b from-blue-500 to-violet-500 animate-scroll-indicator shadow-glow-legendary-sm"></div>
          </div>

          {/* Scroll hint text */}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium">
            Scroll
          </span>
        </div>
      </div>

      {/* Transcendent floating decorative elements */}
      <div className="absolute top-1/4 left-10 w-3 h-3 bg-blue-500/40 rounded-full animate-float-deluxe shadow-glow-legendary-sm animate-stardust" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-1/3 right-16 w-2 h-2 bg-violet-500/30 rounded-full animate-float-deluxe animate-magnetic-field" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/3 left-20 w-2.5 h-2.5 bg-emerald-500/30 rounded-full animate-float-deluxe shadow-glow-legendary-sm" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-2/3 right-24 w-2 h-2 bg-pink-500/30 rounded-full animate-float-deluxe animate-quantum-fluctuation" style={{ animationDelay: '1s' }}></div>

      {/* Extra holographic orbs */}
      <div className="absolute top-[15%] left-[20%] w-2 h-2 bg-cyan-400/30 rounded-full animate-float-deluxe glow-cyan" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-[25%] right-[10%] w-1.5 h-1.5 bg-rose-400/30 rounded-full animate-float-deluxe glow-rose" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-[60%] left-[8%] w-1.5 h-1.5 bg-amber-400/30 rounded-full animate-float-deluxe glow-amber" style={{ animationDelay: '3s' }}></div>
    </section>
  );
};
