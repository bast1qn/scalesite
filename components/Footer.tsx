import type { ReactNode } from 'react';
import { ReactIcon, ScaleSiteLogo, GitHubIcon, InstagramIcon, DiscordIcon } from './Icons';
import { useLanguage } from '../contexts';
import { useHover } from '../lib/hooks';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

const FooterLink = ({ page, setCurrentPage, children }: { page: string; setCurrentPage: (page: string) => void; children: ReactNode }) => {
    const hover = useHover();

    return (
        <li>
            <button
                onClick={() => setCurrentPage(page)}
                {...hover}
                className="relative text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 ease-smooth text-left py-3 group"
            >
                <span className="flex items-center gap-2">
                    {children}
                    <svg className={`w-3.5 h-3.5 transition-all duration-300 ease-smooth ${hover.isHovered ? 'translate-x-0.5 opacity-100' : 'opacity-0 -translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </button>
        </li>
    );
};

const SocialIconButton = ({ href, children, ariaLabel }: { href: string; children: ReactNode; ariaLabel?: string }) => {
    const hover = useHover();

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            {...hover}
            className="group relative w-10 h-10 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all duration-300 ease-smooth hover:border-primary-400 dark:hover:border-violet-500 hover:text-primary-500 dark:hover:text-violet-400 hover:-translate-y-0.5 hover:shadow-soft hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50"
            aria-label={ariaLabel}
        >
            <span className="transition-transform duration-300 group-hover:scale-[1.02]">
                {children}
            </span>
        </a>
    );
};

export const Footer = ({ setCurrentPage }: FooterProps) => {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-slate-50 dark:bg-slate-950 pt-24 pb-14 border-t border-slate-200/80 dark:border-slate-800/80">
      {/* Refined gradient accent at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/60 to-transparent"></div>

      {/* Refined background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

            {/* Brand Column */}
            <div className="lg:col-span-4">
                <button
                    onClick={() => setCurrentPage('home')}
                    className="text-slate-900 dark:text-white mb-6 block hover:opacity-80 transition-opacity duration-300"
                >
                    <ScaleSiteLogo className="h-9" />
                </button>
                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8 max-w-sm">
                    {t('footer.description')}
                </p>

                {/* Social links */}
                <div className="flex gap-3">
                    <SocialIconButton
                        href="https://www.instagram.com/scalesite_app"
                        ariaLabel="Instagram"
                    >
                        <InstagramIcon />
                    </SocialIconButton>
                    <SocialIconButton
                        href="https://discord.gg/65a4PygTJ3"
                        ariaLabel="Discord"
                    >
                        <DiscordIcon />
                    </SocialIconButton>
                    {/* SECURITY: Removed placeholder href="#" links - either use real URLs or remove the button */}
                </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-3">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-6 text-sm uppercase tracking-wider">
                    {t('footer.company')}
                </h3>
                <ul className="space-y-1">
                    <FooterLink page="contact" setCurrentPage={setCurrentPage}>{t('nav.contact')}</FooterLink>
                    <FooterLink page="projekte" setCurrentPage={setCurrentPage}>{t('nav.projects')}</FooterLink>
                    <FooterLink page="faq" setCurrentPage={setCurrentPage}>{t('nav.faq')}</FooterLink>
                </ul>
            </div>

            <div className="lg:col-span-3">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-6 text-sm uppercase tracking-wider">
                    {t('footer.services')}
                </h3>
                <ul className="space-y-1">
                    <FooterLink page="leistungen" setCurrentPage={setCurrentPage}>{t('footer.webdesign')}</FooterLink>
                    <FooterLink page="automationen" setCurrentPage={setCurrentPage}>{t('footer.automation')}</FooterLink>
                    <FooterLink page="preise" setCurrentPage={setCurrentPage}>{t('nav.pricing')}</FooterLink>
                </ul>
            </div>

            <div className="lg:col-span-2">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-6 text-sm uppercase tracking-wider">
                    {t('footer.legal')}
                </h3>
                <ul className="space-y-1">
                    <FooterLink page="impressum" setCurrentPage={setCurrentPage}>{t('footer.imprint')}</FooterLink>
                    <FooterLink page="datenschutz" setCurrentPage={setCurrentPage}>{t('footer.privacy')}</FooterLink>
                    <FooterLink page="login" setCurrentPage={setCurrentPage}>{t('nav.login')}</FooterLink>
                </ul>
            </div>
        </div>

        {/* Copyright section */}
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-3">
                <span>&copy; {new Date().getFullYear()} ScaleSite.</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span>{t('footer.rights')}</span>
            </p>

            {/* Tech stack badge */}
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-soft transition-all duration-300">
                <span>{t('footer.built_with')}</span>
                <div className="w-px h-5 bg-slate-300 dark:bg-slate-600"></div>
                <ReactIcon className="w-5 h-5 text-primary-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">React & TypeScript</span>
            </div>
        </div>
      </div>
    </footer>
  );
};
