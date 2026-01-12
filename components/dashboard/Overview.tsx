
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../lib/api';
import {
    PlusCircleIcon,
    TicketIcon,
    BriefcaseIcon,
    ShieldCheckIcon,
    ArrowRightIcon,
    ClockIcon,
    CreditCardIcon,
    ServerIcon,
    CalendarDaysIcon,
    LightBulbIcon,
    BellIcon
} from '../Icons';
import { DashboardView } from '../../pages/DashboardPage';

interface Project {
    id: string;
    name: string;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    progress: number;
    latest_update?: string;
    created_at?: string;
}

interface OverviewProps {
    setActiveView: (view: DashboardView) => void;
    setCurrentPage: (page: string) => void;
}

// Helper function to format time ago
const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Minute${diffMins > 1 ? 'n' : ''}`;
    if (diffHours < 24) return `vor ${diffHours} Stunde${diffHours > 1 ? 'n' : ''}`;
    if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;
    if (diffDays < 30) return `vor ${Math.floor(diffDays / 7)} Woche${Math.floor(diffDays / 7) > 1 ? 'n' : ''}`;
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
};

const Overview: React.FC<OverviewProps> = ({ setActiveView, setCurrentPage }) => {
    const { user } = useContext(AuthContext);
    const { t } = useLanguage();
    const [stats, setStats] = useState({ ticketCount: 0, serviceCount: 0 });
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // --- REAL DATA STATES (INITIALIZED TO 0) ---
    const [activities, setActivities] = useState<any[]>([]);
    
    const [financeData, setFinanceData] = useState({
        totalBudget: 0,
        spent: 0,
        open: 0,
        nextInvoice: "-"
    });

    const [serverStats, setServerStats] = useState({
        diskUsage: 24,
        ramUsage: 42,
        bandwidth: 12,
        uptime: "99.9%"
    });

    const [nextMilestone, setNextMilestone] = useState<any>(null);

    const tips = [
        "Bilder vor dem Upload komprimieren spart Ladezeit.",
        "Aktualisieren Sie regelmäßig Ihre Rechtstexte.",
        "Nutzen Sie interne Verlinkungen für besseres SEO.",
        "Prüfen Sie Ihre Website monatlich auf dem Smartphone."
    ];
    const [tipOfTheDay] = useState(tips[Math.floor(Math.random() * tips.length)]);

    // Demo Server Stats - Simulated for visualization purposes
    // In production, this would come from actual server monitoring APIs
    useEffect(() => {
        const interval = setInterval(() => {
            setServerStats(prev => ({
                ...prev,
                ramUsage: Math.min(100, Math.max(10, prev.ramUsage + (Math.random() * 6 - 3))),
                bandwidth: Math.min(100, Math.max(5, prev.bandwidth + (Math.random() * 4 - 2)))
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!user) {
                if (isMounted) setLoading(false);
                return;
            }
            try {
                if (isMounted) setLoading(true);
                const [statsRes, projectsRes, transRes, ticketsRes] = await Promise.all([
                    api.getStats(),
                    api.getUserServices(),
                    api.getTransactions(),
                    api.getTickets()
                ]);

                if (!isMounted) return;

                if (!statsRes.error) setStats(statsRes.data);
                
                if (projectsRes.data && Array.isArray(projectsRes.data)) {
                    const formattedProjects = projectsRes.data.map((s: any) => ({
                        id: s.id,
                        name: s.services?.name || "Unbekannter Service",
                        status: s.status,
                        progress: s.progress || 0,
                        latest_update: s.latest_update,
                        created_at: s.created_at
                    }));
                    setProjects(formattedProjects);

                    // Logic for Next Milestone based on projects
                    const activeProject = formattedProjects.find((p: Project) => p.status === 'active');
                    if (activeProject) {
                        setNextMilestone({
                            title: "Live-Gang Review",
                            description: `Abschlussbesprechung für ${activeProject.name}`,
                            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                            daysLeft: 7
                        });
                    }
                } else {
                     setProjects([]);
                }

                // Calculate Finance from Real Transactions if available
                if (transRes.data && Array.isArray(transRes.data)) {
                    let spent = 0;
                    let open = 0;
                    transRes.data.forEach((t: any) => {
                        if (t.status === 'Bezahlt') spent += t.amount;
                        if (t.status === 'Offen') open += t.amount;
                    });
                    // Find next due invoice
                    const upcoming = transRes.data
                        .filter((t:any) => t.status === 'Offen' || t.status === 'Überfällig')
                        .sort((a:any,b:any) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];

                    setFinanceData({
                        totalBudget: spent + open,
                        spent,
                        open,
                        nextInvoice: upcoming ? new Date(upcoming.due_date).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' }) : "-"
                    });
                } else {
                    // Reset if array check fails or empty
                     setFinanceData({ totalBudget: 0, spent: 0, open: 0, nextInvoice: "-" });
                }

                // Generate activities from real data
                const activities: any[] = [];

                // Add ticket activities
                if (ticketsRes.data && Array.isArray(ticketsRes.data)) {
                    ticketsRes.data.slice(0, 3).forEach((t: any) => {
                        const timeAgo = getTimeAgo(new Date(t.created_at));
                        activities.push({
                            id: `ticket-${t.id}`,
                            text: `Ticket erstellt: ${t.subject}`,
                            time: timeAgo,
                            type: 'info'
                        });
                    });
                }

                // Add service activities
                if (projectsRes.data && Array.isArray(projectsRes.data)) {
                    projectsRes.data.slice(0, 2).forEach((s: any) => {
                        if (s.status === 'active') {
                            const timeAgo = getTimeAgo(new Date(s.created_at));
                            activities.push({
                                id: `service-${s.id}`,
                                text: `Projekt gestartet: ${s.services?.name || 'Dienstleistung'}`,
                                time: timeAgo,
                                type: 'success'
                            });
                        }
                    });
                }

                // Add a welcome message if no activities
                if (activities.length === 0) {
                    activities.push({
                        id: 'welcome',
                        text: t('dashboard.alerts.welcome_dashboard'),
                        time: 'Jetzt',
                        type: 'info'
                    });
                }

                setActivities(activities.slice(0, 5));

            } catch (error: any) {
                console.warn("Error fetching dashboard data:", error.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();

        return () => { isMounted = false; };
    }, [user]);

    const getStatusBadge = (status: Project['status']) => {
        switch (status) {
            case 'pending': return (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/30">
                    Geplant
                </span>
            );
            case 'active': return (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30">
                    Aktiv
                </span>
            );
            case 'completed': return (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/30">
                    Fertig
                </span>
            );
            case 'cancelled': return (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/30">
                    Storniert
                </span>
            );
            default: return null;
        }
    };

    const KPICard = ({ title, value, icon, subtext, onClick }: any) => (
        <div
            onClick={onClick}
            className={`p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800/50 transition-all' : ''}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
                </div>
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                    {icon}
                </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                {subtext}
                {onClick && <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-500" />}
            </p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Clean Header */}
            <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-6 sm:p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">
                            {t('dashboard.overview.welcome')} {user?.name ? user.name.split(' ')[0] : 'Nutzer'}
                        </h1>
                        <p className="text-white/80 mt-1">{t('dashboard.overview.your_progress')}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setActiveView('ticket-support')} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                            <TicketIcon className="w-4 h-4" />
                            {t('dashboard.nav.tickets')}
                        </button>
                        <button onClick={() => setCurrentPage('preise')} className="px-5 py-2 bg-white text-blue-600 hover:bg-gray-50 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
                            <PlusCircleIcon className="w-4 h-4" />
                            {t('dashboard.alerts.new_project')}
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <KPICard
                    title={t('dashboard.alerts.hosting_status')}
                    value={serverStats.uptime !== "-" ? "Online" : "N/A"}
                    icon={<ShieldCheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />}
                    subtext={`Uptime: ${serverStats.uptime}`}
                />
                <KPICard
                    title={t('dashboard.alerts.active_services')}
                    value={loading ? "-" : stats.serviceCount}
                    icon={<BriefcaseIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                    subtext="Pakete verwalten"
                    onClick={() => setActiveView('dienstleistungen')}
                />
                <KPICard
                    title={t('dashboard.alerts.open_tickets')}
                    value={loading ? "-" : stats.ticketCount}
                    icon={<TicketIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                    subtext="Support ansehen"
                    onClick={() => setActiveView('ticket-support')}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Projects Section */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                             <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t('dashboard.overview.recent_projects')}</h2>
                             <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                                {projects.length} Laufend
                             </span>
                        </div>

                        <div className="space-y-3">
                            {loading ? (
                                 [1, 2].map(i => (
                                    <div key={i} className="animate-pulse h-24 bg-slate-50 dark:bg-slate-800/50 rounded-lg"></div>
                                 ))
                            ) : projects.length > 0 ? projects.map((project) => (
                                 <div key={project.id} className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-slate-900 dark:text-white">{project.name}</h3>
                                                {getStatusBadge(project.status)}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                <ClockIcon className="w-3 h-3" />
                                                Letztes Update: {project.latest_update || 'Keine Updates'}
                                            </p>
                                        </div>
                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{project.progress}%</span>
                                    </div>

                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                                    <p className="text-slate-500 dark:text-slate-400 mb-3">{t('dashboard.alerts.no_projects')}</p>
                                    <button onClick={() => setCurrentPage('preise')} className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline">
                                        {t('dashboard.alerts.start_project')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Server Resources */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <ServerIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Server Ressourcen</h3>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium">Demo</span>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: 'SSD Speicher', value: serverStats.diskUsage, color: 'bg-cyan-500' },
                                    { label: 'RAM Nutzung', value: serverStats.ramUsage, color: 'bg-violet-500' },
                                    { label: 'Bandbreite', value: serverStats.bandwidth, color: 'bg-indigo-500' }
                                ].map((item) => (
                                    <div key={item.label}>
                                        <div className="flex justify-between text-xs mb-1.5 text-slate-600 dark:text-slate-400">
                                            <span>{item.label}</span>
                                            <span className="font-medium">{Math.round(item.value)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                            <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${item.value}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Uptime</span>
                                <span className="font-semibold text-slate-900 dark:text-white">{serverStats.uptime}</span>
                            </div>
                        </div>

                        {/* Financial Snapshot */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <CreditCardIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Finanzen</h3>
                                </div>
                                <button onClick={() => setActiveView('transaktionen')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Details</button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(financeData.spent)}
                                        </span>
                                        <span className="text-xs text-slate-500">investiert</span>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${financeData.totalBudget > 0 ? (financeData.spent / financeData.totalBudget) * 100 : 0}%` }}></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <div className="text-center">
                                        <span className="block text-[10px] uppercase text-slate-500">Offen</span>
                                        <span className="text-sm font-bold text-red-600">{financeData.open} €</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-[10px] uppercase text-slate-500">Nächste Rg.</span>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{financeData.nextInvoice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (1/3) */}
                <div className="space-y-6">

                    {/* Next Milestone */}
                    {nextMilestone ? (
                        <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl p-5 text-white">
                            <div className="flex items-center gap-2 mb-3 text-white/80 text-sm">
                                <CalendarDaysIcon className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Nächster Meilenstein</span>
                            </div>
                            <h3 className="font-semibold mb-1">{nextMilestone.title}</h3>
                            <p className="text-sm text-white/80 mb-3">{nextMilestone.description}</p>
                            <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                                <div className="text-center">
                                    <span className="block text-lg font-bold">{nextMilestone.date.split('.')[0]}</span>
                                    <span className="text-[10px] uppercase text-white/60">Datum</span>
                                </div>
                                <div className="h-6 w-px bg-white/20"></div>
                                <div className="text-sm">
                                    Noch <span className="font-bold">{nextMilestone.daysLeft} Tage</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 text-center border border-dashed border-slate-200 dark:border-slate-800">
                             <CalendarDaysIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                             <p className="text-sm text-slate-500 dark:text-slate-400">Keine anstehenden Meilensteine.</p>
                        </div>
                    )}

                    {/* Activity Feed */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <BellIcon className="w-4 h-4 text-slate-400" />
                            Aktivitäten
                        </h3>
                        <div className="relative pl-4 border-l border-slate-200 dark:border-slate-800 space-y-4">
                            {activities.length > 0 ? activities.map((act) => (
                                <div key={act.id} className="relative">
                                    <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                                        act.type === 'success' ? 'bg-green-500' :
                                        act.type === 'warning' ? 'bg-red-500' :
                                        act.type === 'system' ? 'bg-slate-400' : 'bg-blue-500'
                                    }`}></div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{act.text}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                                </div>
                            )) : (
                                <div className="py-4 text-center text-xs text-slate-400">Keine neuen Aktivitäten.</div>
                            )}
                        </div>
                    </div>

                    {/* Tip of the Day */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 p-4 rounded-xl flex gap-3">
                        <div className="shrink-0">
                            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                <LightBulbIcon className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm mb-1">Tipp des Tages</h4>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                {tipOfTheDay}
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                         <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Schnellzugriff</h4>
                         <button onClick={() => setActiveView('freunde-werben')} className="w-full text-left p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors flex items-center justify-between">
                            <span className="text-sm text-slate-700 dark:text-slate-300">Freunde werben</span>
                            <ArrowRightIcon className="w-4 h-4 text-slate-400" />
                         </button>
                         <button onClick={() => setCurrentPage('contact')} className="w-full text-left p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors flex items-center justify-between">
                            <span className="text-sm text-slate-700 dark:text-slate-300">Rückruf anfordern</span>
                            <ArrowRightIcon className="w-4 h-4 text-slate-400" />
                         </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Overview;
