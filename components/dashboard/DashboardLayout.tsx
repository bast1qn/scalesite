
import React, { useContext, useState } from 'react';
import { AuthContext, AppUser } from '../../contexts/AuthContext';
import { HomeIcon, TicketIcon, BriefcaseIcon, CreditCardIcon, Cog6ToothIcon, UserGroupIcon, BuildingStorefrontIcon, ArrowLeftOnRectangleIcon, XMarkIcon, Bars3Icon, ScaleSiteLogo, ChatBubbleBottomCenterTextIcon, UsersIcon, ChartBarIcon, DatabaseIcon, PaintBrushIcon, TagIcon, ViewColumnsIcon, ChevronDownIcon, ChevronUpIcon, CloudArrowUpIcon } from '../Icons';
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
            className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                    ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
            <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                {item.icon}
            </span>
            <span className="ml-3">{item.label}</span>
            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></div>}
        </button>
    );
};

const UserInfoFooter: React.FC<{user: AppUser | null, logout: () => void}> = ({user, logout}) => (
    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 shrink-0">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-800">
                {user?.name ? user.name.charAt(0) : '?'}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">{user?.role} Account</p>
            </div>
        </div>
        <button 
            onClick={logout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-900/50 dark:hover:text-red-400 rounded-lg transition-all shadow-sm"
        >
            <ArrowLeftOnRectangleIcon className="w-4 h-4"/>
            Abmelden
        </button>
    </div>
);

const SidebarContent: React.FC<{
    user: AppUser | null, 
    activeView: DashboardView, 
    setActiveView: (v: DashboardView) => void, 
    setCurrentPage: (p: string) => void, 
    closeSidebar: () => void,
    logout: () => void
}> = ({ user, activeView, setActiveView, setCurrentPage, closeSidebar, logout }) => {
    const [adminGroupOpen, setAdminGroupOpen] = useState(true);
    const isTeam = user?.role === 'team' || user?.role === 'owner';
    const isOwner = user?.role === 'owner';

    const handleNavClick = (view: DashboardView) => {
        setActiveView(view);
        closeSidebar();
    };

    // --- USER NAVIGATION ---
    if (!isTeam) {
        const userNavItems = [
            { view: 'übersicht', label: 'Übersicht', icon: <HomeIcon className="w-5 h-5"/> },
            { view: 'ticket-support', label: 'Support Tickets', icon: <TicketIcon className="w-5 h-5"/> },
            { view: 'dienstleistungen', label: 'Meine Dienste', icon: <BriefcaseIcon className="w-5 h-5"/> },
            { view: 'file-manager', label: 'Dateien', icon: <CloudArrowUpIcon className="w-5 h-5"/> },
            { view: 'transaktionen', label: 'Rechnungen', icon: <CreditCardIcon className="w-5 h-5"/> },
            { view: 'einstellungen', label: 'Einstellungen', icon: <Cog6ToothIcon className="w-5 h-5"/> },
        ];
        const secondaryItems = [
            { view: 'freunde-werben', label: 'Freunde werben', icon: <UserGroupIcon className="w-5 h-5"/> },
            { view: 'partner-werden', label: 'Partner werden', icon: <BuildingStorefrontIcon className="w-5 h-5"/> },
        ];

        return (
                <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                <div className="px-6 py-6 flex items-center justify-between flex-shrink-0 border-b border-slate-100 dark:border-slate-800/50">
                    <button onClick={() => setCurrentPage('home')} className="text-dark-text dark:text-light-text transition-opacity hover:opacity-80">
                        <ScaleSiteLogo className="h-7" />
                    </button>
                    <button 
                            onClick={closeSidebar} 
                            className="lg:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
        { view: 'übersicht', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5"/> },
        { view: 'team-board', label: 'Mein Board', icon: <ViewColumnsIcon className="w-5 h-5"/> },
        { view: 'user-management', label: 'Kunden & Projekte', icon: <UsersIcon className="w-5 h-5"/> },
        { view: 'ticket-support', label: 'Support Inbox', icon: <TicketIcon className="w-5 h-5"/> },
        { view: 'team-chat', label: 'Team Chat', icon: <ChatBubbleBottomCenterTextIcon className="w-5 h-5"/> },
    ];

    const adminTools = [
        { view: 'blog-manager', label: 'Blog Content', icon: <PaintBrushIcon className="w-5 h-5"/> },
        { view: 'discount-manager', label: 'Marketing', icon: <TagIcon className="w-5 h-5"/> },
        ...(isOwner ? [
            { view: 'analyse', label: 'Analysen', icon: <ChartBarIcon className="w-5 h-5"/> },
            { view: 'database', label: 'Datenbank', icon: <DatabaseIcon className="w-5 h-5"/> }
        ] : [])
    ];

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
            <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center flex-shrink-0">
                    <button onClick={() => setCurrentPage('home')} className="text-dark-text dark:text-light-text flex items-center gap-3 hover:opacity-80">
                    <ScaleSiteLogo className="h-6" />
                    <span className="text-[10px] font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-2 py-0.5 rounded-full tracking-wide">TEAM</span>
                </button>
                <button 
                        onClick={closeSidebar} 
                        className="lg:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                            <NavLink item={{ view: 'einstellungen', label: 'Einstellungen', icon: <Cog6ToothIcon className="w-5 h-5"/> }} activeView={activeView} onClick={handleNavClick} />
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
        <div className="min-h-screen flex bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 font-sans">
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
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 dark:bg-black">
                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Bars3Icon className="w-6 h-6" />
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
