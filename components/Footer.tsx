
import React from 'react';
import { ReactIcon, ScaleSiteLogo, GitHubIcon, InstagramIcon, DiscordIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

const FooterLink: React.FC<{page: string; setCurrentPage: (page: string) => void; children: React.ReactNode;}> = ({ page, setCurrentPage, children }) => (
    <li>
        <button onClick={() => setCurrentPage(page)} className="text-sm text-slate-600 dark:text-slate-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-violet-600 dark:hover:text-white transition-all duration-300 text-left relative group py-1 btn-micro-press">
            <span className="relative z-10 flex items-center gap-2">
                {children}
                <svg className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </span>
            {/* Enhanced animated underline with glow */}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 group-hover:w-full transition-all duration-300 rounded-full shadow-lg shadow-blue-500/50"></span>
            {/* Hover glow */}
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
        </button>
    </li>
);

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-950 dark:to-slate-950/80 pt-28 pb-16 overflow-hidden">
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none noise-bg"></div>

      {/* Enhanced gradient accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/80 via-violet-500/80 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-transparent via-blue-400/40 via-violet-400/40 to-transparent blur-md"></div>

      {/* Animated gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent animate-shimmer opacity-70"></div>

      {/* Enhanced dot pattern background */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1.5px, transparent 1.5px)',
          backgroundSize: '40px 40px',
          animation: 'grid-pan 120s linear infinite'
        }}></div>
      </div>

      {/* Enhanced decorative gradient background with morphing blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 via-violet-500/8 to-indigo-500/6 rounded-full blur-3xl animate-morph-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/8 via-purple-500/6 to-pink-500/4 rounded-full blur-3xl animate-morph-blob" style={{ animationDelay: '5s' }}></div>
        <div className="absolute top-20 left-1/3 w-[300px] h-[300px] bg-gradient-to-br from-blue-400/8 to-cyan-400/6 rounded-full blur-3xl animate-morph-blob" style={{ animationDelay: '2.5s' }}></div>
      </div>

      {/* Floating orbs with enhanced animations */}
      <div className="absolute top-24 right-[8%] w-2.5 h-2.5 bg-blue-500/40 rounded-full animate-parallax-float shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ animationDuration: '6s' }}></div>
      <div className="absolute top-36 right-[12%] w-2 h-2 bg-violet-500/30 rounded-full animate-parallax-float shadow-[0_0_15px_rgba(139,92,246,0.5)]" style={{ animationDuration: '7s', animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-40 left-[12%] w-2.5 h-2.5 bg-violet-500/40 rounded-full animate-parallax-float shadow-[0_0_15px_rgba(139,92,246,0.5)]" style={{ animationDuration: '8s', animationDelay: '3s' }}></div>
      <div className="absolute bottom-56 left-[18%] w-2 h-2 bg-blue-500/30 rounded-full animate-parallax-float shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ animationDuration: '7s', animationDelay: '0.5s' }}></div>

      {/* Animated gradient mesh overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.03] to-violet-500/[0.02] to-transparent opacity-70 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10 mb-20">

            {/* Enhanced Brand Column */}
            <div className="lg:col-span-4 pr-4">
                <button onClick={() => setCurrentPage('home')} className="text-slate-900 dark:text-white mb-10 block group">
                    <ScaleSiteLogo className="h-10 transition-all duration-500 group-hover:scale-105 group-hover:-rotate-3" />
                </button>
                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed-plus mb-12 max-w-sm">
                    {t('footer.description')}
                </p>

                {/* Enhanced social links with better hover effects */}
                <div className="flex gap-3">
                     <a href="https://www.instagram.com/scalesite_app" target="_blank" rel="noopener noreferrer" className="group/social relative w-12 h-12 flex items-center justify-center border border-slate-200/80 dark:border-slate-700/60 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-500 dark:text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1 overflow-hidden hover:shadow-xl hover:shadow-pink-500/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-0 group-hover/social:opacity-100 transition-opacity duration-300"></div>
                        <span className="absolute inset-0 shimmer-sweep opacity-0 group-hover/social:opacity-30 transition-opacity duration-300"></span>
                        <span className="relative z-10 group-hover/social:text-white transition-colors duration-300 group-hover/social:scale-110">
                            <InstagramIcon />
                        </span>
                     </a>
                     <a href="https://discord.gg/65a4PygTJ3" target="_blank" rel="noopener noreferrer" className="group/social relative w-12 h-12 flex items-center justify-center border border-slate-200/80 dark:border-slate-700/60 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-500 dark:text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/30">
                        <div className="absolute inset-0 bg-[#5865F2] opacity-0 group-hover/social:opacity-100 transition-opacity duration-300"></div>
                        <span className="absolute inset-0 shimmer-sweep opacity-0 group-hover/social:opacity-30 transition-opacity duration-300"></span>
                        <span className="relative z-10 group-hover/social:text-white transition-colors duration-300 group-hover/social:scale-110">
                            <DiscordIcon />
                        </span>
                     </a>
                     <a href="#" className="group/social relative w-12 h-12 flex items-center justify-center border border-slate-200/80 dark:border-slate-700/60 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-500 dark:text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1 overflow-hidden hover:shadow-xl hover:shadow-blue-500/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-violet-600 opacity-0 group-hover/social:opacity-100 transition-opacity duration-300"></div>
                        <span className="absolute inset-0 shimmer-sweep opacity-0 group-hover/social:opacity-30 transition-opacity duration-300"></span>
                        <span className="relative z-10 group-hover/social:text-white transition-colors duration-300 group-hover/social:scale-110">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </span>
                     </a>
                     <a href="#" className="group/social relative w-12 h-12 flex items-center justify-center border border-slate-200/80 dark:border-slate-700/60 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-500 dark:text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1 overflow-hidden hover:shadow-xl hover:shadow-slate-900/30">
                        <div className="absolute inset-0 bg-slate-900 dark:bg-white opacity-0 group-hover/social:opacity-100 transition-opacity duration-300"></div>
                        <span className="absolute inset-0 shimmer-sweep opacity-0 group-hover/social:opacity-30 transition-opacity duration-300"></span>
                        <span className="relative z-10 group-hover/social:text-white dark:group-hover/social:text-slate-900 transition-colors duration-300 group-hover/social:scale-110">
                            <GitHubIcon />
                        </span>
                     </a>
                </div>
            </div>

            {/* Enhanced Links Columns with better spacing */}
            <div className="lg:col-span-3">
                <h3 className="font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-8 text-sm uppercase tracking-wider-plus">
                    {t('footer.company')}
                </h3>
                <ul className="space-y-6">
                    <FooterLink page="contact" setCurrentPage={setCurrentPage}>{t('nav.contact')}</FooterLink>
                    <FooterLink page="projekte" setCurrentPage={setCurrentPage}>{t('nav.projects')}</FooterLink>
                    <FooterLink page="faq" setCurrentPage={setCurrentPage}>{t('nav.faq')}</FooterLink>
                </ul>
            </div>

             <div className="lg:col-span-3">
                <h3 className="font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-8 text-sm uppercase tracking-wider-plus">
                    {t('footer.services')}
                </h3>
                <ul className="space-y-6">
                    <FooterLink page="leistungen" setCurrentPage={setCurrentPage}>{t('footer.webdesign')}</FooterLink>
                    <FooterLink page="automationen" setCurrentPage={setCurrentPage}>{t('footer.automation')}</FooterLink>
                    <FooterLink page="preise" setCurrentPage={setCurrentPage}>{t('nav.pricing')}</FooterLink>
                </ul>
            </div>

             <div className="lg:col-span-3">
                <h3 className="font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-8 text-sm uppercase tracking-wider-plus">
                    {t('footer.legal')}
                </h3>
                <ul className="space-y-6">
                    <FooterLink page="impressum" setCurrentPage={setCurrentPage}>{t('footer.imprint')}</FooterLink>
                    <FooterLink page="datenschutz" setCurrentPage={setCurrentPage}>{t('footer.privacy')}</FooterLink>
                    <FooterLink page="login" setCurrentPage={setCurrentPage}>{t('nav.login')}</FooterLink>
                </ul>
            </div>
        </div>

        {/* Enhanced copyright section */}
        <div className="pt-12 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-3">
                <span>&copy; {new Date().getFullYear()} ScaleSite.</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span>{t('footer.rights')}</span>
            </p>

             {/* Enhanced tech stack badge */}
             <div className="group flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm px-7 py-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 shadow-premium hover:shadow-premium-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <span className="relative z-10">{t('footer.built_with')}</span>
                <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 relative z-10"></div>
                <ReactIcon className="w-5 h-5 text-blue-500 animate-spin-slow relative z-10 group-hover:animate-icon-bounce" />
                <span className="font-medium text-slate-700 dark:text-slate-300 relative z-10">React & TypeScript</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-shimmer"></div>
                <div className="absolute inset-0 shimmer-sweep opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
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
      `}</style>
    </footer>
  );
};
