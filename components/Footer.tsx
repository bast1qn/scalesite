
import React, { useState } from 'react';
import { ReactIcon, ScaleSiteLogo, GitHubIcon, InstagramIcon, DiscordIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

// Transcendent footer link with holographic effects
const FooterLink: React.FC<{page: string; setCurrentPage: (page: string) => void; children: React.ReactNode; index?: number;}> = ({ page, setCurrentPage, children, index = 0 }) => {
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e: ReactMouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setGlowPos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    return (
        <li>
            <button
                onClick={() => setCurrentPage(page)}
                onMouseMove={handleMouseMove}
                className="relative text-sm text-slate-600 dark:text-slate-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:via-violet-600 hover:to-cyan-600 dark:hover:text-white transition-all duration-300 text-left group py-1.5 btn-micro-press overflow-hidden"
                style={{ transitionDelay: `${index * 50}ms` }}
            >
                {/* Dynamic glow following cursor */}
                <span
                    className="absolute inset-0 rounded-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    style={{
                        background: `radial-gradient(200px circle at ${glowPos.x}% ${glowPos.y}%, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.1), transparent 60%)`,
                    }}
                ></span>
                {/* Holographic overlay */}
                <span className="absolute inset-0 holographic-base opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg"></span>

                <span className="relative z-10 flex items-center gap-2">
                    {children}
                    <svg className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 group-hover:scale-125 group-hover:text-blue-500 dark:group-hover:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
                {/* Transcendent animated underline with legendary glow */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 group-hover:w-full transition-all duration-500 rounded-full shadow-glow-legendary-sm animate-gradient-deluxe"></span>
                {/* Corner accents */}
                <span className="absolute top-0 left-0 w-0 h-0 border-t border-l border-blue-400/0 group-hover:border-blue-400/60 dark:group-hover:border-cyan-400/60 transition-all duration-300 rounded-tl-sm"></span>
                <span className="absolute bottom-0 right-0 w-0 h-0 border-b border-r border-violet-400/0 group-hover:border-violet-400/60 dark:group-hover:border-violet-400/60 transition-all duration-300 rounded-br-sm"></span>
            </button>
        </li>
    );
};

