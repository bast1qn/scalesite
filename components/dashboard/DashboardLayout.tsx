// ============================================
// IMPORTS
// ============================================

// React
import React, { useContext, useState, useCallback, memo } from 'react';

// Internal - Contexts & Types
import { AuthContext, AppUser, useLanguage } from '../../contexts';
import type { DashboardView } from '../../pages/DashboardPage';

// Internal - Icons
import {
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    BriefcaseIcon,
    BuildingStorefrontIcon,
    Cog6ToothIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ChartBarIcon,
    CreditCardIcon,
    EnvelopeIcon,
    HomeIcon,
    ScaleSiteLogo,
    TagIcon,
    TicketIcon,
    UserGroupIcon,
    UsersIcon,
    XMarkIcon,
} from '../Icons';

interface DashboardLayoutProps {
    children: React.ReactNode;
    activeView: DashboardView;
    setActiveView: (view: DashboardView) => void;
    setCurrentPage: (page: string) => void;
}

interface NavItem {
    view: DashboardView;
    label: string;
    icon: React.ReactNode;
}

// PERFORMANCE: Memoize NavLink to prevent unnecessary re-renders
const NavLink = React.memo<{item: NavItem, activeView: DashboardView, onClick: (view: DashboardView) => void }>(({ item, activeView, onClick }) => {
    const isActive = activeView === item.view;
    return (
        <button
            onClick={() => onClick(item.view)}
            className={`group relative flex items-center w-full px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300 overflow-hidden ${
                isActive
                    ? 'text-slate-900 dark:text-white shadow-lg shadow-blue-500/10 dark:shadow-violet-500/10 border border-blue-200/60 dark:border-violet-700/50'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-gradient-to-r hover:from-slate-50/80 hover:to-violet-50/30 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
            {/* Animated gradient background for active state */}
            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-indigo-500/10 animate-gradient-xy"></div>
            )}

            {/* Hover gradient for inactive state */}
            {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}

            {/* Active indicator bar */}
            {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-violet-500 rounded-r-full"></div>
            )}

            <span className={`flex-shrink-0 transition-all duration-300 relative z-10 ${isActive ? 'text-blue-600 dark:text-violet-400 scale-110' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-violet-400 group-hover:scale-[1.02]'}`}>
                {item.icon}
            </span>
            <span className={`ml-3 relative z-10 transition-all duration-300 ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>

            {/* Animated indicator dot */}
            {isActive && (
                <span className="ml-auto relative z-10 flex">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-blue-500 to-violet-500"></span>
                    </span>
                </span>
            )}
        </button>
    );
});

// PERFORMANCE: Memoize UserInfoFooter to prevent unnecessary re-renders
const UserInfoFooter = React.memo<{user: AppUser | null, logout: () => void}>(({user, logout}) => {
    const { t } = useLanguage();
    return (
    <div className="p-5 border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-slate-50/90 via-white/90 to-blue-50/30 dark:from-slate-900/90 dark:via-slate-900/90 dark:to-violet-950/30 backdrop-blur-xl shrink-0 relative overflow-hidden">
        {/* Decorative gradient orb */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-violet-400/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-4 relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/25 ring-2 ring-white dark:ring-slate-700/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {user?.name ? user.name.charAt(0) : '?'}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs font-medium truncate capitalize bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
                    {user?.role} Account
                </p>
            </div>
        </div>
        <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700/50 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-red-500/10 group"
        >
            <ArrowLeftOnRectangleIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"/>
            {t('nav.logout')}
        </button>
    </div>
    );
});

const SidebarContent: React.FC<{
    user: AppUser | null,
    activeView: DashboardView,
    setActiveView: (v: DashboardView) => void,
    setCurrentPage: (p: string) => void,
    closeSidebar: () => void,
    logout: () => void
}> = ({ user, activeView, setActiveView, setCurrentPage, closeSidebar, logout }) => {
    const { t } = useLanguage();
    const [adminGroupOpen, setAdminGroupOpen] = useState(true);
    const isTeam = user?.role === 'team' || user?.role === 'owner';

    // STABLE: Memoized nav click handler to prevent re-renders
    const handleNavClick = useCallback((view: DashboardView) => {
        setActiveView(view);
        closeSidebar();
    }, [setActiveView, closeSidebar]);

    // --- USER NAVIGATION ---
    if (!isTeam) {
        const userNavItems = [
            { view: 'übersicht', label: t('dashboard.nav.overview'), icon: <HomeIcon className="w-5 h-5"/> },
            { view: 'analytics', label: 'Analytics', icon: <ChartBarIcon className="w-5 h-5"/> },
            { view: 'ticket-support', label: t('dashboard.nav.tickets'), icon: <TicketIcon className="w-5 h-5"/> },
            { view: 'dienstleistungen', label: t('dashboard.nav.services'), icon: <BriefcaseIcon className="w-5 h-5"/> },
            { view: 'transaktionen', label: t('dashboard.nav.transactions'), icon: <CreditCardIcon className="w-5 h-5"/> },
            { view: 'einstellungen', label: t('dashboard.nav.settings'), icon: <Cog6ToothIcon className="w-5 h-5"/> },
        ];
        const secondaryItems = [
            { view: 'freunde-werben', label: t('dashboard.nav.referrals'), icon: <UserGroupIcon className="w-5 h-5"/> },
            { view: 'partner-werden', label: 'Partner werden', icon: <BuildingStorefrontIcon className="w-5 h-5"/> },
        ];

        return (
                <div className="flex flex-col h-full bg-gradient-to-b from-white via-white to-slate-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-r border-slate-200/60 dark:border-slate-700/60 relative">
                    {/* Subtle gradient accent at top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 opacity-80"></div>

                <div className="px-6 py-6 flex items-center justify-between flex-shrink-0 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
                    <button onClick={() => setCurrentPage('home')} className="text-slate-900 dark:text-white transition-opacity hover:opacity-80 group">
                        <ScaleSiteLogo className="h-7 transition-transform duration-300 group-hover:scale-[1.02]" />
                    </button>
                    <button
                            onClick={closeSidebar}
                            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 px-3 space-y-8 overflow-y-auto custom-scrollbar py-6">
                    <div>
                        <p className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            Hauptmenü
                        </p>
                        <nav className="space-y-1">
                            {userNavItems.map((item) => <NavLink key={item.view} item={item} activeView={activeView} onClick={handleNavClick} />)}
                        </nav>
                    </div>
                    <div>
                        <p className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                            Community
                        </p>
                        <nav className="space-y-1">
                            {secondaryItems.map((item) => <NavLink key={item.view} item={item} activeView={activeView} onClick={handleNavClick} />)}
                        </nav>
                    </div>
                </div>
                <UserInfoFooter user={user} logout={logout} />
            </div>
        )
    }

    // --- TEAM NAVIGATION ---
    const workspaceItems = [
        { view: 'übersicht', label: t('dashboard.nav.overview'), icon: <HomeIcon className="w-5 h-5"/> },
        { view: 'analytics', label: 'Analytics', icon: <ChartBarIcon className="w-5 h-5"/> },
        { view: 'user-management', label: t('dashboard.users.title'), icon: <UsersIcon className="w-5 h-5"/> },
        { view: 'ticket-support', label: t('dashboard.nav.tickets'), icon: <TicketIcon className="w-5 h-5"/> },
    ];

    const adminTools = [
        { view: 'discount-manager', label: t('dashboard.discounts.title'), icon: <TagIcon className="w-5 h-5"/> },
        { view: 'newsletter-manager', label: 'Newsletter', icon: <EnvelopeIcon className="w-5 h-5"/> },
    ];

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-white via-white to-slate-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-r border-slate-200/60 dark:border-slate-700/60 relative">
            {/* Subtle gradient accent at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-80"></div>

            <div className="px-6 py-6 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center flex-shrink-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
                    <button onClick={() => setCurrentPage('home')} className="text-slate-900 dark:text-white flex items-center gap-3 hover:opacity-80 group">
                    <ScaleSiteLogo className="h-6 transition-transform duration-300 group-hover:scale-[1.02]" />
                    <span className="text-[10px] font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-2.5 py-1 rounded-full tracking-wide shadow-lg shadow-violet-500/25">TEAM</span>
                </button>
                <button
                        onClick={closeSidebar}
                        className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <XMarkIcon className="w-6 h-6 text-slate-500" />
                </button>
            </div>
            <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto custom-scrollbar">
                <div>
                    <p className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                        Workspace
                    </p>
                    <div className="space-y-1">
                        {workspaceItems.map((item) => <NavLink key={item.view} item={item} activeView={activeView} onClick={handleNavClick} />)}
                    </div>
                </div>

                <div>
                        <button
                        onClick={() => setAdminGroupOpen(!adminGroupOpen)}
                        className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-300 transition-colors group"
                    >
                        <span className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full bg-indigo-500 transition-transform ${adminGroupOpen ? 'scale-125' : ''}`}></span>
                            Tools & Admin
                        </span>
                        <span className={`transition-transform duration-300 ${adminGroupOpen ? 'rotate-180' : ''}`}>
                            {adminGroupOpen ? <ChevronUpIcon className="w-3 h-3"/> : <ChevronDownIcon className="w-3 h-3"/>}
                        </span>
                    </button>

                    {adminGroupOpen && (
                        <div className="mt-2 space-y-1 animate-slide-down">
                            {adminTools.map((item) => <NavLink key={item.view} item={item} activeView={activeView} onClick={handleNavClick} />)}
                            <NavLink item={{ view: 'einstellungen', label: t('dashboard.nav.settings'), icon: <Cog6ToothIcon className="w-5 h-5"/> }} activeView={activeView} onClick={handleNavClick} />
                        </div>
                    )}
                </div>
            </nav>
            <UserInfoFooter user={user} logout={logout} />
        </div>
    );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeView, setActiveView, setCurrentPage }) => {
    const { user, logout } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 font-sans mesh-bg">
            {/* Mobile Sidebar Overlay */}
            <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${sidebarOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
                 <div 
                    className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
                    onClick={() => setSidebarOpen(false)}
                ></div>
                <div className={`absolute top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 flex flex-col h-full ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <SidebarContent 
                        user={user} 
                        activeView={activeView} 
                        setActiveView={setActiveView} 
                        setCurrentPage={setCurrentPage} 
                        closeSidebar={() => setSidebarOpen(false)}
                        logout={logout}
                    />
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 flex-shrink-0">
               <div className="fixed top-0 bottom-0 w-72 z-50">
                   <SidebarContent 
                        user={user} 
                        activeView={activeView} 
                        setActiveView={setActiveView} 
                        setCurrentPage={setCurrentPage} 
                        closeSidebar={() => setSidebarOpen(false)}
                        logout={logout}
                    />
               </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50 dark:bg-black/50">
                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <Bars3Icon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </button>
                    <ScaleSiteLogo className="h-6" />
                    <div className="w-8"></div> {/* Spacer */}
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 scroll-smooth custom-scrollbar">
                   <div className="max-w-7xl mx-auto animate-fade-in">
                        {children}
                   </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
