
import React, { useState, useEffect, useContext } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { ArrowPathIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon, UserCircleIcon, ArrowLeftOnRectangleIcon, ScaleSiteLogo } from './Icons';
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
    isMobile?: boolean;
}> = ({ page, currentPage, onClick, children, isMobile = false }) => (
    <button
        onClick={() => onClick(page)}
        className={`transition-all duration-300 rounded-full relative overflow-hidden group ${
            isMobile
            ? `text-xl font-medium py-4 w-full text-center ${currentPage === page ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 bg-blue-50 dark:bg-blue-900/20 font-bold' : 'text-dark-text/80 dark:text-light-text/80 hover:bg-dark-text/5 dark:hover:bg-light-text/5'}`
            : `text-sm font-medium px-4 py-2 ${currentPage === page ? 'text-slate-900 dark:text-white font-bold bg-white/50 dark:bg-white/10 shadow-sm border border-slate-200/50 dark:border-slate-700/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5'}`
        }`}
        aria-current={currentPage === page ? 'page' : undefined}
    >
        {children}
    </button>
);

const CurrencySelector: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
    const { currency, setCurrency, currenciesList } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);

    const commonCurrencies = ['EUR', 'USD', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SEK', 'DKK', 'PLN', 'CZK', 'HUF', 'BRL', 'TRY'];
    const otherCurrencies = currenciesList.filter(c => !commonCurrencies.includes(c.code));

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 transition-colors ${isMobile ? 'text-sm font-medium text-dark-text dark:text-light-text px-4 py-2' : 'text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white'}`}
            >
                <span className="text-lg">{currenciesList.find(c => c.code === currency)?.flag || '🇪🇺'}</span>
                <span className="uppercase">{currency}</span>
                <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-[200] overflow-hidden ${isMobile ? 'top-full left-0 w-full' : 'w-72 max-h-96 overflow-y-auto'}`}>
                    <div className="p-2">
                        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 px-3 py-2 uppercase tracking-wider">
                            Popular
                        </div>
                        {commonCurrencies.map(currCode => {
                            const curr = currenciesList.find(c => c.code === currCode)!;
                            return (
                                <button
                                    key={curr.code}
                                    onClick={() => { setCurrency(curr.code); setIsOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${currency === curr.code ? 'bg-primary/10 text-primary' : 'text-slate-700 dark:text-slate-300'}`}
                                >
                                    <span className="text-lg">{curr.flag}</span>
                                    <span className="font-medium">{curr.code}</span>
                                    <span className="text-slate-400 dark:text-slate-500 text-sm">{curr.name}</span>
                                </button>
                            );
                        })}

                        {otherCurrencies.length > 0 && (
                            <>
                                <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>
                                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 px-3 py-2 uppercase tracking-wider">
                                    All
                                </div>
                                {otherCurrencies.map(curr => (
                                    <button
                                        key={curr.code}
                                        onClick={() => { setCurrency(curr.code); setIsOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${currency === curr.code ? 'bg-primary/10 text-primary' : 'text-slate-700 dark:text-slate-300'}`}
                                    >
                                        <span className="text-lg">{curr.flag}</span>
                                        <span className="font-medium">{curr.code}</span>
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
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isMenuOpen]);

    const handleLogout = () => {
        logout();
        setCurrentPage('home');
        if(isMenuOpen) setIsMenuOpen(false);
    }

    const handleNavClick = (page: string) => {
        if (isMenuOpen) setIsMenuOpen(false);
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
        { page: 'blog', label: t('nav.insights')},
        { page: 'contact', label: t('nav.contact')},
    ];

        const headerClasses = `fixed top-0 left-0 right-0 z-[90] transition-all duration-500 border-b ${
        isScrolled || isMenuOpen
            ? 'h-20 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 shadow-glass supports-[backdrop-filter]:bg-white/60'
            : 'h-24 bg-transparent border-transparent'
    }`;

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between relative z-[91]">
                <button onClick={() => setCurrentPage('home')} className="rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-dark-bg text-dark-text dark:text-light-text hover:opacity-80 transition-opacity">
                    <ScaleSiteLogo className={`transition-all duration-300 ${isScrolled || isMenuOpen ? 'h-6' : 'h-8'}`} />
                </button>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-full p-1.5 shadow-sm">
                   {navItems.map(item => (
                        <NavButton key={item.page} page={item.page} currentPage={currentPage} onClick={handleNavClick}>
                            {item.label}
                        </NavButton>
                    ))}
                </nav>

                <div className="hidden lg:flex items-center gap-3">
                     <CurrencySelector />

                     <button
                        onClick={toggleLanguage}
                        className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors w-8 uppercase tracking-wide"
                     >
                        {language}
                     </button>

                     <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>

                     {user ? (
                         <>
                            <button onClick={handleLogout} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors px-2">
                               {t('nav.logout')}
                            </button>
                            <button onClick={() => setCurrentPage('dashboard')} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm transform hover:-translate-y-0.5 active:translate-y-0">
                                <UserCircleIcon className="w-4 h-4"/> {t('nav.dashboard')}
                            </button>
                         </>
                     ) : (
                         <>
                            <button onClick={() => setCurrentPage('login')} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors px-2">
                                {t('nav.login')}
                            </button>
                            <button onClick={() => setCurrentPage('preise')} className="group relative bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 text-white font-bold px-6 py-2.5 rounded-full hover:shadow-glow transition-all duration-300 shadow-lg shadow-blue-500/25 text-sm flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 bg-[length:200%_auto] animate-gradient-shift">
                                <span className="relative z-10">Angebot sichern</span>
                                <ArrowRightOnRectangleIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform relative z-10" />
                            </button>
                         </>
                     )}
                    <div className="pl-2 ml-2 border-l border-slate-200 dark:border-slate-700">
                        <ThemeToggle />
                    </div>
                </div>

                {/* Mobile Controls */}
                 <div className="lg:hidden flex items-center gap-3">
                    <CurrencySelector isMobile={false} />
                    <button
                        onClick={toggleLanguage}
                        className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors uppercase"
                     >
                        {language}
                    </button>
                    <ThemeToggle />
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-full text-dark-text dark:text-light-text hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-[102]"
                        aria-label={isMenuOpen ? t('nav.menuClose') : t('nav.menuOpen')}
                    >
                        {isMenuOpen ? <XMarkIcon /> : <Bars3Icon />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay - Increased Z-Index */}
            <div
                className={`fixed inset-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl z-[100] transform transition-transform duration-500 ease-in-out lg:hidden flex flex-col overflow-y-auto max-h-screen ${
                    isMenuOpen ? 'translate-y-0' : '-translate-y-full'
                }`}
                style={{ top: 0 }}
            >
                 <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white dark:from-slate-950 to-transparent pointer-events-none"></div>

                 <nav className="flex flex-col items-center justify-center gap-2 p-6 w-full max-w-sm mx-auto relative z-10 min-h-full pt-24">
                    {navItems.map(item => (
                        <NavButton key={item.page} page={item.page} currentPage={currentPage} onClick={handleNavClick} isMobile>
                            {item.label}
                        </NavButton>
                    ))}

                    <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full my-4">
                        <CurrencySelector isMobile={true} />
                    </div>

                    <button onClick={() => handleNavClick('preise')} className="w-full bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl hover:shadow-glow transition-all shadow-xl shadow-blue-500/20 mb-4 transform active:scale-95 bg-[length:200%_auto] animate-gradient-shift">
                        {t('nav.projectStart')}
                    </button>

                    {user ? (
                        <div className="flex flex-col w-full gap-3">
                            <button onClick={() => handleNavClick('dashboard')} className="w-full border border-slate-200 dark:border-slate-800 text-dark-text dark:text-light-text font-semibold px-8 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
                                <UserCircleIcon className="w-5 h-5"/> {t('nav.dashboard')}
                            </button>
                             <button onClick={handleLogout} className="text-slate-500 dark:text-slate-400 font-medium py-2 hover:text-primary transition-colors">
                                {t('nav.logout')}
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => handleNavClick('login')} className="w-full border border-slate-200 dark:border-slate-800 text-dark-text dark:text-light-text font-semibold px-8 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                             {t('nav.login')}
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
};
