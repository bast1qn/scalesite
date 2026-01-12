import React, { useState, useEffect, useContext, useRef } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Bars3Icon, XMarkIcon, ArrowRightIcon, UserCircleIcon, ScaleSiteLogo } from './Icons';
import { AuthContext } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface HeaderProps {
    setCurrentPage: (page: string) => void;
    currentPage: string;
}

// Clean nav button with subtle hover
const NavButton: React.FC<{
    page: string;
    currentPage: string;
    onClick: (page: string) => void;
    children: React.ReactNode;
}> = ({ page, currentPage, onClick, children }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isActive = currentPage === page;

    return (
        <button
            onClick={() => onClick(page)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-full ${
                isActive
                    ? 'text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            aria-current={isActive ? 'page' : undefined}
        >
            {!isActive && isHovered && (
                <span className="absolute inset-0 rounded-full bg-slate-100 dark:bg-slate-800"></span>
            )}
            <span className="relative z-10">{children}</span>
        </button>
    );
};

const CurrencySelector: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
    const { currency, setCurrency, currenciesList } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const commonCurrencies = ['EUR', 'USD', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SEK', 'DKK', 'PLN', 'CZK', 'HUF', 'BRL', 'TRY'];
    const otherCurrencies = currenciesList.filter(c => !commonCurrencies.includes(c.code));

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex items-center gap-2 transition-all duration-300 ${
                    isMobile
                        ? 'text-base font-medium text-slate-800 dark:text-slate-200 px-4 py-3'
                        : 'text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
            >
                <span className="text-sm">{currenciesList.find(c => c.code === currency)?.flag || '🇪🇺'}</span>
                <span className="uppercase">{currency}</span>
                <svg className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute right-0 mt-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg z-50 overflow-hidden ${
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
                                    onClick={() => { setCurrency(curr.code); setIsOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                                        isSelected
                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <span className="text-base">{curr.flag}</span>
                                    <span className="text-sm">{curr.code}</span>
                                    {isSelected && (
                                        <svg className="w-4 h-4 ml-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
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
                                            onClick={() => { setCurrency(curr.code); setIsOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                                                isSelected
                                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
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

export const Header: React.FC<HeaderProps> = ({ setCurrentPage, currentPage }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
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

    const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70 shadow-sm py-3'
            : 'bg-transparent border-transparent py-5'
    }`;

    return (
        <header ref={headerRef} className={headerClasses}>
            {/* Subtle bottom accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 lg:h-16">
                    {/* Logo */}
                    <button
                        onClick={() => setCurrentPage('home')}
                        className="flex-shrink-0 text-slate-900 dark:text-white hover:opacity-80 transition-opacity duration-300"
                    >
                        <ScaleSiteLogo className="h-7 lg:h-8" />
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center">
                        <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 px-2 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
                            {navItems.map(item => (
                                <NavButton key={item.page} page={item.page} currentPage={currentPage} onClick={handleNavClick}>
                                    {item.label}
                                </NavButton>
                            ))}
                        </div>
                    </nav>

                    {/* Desktop Right Side */}
                    <div className="hidden lg:flex items-center gap-4">
                        <CurrencySelector />

                        {/* Language toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="relative text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300 w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center uppercase tracking-wider"
                        >
                            {language}
                        </button>

                        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700"></div>

                        {user ? (
                            <button
                                onClick={() => setCurrentPage('dashboard')}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <UserCircleIcon className="w-4 h-4" />
                                <span>{t('nav.dashboard')}</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setCurrentPage('login')}
                                    className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300 px-4 py-2"
                                >
                                    {t('nav.login')}
                                </button>
                                <button
                                    onClick={() => setCurrentPage('preise')}
                                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
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

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-2">
                        <CurrencySelector />
                        <button
                            onClick={toggleLanguage}
                            className="relative text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-300 uppercase w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
                        >
                            {language}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="relative p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
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

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 lg:hidden transition-all duration-300 ${
                    isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                style={{ zIndex: 40 }}
            >
                {/* Clean background */}
                <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"></div>

                {/* Subtle gradient accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 pointer-events-none"></div>

                <nav className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 relative z-10">
                    {navItems.map((item, index) => (
                        <button
                            key={item.page}
                            onClick={() => handleNavClick(item.page)}
                            className={`w-full max-w-xs text-lg font-medium transition-all duration-300 px-6 py-3 rounded-xl text-center ${
                                currentPage === item.page
                                    ? 'text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-md'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                            style={{
                                transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                                opacity: isMenuOpen ? 1 : 0,
                                transform: isMenuOpen ? 'translateY(0)' : 'translateY(16px)',
                            }}
                        >
                            {item.label}
                        </button>
                    ))}

                    <div className="w-24 h-px bg-slate-200 dark:bg-slate-700 my-4"></div>

                    {user ? (
                        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                            <button
                                onClick={() => handleNavClick('dashboard')}
                                className="w-full flex items-center justify-center gap-3 px-6 py-3 text-base font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                            >
                                <UserCircleIcon className="w-5 h-5" />
                                <span>{t('nav.dashboard')}</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300 py-3"
                            >
                                {t('nav.logout')}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                            <button
                                onClick={() => handleNavClick('preise')}
                                className="w-full flex items-center justify-center gap-3 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:shadow-md transition-all duration-300"
                            >
                                <span>{t('nav.projectStart')}</span>
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleNavClick('login')}
                                className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300 py-3"
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
