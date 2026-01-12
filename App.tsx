
import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { Layout } from './components/Layout';
import { PageTransition } from './components/PageTransition';
import { AnimatePresence } from 'framer-motion';
import { ChatWidget } from './components/ChatWidget';
import { CookieConsent } from './components/CookieConsent';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const LeistungenPage = lazy(() => import('./pages/LeistungenPage'));
const ProjektePage = lazy(() => import('./pages/ProjektePage'));
const AutomationenPage = lazy(() => import('./pages/AutomationenPage'));
const PreisePage = lazy(() => import('./pages/PreisePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ImpressumPage = lazy(() => import('./pages/ImpressumPage'));
const DatenschutzPage = lazy(() => import('./pages/DatenschutzPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const RestaurantPage = lazy(() => import('./pages/RestaurantPage'));
const ArchitecturePage = lazy(() => import('./pages/ArchitecturePage'));
const RealEstatePage = lazy(() => import('./pages/RealEstatePage'));

// Loading fallback component
const PageLoader: React.FC = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Loading...</p>
        </div>
    </div>
);

const AppContent: React.FC = () => {
    const [currentPage, setCurrentPage] = useState('home');
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
            contact: 'Kontakt aufnehmen',
            login: 'Login',
            register: 'Registrieren',
            dashboard: 'Mein Dashboard',
            impressum: 'Impressum',
            datenschutz: 'Datenschutz',
            faq: 'FAQ',
            restaurant: 'The Coffee House | Showcase',
            architecture: 'Richter Architects | Showcase',
            realestate: 'Premium Properties | Showcase'
        };
        document.title = pageTitles[currentPage] || 'ScaleSite';
    }, [currentPage]);

    // --- SAFETY RESET LOGIC ---
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (loading) {
            // If loading takes more than 8 seconds, offer a reset option
            // Increased from 3s because auth can take longer on some connections
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

    // --- PAGE ROUTING ---
    const getPage = () => {
        switch (currentPage) {
            case 'home': return <HomePage setCurrentPage={setCurrentPage} />;
            case 'leistungen': return <LeistungenPage setCurrentPage={setCurrentPage} />;
            case 'projekte': return <ProjektePage setCurrentPage={setCurrentPage} />;
            case 'automationen': return <AutomationenPage setCurrentPage={setCurrentPage} />;
            case 'preise': return <PreisePage setCurrentPage={setCurrentPage} />;
            case 'contact': return <ContactPage setCurrentPage={setCurrentPage} />;
            case 'login': return <LoginPage setCurrentPage={setCurrentPage} />;
            case 'register': return <RegisterPage setCurrentPage={setCurrentPage} />;
            case 'dashboard':
                if (!user) {
                    setTimeout(() => setCurrentPage('login'), 0);
                    return null;
                }
                return <DashboardPage setCurrentPage={setCurrentPage} />;
            case 'impressum': return <ImpressumPage />;
            case 'datenschutz': return <DatenschutzPage />;
            case 'faq': return <FaqPage />;
            case 'restaurant': return <RestaurantPage setCurrentPage={setCurrentPage} />;
            case 'architecture': return <ArchitecturePage setCurrentPage={setCurrentPage} />;
            case 'realestate': return <RealEstatePage setCurrentPage={setCurrentPage} />;
            default: return <HomePage setCurrentPage={setCurrentPage} />;
        }
    };

    // --- LOADING STATE ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Laden...</p>
                    {showReset && (
                        <button onClick={handleReset} className="mt-4 text-sm text-red-500 hover:text-red-600 underline">
                            App zurücksetzen
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <Layout setCurrentPage={setCurrentPage} currentPage={currentPage}>
            <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                    <AnimatePresence mode="wait">
                        <PageTransition key={currentPage}>
                            {getPage()}
                        </PageTransition>
                    </AnimatePresence>
                </Suspense>
            </ErrorBoundary>
            <ChatWidget />
            <CookieConsent />
        </Layout>
    );
};

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <LanguageProvider>
                    <CurrencyProvider>
                        <AppContent />
                    </CurrencyProvider>
                </LanguageProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
};

export default App;
