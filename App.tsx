// ========================================================================
// IMPORTS - Organized by: React → External → Internal → Types
// ========================================================================

// React
import { lazy, Suspense, useCallback, useContext, useEffect, useState } from 'react';

// External libraries
import { AnimatePresence } from 'framer-motion';

// Internal - Components
import { Layout, PageTransition, ChatWidget, CookieConsent, ErrorBoundary, NotificationToastContainer } from './components';

// Internal - Contexts
import { AuthContext, AuthProvider, LanguageProvider, useLanguage, CurrencyProvider, NotificationProvider, ThemeProvider } from './contexts';

// Internal - Constants
import { TIMING } from './lib/constants';

// Internal - Performance
import { initPerformanceMonitoring } from './lib/performance/monitoring';

// PERFORMANCE: Code Splitting with Strategic Prefetching
// High-priority pages (prefetch immediately on idle)
const HomePage = lazy(() => import('./pages/HomePage'));
const PreisePage = lazy(() => import('./pages/PreisePage'));
const ProjektePage = lazy(() => import('./pages/ProjektePage'));

// Medium-priority pages (prefetch on hover/interaction)
const LeistungenPage = lazy(() => import('./pages/LeistungenPage'));
const AutomationenPage = lazy(() => import('./pages/AutomationenPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Auth pages (load on demand)
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

// Protected routes (load on demand)
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));

// Legal pages (low priority)
const ImpressumPage = lazy(() => import('./pages/ImpressumPage'));
const DatenschutzPage = lazy(() => import('./pages/DatenschutzPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));

// Showcase pages (medium priority)
const RestaurantPage = lazy(() => import('./pages/RestaurantPage'));
const ArchitecturePage = lazy(() => import('./pages/ArchitecturePage'));
const RealEstatePage = lazy(() => import('./pages/RealEstatePage'));

// Feature pages (load on demand)
const ConfiguratorPage = lazy(() => import('./pages/ConfiguratorPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const SEOPage = lazy(() => import('./pages/SEOPage'));

const PageLoader = () => {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
            <div className="flex flex-col items-center gap-6 px-4">
                {/* Skeleton-style loading indicator */}
                <div className="relative w-16 h-16">
                    {/* Outer ring */}
                    <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                    {/* Animated ring */}
                    <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 border-r-primary-600 rounded-full animate-spin"></div>
                    {/* Inner glow */}
                    <div className="absolute inset-2 bg-gradient-to-br from-primary-500/10 to-violet-500/10 rounded-full animate-pulse"></div>
                </div>
                <div className="text-center">
                    <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">{t('general.loading')}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Bitte warten...</p>
                </div>
                {/* Progress hint - Loading dots animation */}
                <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary-500/40 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary-500/40 rounded-full animate-pulse" style={{ animationDelay: `${TIMING.staggerSlow}ms` }}></div>
                    <div className="w-2 h-2 bg-primary-500/40 rounded-full animate-pulse" style={{ animationDelay: `${TIMING.staggerSlow * 2}ms` }}></div>
                </div>
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

    // ✅ PERFORMANCE: Move pageTitles outside useEffect to prevent recreation on every render
    const pageTitles: {[key: string]: string} = useMemo(() => ({
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
        configurator: 'Website Konfigurator | ScaleSite',
        analytics: 'Analytics | ScaleSite',
        seo: 'SEO Tools | ScaleSite',
        chat: 'Chat | ScaleSite'
    }), []);

    /**
     * Set document title based on current page
     * Uses pageTitles mapping for SEO and browser tab identification
     */
    useEffect(() => {
        document.title = pageTitles[currentPage] || 'ScaleSite';
    }, [currentPage, pageTitles]); // ✅ FIXED: pageTitles is now stable (useMemo)

    /**
     * Show reset button after loading timeout
     * Prevents users from getting stuck in infinite loading state
     */
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (loading) {
            timer = setTimeout(() => setShowReset(true), TIMING.loadingTimeout);
        } else {
            setShowReset(false);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    /**
     * Reset application state and reload
     * Clears localStorage and sessionStorage as best-effort operation
     * Always reloads the page to ensure clean state
     */
    const handleReset = () => {
        try {
            localStorage.clear();
        } catch (error) {
            console.warn('localStorage clear failed:', error);
            // Continue with reload - storage clearing is best-effort
        }
        try {
            sessionStorage.clear();
        } catch (error) {
            console.warn('sessionStorage clear failed:', error);
            // Continue with reload - storage clearing is best-effort
        }
        window.location.reload();
    };

    /**
     * Route to appropriate page component based on currentPage state
     * Handles protected routes by checking user authentication
     * Returns null for protected routes when user is not authenticated
     */
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
            case 'analytics':
                if (!user) return null;
                return <AnalyticsPage setCurrentPage={setCurrentPage} />;
            case 'seo': return <SEOPage />;
            case 'chat':
                if (!user) return null;
                return <ChatPage setCurrentPage={setCurrentPage} />;
            default: return <HomePage setCurrentPage={setCurrentPage} />;
        }
    };

    /**
     * Redirect to login page for protected routes
     * Triggers when unauthenticated user accesses dashboard, analytics, or chat
     */
    useEffect(() => {
        const PROTECTED_ROUTES = ['dashboard', 'analytics', 'chat'] as const;
        type ProtectedRoute = typeof PROTECTED_ROUTES[number];
        if (PROTECTED_ROUTES.includes(currentPage as ProtectedRoute) && !user && !loading) {
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
            <NotificationToastContainer />
        </Layout>
    );
};

const App = () => {
    // PERFORMANCE: Initialize Core Web Vitals monitoring
    useEffect(() => {
        if (import.meta.env.PROD) {
            // Only monitor in production to avoid dev mode noise
            initPerformanceMonitoring().then((vitals) => {
                // Log vitals in development for debugging
                if (import.meta.env.DEV) {
                    console.log('[Performance] Core Web Vitals:', vitals);
                }
            }).catch((err) => {
                console.warn('[Performance] Failed to initialize monitoring:', err);
            });
        }
    }, []);

    return (
        <ErrorBoundary>
            <ThemeProvider defaultTheme="system">
                <AuthProvider>
                    <LanguageProvider>
                        <CurrencyProvider>
                            <NotificationProvider>
                                <AppContent />
                            </NotificationProvider>
                        </CurrencyProvider>
                    </LanguageProvider>
                </AuthProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
};

export default App;