// Transcendent social icon button with particle effects
const SocialIconButton: React.FC<{
    href: string;
    children: React.ReactNode;
    gradient?: string;
    shadowColor?: string;
    ariaLabel?: string;
}> = ({ href, children, gradient = 'from-blue-600 to-violet-600', shadowColor = 'blue', ariaLabel }) => {
    const [particles, setParticles] = useState<Array<{x: number; y: number; id: number}>>([]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const newParticles = Array.from({ length: 8 }, (_, i) => ({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            id: Date.now() + i,
        }));
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 1000);
    };

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="group/social relative w-12 h-12 flex items-center justify-center border-2 border-slate-200/80 dark:border-slate-700/60 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-slate-500 dark:text-slate-400 transition-all duration-500 hover:scale-110 hover:-translate-y-1 overflow-hidden hover:shadow-glow-legendary-lg hover:shadow-${shadowColor}-500/40"
            aria-label={ariaLabel}
        >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover/social:opacity-100 transition-opacity duration-300 animate-gradient-deluxe`}></div>
            {/* Holographic overlay */}
            <div className="absolute inset-0 holographic-base opacity-0 group-hover/social:opacity-30 transition-opacity duration-500"></div>
            {/* Shimmer effect */}
            <span className="absolute inset-0 shimmer-sweep opacity-0 group-hover/social:opacity-50 transition-opacity duration-300"></span>
            {/* Particle burst on click */}
            {particles.map(p => (
                <span
                    key={p.id}
                    className="absolute w-1 h-1 rounded-full bg-white/80 animate-particle-burst pointer-events-none"
                    style={{
                        left: p.x,
                        top: p.y,
                        transform: `translate(-50%, -50%)`,
                    }}
                ></span>
            ))}
            {/* Corner accents */}
            <span className="absolute top-1 left-1 w-1.5 h-1.5 bg-white/40 rounded-full opacity-0 group-hover/social:opacity-100 group-hover/social:animate-ping-slow transition-opacity duration-300"></span>
            <span className="absolute bottom-1 right-1 w-1 h-1 bg-white/30 rounded-full opacity-0 group-hover/social:opacity-100 transition-opacity duration-300" style={{ transitionDelay: '0.2s' }}></span>
            <span className="relative z-10 group-hover/social:text-white transition-colors duration-300 group-hover/social:scale-125 group-hover/social:rotate-12">
                {children}
            </span>
        </a>
    );
};

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-gradient-to-b from-slate-50 via-slate-100/80 to-slate-100/50 dark:from-slate-950 dark:via-slate-950/90 dark:to-slate-950/80 pt-28 pb-16 overflow-hidden">
      {/* COSMIC BACKGROUND EFFECTS */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none noise-bg noise-bg-animated"></div>

      {/* COSMIC GRADIENT ACCENT LINE AT TOP */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-transparent via-blue-500/95 via-violet-500/95 via-cyan-500/80 to-transparent animate-gradient-flow"></div>
      <div className="absolute top-0 left-0 right-0 h-[12px] bg-gradient-to-r from-transparent via-blue-400/60 via-violet-400/60 to-transparent blur-xl animate-aurora-wave"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[4px] bg-gradient-to-r from-transparent via-cyan-400 via-violet-400 to-transparent animate-gradient-deluxe opacity-90"></div>

      {/* COSMIC AURORA LEGENDARY OVERLAY */}
      <div className="absolute inset-0 bg-aurora-gradient animate-aurora-wave opacity-30 pointer-events-none"></div>

      {/* COSMIC NEBULA OVERLAY */}
      <div className="absolute inset-0 animate-nebula-cloud opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 20% 80%, rgba(138, 43, 226, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59, 130, 246, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
          animationDuration: '35s',
        }}
      ></div>

      {/* HOLOGRAPHIC OVERLAY */}
      <div className="absolute inset-0 holographic-base opacity-15 pointer-events-none animate-holographic-shimmer"></div>

      {/* Enhanced dot pattern background */}
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none animate-starfield">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 2px, transparent 2px)',
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      {/* COSMIC DECORATIVE GRADIENT BACKGROUND WITH MORPHING BLOBS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[1000px] h-[1000px] bg-gradient-to-br from-blue-500/18 via-violet-500/15 via-cyan-500/12 to-indigo-500/10 rounded-full blur-3xl animate-nebula-cloud shadow-glow-cosmic"></div>
        <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-gradient-to-br from-violet-500/15 via-purple-500/12 via-pink-500/10 to-rose-500/8 rounded-full blur-3xl animate-nebula-cloud shadow-glow-nebula" style={{ animationDelay: '8s' }}></div>
        <div className="absolute top-10 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/15 to-cyan-400/12 rounded-full blur-3xl animate-antigravity shadow-glow-aurora" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-20 right-1/3 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/12 to-teal-400/10 rounded-full blur-3xl animate-antigravity shadow-glow-cyan" style={{ animationDelay: '5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-rose-400/10 to-pink-400/8 rounded-full blur-3xl animate-nebula-cloud shadow-glow-plasma" style={{ animationDelay: '10s' }}></div>

        {/* Additional cosmic orbs */}
        <div className="absolute bottom-20 left-[10%] w-[400px] h-[400px] bg-gradient-to-br from-fuchsia-400/12 to-pink-400/10 rounded-full blur-3xl animate-quantum-shift" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 right-[10%] w-[350px] h-[350px] bg-gradient-to-br from-cyan-400/12 to-blue-400/10 rounded-full blur-3xl animate-magnetic-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* COSMIC FLOATING ORBS WITH LEGENDARY ANIMATIONS */}
      <div className="absolute top-24 right-[8%] w-3 h-3 bg-blue-500/70 rounded-full animate-antigravity glow-cyan shadow-glow-cosmic-sm" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-36 right-[12%] w-2.5 h-2.5 bg-violet-500/60 rounded-full animate-antigravity glow-violet shadow-glow-cosmic-sm" style={{ animationDuration: '9s', animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-[12%] w-3 h-3 bg-cyan-500/70 rounded-full animate-antigravity glow-cyan shadow-glow-cosmic-sm" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
      <div className="absolute bottom-56 left-[18%] w-2.5 h-2.5 bg-blue-500/60 rounded-full animate-antigravity glow-blue shadow-glow-cosmic-sm" style={{ animationDuration: '9s', animationDelay: '3s' }}></div>
      <div className="absolute top-48 left-[8%] w-2 h-2 bg-emerald-500/60 rounded-full animate-antigravity glow-emerald shadow-glow-cosmic-sm" style={{ animationDuration: '7s', animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-32 right-[15%] w-2.5 h-2.5 bg-pink-500/60 rounded-full animate-antigravity glow-rose shadow-glow-cosmic-sm" style={{ animationDuration: '8s', animationDelay: '4s' }}></div>
      <div className="absolute top-1/3 right-[20%] w-2 h-2 bg-amber-500/50 rounded-full animate-antigravity glow-amber shadow-glow-cosmic-sm" style={{ animationDuration: '11s', animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-1/4 left-[20%] w-2 h-2 bg-rose-500/50 rounded-full animate-antigravity glow-rose shadow-glow-cosmic-sm" style={{ animationDuration: '12s', animationDelay: '5s' }}></div>

      {/* GALAXY FLOATING PARTICLES */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full animate-antigravity shadow-glow-cosmic-sm"
          style={{
            left: `${5 + Math.random() * 90}%`,
            bottom: `${Math.random() * 50}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
            background: Math.random() > 0.6
              ? 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)'
              : Math.random() > 0.3
              ? 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, transparent 70%)',
            boxShadow: `0 0 ${6 + Math.random() * 8}px ${Math.random() > 0.6 ? 'rgba(59, 130, 246, 0.6)' : Math.random() > 0.3 ? 'rgba(139, 92, 246, 0.6)' : 'rgba(236, 72, 153, 0.6)'}`,
          }}
        ></div>
      ))}

      {/* COSMIC STARDUST FIELD */}
      <div className="absolute inset-0 stardust-field opacity-50 pointer-events-none"></div>

      {/* Gradient mesh overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.1] via-violet-500/[0.08] via-cyan-500/[0.05] to-transparent opacity-90 pointer-events-none animate-cosmic-shimmer"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10 mb-20">

            {/* Transcendent Brand Column */}
            <div className="lg:col-span-4 pr-4">
                <button
                    onClick={() => setCurrentPage('home')}
                    className="text-slate-900 dark:text-white mb-10 block group relative"
                >
                    {/* Multi-layer glow effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-violet-500/30 to-cyan-500/0 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow"></div>
                    <div className="absolute inset-0 holographic-base opacity-0 group-hover:opacity-30 rounded-full blur-xl transition-opacity duration-500"></div>
                    {/* Corner sparkles */}
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping-slow transition-opacity duration-300 shadow-glow-legendary-sm"></span>
                    <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping-slow transition-opacity duration-300 shadow-glow-legendary-sm" style={{ animationDelay: '0.3s' }}></span>
                    <ScaleSiteLogo className="h-10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 relative z-10" />
                </button>
                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed-plus mb-12 max-w-sm">
                    {t('footer.description')}
                </p>

                {/* Transcendent social links with legendary hover effects */}
                <div className="flex gap-3">
                     <SocialIconButton
                        href="https://www.instagram.com/scalesite_app"
                        gradient="from-purple-500 via-pink-500 to-orange-500"
                        shadowColor="pink"
                        ariaLabel="Instagram"
                     >
                        <InstagramIcon />
                     </SocialIconButton>
                     <SocialIconButton
                        href="https://discord.gg/65a4PygTJ3"
                        gradient="from-[#5865F2] to-[#7289da]"
                        shadowColor="indigo"
                        ariaLabel="Discord"
                     >
                        <DiscordIcon />
                     </SocialIconButton>
                     <SocialIconButton
                        href="#"
                        gradient="from-blue-600 via-violet-600 to-cyan-600"
                        shadowColor="blue"
                        ariaLabel="LinkedIn"
                     >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                     </SocialIconButton>
                     <SocialIconButton
                        href="#"
                        gradient="from-slate-900 to-slate-700 dark:from-white dark:to-slate-300"
                        shadowColor="slate"
                        ariaLabel="GitHub"
                     >
                        <GitHubIcon />
                     </SocialIconButton>
                </div>
            </div>

            {/* Enhanced Links Columns with transcendent effects */}
            <div className="lg:col-span-3">
                <h3 className="font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 dark:from-blue-400 dark:via-violet-400 dark:to-cyan-400 mb-8 text-sm uppercase tracking-wider-plus animate-gradient-deluxe">
                    {t('footer.company')}
                </h3>
                <ul className="space-y-6">
                    <FooterLink page="contact" setCurrentPage={setCurrentPage} index={0}>{t('nav.contact')}</FooterLink>
                    <FooterLink page="projekte" setCurrentPage={setCurrentPage} index={1}>{t('nav.projects')}</FooterLink>
                    <FooterLink page="faq" setCurrentPage={setCurrentPage} index={2}>{t('nav.faq')}</FooterLink>
                </ul>
            </div>

             <div className="lg:col-span-3">
                <h3 className="font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 dark:from-blue-400 dark:via-violet-400 dark:to-cyan-400 mb-8 text-sm uppercase tracking-wider-plus animate-gradient-deluxe">
                    {t('footer.services')}
                </h3>
                <ul className="space-y-6">
                    <FooterLink page="leistungen" setCurrentPage={setCurrentPage} index={0}>{t('footer.webdesign')}</FooterLink>
                    <FooterLink page="automationen" setCurrentPage={setCurrentPage} index={1}>{t('footer.automation')}</FooterLink>
                    <FooterLink page="preise" setCurrentPage={setCurrentPage} index={2}>{t('nav.pricing')}</FooterLink>
                </ul>
            </div>

             <div className="lg:col-span-3">
                <h3 className="font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 dark:from-blue-400 dark:via-violet-400 dark:to-cyan-400 mb-8 text-sm uppercase tracking-wider-plus animate-gradient-deluxe">
                    {t('footer.legal')}
                </h3>
                <ul className="space-y-6">
                    <FooterLink page="impressum" setCurrentPage={setCurrentPage} index={0}>{t('footer.imprint')}</FooterLink>
                    <FooterLink page="datenschutz" setCurrentPage={setCurrentPage} index={1}>{t('footer.privacy')}</FooterLink>
                    <FooterLink page="login" setCurrentPage={setCurrentPage} index={2}>{t('nav.login')}</FooterLink>
                </ul>
            </div>
        </div>

        {/* Transcendent copyright section */}
        <div className="pt-12 border-t-2 border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-3">
                <span>&copy; {new Date().getFullYear()} ScaleSite.</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-violet-400 animate-pulse shadow-glow-legendary-sm"></span>
                <span>{t('footer.rights')}</span>
            </p>

             {/* Transcendent tech stack badge */}
             <div className="group flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm px-8 py-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl border-2 border-slate-200/70 dark:border-slate-700/60 shadow-legendary hover:shadow-glow-legendary-md hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 relative overflow-hidden btn-holographic">
                <span className="relative z-10">{t('footer.built_with')}</span>
                <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 relative z-10"></div>
                <ReactIcon className="w-5 h-5 text-blue-500 animate-spin-slow relative z-10 group-hover:animate-icon-bounce group-hover:text-violet-500 transition-colors duration-300" />
                <span className="font-medium text-slate-700 dark:text-slate-300 relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-violet-600 transition-all duration-300">React & TypeScript</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-deluxe"></div>
                <div className="absolute inset-0 shimmer-sweep opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="absolute inset-0 holographic-base opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl"></div>
                {/* Corner accents */}
                <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-400/0 group-hover:border-blue-400/60 rounded-tl-lg transition-all duration-300"></span>
                <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-violet-400/0 group-hover:border-violet-400/60 rounded-br-lg transition-all duration-300"></span>
            </div>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes particle-burst {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx, -50%), var(--ty, -50%)) scale(0);
            opacity: 0;
          }
        }
        .animate-particle-burst {
          animation: particle-burst 0.8s ease-out forwards;
        }
      `}</style>
    </footer>
  );
};
