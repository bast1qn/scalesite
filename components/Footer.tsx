

import React from 'react';
import { ReactIcon, ScaleSiteLogo, GitHubIcon, InstagramIcon, DiscordIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

const FooterLink: React.FC<{page: string; setCurrentPage: (page: string) => void; children: React.ReactNode;}> = ({ page, setCurrentPage, children }) => (
    <li>
        <button onClick={() => setCurrentPage(page)} className="text-sm text-dark-text/60 dark:text-light-text/60 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-violet-600 dark:hover:text-white transition-all duration-200 text-left relative group">
            <span className="relative z-10">{children}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 group-hover:w-full transition-all duration-300"></span>
        </button>
    </li>
);

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-light-bg dark:bg-dark-bg pt-20 pb-10 border-t border-dark-text/5 dark:border-light-text/5 overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-violet-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

            {/* Brand Column */}
            <div className="lg:col-span-4 pr-8">
                <button onClick={() => setCurrentPage('home')} className="text-dark-text dark:text-light-text mb-6 block group">
                    <ScaleSiteLogo className="h-8 transition-transform duration-300 group-hover:scale-105" />
                </button>
                <p className="text-dark-text/60 dark:text-light-text/60 text-sm leading-relaxed mb-8 max-w-xs">
                    {t('footer.description')}
                </p>
                <div className="flex gap-4">
                     <a href="https://www.instagram.com/scalesite_app" target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center border border-dark-text/10 dark:border-light-text/10 rounded-full hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:border-transparent hover:text-white hover:shadow-glow transition-all duration-300 dark:text-light-text/60 hover:scale-110">
                        <span className="sr-only">Instagram</span>
                        <InstagramIcon />
                     </a>
                     <a href="https://discord.gg/65a4PygTJ3" target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center border border-dark-text/10 dark:border-light-text/10 rounded-full hover:bg-[#5865F2] hover:border-[#5865F2] hover:text-white hover:shadow-glow hover:scale-110 transition-all duration-300 dark:text-light-text/60">
                        <span className="sr-only">Discord</span>
                        <DiscordIcon />
                     </a>
                     <a href="#" className="w-11 h-11 flex items-center justify-center border border-dark-text/10 dark:border-light-text/10 rounded-full hover:bg-gradient-to-br hover:from-blue-600 hover:to-violet-600 hover:border-transparent hover:text-white hover:shadow-glow hover:scale-110 transition-all duration-300 dark:text-light-text/60">
                        <span className="sr-only">LinkedIn</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                     </a>
                     <a href="#" className="w-11 h-11 flex items-center justify-center border border-dark-text/10 dark:border-light-text/10 rounded-full hover:bg-slate-900 dark:hover:bg-white hover:border-slate-900 hover:text-white dark:hover:text-slate-900 hover:shadow-glow hover:scale-110 transition-all duration-300 dark:text-light-text/60">
                        <span className="sr-only">GitHub</span>
                        <GitHubIcon />
                     </a>
                </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-2">
                <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-6 text-sm uppercase tracking-wider">{t('footer.company')}</h3>
                <ul className="space-y-4">
                    <FooterLink page="story" setCurrentPage={setCurrentPage}>{t('footer.about')}</FooterLink>
                    <FooterLink page="contact" setCurrentPage={setCurrentPage}>{t('nav.contact')}</FooterLink>
                    <FooterLink page="projekte" setCurrentPage={setCurrentPage}>{t('nav.projects')}</FooterLink>
                </ul>
            </div>

             <div className="lg:col-span-2">
                <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-6 text-sm uppercase tracking-wider">{t('footer.services')}</h3>
                <ul className="space-y-4">
                    <FooterLink page="leistungen" setCurrentPage={setCurrentPage}>{t('footer.webdesign')}</FooterLink>
                    <FooterLink page="leistungen" setCurrentPage={setCurrentPage}>{t('footer.development')}</FooterLink>
                    <FooterLink page="preise" setCurrentPage={setCurrentPage}>{t('footer.seo')}</FooterLink>
                </ul>
            </div>

            <div className="lg:col-span-2">
                <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-6 text-sm uppercase tracking-wider">{t('footer.resources')}</h3>
                <ul className="space-y-4">
                    <FooterLink page="ressourcen" setCurrentPage={setCurrentPage}>{t('footer.downloads')}</FooterLink>
                    <FooterLink page="blog" setCurrentPage={setCurrentPage}>{t('footer.blog')}</FooterLink>
                    <FooterLink page="faq" setCurrentPage={setCurrentPage}>{t('nav.faq')}</FooterLink>
                </ul>
            </div>

             <div className="lg:col-span-2">
                <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-6 text-sm uppercase tracking-wider">{t('footer.legal')}</h3>
                <ul className="space-y-4">
                    <FooterLink page="impressum" setCurrentPage={setCurrentPage}>{t('footer.imprint')}</FooterLink>
                    <FooterLink page="datenschutz" setCurrentPage={setCurrentPage}>{t('footer.privacy')}</FooterLink>
                    <FooterLink page="login" setCurrentPage={setCurrentPage}>{t('nav.login')}</FooterLink>
                </ul>
            </div>
        </div>

        <div className="pt-8 border-t border-dark-text/5 dark:border-light-text/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-dark-text/40 dark:text-light-text/40 text-xs">&copy; {new Date().getFullYear()} ScaleSite. {t('footer.rights')}</p>
             <div className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-400 text-xs bg-dark-text/5 dark:bg-light-text/5 px-4 py-2 rounded-full border border-dark-text/10 dark:border-light-text/10">
                <span>{t('footer.built_with')}</span>
                <ReactIcon className="w-3.5 h-3.5 animate-spin-slow text-blue-500" />
                <span>React & TypeScript</span>
            </div>
        </div>
      </div>
    </footer>
  );
};
