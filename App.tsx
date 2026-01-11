
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { Layout } from './components/Layout';
import { PageTransition } from './components/PageTransition';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import LeistungenPage from './pages/LeistungenPage';
import ProjektePage from './pages/ProjektePage';
import AutomationenPage from './pages/AutomationenPage';
import PreisePage from './pages/PreisePage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CaseStudyDetailPage from './pages/CaseStudyDetailPage';
import ImpressumPage from './pages/ImpressumPage';
import DatenschutzPage from './pages/DatenschutzPage';
import FaqPage from './pages/FaqPage';
import GlossarPage from './pages/GlossarPage';
import StoryPage from './pages/StoryPage';
import RessourcenPage from './pages/RessourcenPage';
import { ChatWidget } from './components/ChatWidget';
import { CookieConsent } from './components/CookieConsent';
import { trackPageView, trackClick } from './lib/analytics';

const AppContent: React.FC = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const { user, loading } = useContext(AuthContext);
    const [showReset, setShowReset] = useState(false);

    // --- TITLE & METADATA MANAGEMENT ---
    useEffect(() => {
        const pageTitles: {[key: string]: string} = {
            home: 'ScaleSite | Exzellente Websites',
            leistungen: 'Leistungen | ScaleSite',
            projekte: 'Referenzen & Projekte',
            automationen: 'KI & Automation',
            preise: 'Preise & Pakete',
            blog: 'Blog & Insights',
            contact: 'Kontakt aufnehmen',
            login: 'Login',
            register: 'Registrieren',
            dashboard: 'Mein Dashboard',
            impressum: 'Impressum',
            datenschutz: 'Datenschutz'
        };
        document.title = pageTitles[currentPage] || 'ScaleSite';
    }, [currentPage]);

    // --- SAFETY RESET LOGIC ---
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (loading) {
            // If loading takes more than 8 seconds (increased from 4), offer a reset option
            timer = setTimeout(() => setShowReset(true), 8000);
        } else {
            setShowReset(false);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    const handleReset = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
    };
    // --------------------------

    // --- TRACKING LOGIC ---
    useEffect(() => {
        // Track Page View whenever currentPage changes
        trackPageView(currentPage);
    }, [currentPage]);

    useEffect(() => {
        // Global Click Tracking
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Try to find a meaningful name: Button text, Link text, or Aria label
            const element = target.closest('button, a');
            if (element) {
                const name = element.textContent?.slice(0, 30) || element.getAttribute('aria-label') || element.tagName;
                if (name) {
                    trackClick(name.trim(), currentPage);
                }
            }
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [currentPage]);
    // ----------------------

    const handleSetCurrentPage = (page: string) => {
        // Scroll to top happens automatically due to AnimatePresence exit/enter behavior usually, 
        // but keeping this ensures we start at top of new page logic.
        window.scrollTo(0, 0);
        setCurrentPage(page);
    }
    
    const handlePostSelect = (postId: string) => {
        setSelectedPostId(postId);
        handleSetCurrentPage('blog-detail');
    }

    // Auth Redirects
    useEffect(() => {
        if (!loading) {
            if (user && ['login', 'register'].includes(currentPage)) {
                handleSetCurrentPage('dashboard');
            } else if (!user && currentPage === 'dashboard') {
                handleSetCurrentPage('login');
            }
        }
    }, [user, loading, currentPage]);

    const renderPageContent = () => {
        switch (currentPage) {
            case 'home': return <HomePage setCurrentPage={handleSetCurrentPage} />;
            case 'leistungen': return <LeistungenPage setCurrentPage={handleSetCurrentPage} />;
            case 'projekte': return <ProjektePage setCurrentPage={handleSetCurrentPage} />;
            case 'automationen': return <AutomationenPage setCurrentPage={handleSetCurrentPage} />;
            case 'preise': return <PreisePage setCurrentPage={handleSetCurrentPage} />;
            case 'blog': return <BlogPage setCurrentPage={handleSetCurrentPage} onPostSelect={handlePostSelect} />;
            case 'blog-detail': return <CaseStudyDetailPage setCurrentPage={handleSetCurrentPage} postId={selectedPostId} />;
            case 'contact': return <ContactPage setCurrentPage={handleSetCurrentPage} />;
            case 'login': return <LoginPage setCurrentPage={handleSetCurrentPage} />;
            case 'register': return <RegisterPage setCurrentPage={handleSetCurrentPage} />;
            case 'dashboard': return <DashboardPage setCurrentPage={handleSetCurrentPage} />;
            case 'impressum': return <ImpressumPage setCurrentPage={handleSetCurrentPage} />;
            case 'datenschutz': return <DatenschutzPage setCurrentPage={handleSetCurrentPage} />;
            case 'faq': return <FaqPage setCurrentPage={handleSetCurrentPage} />;
            case 'glossar': return <GlossarPage setCurrentPage={handleSetCurrentPage} />;
            case 'story': return <StoryPage setCurrentPage={handleSetCurrentPage} />;
            case 'ressourcen': return <RessourcenPage setCurrentPage={handleSetCurrentPage} />;
            default: return <HomePage setCurrentPage={handleSetCurrentPage} />;
        }
    };

    const renderPage = () => {
        if (loading) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-light-bg dark:bg-dark-bg p-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
                    {showReset && (
                        <div className="text-center animate-fade-in max-w-md">
                            <p className="text-dark-text dark:text-light-text mb-4 font-medium">
                                Das Laden dauert länger als erwartet?
                            </p>
                            <button 
                                onClick={handleReset}
                                className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-dark-text dark:text-light-text rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all duration-300 shadow-lg"
                            >
                                App neu starten (Reset)
                            </button>
                            <p className="text-xs text-slate-400 mt-4 mx-auto leading-relaxed">
                                Dies löscht lokale Zwischenspeicher und behebt Probleme mit veralteten Sitzungen, die das Laden blockieren könnten.
                            </p>
                        </div>
                    )}
                </div>
            );
        }
        
        // Fullscreen pages without layout (login/register/dashboard)
        if (['login', 'register'].includes(currentPage)) {
             return (
                <AnimatePresence mode="wait">
                    <PageTransition key={currentPage}>
                        {renderPageContent()}
                    </PageTransition>
                </AnimatePresence>
            );
        }
        
        if (currentPage === 'dashboard') {
             // Show loading spinner if user check is failing, instead of null which flickers white
             if (!user) return (
                <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
             ); 
             return (
                 <AnimatePresence mode="wait">
                    <PageTransition key={currentPage}>
                        {renderPageContent()}
                    </PageTransition>
                </AnimatePresence>
             )
        }

        // Default Layout Pages
        return (
            <Layout currentPage={currentPage} setCurrentPage={handleSetCurrentPage}>
                <AnimatePresence mode="wait">
                    <PageTransition key={currentPage}>
                         {renderPageContent()}
                    </PageTransition>
                </AnimatePresence>
                <ChatWidget />
                <CookieConsent />
            </Layout>
        );
    };
    
    return renderPage();
};


const App: React.FC = () => (
    <AuthProvider>
        <LanguageProvider>
            <CurrencyProvider>
                <AppContent />
            </CurrencyProvider>
        </LanguageProvider>
    </AuthProvider>
);

export default App;
