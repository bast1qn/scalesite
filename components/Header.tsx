
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
    const [isHovered, setIsHovered] = useState(false);
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
    const isActive = currentPage === page;

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setGlowPos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    return (
        <button
            onClick={() => onClick(page)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            className={`relative px-5 py-2.5 text-sm font-medium transition-all duration-500 rounded-full group overflow-hidden btn-micro-press ${
                isActive
                    ? 'text-white shadow-xl shadow-blue-500/30 scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            aria-current={isActive ? 'page' : undefined}
            style={{
                background: isActive
                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                    : 'transparent',
            }}
        >
            {/* Dynamic glow on hover */}
            {!isActive && isHovered && (
                <span
                    className="absolute inset-0 rounded-full opacity-50"
                    style={{
                        background: `radial-gradient(150px circle at ${glowPos.x}% ${glowPos.y}%, rgba(59, 130, 246, 0.15), transparent 70%)`,
                    }}
                ></span>
            )}

            {children}
            {!isActive && (
                <>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 group-hover:w-1/2 transition-all duration-300 rounded-full shadow-lg shadow-blue-500/50"></span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                </>
            )}
            {isActive && (
                <>
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></span>
                    <span className="absolute inset-0 animate-shimmer-sweep"></span>
                </>
            )}
        </button>
    );
};

const CurrencySelector: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
    const { currency, setCurrency, currenciesList } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const commonCurrencies = ['EUR', 'USD', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SEK', 'DKK', 'PLN', 'CZK', 'HUF', 'BRL', 'TRY'];
    const otherCurrencies = currenciesList.filter(c => !commonCurrencies.includes(c.code));

    const handleToggle = () => {
        setIsAnimating(true);
        setIsOpen(!isOpen);
        setTimeout(() => setIsAnimating(false), 300);
    };

    return (
        <div className="relative">
            <button
                onClick={handleToggle}
                className={`flex items-center gap-1.5 transition-all duration-300 hover:scale-105 active:scale-95 ${
                    isMobile
                        ? 'text-base font-medium text-slate-800 dark:text-slate-200 px-4 py-3'
                        : 'text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                }`}
            >
                <span className="text-sm drop-shadow-sm">{currenciesList.find(c => c.code === currency)?.flag || '🇪🇺'}</span>
                <span className="uppercase tracking-wide">{currency}</span>
                <svg className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute right-0 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 rounded-2xl shadow-premium-lg z-[200] overflow-hidden ${
                    isAnimating ? 'animate-scale-in' : ''
                } ${isMobile ? 'top-full left-0 w-full' : 'w-64 max-h-80 overflow-y-auto'}`}>
                    <div className="p-2 space-y-1">
                        {commonCurrencies.map(currCode => {
                            const curr = currenciesList.find(c => c.code === currCode);
                            if (!curr) return null;
                            const isSelected = currency === curr.code;
                            return (
                                <button
                                    key={curr.code}
                                    onClick={() => { setCurrency(curr.code); setIsOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                                        isSelected
                                            ? 'bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/30 dark:to-violet-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <span className="text-base drop-shadow-sm">{curr.flag}</span>
                                    <span className="font-medium text-sm">{curr.code}</span>
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
                                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                                {otherCurrencies.slice(0, 10).map(curr => {
                                    const isSelected = currency === curr.code;
                                    return (
                                        <button
                                            key={curr.code}
                                            onClick={() => { setCurrency(curr.code); setIsOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                                                isSelected
                                                    ? 'bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/30 dark:to-violet-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <span className="text-base drop-shadow-sm">{curr.flag}</span>
                                            <span className="font-medium text-sm">{curr.code}</span>
                                            {isSelected && (
                                                <svg className="w-4 h-4 ml-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
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
            ? 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-premium-lg py-2'
            : 'bg-transparent border-transparent py-4'
    }`;

    return (
        <header className={headerClasses}>
            {/* Animated border gradient */}
            <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <button
                        onClick={() => setCurrentPage('home')}
                        className="flex-shrink-0 text-slate-900 dark:text-white hover:opacity-80 transition-all duration-300 hover:scale-105 active:scale-95 group"
                    >
                        <ScaleSiteLogo className="h-7 lg:h-8 transition-transform duration-300 group-hover:rotate-3" />
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center">
                        <div className="flex items-center gap-1.5 bg-slate-100/60 dark:bg-slate-800/60 backdrop-blur-md px-2 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
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
                            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center uppercase tracking-wider border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm"
                        >
                            {language}
                        </button>

                        <div className="h-5 w-px bg-gradient-to-b from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>

                        {user ? (
                            <button
                                onClick={() => setCurrentPage('dashboard')}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md group"
                            >
                                <UserCircleIcon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                                <span>{t('nav.dashboard')}</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setCurrentPage('login')}
                                    className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200 px-4 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    {t('nav.login')}
                                </button>
                                <button
                                    onClick={() => setCurrentPage('preise')}
                                    className="group relative flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 btn-micro-press overflow-hidden"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                                    <span className="absolute inset-0 animate-gradient-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
                                    <span className="relative z-10 flex items-center gap-2">
                                        {t('nav.projectStart')}
                                        <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                                    </span>
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
                            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 uppercase w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                        >
                            {language}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="relative p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105 active:scale-95 group"
                            aria-label={isMenuOpen ? t('nav.menuClose') : t('nav.menuOpen')}
                        >
                            <span className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-violet-500/10 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}></span>
                            {isMenuOpen ? (
                                <XMarkIcon className="w-6 h-6 relative transition-transform duration-300 rotate-90" />
                            ) : (
                                <Bars3Icon className="w-6 h-6 relative transition-transform duration-300 group-hover:rotate-180" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 lg:hidden transition-all duration-500 ${
                    isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                style={{ zIndex: 99 }}
            >
                {/* Animated background gradient for mobile menu */}
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/50 transition-opacity duration-700 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}></div>

                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] noise-bg"></div>

                {/* Floating decorative elements */}
                <div className="absolute top-20 left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl animate-morph-blob"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-violet-400/10 rounded-full blur-3xl animate-morph-blob" style={{ animationDelay: '3s' }}></div>

                <nav className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 relative z-10">
                    {navItems.map((item, index) => (
                        <button
                            key={item.page}
                            onClick={() => handleNavClick(item.page)}
                            className={`w-full max-w-xs text-xl font-medium transition-all duration-500 px-6 py-4 rounded-2xl text-center transform relative overflow-hidden group ${
                                currentPage === item.page
                                    ? 'text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-xl shadow-blue-500/25 scale-105'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:scale-105 hover:shadow-lg'
                            }`}
                            style={{
                                transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                                opacity: isMenuOpen ? 1 : 0,
                                transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                            }}
                        >
                            {currentPage === item.page && (
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20 animate-gradient-shimmer"></span>
                            )}
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {item.label}
                                {currentPage !== item.page && (
                                    <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                )}
                            </span>
                        </button>
                    ))}

                    <div className={`w-24 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent my-6 transition-all duration-500 ${isMenuOpen ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} style={{ transitionDelay: '250ms' }}></div>

                    {user ? (
                        <div className="flex flex-col items-center gap-4 w-full max-w-xs" style={{ transitionDelay: '300ms' }}>
                            <button
                                onClick={() => handleNavClick('dashboard')}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 text-lg font-medium text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-violet-50 dark:hover:from-blue-900/20 dark:hover:to-violet-900/20 hover:shadow-lg transition-all duration-300 group"
                            >
                                <UserCircleIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                                {t('nav.dashboard')}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors py-3 hover:scale-105 active:scale-95"
                            >
                                {t('nav.logout')}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                            <button
                                onClick={() => handleNavClick('preise')}
                                className="group w-full flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 btn-micro-press relative overflow-hidden"
                                style={{ transitionDelay: '300ms' }}
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-shimmer"></span>
                                <span className="absolute inset-0 shimmer-sweep"></span>
                                <span className="relative z-10 flex items-center gap-2">
                                    {t('nav.projectStart')}
                                    <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                                </span>
                            </button>
                            <button
                                onClick={() => handleNavClick('login')}
                                className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors py-4 hover:scale-105 active:scale-95"
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
