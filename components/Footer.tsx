

import React from 'react';
import { ReactIcon, ScaleSiteLogo, GitHubIcon, InstagramIcon, DiscordIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

const FooterLink: React.FC<{page: string; setCurrentPage: (page: string) => void; children: React.ReactNode;}> = ({ page, setCurrentPage, children }) => (
    <li>
        <button onClick={() => setCurrentPage(page)} className="text-sm text-slate-600 dark:text-slate-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-violet-600 dark:hover:text-white transition-all duration-200 text-left relative group">
            <span className="relative z-10">{children}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 group-hover:w-full transition-all duration-300"></span>
        </button>
    </li>
);

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-slate-50 dark:bg-slate-950 pt-20 pb-10 overflow-hidden">
      {/* Gradient accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 via-violet-500 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-blue-400/50 via-violet-400/50 to-transparent blur-sm"></div>

      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          color: 'rgb(148 163 184)'
        }}></div>
      </div>

      {/* Decorative gradient background */}
      <div className="absolute inset-0 opacity-50 dark:opacity-30 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-violet-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 right-[10%] w-2 h-2 bg-blue-500/60 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
      <div className="absolute bottom-32 left-[15%] w-1.5 h-1.5 bg-violet-500/60 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

            {/* Brand Column */}
            <div className="lg:col-span-4 pr-8">
                <button onClick={() => setCurrentPage('home')} className="text-slate-900 dark:text-white mb-6 block group">
                    <ScaleSiteLogo className="h-8 transition-transform duration-300 group-hover:scale-105" />
                </button>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
                    {t('footer.description')}
                </p>

                {/* Enhanced social links */}
                <div className="flex gap-3">
                     <a href="https://www.instagram.com/scalesite_app" target="_blank" rel="noopener noreferrer" className="group/social w-11 h-11 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-500 dark:text-slate-400 hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:border-transparent hover:text-white hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                        <span className="sr-only">Instagram</span>
                        <InstagramIcon />
                     </a>
                     <a href="https://discord.gg/65a4PygTJ3" target="_blank" rel="noopener noreferrer" className="group/social w-11 h-11 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-500 dark:text-slate-400 hover:bg-[#5865F2] hover:border-[#5865F2] hover:text-white hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                        <span className="sr-only">Discord</span>
                        <DiscordIcon />
                     </a>
                     <a href="#" className="group/social w-11 h-11 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-500 dark:text-slate-400 hover:bg-gradient-to-br hover:from-blue-600 hover:to-violet-600 hover:border-transparent hover:text-white hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                        <span className="sr-only">LinkedIn</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                     </a>
                     <a href="#" className="group/social w-11 h-11 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-500 dark:text-slate-400 hover:bg-slate-900 dark:hover:bg-white hover:border-slate-900 hover:text-white dark:hover:text-slate-900 hover:shadow-xl hover:shadow-slate-900/30 transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                        <span className="sr-only">GitHub</span>
                        <GitHubIcon />
                     </a>
                </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-3">
                <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-6 text-sm uppercase tracking-wider">{t('footer.company')}</h3>
                <ul className="space-y-4">
                    <FooterLink page="contact" setCurrentPage={setCurrentPage}>{t('nav.contact')}</FooterLink>
                    <FooterLink page="projekte" setCurrentPage={setCurrentPage}>{t('nav.projects')}</FooterLink>
                    <FooterLink page="faq" setCurrentPage={setCurrentPage}>{t('nav.faq')}</FooterLink>
                </ul>
            </div>

             <div className="lg:col-span-3">
                <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-6 text-sm uppercase tracking-wider">{t('footer.services')}</h3>
                <ul className="space-y-4">
                    <FooterLink page="leistungen" setCurrentPage={setCurrentPage}>{t('footer.webdesign')}</FooterLink>
                    <FooterLink page="automationen" setCurrentPage={setCurrentPage}>{t('footer.automation')}</FooterLink>
                    <FooterLink page="preise" setCurrentPage={setCurrentPage}>{t('nav.pricing')}</FooterLink>
                </ul>
            </div>

             <div className="lg:col-span-3">
                <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-6 text-sm uppercase tracking-wider">{t('footer.legal')}</h3>
                <ul className="space-y-4">
                    <FooterLink page="impressum" setCurrentPage={setCurrentPage}>{t('footer.imprint')}</FooterLink>
                    <FooterLink page="datenschutz" setCurrentPage={setCurrentPage}>{t('footer.privacy')}</FooterLink>
                    <FooterLink page="login" setCurrentPage={setCurrentPage}>{t('nav.login')}</FooterLink>
                </ul>
            </div>
        </div>

        {/* Enhanced copyright section */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                <span>&copy; {new Date().getFullYear()} ScaleSite.</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span>{t('footer.rights')}</span>
            </p>
             <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm px-5 py-2.5 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 shadow-sm">
                <span>{t('footer.built_with')}</span>
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                <ReactIcon className="w-4 h-4 text-blue-500 animate-spin-slow" />
                <span className="font-medium text-slate-700 dark:text-slate-300">React & TypeScript</span>
            </div>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </footer>
  );
};
