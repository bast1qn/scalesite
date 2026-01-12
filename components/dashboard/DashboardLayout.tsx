
import React, { useContext, useState } from 'react';
import { AuthContext, AppUser } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { HomeIcon, TicketIcon, BriefcaseIcon, CreditCardIcon, Cog6ToothIcon, UserGroupIcon, BuildingStorefrontIcon, ArrowLeftOnRectangleIcon, XMarkIcon, Bars3Icon, ScaleSiteLogo, UsersIcon, TagIcon, ChevronDownIcon, ChevronUpIcon } from '../Icons';
import { DashboardView } from '../../pages/DashboardPage';

interface DashboardLayoutProps {
    children: React.ReactNode;
    activeView: DashboardView;
    setActiveView: (view: DashboardView) => void;
    setCurrentPage: (page: string) => void;
}

const NavLink: React.FC<{item: { view: DashboardView; label: string; icon: React.ReactNode }, activeView: DashboardView, onClick: (view: DashboardView) => void }> = ({ item, activeView, onClick }) => {
    const isActive = activeView === item.view;
    return (
        <button
            onClick={() => onClick(item.view)}
            className={`group flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                isActive
                    ? 'bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 shadow-sm border border-blue-200/50 dark:border-violet-700/50 relative overflow-hidden'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-violet-500/5 animate-gradient-shift"></div>
            )}
            <span className={`flex-shrink-0 transition-all duration-300 relative z-10 ${isActive ? 'text-blue-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-violet-400'}`}>
                {item.icon}
            </span>
            <span className="ml-3 relative z-10">{item.label}</span>
            {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 animate-pulse-slow"></div>}
        </button>
    );
};

const UserInfoFooter: React.FC<{user: AppUser | null, logout: () => void}> = ({user, logout}) => {
    const { t } = useLanguage();
    return (
    <div className="p-5 border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-b from-slate-50/80 to-white/80 dark:from-slate-900/80 dark:to-slate-900/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20 ring-2 ring-white dark:ring-slate-700">
                {user?.name ? user.name.charAt(0) : '?'}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500 font-medium truncate capitalize">{user?.role} Account</p>
            </div>
        </div>
        <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-700/50 dark:hover:text-red-400 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group"
        >
            <ArrowLeftOnRectangleIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"/>
            {t('nav.logout')}
        </button>
    </div>
);
};

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

    const handleNavClick = (view: DashboardView) => {
        setActiveView(view);
        closeSidebar();
    };

    // --- USER NAVIGATION ---
    if (!isTeam) {
        const userNavItems = [
            { view: 'übersicht', label: t('dashboard.nav.overview'), icon: <HomeIcon className="w-5 h-5"/> },
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
                <div className="flex flex-col h-full bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 border-r border-slate-200/50 dark:border-slate-700/50">
                <div className="px-6 py-6 flex items-center justify-between flex-shrink-0 border-b border-slate-100/80 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <button onClick={() => setCurrentPage('home')} className="text-slate-900 dark:text-white transition-opacity hover:opacity-80 group">
                        <ScaleSiteLogo className="h-7 transition-transform duration-300 group-hover:scale-105" />
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
                        <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Hauptmenü</p>
                        <nav className="space-y-0.5">
                            {userNavItems.map((item: any) => <NavLink key={item.view} item={item} activeView={activeView} onClick={handleNavClick} />)}
                        </nav>
                    </div>
                    <div>
                        <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Community</p>
                        <nav className="space-y-0.5">
                            {secondaryItems.map((item: any) => <NavLink key={item.view} item={item} activeView={activeView} onClick={handleNavClick} />)}
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
        { view: 'user-management', label: t('dashboard.users.title'), icon: <UsersIcon className="w-5 h-5"/> },
        { view: 'ticket-support', label: t('dashboard.nav.tickets'), icon: <TicketIcon className="w-5 h-5"/> },
    ];

    const adminTools = [
        { view: 'discount-manager', label: t('dashboard.discounts.title'), icon: <TagIcon className="w-5 h-5"/> },
    ];

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 border-r border-slate-200/50 dark:border-slate-700/50">
            <div className="px-6 py-6 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center flex-shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <button onClick={() => setCurrentPage('home')} className="text-slate-900 dark:text-white flex items-center gap-3 hover:opacity-80 group">
                    <ScaleSiteLogo className="h-6 transition-transform duration-300 group-hover:scale-105" />
                    <span className="text-[10px] font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white px-2.5 py-1 rounded-full tracking-wide shadow-md shadow-blue-500/20">TEAM</span>
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
                    <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Workspace</p>
                    <div className="space-y-0.5">
                        {workspaceItems.map((item: any) => <NavLink key={item.view} item={item} activeView={activeView} onClick={handleNavClick} />)}
                    </div>
                </div>
                
                <div>
                        <button 
                        onClick={() => setAdminGroupOpen(!adminGroupOpen)}
                        className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <span>Tools & Admin</span>
                        {adminGroupOpen ? <ChevronUpIcon className="w-3 h-3"/> : <ChevronDownIcon className="w-3 h-3"/>}
                    </button>
                    
                    {adminGroupOpen && (
                        <div className="mt-1 space-y-0.5 animate-fade-in">
                            {adminTools.map((item: any) => <NavLink key={item.view} item={item} activeView={activeView} onClick={handleNavClick} />)}
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
