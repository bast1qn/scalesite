// ============================================
// IMPORTS - Organized by: React → External → Internal → Types
// ============================================

// React
import { useState, useContext, useRef, useMemo, useCallback, type ReactNode } from 'react';

// Internal - Components
import { ThemeToggle } from './ThemeToggle';
import NotificationBell from './notifications/NotificationBell';
import { MobileNavigation } from './MobileNavigation';
import { Bars3Icon, XMarkIcon, ArrowRightIcon, UserCircleIcon, ScaleSiteLogo } from './Icons';

// Internal - Contexts
import { AuthContext, useLanguage, useCurrency } from '../contexts';

// Internal - Hooks
import { useScroll, useBodyScrollLock, useClickOutsideCallback, useHover } from '../lib/hooks';

interface HeaderProps {
    setCurrentPage: (page: string) => void;
    currentPage: string;
}

const NavButton = ({ page, currentPage, onClick, children }: { page: string; currentPage: string; onClick: (page: string) => void; children: ReactNode }) => {
    const hover = useHover();
    const isActive = currentPage === page;

    // Memoized click handler to prevent inline function creation
    const handleClick = useCallback(() => onClick(page), [onClick, page]);

    return (
        <button
            onClick={handleClick}
            {...hover}
            className={`relative px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium transition-all duration-300 rounded-2xl min-h-11 ${
                isActive
                    ? 'text-white bg-gradient-to-r from-primary-600 to-violet-600 shadow-premium'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50'
            }`}
            aria-current={isActive ? 'page' : undefined}
        >
            {!isActive && hover.isHovered && (
                <span className="absolute inset-0 rounded-2xl bg-slate-100 dark:bg-slate-800/80"></span>
            )}
            <span className="relative z-10">{children}</span>
        </button>
    );
};
const CurrencySelector = ({ isMobile = false }: { isMobile?: boolean }) => {
    const { currency, setCurrency, currenciesList } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useClickOutsideCallback(() => setIsOpen(false), isOpen);

    const commonCurrencies = useMemo(() => ['EUR', 'USD', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SEK', 'DKK', 'PLN', 'CZK', 'HUF', 'BRL', 'TRY'], []);
    const otherCurrencies = useMemo(() => currenciesList.filter(c => !commonCurrencies.includes(c.code)), [currenciesList, commonCurrencies]);

    // Memoized handlers to prevent inline function creation
    const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);
    const handleCurrencySelect = useCallback((code: string) => {
        setCurrency(code);
        setIsOpen(false);
    }, [setCurrency]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className={`relative flex items-center gap-2 transition-all duration-300 ease-smooth min-h-11 ${
                    isMobile
                        ? 'text-base font-medium text-slate-800 dark:text-slate-200 px-4 py-3'
                        : 'text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-soft hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50'
                }`}
                aria-label={`Währung wählen: ${currency}`}
            >
                <span className="text-sm">{currenciesList.find(c => c.code === currency)?.flag || '🇪🇺'}</span>
                <span className="uppercase">{currency}</span>
                <svg className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute right-0 mt-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-premium-lg z-50 overflow-hidden ${
                    isMobile ? 'top-full left-0 w-full' : 'w-56 max-h-80 overflow-y-auto'
                }`}>
                    <div className="p-2">
                        {commonCurrencies.map((currCode) => {
                            const curr = currenciesList.find(c => c.code === currCode);
                            if (!curr) return null;
                            const isSelected = currency === curr.code;
                            return (
                                <button
                                    key={curr.code}
                                    onClick={() => handleCurrencySelect(curr.code)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                                        isSelected
                                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <span className="text-base">{curr.flag}</span>
                                    <span className="text-sm">{curr.code}</span>
                                    {isSelected && (
                                        <svg className="w-4 h-4 ml-auto text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}

                        {otherCurrencies.length > 0 && (
                            <>
                                <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                                {otherCurrencies.slice(0, 8).map((curr) => {
                                    const isSelected = currency === curr.code;
                                    return (
                                        <button
                                            key={curr.code}
                                            onClick={() => handleCurrencySelect(curr.code)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                                                isSelected
                                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <span className="text-base">{curr.flag}</span>
                                            <span className="text-sm">{curr.code}</span>
                                        </button>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export const Header = ({ setCurrentPage, currentPage }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const { user, logout } = useContext(AuthContext);
    const { t, language, setLanguage } = useLanguage();

    const isScrolled = useScroll(8);
    useBodyScrollLock(isMenuOpen);

    // Memoized handlers to prevent inline function creation
    const handleLogout = useCallback(() => {
        logout();
        setCurrentPage('home');
        setIsMenuOpen(false);
    }, [logout, setCurrentPage]);

    const handleNavClick = useCallback((page: string) => {
        setIsMenuOpen(false);
        setCurrentPage(page);
    }, [setCurrentPage]);

    const toggleLanguage = useCallback(() => {
        setLanguage(language === 'de' ? 'en' : 'de');
    }, [language, setLanguage]);

    const handleMenuToggle = useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    const navItems = useMemo(() => [
        { page: 'home', label: t('nav.home')},
        { page: 'leistungen', label: t('nav.services')},
        { page: 'automationen', label: t('nav.automation')},
        { page: 'preise', label: t('nav.pricing')},
        { page: 'contact', label: t('nav.contact')},
    ], [t]);

    const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-soft py-3'
            : 'bg-transparent border-transparent py-4 md:py-5'
    }`;

    return (
        <header ref={headerRef} className={headerClasses}>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/60 to-transparent transition-opacity duration-300"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 md:h-16 lg:h-18">
                    <button
                        onClick={() => handleNavClick('home')}
                        className="flex-shrink-0 text-slate-900 dark:text-white hover:opacity-80 transition-opacity duration-300 min-h-11"
                        aria-label="ScaleSite Logo - Zur Startseite"
                    >
                        <ScaleSiteLogo className="h-7 lg:h-8" />
                    </button>

                    <nav className="hidden lg:flex items-center">
                        <div className="flex items-center gap-1 bg-slate-100/60 dark:bg-slate-800/60 px-2 py-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                            {navItems.map(item => (
                                <NavButton key={item.page} page={item.page} currentPage={currentPage} onClick={handleNavClick}>
                                    {item.label}
                                </NavButton>
                            ))}
                        </div>
                    </nav>

                    <div className="hidden lg:flex items-center gap-4">
                        <CurrencySelector />

                        <button
                            onClick={toggleLanguage}
                            className="relative text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50 w-12 h-11 min-h-11 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center uppercase tracking-wider"
                            aria-label={`Sprache wechseln: ${language === 'de' ? 'Deutsch' : 'English'}`}
                        >
                            {language}
                        </button>

                        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700"></div>

                        {user ? (
                            <>
                                <NotificationBell />
                                <button
                                    onClick={() => handleNavClick('configurator')}
                                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-violet-600 hover:shadow-premium transition-all duration-300 rounded-xl hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50 min-h-11"
                                    title="Website Konfigurator"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                    </svg>
                                    <span>Konfigurator</span>
                                </button>
                                <button
                                    onClick={() => handleNavClick('dashboard')}
                                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-soft hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50 min-h-11"
                                >
                                    <UserCircleIcon className="w-4 h-4" />
                                    <span>{t('nav.dashboard')}</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setCurrentPage('login')}
                                    className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-300 px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50 min-h-11"
                                >
                                    {t('nav.login')}
                                </button>
                                <button
                                    onClick={() => setCurrentPage('preise')}
                                    className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-violet-600 rounded-xl hover:shadow-premium hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:ring-2 focus:ring-primary-500/50 min-h-11"
                                >
                                    <span>{t('nav.projectStart')}</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </button>
                            </>
                        )}

                        <div className="pl-3 border-l border-slate-200 dark:border-slate-700">
                            <ThemeToggle />
                        </div>
                    </div>

                    <div className="lg:hidden flex items-center gap-2">
                        <CurrencySelector />
                        <button
                            onClick={toggleLanguage}
                            className="relative text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 uppercase w-11 h-11 min-h-11 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50"
                            aria-label={`Sprache wechseln: ${language === 'de' ? 'Deutsch' : 'English'}`}
                        >
                            {language}
                        </button>
                        <button
                            onClick={handleMenuToggle}
                            className="relative p-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 min-h-11 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50"
                            aria-label={isMenuOpen ? t('nav.menuClose') : t('nav.menuOpen')}
                        >
                            {isMenuOpen ? (
                                <XMarkIcon className="w-6 h-6" />
                            ) : (
                                <Bars3Icon className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <MobileNavigation
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                navItems={navItems}
            />
        </header>
    );
};
