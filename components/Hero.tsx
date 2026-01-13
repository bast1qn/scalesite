import { useEffect, useState, useRef, type ReactNode, type MouseEvent } from 'react';
import { ArrowRightIcon } from './Icons';
import { useLanguage } from '../contexts';

interface HeroProps {
  setCurrentPage: (page: string) => void;
}

const guarantees = [
  { text: '48h Lieferung', icon: 'lightning' },
  { text: '30 Tage Geld-zurück', icon: 'shield' },
  { text: 'Alles inklusive', icon: 'sparkle' },
];

// Icons for guarantees
const GuaranteeIcons = {
  lightning: () => (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  shield: () => (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  sparkle: () => (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
};

// Refined floating particle
const FloatingParticle = ({
  delay,
  duration,
  left,
  size,
  opacity,
}: {
  delay: number;
  duration: number;
  left: string;
  size: string;
  opacity: number;
}) => {
  return (
    <div
      className="absolute rounded-full bg-primary-500/15 dark:bg-primary-400/10 pointer-events-none"
      style={{
        left,
        width: size,
        height: size,
        opacity,
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
};

// Refined card with subtle spotlight
const SpotlightCard = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setGlowPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Refined spotlight effect */}
      <div
        className="absolute inset-0 rounded-inherit opacity-0 transition-opacity duration-350 pointer-events-none"
        style={{
          background: `radial-gradient(350px circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(75, 90, 237, 0.06), transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {children}
    </div>
  );
};

// Refined button with consistent interactive states
const CleanButton = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}) => {
  const baseStyle = variant === 'primary'
    ? 'relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-violet-600 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95 focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed'
    : 'px-8 py-4 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-violet-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export const Hero = ({ setCurrentPage }: HeroProps) => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Refined background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary-50/20 dark:from-[#030305] dark:via-slate-950 dark:to-violet-950/10"></div>

      {/* Refined gradient orbs with blob animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary orb - top left */}
        <div
          className="absolute top-[8%] left-[-5%] w-[700px] h-[700px] bg-gradient-to-br from-primary-500/12 to-violet-500/8 rounded-full blur-3xl"
          style={{ animation: 'blob 12s ease-in-out infinite' }}
        ></div>

        {/* Secondary orb - bottom right */}
        <div
          className="absolute bottom-[5%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-violet-500/10 to-primary-500/6 rounded-full blur-3xl"
          style={{ animation: 'blob 14s ease-in-out infinite', animationDelay: '3s' }}
        ></div>

        {/* Accent orb - center */}
        <div
          className="absolute top-[45%] left-[25%] w-[500px] h-[500px] bg-gradient-to-br from-primary-400/8 to-violet-400/6 rounded-full blur-3xl"
          style={{ animation: 'blob 16s ease-in-out infinite', animationDelay: '6s' }}
        ></div>
      </div>

      {/* Refined particle system */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingParticle delay={0} duration={10} left="3%" size="5px" opacity={0.25} />
        <FloatingParticle delay={1} duration={12} left="12%" size="4px" opacity={0.2} />
        <FloatingParticle delay={2} duration={11} left="22%" size="6px" opacity={0.18} />
        <FloatingParticle delay={3} duration={13} left="32%" size="4px" opacity={0.22} />
        <FloatingParticle delay={4} duration={10} left="42%" size="5px" opacity={0.2} />
        <FloatingParticle delay={5} duration={12} left="52%" size="4px" opacity={0.18} />
        <FloatingParticle delay={6} duration={11} left="62%" size="6px" opacity={0.25} />
        <FloatingParticle delay={7} duration={13} left="72%" size="5px" opacity={0.2} />
        <FloatingParticle delay={8} duration={10} left="82%" size="4px" opacity={0.22} />
        <FloatingParticle delay={9} duration={12} left="92%" size="5px" opacity={0.18} />
      </div>

      {/* Refined dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      ></div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <SpotlightCard className={`inline-block mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/40 shadow-premium hover:shadow-premium-lg transition-shadow duration-350">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('hero.guarantee_badge')}
            </span>
          </div>
        </SpotlightCard>

        {/* Headline */}
        <h1
          className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-slate-900 dark:text-white leading-tight mb-8 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '100ms' }}
        >
          {t('hero.title_prefix')}{' '}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600">
              {t('hero.title_highlight')}
            </span>
            {/* Refined underline */}
            <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 400 20" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path
                d="M0 12C100 2 300 2 400 10"
                stroke="url(#hero-underline)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <defs>
                <linearGradient id="hero-underline" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4b5aed" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.7" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-12 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '200ms' }}
        >
          {t('hero.subtitle')}
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '300ms' }}
        >
          <CleanButton onClick={() => setCurrentPage('preise')} variant="primary">
            <span className="flex items-center gap-2.5">
              <span>Projekt starten</span>
              <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </CleanButton>
          <CleanButton onClick={() => setCurrentPage('projekte')} variant="secondary">
            <span className="flex items-center gap-2.5">
              <span>Beispiele ansehen</span>
              <ArrowRightIcon className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </span>
          </CleanButton>
        </div>

        {/* Guarantees */}
        <div
          className={`flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-500 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '400ms' }}
        >
          {guarantees.map((g, i) => (
            <SpotlightCard key={i} className="inline-block">
              <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/40 hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:border-primary-300/60 dark:hover:border-violet-500/60 transition-all duration-300 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-primary-500/50 cursor-pointer min-h-11 sm:min-h-0">
                <span className="text-primary-500 dark:text-violet-400">
                  {GuaranteeIcons[g.icon as keyof typeof GuaranteeIcons]()}
                </span>
                <span className="font-medium">{g.text}</span>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* Price hint */}
        <SpotlightCard
          className={`mt-14 inline-block transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '500ms' }}
        >
          <div className="flex items-center gap-6 px-8 py-4 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/40 shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 dark:text-slate-500 line-through text-base">99€ - 299€</span>
              <ArrowRightIcon className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600">
                29€
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Startpreis</span>
          </div>
        </SpotlightCard>
      </div>

      {/* Bottom fade - refined */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#030305] dark:via-slate-950/90 to-transparent pointer-events-none"></div>

      {/* Scroll indicator - refined */}
      <div
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ transitionDelay: '600ms' }}
      >
        <div
          className="group cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="relative w-7 h-12 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-start justify-center p-2.5 group-hover:border-primary-400 dark:group-hover:border-violet-500 transition-colors duration-350 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
            <div className="w-1.5 h-3 rounded-full bg-slate-400 dark:bg-slate-500 group-hover:bg-primary-500 dark:group-hover:bg-violet-400 transition-colors duration-350 animate-bounce" style={{ animationDuration: '2.5s' }}></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(1deg);
          }
        }
      `}</style>
    </section>
  );
};
