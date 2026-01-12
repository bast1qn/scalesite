
import React from 'react';
import { ReactIcon, ScaleSiteLogo, GitHubIcon, InstagramIcon, DiscordIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

const FooterLink: React.FC<{page: string; setCurrentPage: (page: string) => void; children: React.ReactNode;}> = ({ page, setCurrentPage, children }) => (
    <li>
        <button onClick={() => setCurrentPage(page)} className="link-premium text-sm text-slate-600 dark:text-slate-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-violet-600 dark:hover:text-white transition-all duration-200 text-left relative group">
            <span className="relative z-10 flex items-center gap-2">
                {children}
                <svg className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </span>
        </button>
    </li>
);

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-slate-50 dark:bg-slate-950 pt-24 pb-12 overflow-hidden">
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] pointer-events-none noise-bg"></div>

      {/* Enhanced gradient accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 via-violet-500 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-blue-400/50 via-violet-400/50 to-transparent blur-sm"></div>

      {/* Animated gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent animate-shimmer"></div>

      {/* Enhanced dot pattern background */}
      <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          animation: 'grid-pan 120s linear infinite'
        }}></div>
      </div>

      {/* Enhanced decorative gradient background with morphing blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/15 to-violet-400/10 rounded-full blur-3xl animate-morph-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-400/12 to-indigo-400/8 rounded-full blur-3xl animate-morph-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating orbs with enhanced animations */}
      <div className="absolute top-20 right-[10%] w-2 h-2 bg-blue-500/50 rounded-full animate-float" style={{ animationDuration: '4s' }}></div>
      <div className="absolute top-32 right-[15%] w-1.5 h-1.5 bg-violet-500/40 rounded-full animate-float" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-[15%] w-2 h-2 bg-violet-500/50 rounded-full animate-float" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
      <div className="absolute bottom-48 left-[20%] w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-float" style={{ animationDuration: '5s', animationDelay: '0.5s' }}></div>

      {/* Animated gradient mesh overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

            {/* Enhanced Brand Column */}
            <div className="lg:col-span-4 pr-8">
                <button onClick={() => setCurrentPage('home')} className="text-slate-900 dark:text-white mb-8 block group">
                    <ScaleSiteLogo className="h-9 transition-transform duration-300 group-hover:scale-105" />
                </button>
                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-10 max-w-sm">
                    {t('footer.description')}
                </p>

                {/* Enhanced social links with better hover effects */}
                <div className="flex gap-3">
                     <a href="https://www.instagram.com/scalesite_app" target="_blank" rel="noopener noreferrer" className="group/social relative w-12 h-12 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-slate-500 dark:text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-0 group-hover/social:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 group-hover/social:text-white transition-colors duration-300">
                            <InstagramIcon />
                        </span>
                        <span className="absolute inset-0 rounded-xl opacity-0 group-hover/social:opacity-100 transition-opacity duration-300" style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}></span>
                     </a>
                     <a href="https://discord.gg/65a4PygTJ3" target="_blank" rel="noopener noreferrer" className="group/social relative w-12 h-12 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-slate-500 dark:text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute inset-0 bg-[#5865F2] opacity-0 group-hover/social:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 group-hover/social:text-white transition-colors duration-300">
                            <DiscordIcon />
                        </span>
                        <span className="absolute inset-0 rounded-xl opacity-0 group-hover/social:opacity-100 transition-opacity duration-300" style={{ boxShadow: '0 0 30px rgba(88, 101, 242, 0.4)' }}></span>
                     </a>
                     <a href="#" className="group/social relative w-12 h-12 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-slate-500 dark:text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-violet-600 opacity-0 group-hover/social:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 group-hover/social:text-white transition-colors duration-300">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </span>
                        <span className="absolute inset-0 rounded-xl opacity-0 group-hover/social:opacity-100 transition-opacity duration-300" style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}></span>
                     </a>
                     <a href="#" className="group/social relative w-12 h-12 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-slate-500 dark:text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute inset-0 bg-slate-900 dark:bg-white opacity-0 group-hover/social:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 group-hover/social:text-white dark:group-hover/social:text-slate-900 transition-colors duration-300">
                            <GitHubIcon />
                        </span>
                        <span className="absolute inset-0 rounded-xl opacity-0 group-hover/social:opacity-100 transition-opacity duration-300" style={{ boxShadow: '0 0 30px rgba(15, 23, 42, 0.4)' }}></span>
                     </a>
                </div>
            </div>

            {/* Enhanced Links Columns with staggered animations */}
            <div className="lg:col-span-3">
                <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-8 text-sm uppercase tracking-wider">
                    {t('footer.company')}
                </h3>
                <ul className="space-y-5 stagger-fade-in">
                    <FooterLink page="contact" setCurrentPage={setCurrentPage}>{t('nav.contact')}</FooterLink>
                    <FooterLink page="projekte" setCurrentPage={setCurrentPage}>{t('nav.projects')}</FooterLink>
                    <FooterLink page="faq" setCurrentPage={setCurrentPage}>{t('nav.faq')}</FooterLink>
                </ul>
            </div>

             <div className="lg:col-span-3">
                <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-8 text-sm uppercase tracking-wider">
                    {t('footer.services')}
                </h3>
                <ul className="space-y-5 stagger-fade-in">
                    <FooterLink page="leistungen" setCurrentPage={setCurrentPage}>{t('footer.webdesign')}</FooterLink>
                    <FooterLink page="automationen" setCurrentPage={setCurrentPage}>{t('footer.automation')}</FooterLink>
                    <FooterLink page="preise" setCurrentPage={setCurrentPage}>{t('nav.pricing')}</FooterLink>
                </ul>
            </div>

             <div className="lg:col-span-3">
                <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-8 text-sm uppercase tracking-wider">
                    {t('footer.legal')}
                </h3>
                <ul className="space-y-5 stagger-fade-in">
                    <FooterLink page="impressum" setCurrentPage={setCurrentPage}>{t('footer.imprint')}</FooterLink>
                    <FooterLink page="datenschutz" setCurrentPage={setCurrentPage}>{t('footer.privacy')}</FooterLink>
                    <FooterLink page="login" setCurrentPage={setCurrentPage}>{t('nav.login')}</FooterLink>
                </ul>
            </div>
        </div>

        {/* Enhanced copyright section */}
        <div className="pt-10 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-3">
                <span>&copy; {new Date().getFullYear()} ScaleSite.</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span>{t('footer.rights')}</span>
            </p>

             {/* Enhanced tech stack badge */}
             <div className="group flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm px-6 py-3 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 hover:scale-105">
                <span>{t('footer.built_with')}</span>
                <div className="w-px h-5 bg-slate-300 dark:bg-slate-600"></div>
                <ReactIcon className="w-5 h-5 text-blue-500 animate-spin-slow" />
                <span className="font-medium text-slate-700 dark:text-slate-300">React & TypeScript</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </footer>
  );
};
