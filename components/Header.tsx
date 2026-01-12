
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

// Transcendent magnetic nav button with holographic effects
const NavButton: React.FC<{
    page: string;
    currentPage: string;
    onClick: (page: string) => void;
    children: React.ReactNode;
}> = ({ page, currentPage, onClick, children }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
    const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
    const [particlePositions, setParticlePositions] = useState<Array<{x: number, y: number, delay: number}>>([]);
    const isActive = currentPage === page;
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Initialize particles on hover
    useEffect(() => {
        if (isHovered && !isActive) {
            const positions = Array.from({ length: 6 }, () => ({
                x: Math.random() * 100,
                y: Math.random() * 100,
                delay: Math.random() * 0.3
            }));
            setParticlePositions(positions);
        }
    }, [isHovered, isActive]);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setGlowPos({ x, y });

        // Magnetic effect - pull button slightly towards cursor
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const offsetX = ((e.clientX - rect.left) - centerX) / 6;
        const offsetY = ((e.clientY - rect.top) - centerY) / 6;
        setMagneticOffset({ x: offsetX, y: offsetY });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setMagneticOffset({ x: 0, y: 0 });
    };

    return (
        <button
            ref={buttonRef}
            onClick={() => onClick(page)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            className={`relative px-5 py-2.5 text-sm font-medium transition-all duration-500 rounded-full group overflow-hidden btn-micro-press ${
                isActive
                    ? 'text-white shadow-glow-legendary-sm scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            style={{
                background: isActive
                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                    : 'transparent',
                transform: `translate(${magneticOffset.x}px, ${magneticOffset.y}px)`,
            }}
            aria-current={isActive ? 'page' : undefined}
        >
            {/* Transcendent multi-layer dynamic glow on hover */}
            {!isActive && (
                <>
                    {/* Primary glow layer */}
                    <span
                        className="absolute inset-0 rounded-full transition-opacity duration-300"
                        style={{
                            background: `radial-gradient(250px circle at ${glowPos.x}% ${glowPos.y}%, rgba(59, 130, 246, 0.25), rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.15), transparent 60%)`,
                            opacity: isHovered ? 1 : 0,
                        }}
                    ></span>
                    {/* Secondary holographic glow */}
                    <span
                        className="absolute inset-0 rounded-full holographic-base opacity-0 transition-opacity duration-500"
                        style={{ opacity: isHovered ? 0.3 : 0 }}
                    ></span>
                    {/* Floating particles */}
                    {isHovered && particlePositions.map((pos, i) => (
                        <span
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-blue-400 dark:bg-blue-300 animate-float-up-particle shadow-glow-legendary-sm"
                            style={{
                                left: `${pos.x}%`,
                                bottom: '20%',
                                animationDelay: `${pos.delay}s`,
                            }}
                        ></span>
                    ))}
                </>
            )}

            {children}
            {!isActive && (
                <>
                    {/* Enhanced animated underline with glow */}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 group-hover:w-3/4 transition-all duration-500 rounded-full shadow-glow-legendary-sm animate-pulse-glow"></span>
                    {/* Gradient sweep effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-violet-500/10 via-violet-500/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                    {/* Cyberpunk corner accents */}
                    <span className="absolute top-0 left-0 w-0 h-0 border-t-2 border-l-2 border-blue-400/0 group-hover:border-blue-400/50 dark:group-hover:border-blue-500/60 transition-all duration-300 rounded-tl-lg"></span>
                    <span className="absolute bottom-0 right-0 w-0 h-0 border-b-2 border-r-2 border-violet-400/0 group-hover:border-violet-400/50 dark:group-hover:border-violet-500/60 transition-all duration-300 rounded-br-lg"></span>
                </>
            )}
            {isActive && (
                <>
                    {/* Premium active state effects */}
                    <span className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent rounded-full"></span>
                    <span className="absolute inset-0 shimmer-sweep"></span>
                    <span className="absolute inset-0 animate-gradient-deluxe opacity-60"></span>
                    {/* Holographic overlay for active state */}
                    <span className="absolute inset-0 holographic-base opacity-40 rounded-full"></span>
                    {/* Pulsing glow ring */}
                    <span className="absolute inset-0 rounded-full border border-white/30 animate-ping-slow opacity-50"></span>
                    {/* Corner sparkles */}
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-glow-legendary-sm"></span>
                    <span className="absolute bottom-1 left-1 w-1 h-1 bg-white/70 rounded-full animate-pulse shadow-glow-legendary-sm" style={{ animationDelay: '0.5s' }}></span>
                </>
            )}
        </button>
    );
};

const CurrencySelector: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
    const { currency, setCurrency, currenciesList } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
    const [hoveredCurrency, setHoveredCurrency] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const commonCurrencies = ['EUR', 'USD', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SEK', 'DKK', 'PLN', 'CZK', 'HUF', 'BRL', 'TRY'];
    const otherCurrencies = currenciesList.filter(c => !commonCurrencies.includes(c.code));

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        setIsAnimating(true);
        setIsOpen(!isOpen);
        setTimeout(() => setIsAnimating(false), 300);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setGlowPos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                onMouseMove={handleMouseMove}
                className={`relative flex items-center gap-1.5 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden group ${
                    isMobile
                        ? 'text-base font-medium text-slate-800 dark:text-slate-200 px-4 py-3'
                        : 'text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-1.5 rounded-full border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                }`}
            >
                {/* Cyberpunk glow effect on hover */}
                {!isMobile && (
                    <span
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: `radial-gradient(150px circle at ${glowPos.x}% ${glowPos.y}%, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.1), transparent 70%)`,
                        }}
                    ></span>
                )}
                {/* Holographic shimmer */}
                <span className="absolute inset-0 holographic-base opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-500"></span>
                <span className="text-sm drop-shadow-sm relative z-10">{currenciesList.find(c => c.code === currency)?.flag || '🇪🇺'}</span>
                <span className="uppercase tracking-wide relative z-10">{currency}</span>
                <svg className={`w-3 h-3 transition-transform duration-300 relative z-10 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute right-0 mt-3 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl border-2 border-slate-200/80 dark:border-slate-700/80 rounded-3xl shadow-glow-legendary-lg z-[200] overflow-hidden ${
                    isAnimating ? 'animate-scale-in-reveal' : ''
                } ${isMobile ? 'top-full left-0 w-full' : 'w-72 max-h-96 overflow-y-auto scroll-hidden'}`}>
                    {/* Enhanced dropdown decorations */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 pointer-events-none"></div>
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 animate-gradient-deluxe"></div>

                    <div className="p-3 space-y-1.5 relative z-10">
                        {commonCurrencies.map((currCode, index) => {
                            const curr = currenciesList.find(c => c.code === currCode);
                            if (!curr) return null;
                            const isSelected = currency === curr.code;
                            const isHovered = hoveredCurrency === curr.code;
                            return (
                                <button
                                    key={curr.code}
                                    onClick={() => { setCurrency(curr.code); setIsOpen(false); }}
                                    onMouseEnter={() => setHoveredCurrency(curr.code)}
                                    onMouseLeave={() => setHoveredCurrency(null)}
                                    className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group overflow-hidden ${
                                        isSelected
                                            ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-glow-legendary-sm scale-[1.02]'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-[1.02]'
                                    }`}
                                    style={{ transitionDelay: `${index * 30}ms` }}
                                >
                                    {/* Holographic shimmer for selected */}
                                    {isSelected && (
                                        <>
                                            <span className="absolute inset-0 shimmer-sweep"></span>
                                            <span className="absolute inset-0 holographic-base opacity-30"></span>
                                        </>
                                    )}
                                    {/* Hover glow effect */}
                                    {!isSelected && isHovered && (
                                        <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-2xl"></span>
                                    )}
                                    <span className="text-lg drop-shadow-sm relative z-10">{curr.flag}</span>
                                    <span className={`font-medium text-sm relative z-10 ${isSelected ? 'text-white' : ''}`}>{curr.code}</span>
                                    {isSelected && (
                                        <svg className="w-5 h-5 ml-auto text-white animate-bounce-in" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}

                        {otherCurrencies.length > 0 && (
                            <>
                                <div className="border-t border-slate-200/50 dark:border-slate-700/50 my-2 relative">
                                    <div className="absolute inset-x-0 top-0 flex items-center justify-center">
                                        <span className="bg-slate-100 dark:bg-slate-800 px-3 text-xs text-slate-400 uppercase tracking-wider">More</span>
                                    </div>
                                </div>
                                {otherCurrencies.slice(0, 10).map((curr, index) => {
                                    const isSelected = currency === curr.code;
                                    const isHovered = hoveredCurrency === curr.code;
                                    return (
                                        <button
                                            key={curr.code}
                                            onClick={() => { setCurrency(curr.code); setIsOpen(false); }}
                                            onMouseEnter={() => setHoveredCurrency(curr.code)}
                                            onMouseLeave={() => setHoveredCurrency(null)}
                                            className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group overflow-hidden ${
                                                isSelected
                                                    ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-glow-legendary-sm scale-[1.02]'
                                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-[1.02]'
                                            }`}
                                            style={{ transitionDelay: `${(index + commonCurrencies.length) * 20}ms` }}
                                        >
                                            {isSelected && (
                                                <>
                                                    <span className="absolute inset-0 shimmer-sweep"></span>
                                                    <span className="absolute inset-0 holographic-base opacity-30"></span>
                                                </>
                                            )}
                                            {!isSelected && isHovered && (
                                                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-2xl"></span>
                                            )}
                                            <span className="text-base drop-shadow-sm relative z-10">{curr.flag}</span>
                                            <span className={`font-medium text-sm relative z-10 ${isSelected ? 'text-white' : ''}`}>{curr.code}</span>
                                            {isSelected && (
                                                <svg className="w-5 h-5 ml-auto text-white animate-bounce-in" fill="currentColor" viewBox="0 0 20 20">
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
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
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

    const handleHeaderMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!headerRef.current) return;
        const rect = headerRef.current.getBoundingClientRect();
        setGlowPos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
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
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b-2 border-slate-200/60 dark:border-slate-800/60 shadow-glow-legendary-sm py-2'
            : 'bg-transparent border-transparent py-4'
    }`;

    return (
        <header ref={headerRef} className={headerClasses} onMouseMove={handleHeaderMouseMove}>
            {/* Transcendent animated border gradient with aurora effect */}
            <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-blue-500/80 via-violet-500/80 via-cyan-500/60 to-transparent transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/50 via-violet-400/50 to-cyan-400/50 animate-gradient-flow"></div>
            </div>

            {/* Dynamic glow effect following cursor */}
            {isScrolled && (
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(300px circle at ${glowPos.x}% ${glowPos.y}%, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.05), transparent 70%)`,
                    }}
                ></div>
            )}

            {/* Holographic overlay for scrolled state */}
            {isScrolled && (
                <div className="absolute inset-0 holographic-base opacity-5 pointer-events-none transition-opacity duration-500"></div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Transcendent Logo */}
                    <button
                        onClick={() => setCurrentPage('home')}
                        className="flex-shrink-0 text-slate-900 dark:text-white hover:opacity-80 transition-all duration-500 hover:scale-105 active:scale-95 group relative"
                    >
                        {/* Multi-layer glow effects */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-violet-500/30 to-cyan-500/0 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow"></div>
                        <div className="absolute inset-0 holographic-base opacity-0 group-hover:opacity-30 rounded-full blur-xl transition-opacity duration-500"></div>
                        {/* Corner sparkles */}
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping-slow transition-opacity duration-300 shadow-glow-legendary-sm"></span>
                        <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping-slow transition-opacity duration-300 shadow-glow-legendary-sm" style={{ animationDelay: '0.3s' }}></span>
                        <ScaleSiteLogo className="h-7 lg:h-8 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 relative z-10" />
                    </button>

                    {/* Desktop Navigation with transcendent container */}
                    <nav className="hidden lg:flex items-center">
                        <div className="flex items-center gap-1.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl px-3 py-2 rounded-2xl border-2 border-slate-200/70 dark:border-slate-700/70 shadow-glow-legendary-sm hover:shadow-glow-legendary-md transition-all duration-500 relative overflow-hidden group/nav">
                            {/* Holographic background effect */}
                            <div className="absolute inset-0 holographic-base opacity-0 group-hover/nav:opacity-10 transition-opacity duration-500"></div>
                            {/* Animated top border */}
                            <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 rounded-full opacity-50 animate-gradient-deluxe"></div>
                            {navItems.map(item => (
                                <NavButton key={item.page} page={item.page} currentPage={currentPage} onClick={handleNavClick}>
                                    {item.label}
                                </NavButton>
                            ))}
                        </div>
                    </nav>

                    {/* Desktop Right Side with enhanced buttons */}
                    <div className="hidden lg:flex items-center gap-3">
                        <CurrencySelector />

                        {/* Language toggle with cyberpunk effect */}
                        <button
                            onClick={toggleLanguage}
                            className="relative text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-300 w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center uppercase tracking-wider border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 overflow-hidden group"
                        >
                            <span className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-violet-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="absolute inset-0 holographic-base opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-500"></span>
                            <span className="relative z-10">{language}</span>
                        </button>

                        <div className="h-5 w-px bg-gradient-to-b from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>

                        {user ? (
                            <button
                                onClick={() => setCurrentPage('dashboard')}
                                className="relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md group overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <UserCircleIcon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 relative z-10" />
                                <span className="relative z-10">{t('nav.dashboard')}</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setCurrentPage('login')}
                                    className="relative text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-300 px-4 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 overflow-hidden group"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                    <span className="relative z-10">{t('nav.login')}</span>
                                </button>
                                <button
                                    onClick={() => setCurrentPage('preise')}
                                    className="group relative flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:shadow-glow-legendary-lg hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300 btn-micro-press overflow-hidden btn-legendary btn-holographic"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-deluxe"></span>
                                    <span className="absolute inset-0 shimmer-sweep"></span>
                                    <span className="absolute inset-0 hover-shine-effect"></span>
                                    {/* Corner accents */}
                                    <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/40 rounded-tl-lg"></span>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/40 rounded-br-lg"></span>
                                    <span className="relative z-10 flex items-center gap-2">
                                        {t('nav.projectStart')}
                                        <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-125" />
                                    </span>
                                </button>
                            </>
                        )}

                        <div className="pl-3 border-l border-slate-200 dark:border-slate-700">
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Mobile Menu Button with transcendent effects */}
                    <div className="lg:hidden flex items-center gap-2">
                        <CurrencySelector />
                        <button
                            onClick={toggleLanguage}
                            className="relative text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 uppercase w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 overflow-hidden group"
                        >
                            <span className="absolute inset-0 holographic-base opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-500"></span>
                            <span className="relative z-10">{language}</span>
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="relative p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105 active:scale-95 group border-2 border-transparent hover:border-blue-400/60 dark:hover:border-violet-500/60 overflow-hidden"
                            aria-label={isMenuOpen ? t('nav.menuClose') : t('nav.menuOpen')}
                        >
                            {/* Animated background */}
                            <span className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-violet-500/20 transition-all duration-500 ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}></span>
                            {/* Holographic overlay */}
                            <span className={`absolute inset-0 holographic-base rounded-xl transition-all duration-500 ${isMenuOpen ? 'opacity-40' : 'opacity-0 group-hover:opacity-30'}`}></span>
                            {/* Corner accents */}
                            <span className="absolute top-1 left-1 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-glow-legendary-sm"></span>
                            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-glow-legendary-sm" style={{ transitionDelay: '0.1s' }}></span>
                            {isMenuOpen ? (
                                <XMarkIcon className="w-6 h-6 relative transition-transform duration-300 rotate-90 scale-110" />
                            ) : (
                                <Bars3Icon className="w-6 h-6 relative transition-transform duration-300 group-hover:rotate-180 group-hover:scale-110" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Transcendent Mobile Menu */}
            <div
                className={`fixed inset-0 lg:hidden transition-all duration-700 ${
                    isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                style={{ zIndex: 99 }}
            >
                {/* COSMIC QUANTUM MOBILE MENU BACKGROUND */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/50 to-violet-950 dark:from-slate-950 dark:via-blue-950/70 dark:to-violet-950/60 transition-opacity duration-700 animate-cosmic-shimmer"></div>

                {/* COSMIC AURORA LEGENDARY OVERLAY */}
                <div className={`absolute inset-0 bg-aurora-gradient animate-aurora-wave transition-opacity duration-1000 ${isMenuOpen ? 'opacity-60' : 'opacity-0'}`}></div>

                {/* COSMIC NEBULA OVERLAY */}
                <div className={`absolute inset-0 animate-nebula-cloud transition-opacity duration-1000 ${isMenuOpen ? 'opacity-50' : 'opacity-0'}`}
                    style={{
                        background: 'radial-gradient(ellipse at 30% 20%, rgba(138, 43, 226, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
                        animationDuration: '30s',
                    }}
                ></div>

                {/* GALAXY SWIRL OVERLAY */}
                <div className={`absolute inset-0 animate-galaxy-swirl transition-opacity duration-1000 ${isMenuOpen ? 'opacity-40' : 'opacity-0'}`}
                    style={{
                        background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 30% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 40%), radial-gradient(ellipse at 70% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 40%)',
                        animationDuration: '40s',
                    }}
                ></div>

                {/* Holographic overlay */}
                <div className={`absolute inset-0 holographic-base transition-opacity duration-700 ${isMenuOpen ? 'opacity-25' : 'opacity-0'}`}></div>

                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] noise-bg noise-bg-animated"></div>

                {/* COSMIC FLOATING DECORATIVE ORBS */}
                <div className={`absolute top-20 left-10 w-80 h-80 bg-gradient-to-br from-blue-500/30 to-cyan-500/20 rounded-full blur-3xl animate-nebula-cloud shadow-glow-cosmic transition-all duration-1000 ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} style={{ animationDelay: '0s' }}></div>
                <div className={`absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-violet-500/30 to-pink-500/20 rounded-full blur-3xl animate-nebula-cloud shadow-glow-nebula transition-all duration-1000 ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} style={{ animationDelay: '3s' }}></div>
                <div className={`absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-teal-400/15 rounded-full blur-3xl animate-antigravity shadow-glow-aurora transition-all duration-1000 ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} style={{ animationDelay: '1.5s' }}></div>
                <div className={`absolute bottom-1/3 right-1/4 w-56 h-56 bg-gradient-to-br from-rose-400/20 to-orange-400/15 rounded-full blur-3xl animate-antigravity shadow-glow-solar transition-all duration-1000 ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} style={{ animationDelay: '2.5s' }}></div>

                {/* Additional cosmic orbs */}
                <div className={`absolute top-[15%] right-[20%] w-40 h-40 bg-gradient-to-br from-cyan-400/25 to-blue-400/20 rounded-full blur-3xl animate-quantum-shift glow-cyan transition-all duration-1000 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '4s' }}></div>
                <div className={`absolute bottom-[25%] left-[15%] w-48 h-48 bg-gradient-to-br from-fuchsia-400/20 to-pink-400/15 rounded-full blur-3xl animate-magnetic-pulse glow-fuchsia transition-all duration-1000 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '5s' }}></div>

                {/* COSMIC ANIMATED GRID PATTERN */}
                <div className={`absolute inset-0 opacity-[0.05] dark:opacity-[0.08] transition-opacity duration-700 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} style={{
                    backgroundImage: 'radial-gradient(circle, currentColor 2px, transparent 2px)',
                    backgroundSize: '50px 50px',
                    animation: 'grid-pan 60s linear infinite',
                }}></div>

                {/* COSMIC STARDUST FIELD */}
                <div className={`absolute inset-0 stardust-field transition-opacity duration-700 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}></div>

                {/* COSMIC FLOATING PARTICLES - ENHANCED */}
                {isMenuOpen && Array.from({ length: 50 }).map((_, i) => (
                    <div
                        key={`particle-${i}`}
                        className={`absolute rounded-full animate-antigravity transition-all duration-1000 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            width: `${2 + Math.random() * 4}px`,
                            height: `${2 + Math.random() * 4}px`,
                            left: `${Math.random() * 100}%`,
                            bottom: `${Math.random() * 40}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${4 + Math.random() * 4}s`,
                            background: Math.random() > 0.5
                                ? 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)'
                                : 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, transparent 70%)',
                            boxShadow: `0 0 ${5 + Math.random() * 10}px ${Math.random() > 0.5 ? 'rgba(59, 130, 246, 0.6)' : 'rgba(139, 92, 246, 0.6)'}`,
                        }}
                    ></div>
                ))}

                <nav className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 relative z-10">
                    {navItems.map((item, index) => (
                        <button
                            key={item.page}
                            onClick={() => handleNavClick(item.page)}
                            className={`w-full max-w-xs text-xl font-medium transition-all duration-500 px-6 py-4 rounded-2xl text-center transform relative overflow-hidden group ${
                                currentPage === item.page
                                    ? 'text-white bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 shadow-glow-legendary-md scale-105 btn-holographic'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-white/95 dark:hover:bg-slate-800/95 hover:scale-105 hover:shadow-glow-legendary-sm border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                            }`}
                            style={{
                                transitionDelay: isMenuOpen ? `${index * 60}ms` : '0ms',
                                opacity: isMenuOpen ? 1 : 0,
                                transform: isMenuOpen ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                            }}
                        >
                            {/* Active state effects */}
                            {currentPage === item.page && (
                                <>
                                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-cyan-500/30 animate-gradient-deluxe"></span>
                                    <span className="absolute inset-0 shimmer-sweep"></span>
                                    <span className="absolute inset-0 holographic-base opacity-40"></span>
                                    {/* Pulsing border ring */}
                                    <span className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-ping-slow opacity-50"></span>
                                </>
                            )}
                            {/* Hover effects for inactive items */}
                            {currentPage !== item.page && (
                                <>
                                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-violet-500/10 to-cyan-500/0 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                                    <span className="absolute inset-0 holographic-base opacity-0 group-hover:opacity-15 transition-opacity duration-500 rounded-2xl"></span>
                                    {/* Corner accents */}
                                    <span className="absolute top-0 left-0 w-0 h-0 border-t-2 border-l-2 border-blue-400/0 group-hover:border-blue-400/60 dark:group-hover:border-blue-500/60 transition-all duration-300 rounded-tl-xl"></span>
                                    <span className="absolute bottom-0 right-0 w-0 h-0 border-b-2 border-r-2 border-violet-400/0 group-hover:border-violet-400/60 dark:group-hover:border-violet-500/60 transition-all duration-300 rounded-br-xl"></span>
                                </>
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

                    {/* Animated divider */}
                    <div className={`w-32 h-px bg-gradient-to-r from-transparent via-blue-400/60 via-violet-400/60 to-transparent my-6 transition-all duration-500 shadow-glow-legendary-sm ${isMenuOpen ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} style={{ transitionDelay: '300ms' }}></div>

                    {user ? (
                        <div className="flex flex-col items-center gap-4 w-full max-w-xs" style={{ transitionDelay: '350ms', opacity: isMenuOpen ? 1 : 0, transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)' }}>
                            <button
                                onClick={() => handleNavClick('dashboard')}
                                className="relative w-full flex items-center justify-center gap-3 px-6 py-4 text-lg font-medium text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-violet-50 dark:hover:from-blue-900/20 dark:hover:to-violet-900/20 hover:shadow-glow-legendary-sm hover:shadow-blue-500/30 transition-all duration-300 group overflow-hidden"
                            >
                                <span className="absolute inset-0 holographic-base opacity-0 group-hover:opacity-15 transition-opacity duration-500 rounded-2xl"></span>
                                <UserCircleIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 relative z-10" />
                                <span className="relative z-10">{t('nav.dashboard')}</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-300 py-3 hover:scale-105 active:scale-95 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl px-6"
                            >
                                {t('nav.logout')}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                            <button
                                onClick={() => handleNavClick('preise')}
                                className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 rounded-2xl hover:shadow-glow-legendary-lg hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300 btn-micro-press overflow-hidden btn-legendary btn-holographic"
                                style={{ transitionDelay: '350ms', opacity: isMenuOpen ? 1 : 0, transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)' }}
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 via-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-deluxe"></span>
                                <span className="absolute inset-0 shimmer-sweep"></span>
                                <span className="absolute inset-0 holographic-base opacity-30"></span>
                                {/* Corner accents */}
                                <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/50 rounded-tl-lg"></span>
                                <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/50 rounded-br-lg"></span>
                                <span className="relative z-10 flex items-center gap-2">
                                    {t('nav.projectStart')}
                                    <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-125" />
                                </span>
                            </button>
                            <button
                                onClick={() => handleNavClick('login')}
                                className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-300 py-4 hover:scale-105 active:scale-95 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl px-8"
                                style={{ transitionDelay: '400ms', opacity: isMenuOpen ? 1 : 0, transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)' }}
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
