

import React from 'react';
import { ReactIcon, ScaleSiteLogo, GitHubIcon, InstagramIcon, DiscordIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

const FooterLink: React.FC<{page: string; setCurrentPage: (page: string) => void; children: React.ReactNode;}> = ({ page, setCurrentPage, children }) => (
    <li>
        <button onClick={() => setCurrentPage(page)} className="text-sm text-dark-text/60 dark:text-light-text/60 hover:text-primary dark:hover:text-white transition-colors duration-200 text-left">
            {children}
        </button>
    </li>
);

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-light-bg dark:bg-dark-bg pt-20 pb-10 border-t border-dark-text/5 dark:border-light-text/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            
            {/* Brand Column */}
            <div className="lg:col-span-4 pr-8">
                <button onClick={() => setCurrentPage('home')} className="text-dark-text dark:text-light-text mb-6 block">
                    <ScaleSiteLogo className="h-8" />
                </button>
                <p className="text-dark-text/60 dark:text-light-text/60 text-sm leading-relaxed mb-8 max-w-xs">
                    {t('footer.description')}
                </p>
                <div className="flex gap-4">
                     <a href="https://www.instagram.com/scalesite_app" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-dark-text/10 dark:border-light-text/10 rounded-full hover:bg-gradient-to-br hover:from-purple-500 hover:via-red-500 hover:to-yellow-500 hover:border-transparent hover:text-white transition-all dark:text-light-text/60">
                        <span className="sr-only">Instagram</span>
                        <InstagramIcon />
                     </a>
                     <a href="https://discord.gg/65a4PygTJ3" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-dark-text/10 dark:border-light-text/10 rounded-full hover:bg-[#5865F2] hover:border-[#5865F2] hover:text-white transition-all dark:text-light-text/60">
                        <span className="sr-only">Discord</span>
                        <DiscordIcon />
                     </a>
                     <a href="#" className="w-10 h-10 flex items-center justify-center border border-dark-text/10 dark:border-light-text/10 rounded-full hover:bg-primary hover:border-primary hover:text-white transition-all dark:text-light-text/60">
                        <span className="sr-only">LinkedIn</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                     </a>
                     <a href="#" className="w-10 h-10 flex items-center justify-center border border-dark-text/10 dark:border-light-text/10 rounded-full hover:bg-black hover:border-black hover:text-white transition-all dark:text-light-text/60">
                        <span className="sr-only">GitHub</span>
                        <GitHubIcon />
                     </a>
                </div>
            </div>
            
            {/* Links Columns */}
            <div className="lg:col-span-2">
                <h3 className="font-bold text-dark-text dark:text-light-text mb-6 text-sm uppercase tracking-wider">{t('footer.company')}</h3>
                <ul className="space-y-4">
                    <FooterLink page="story" setCurrentPage={setCurrentPage}>{t('footer.about')}</FooterLink>
                    <FooterLink page="contact" setCurrentPage={setCurrentPage}>{t('nav.contact')}</FooterLink>
                    <FooterLink page="projekte" setCurrentPage={setCurrentPage}>{t('nav.projects')}</FooterLink>
                </ul>
            </div>
            
             <div className="lg:col-span-2">
                <h3 className="font-bold text-dark-text dark:text-light-text mb-6 text-sm uppercase tracking-wider">{t('footer.services')}</h3>
                <ul className="space-y-4">
                    <FooterLink page="leistungen" setCurrentPage={setCurrentPage}>{t('footer.webdesign')}</FooterLink>
                    <FooterLink page="leistungen" setCurrentPage={setCurrentPage}>{t('footer.development')}</FooterLink>
                    <FooterLink page="preise" setCurrentPage={setCurrentPage}>{t('footer.seo')}</FooterLink>
                </ul>
            </div>

            <div className="lg:col-span-2">
                <h3 className="font-bold text-dark-text dark:text-light-text mb-6 text-sm uppercase tracking-wider">{t('footer.resources')}</h3>
                <ul className="space-y-4">
                    <FooterLink page="ressourcen" setCurrentPage={setCurrentPage}>{t('footer.downloads')}</FooterLink>
                    <FooterLink page="blog" setCurrentPage={setCurrentPage}>{t('footer.blog')}</FooterLink>
                    <FooterLink page="faq" setCurrentPage={setCurrentPage}>{t('nav.faq')}</FooterLink>
                </ul>
            </div>
            
             <div className="lg:col-span-2">
                <h3 className="font-bold text-dark-text dark:text-light-text mb-6 text-sm uppercase tracking-wider">{t('footer.legal')}</h3>
                <ul className="space-y-4">
                    <FooterLink page="impressum" setCurrentPage={setCurrentPage}>{t('footer.imprint')}</FooterLink>
                    <FooterLink page="datenschutz" setCurrentPage={setCurrentPage}>{t('footer.privacy')}</FooterLink>
                    <FooterLink page="login" setCurrentPage={setCurrentPage}>{t('nav.login')}</FooterLink>
                </ul>
            </div>
        </div>
        
        <div className="pt-8 border-t border-dark-text/5 dark:border-light-text/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-dark-text/40 dark:text-light-text/40 text-xs">&copy; {new Date().getFullYear()} ScaleSite. {t('footer.rights')}</p>
             <div className="flex items-center gap-2 text-dark-text/40 dark:text-light-text/40 text-xs bg-dark-text/5 dark:bg-light-text/5 px-3 py-1.5 rounded-full">
                <span>{t('footer.built_with')}</span>
                <ReactIcon className="w-3.5 h-3.5 animate-spin-slow" />
                <span>React & TypeScript</span>
            </div>
        </div>
      </div>
    </footer>
  );
};
