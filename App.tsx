import { useState, useEffect, useContext, lazy, Suspense, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthContext, AuthProvider, LanguageProvider, useLanguage, CurrencyProvider } from './contexts';
import { Layout, PageTransition, ChatWidget, CookieConsent, ErrorBoundary } from './components';

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
const ConfiguratorPage = lazy(() => import('./pages/ConfiguratorPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));

const PageLoader = () => {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{t('general.loading')}</p>
            </div>
        </div>
    );
};

const AppContent = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const { user, loading } = useContext(AuthContext);
    const { t } = useLanguage();
    const [showReset, setShowReset] = useState(false);

    // Stable callback for page navigation
    const handleNavigateToLogin = useCallback(() => {
        setCurrentPage('login');
    }, []);

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
            realestate: 'Premium Properties | Showcase',
            configurator: 'Website Konfigurator | ScaleSite'
        };
        document.title = pageTitles[currentPage] || 'ScaleSite';
    }, [currentPage]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (loading) {
            timer = setTimeout(() => setShowReset(true), 8000);
        } else {
            setShowReset(false);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    const handleReset = () => {
        try {
            localStorage.clear();
        } catch (error) {
            // localStorage clear failed - continue with reload
        }
        try {
            sessionStorage.clear();
        } catch (error) {
            // sessionStorage clear failed - continue with reload
        }
        window.location.reload();
    };

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
                if (!user) return null;
                return <DashboardPage setCurrentPage={setCurrentPage} />;
            case 'impressum': return <ImpressumPage />;
            case 'datenschutz': return <DatenschutzPage />;
            case 'faq': return <FaqPage />;
            case 'restaurant': return <RestaurantPage setCurrentPage={setCurrentPage} />;
            case 'architecture': return <ArchitecturePage setCurrentPage={setCurrentPage} />;
            case 'realestate': return <RealEstatePage setCurrentPage={setCurrentPage} />;
            case 'configurator': return <ConfiguratorPage setCurrentPage={setCurrentPage} />;
            case 'project-detail': return <ProjectDetailPage setCurrentPage={setCurrentPage} />;
            default: return <HomePage setCurrentPage={setCurrentPage} />;
        }
    };

    useEffect(() => {
        if (currentPage === 'dashboard' && !user && !loading) {
            handleNavigateToLogin();
        }
    }, [currentPage, user, loading, handleNavigateToLogin]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">{t('general.loading')}</p>
                    {showReset && (
                        <button onClick={handleReset} className="mt-4 text-sm text-red-500 hover:text-red-600 underline">
                            {t('general.reset_app')}
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

const App = () => {
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
