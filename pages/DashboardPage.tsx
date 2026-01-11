
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Overview from '../components/dashboard/Overview';
import TicketSupport from '../components/dashboard/TicketSupport';
import Services from '../components/dashboard/Services';
import Settings from '../components/dashboard/Settings';
import Referral from '../components/dashboard/Referral';
import Partner from '../components/dashboard/Partner';
import Transactions from '../components/dashboard/Transactions';
import TeamChat from '../components/dashboard/TeamChat';
import UserManagement from '../components/dashboard/UserManagement';
import Analytics from '../components/dashboard/Analytics';
import DatabaseViewer from '../components/dashboard/DatabaseViewer';
import BlogManager from '../components/dashboard/BlogManager';
import DiscountManager from '../components/dashboard/DiscountManager';
import TeamBoard from '../components/dashboard/TeamBoard';
import FileManager from '../components/dashboard/FileManager';

export type DashboardView = 'übersicht' | 'ticket-support' | 'dienstleistungen' | 'transaktionen' | 'einstellungen' | 'freunde-werben' | 'partner-werden' | 'team-chat' | 'user-management' | 'analyse' | 'database' | 'blog-manager' | 'discount-manager' | 'team-board' | 'file-manager';

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
            if (viewParam) {
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
            case 'team-chat':
                return <TeamChat />;
            case 'user-management':
                return <UserManagement />;
            case 'analyse':
                return <Analytics />;
            case 'database':
                return <DatabaseViewer />;
            case 'blog-manager':
                return <BlogManager />;
            case 'discount-manager':
                return <DiscountManager />;
            case 'team-board':
                return <TeamBoard />;
            case 'file-manager':
                return <FileManager />;
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
