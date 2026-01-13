
import { useState, useEffect } from 'react';
import {
  DashboardLayout,
  Overview,
  TicketSupport,
  Services,
  Settings,
  Referral,
  Partner,
  Transactions,
  UserManagement,
  DiscountManager,
  NewsletterManager,
  AnalyticsDashboard
} from '../components';

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
            <div key={activeView} className="animated-section is-visible h-full">
                {renderContent()}
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;
