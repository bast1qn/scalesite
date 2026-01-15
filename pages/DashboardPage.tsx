
import { useState, useEffect, lazy, Suspense } from 'react';
import { DashboardLayout } from '../components';

// ✅ PERFORMANCE: Component-level code splitting for dashboard views
// Reduces initial bundle from 148KB to ~20KB, loads views on-demand
const Overview = lazy(() => import('../components/dashboard/Overview').then(m => ({ default: m.default })));
const TicketSupport = lazy(() => import('../components/dashboard/TicketSupport').then(m => ({ default: m.default })));
const Services = lazy(() => import('../components/dashboard/Services').then(m => ({ default: m.default })));
const Settings = lazy(() => import('../components/dashboard/Settings').then(m => ({ default: m.default })));
const Referral = lazy(() => import('../components/dashboard/Referral').then(m => ({ default: m.default })));
const Partner = lazy(() => import('../components/dashboard/Partner').then(m => ({ default: m.default })));
const Transactions = lazy(() => import('../components/dashboard/Transactions').then(m => ({ default: m.default })));
const UserManagement = lazy(() => import('../components/dashboard/UserManagement').then(m => ({ default: m.default })));
const DiscountManager = lazy(() => import('../components/dashboard/DiscountManager').then(m => ({ default: m.default })));
const NewsletterManager = lazy(() => import('../components/dashboard/NewsletterManager').then(m => ({ default: m.default })));
const AnalyticsDashboard = lazy(() => import('../components/analytics/AnalyticsDashboard').then(m => ({ default: m.default })));

// Skeleton loader for dashboard views
const DashboardViewSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-1/3"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
      ))}
    </div>
  </div>
);

export type DashboardView = 'übersicht' | 'ticket-support' | 'dienstleistungen' | 'transaktionen' | 'einstellungen' | 'freunde-werben' | 'partner-werden' | 'user-management' | 'discount-manager' | 'newsletter-manager' | 'analytics';

interface DashboardPageProps {
    setCurrentPage: (page: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ setCurrentPage }) => {
    const [activeView, setActiveView] = useState<DashboardView>('übersicht');

    // Sync state with URL parameters on mount and navigation (popstate)
    useEffect(() => {
        const handleUrlChange = () => {
            const params = new URLSearchParams(window.location.search);
            const viewParam = params.get('view');

            // Defensively validate viewParam against allowed values
            const validViews: DashboardView[] = [
                'übersicht', 'ticket-support', 'dienstleistungen', 'transaktionen',
                'einstellungen', 'freunde-werben', 'partner-werden', 'user-management', 'discount-manager', 'newsletter-manager', 'analytics'
            ];

            if (viewParam && validViews.includes(viewParam as DashboardView)) {
                setActiveView(viewParam as DashboardView);
            } else {
                setActiveView('übersicht');
            }
        };

        // Initial check
        handleUrlChange();

        // Listen for back/forward button clicks
        window.addEventListener('popstate', handleUrlChange);

        return () => {
            window.removeEventListener('popstate', handleUrlChange);
        };
    }, []);

    const handleViewSet = (view: DashboardView) => {
        setActiveView(view);
        // Update URL without reloading
        const url = new URL(window.location.href);
        url.searchParams.set('view', view);
        window.history.pushState({}, '', url);
        // Scroll to top of dashboard content
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderContent = () => {
        switch (activeView) {
            case 'übersicht':
                return <Overview setActiveView={handleViewSet} setCurrentPage={setCurrentPage} />;
            case 'ticket-support':
                return <TicketSupport />;
            case 'dienstleistungen':
                return <Services setActiveView={handleViewSet} />;
            case 'transaktionen':
                return <Transactions />;
            case 'einstellungen':
                return <Settings />;
            case 'freunde-werben':
                return <Referral />;
            case 'partner-werden':
                return <Partner />;
            case 'user-management':
                return <UserManagement />;
            case 'discount-manager':
                return <DiscountManager />;
            case 'newsletter-manager':
                return <NewsletterManager />;
            case 'analytics':
                return <AnalyticsDashboard />;
            default:
                return <Overview setActiveView={handleViewSet} setCurrentPage={setCurrentPage} />;
        }
    }

    return (
        <DashboardLayout activeView={activeView} setActiveView={handleViewSet} setCurrentPage={setCurrentPage}>
            <Suspense fallback={<DashboardViewSkeleton />}>
                <div key={activeView} className="animated-section is-visible h-full">
                    {renderContent()}
                </div>
            </Suspense>
        </DashboardLayout>
    );
};

export default DashboardPage;
