
import React, { useState, useEffect, useContext } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Bars3Icon, XMarkIcon, ArrowRightIcon, UserCircleIcon, ScaleSiteLogo } from './Icons';
import { AuthContext } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface HeaderProps {
    setCurrentPage: (page: string) => void;
    currentPage: string;
}

const NavButton: React.FC<{
    page: string;
    currentPage: string;
    onClick: (page: string) => void;
    children: React.ReactNode;
}> = ({ page, currentPage, onClick, children }) => {
    const isActive = currentPage === page;

    return (
        <button
            onClick={() => onClick(page)}
            className={`relative px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-full group overflow-hidden ${
                isActive
                    ? 'text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-blue-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-current={isActive ? 'page' : undefined}
        >
            {children}
            {!isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 group-hover:w-1/2 transition-all duration-300"></span>
            )}
        </button>
    );
};

const CurrencySelector: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
    const { currency, setCurrency, currenciesList } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);

    const commonCurrencies = ['EUR', 'USD', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SEK', 'DKK', 'PLN', 'CZK', 'HUF', 'BRL', 'TRY'];
    const otherCurrencies = currenciesList.filter(c => !commonCurrencies.includes(c.code));

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 transition-all duration-300 hover:scale-105 active:scale-95 ${
                    isMobile
                        ? 'text-base font-medium text-dark-text dark:text-light-text px-4 py-3'
                        : 'text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
                <span className="text-sm">{currenciesList.find(c => c.code === currency)?.flag || '🇪🇺'}</span>
                <span className="uppercase">{currency}</span>
            </button>

            {isOpen && (
                <div className={`absolute right-0 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 z-[200] overflow-hidden animate-scale-in ${isMobile ? 'top-full left-0 w-full' : 'w-64 max-h-80 overflow-y-auto'}`}>
                    <div className="p-2">
                        {commonCurrencies.map(currCode => {
                            const curr = currenciesList.find(c => c.code === currCode);
                            if (!curr) return null;
                            return (
                                <button
                                    key={curr.code}
                                    onClick={() => { setCurrency(curr.code); setIsOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 ${currency === curr.code ? 'bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}
                                >
                                    <span className="text-base">{curr.flag}</span>
                                    <span className="font-medium text-sm">{curr.code}</span>
                                </button>
                            );
                        })}

                        {otherCurrencies.length > 0 && (
                            <>
                                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                                {otherCurrencies.slice(0, 10).map(curr => (
                                    <button
                                        key={curr.code}
                                        onClick={() => { setCurrency(curr.code); setIsOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 ${currency === curr.code ? 'bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}
                                    >
                                        <span className="text-base">{curr.flag}</span>
                                        <span className="font-medium text-sm">{curr.code}</span>
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const Header: React.FC<HeaderProps> = ({ setCurrentPage, currentPage }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const { t, language, setLanguage } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const handleLogout = () => {
        logout();
        setCurrentPage('home');
        setIsMenuOpen(false);
    }

    const handleNavClick = (page: string) => {
        setIsMenuOpen(false);
        setCurrentPage(page);
    };

    const toggleLanguage = () => {
        setLanguage(language === 'de' ? 'en' : 'de');
    };

    const navItems = [
        { page: 'home', label: t('nav.home')},
        { page: 'leistungen', label: t('nav.services')},
        { page: 'automationen', label: t('nav.automation')},
        { page: 'preise', label: t('nav.pricing')},
        { page: 'contact', label: t('nav.contact')},
    ];

    const headerClasses = `fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled || isMenuOpen
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg shadow-slate-200/50 dark:shadow-black/20'
            : 'bg-transparent border-transparent'
    }`;

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <button
                        onClick={() => setCurrentPage('home')}
                        className="flex-shrink-0 text-dark-text dark:text-light-text hover:opacity-80 transition-opacity hover:scale-105 active:scale-95 duration-200"
                    >
                        <ScaleSiteLogo className="h-7 lg:h-8" />
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center">
                        <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm px-2 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
                            {navItems.map(item => (
                                <NavButton key={item.page} page={item.page} currentPage={currentPage} onClick={handleNavClick}>
                                    {item.label}
                                </NavButton>
                            ))}
                        </div>
                    </nav>

                    {/* Desktop Right Side */}
                    <div className="hidden lg:flex items-center gap-3">
                        <CurrencySelector />

                        <button
                            onClick={toggleLanguage}
                            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center uppercase tracking-wider border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                        >
                            {language}
                        </button>

                        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700"></div>

                        {user ? (
                            <button
                                onClick={() => setCurrentPage('dashboard')}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md"
                            >
                                <UserCircleIcon className="w-4 h-4" />
                                <span>{t('nav.dashboard')}</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setCurrentPage('login')}
                                    className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    {t('nav.login')}
                                </button>
                                <button
                                    onClick={() => setCurrentPage('preise')}
                                    className="group flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-full hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 btn-press"
                                >
                                    <span>{t('nav.projectStart')}</span>
                                    <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                                </button>
                            </>
                        )}

                        <div className="pl-2 border-l border-slate-200 dark:border-slate-700">
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-2">
                        <CurrencySelector />
                        <button
                            onClick={toggleLanguage}
                            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 uppercase w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                        >
                            {language}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105 active:scale-95 relative"
                            aria-label={isMenuOpen ? t('nav.menuClose') : t('nav.menuOpen')}
                        >
                            <span className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-violet-500/10 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}></span>
                            {isMenuOpen ? <XMarkIcon className="w-6 h-6 relative" /> : <Bars3Icon className="w-6 h-6 relative" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 bg-white dark:bg-slate-950 lg:hidden transition-all duration-500 ${
                    isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                style={{ zIndex: 99 }}
            >
                {/* Animated background gradient for mobile menu */}
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-transparent transition-opacity duration-700 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}></div>

                <nav className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
                    {navItems.map((item, index) => (
                        <button
                            key={item.page}
                            onClick={() => handleNavClick(item.page)}
                            className={`w-full max-w-xs text-xl font-medium transition-all duration-300 px-6 py-4 rounded-2xl text-center transform ${
                                currentPage === item.page
                                    ? 'text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-xl shadow-blue-500/25 scale-105'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105'
                            }`}
                            style={{
                                transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                                opacity: isMenuOpen ? 1 : 0,
                                transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                            }}
                        >
                            {item.label}
                        </button>
                    ))}

                    <div className={`w-24 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent my-6 transition-all duration-500 ${isMenuOpen ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} style={{ transitionDelay: '250ms' }}></div>

                    {user ? (
                        <div className="flex flex-col items-center gap-4 w-full max-w-xs" style={{ transitionDelay: '300ms' }}>
                            <button
                                onClick={() => handleNavClick('dashboard')}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 text-lg font-medium text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-violet-50 dark:hover:from-blue-900/20 dark:hover:to-violet-900/20 hover:shadow-lg transition-all duration-300"
                            >
                                <UserCircleIcon className="w-5 h-5" />
                                {t('nav.dashboard')}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors py-2"
                            >
                                {t('nav.logout')}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                            <button
                                onClick={() => handleNavClick('preise')}
                                className="group w-full flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300 btn-press"
                                style={{ transitionDelay: '300ms' }}
                            >
                                <span>{t('nav.projectStart')}</span>
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleNavClick('login')}
                                className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors py-3"
                                style={{ transitionDelay: '350ms' }}
                            >
                                {t('nav.login')}
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};
