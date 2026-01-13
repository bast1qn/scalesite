
import { useContext, useState, useEffect, useCallback, type FC, type ReactNode } from 'react';
import { AuthContext, useLanguage } from '../../contexts';
import { api } from '../../lib';
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
import type { DashboardView } from '../../pages/DashboardPage';

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

const getTimeAgo = (date: Date): string => {
    const now = new Date();
    // Validate date
    if (isNaN(date.getTime())) return '-';
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Handle future dates
    if (diffMs < 0) return 'in Kürze';
    if (diffMins < 1) return 'Gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Minute${diffMins > 1 ? 'n' : ''}`;
    if (diffHours < 24) return `vor ${diffHours} Stunde${diffHours > 1 ? 'n' : ''}`;
    if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;
    if (diffDays < 30) return `vor ${Math.floor(diffDays / 7)} Woche${Math.floor(diffDays / 7) > 1 ? 'n' : ''}`;
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
};

const Overview: FC<OverviewProps> = ({ setActiveView, setCurrentPage }) => {
    const { user } = useContext(AuthContext);
    const { t } = useLanguage();
    const [stats, setStats] = useState({ ticketCount: 0, serviceCount: 0 });
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // --- REAL DATA STATES (INITIALIZED TO 0) ---
    const [activities, setActivities] = useState<Array<{id: string; text: string; time: string; type: 'info' | 'success' | 'warning' | 'system'}>>([]);

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

    const [nextMilestone, setNextMilestone] = useState<{title: string; description: string; date: string; daysLeft: number} | null>(null);

    const tips = [
        "Bilder vor dem Upload komprimieren spart Ladezeit.",
        "Aktualisieren Sie regelmäßig Ihre Rechtstexte.",
        "Nutzen Sie interne Verlinkungen für besseres SEO.",
        "Prüfen Sie Ihre Website monatlich auf dem Smartphone."
    ];
    const [tipOfTheDay] = useState(tips[Math.floor(Math.random() * tips.length)]);

    // Memoized getStatusBadge function to prevent recreation on every render
    const getStatusBadge = useCallback((status: Project['status']) => {
        switch (status) {
            case 'pending': return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Geplant
                </span>
            );
            case 'active': return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    Aktiv
                </span>
            );
            case 'completed': return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm">
                    <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Fertig
                </span>
            );
            case 'cancelled': return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-800/40 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Storniert
                </span>
            );
            default: return null;
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        const interval = setInterval(() => {
            if (!isMounted) return;
            setServerStats(prev => ({
                ...prev,
                ramUsage: Math.min(100, Math.max(10, prev.ramUsage + (Math.random() * 6 - 3))),
                bandwidth: Math.min(100, Math.max(5, prev.bandwidth + (Math.random() * 4 - 2)))
            }));
        }, 3000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
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
                    const formattedProjects = projectsRes.data.map((s) => ({
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
                    transRes.data.forEach((t) => {
                        if (t.status === 'Bezahlt') spent += t.amount;
                        if (t.status === 'Offen') open += t.amount;
                    });
                    // Find next due invoice
                    const upcoming = transRes.data
                        .filter((t) => t.status === 'Offen' || t.status === 'Überfällig')
                        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];

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
                const activities: Array<{id: string; text: string; time: string; type: 'info' | 'success' | 'warning' | 'system'}> = [];

                // Add ticket activities
                if (ticketsRes.data && Array.isArray(ticketsRes.data)) {
                    ticketsRes.data.slice(0, 3).forEach((t) => {
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
                    projectsRes.data.slice(0, 2).forEach((s) => {
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

            } catch (error) {
                // Error fetching dashboard data - activities will remain empty
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();

        return () => { isMounted = false; };
    }, [user]);

    const KPICard = useCallback(({ title, value, icon, subtext, onClick }: {title?: string; value: string | number; icon: ReactNode; subtext?: ReactNode; onClick?: () => void}) => (
        <div
            onClick={onClick}
            className={`group relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 overflow-hidden transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95 hover:shadow-glow' : ''}`}
        >
            {/* Hover gradient overlay */}
            {onClick && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-violet-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:via-violet-500/5 group-hover:to-indigo-500/5 transition-all duration-300"></div>
            )}

            <div className="relative flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700/50 shadow-sm transition-all duration-300 ${onClick ? 'group-hover:scale-110 group-hover:rotate-3' : ''}`}>
                    {icon}
                </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 relative">
                {subtext}
                {onClick && <ArrowRightIcon className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-blue-500 transition-all duration-300" />}
            </p>
        </div>
    }, []); // Removed ArrowRightIcon from dependencies - it's a stable component import

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Modern Header with animated gradient */}
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white bg-gradient-to-br from-blue-600 via-violet-600 to-indigo-600 shadow-xl shadow-blue-500/20">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9nPjwvc3ZnPg==')] [size:20px]"></div>
                </div>
                {/* Animated gradient orbs */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-gradient-orb-1"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl animate-gradient-orb-2"></div>

                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            {t('dashboard.overview.welcome')} {user?.name ? user.name.split(' ')[0] : 'Nutzer'}
                        </h1>
                        <p className="text-white/80 mt-1 font-medium">{t('dashboard.overview.your_progress')}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setActiveView('ticket-support')} className="group px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-white/10 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-white/50 min-h-11">
                            <TicketIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            {t('dashboard.nav.tickets')}
                        </button>
                        <button onClick={() => setCurrentPage('preise')} className="group px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-500/50 min-h-11">
                            <PlusCircleIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
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

            {/* Projects Section */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 shadow-lg shadow-slate-200/50 dark:shadow-black/30">
                <div className="flex items-center justify-between mb-5">
                     <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <BriefcaseIcon className="w-5 h-5 text-blue-500" />
                        {t('dashboard.overview.recent_projects')}
                     </h2>
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200/60 dark:border-blue-800/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        {projects.length} Laufend
                     </span>
                </div>

                <div className="space-y-4">
                    {loading ? (
                         [1, 2].map(i => (
                            <div key={i} className="skeleton h-28 rounded-xl"></div>
                         ))
                    ) : projects.length > 0 ? projects.map((project) => (
                         <div key={project.id} className="group p-5 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-blue-300/60 dark:hover:border-blue-700/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 hover:scale-105 active:scale-95 cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">{project.name}</h3>
                                        {getStatusBadge(project.status)}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 leading-relaxed">
                                        <ClockIcon className="w-3.5 h-3.5" />
                                        Letztes Update: {project.latest_update || 'Keine Updates'}
                                    </p>
                                </div>
                                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent leading-tight">{project.progress}%</span>
                            </div>

                            <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                {/* Background pattern */}
                                <div className="absolute inset-0 opacity-10" style={{
                                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, currentColor 5px, currentColor 10px)'
                                }}></div>
                                {/* Animated progress bar */}
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                                    style={{ width: `${project.progress}%` }}
                                >
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-10 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-950/20 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                            <BriefcaseIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-500 dark:text-slate-400 mb-3">{t('dashboard.alerts.no_projects')}</p>
                            <button onClick={() => setCurrentPage('preise')} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline group">
                                {t('dashboard.alerts.start_project')}
                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Server Resources */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <ServerIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="font-bold text-slate-900 dark:text-white">Server Ressourcen</h3>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold">Demo</span>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: 'SSD Speicher', value: serverStats.diskUsage, color: 'bg-cyan-500' },
                                    { label: 'RAM Nutzung', value: serverStats.ramUsage, color: 'bg-violet-500' },
                                    { label: 'Bandbreite', value: serverStats.bandwidth, color: 'bg-indigo-500' }
                                ].map((item) => (
                                    <div key={item.label}>
                                        <div className="flex justify-between text-xs mb-1.5 text-slate-600 dark:text-slate-400">
                                            <span className="font-medium">{item.label}</span>
                                            <span className="font-bold">{Math.round(item.value)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                            <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${item.value}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Uptime</span>
                                <span className="font-black text-slate-900 dark:text-white">{serverStats.uptime}</span>
                            </div>
                        </div>

                        {/* Financial Snapshot */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <CreditCardIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    <h3 className="font-bold text-slate-900 dark:text-white">Finanzen</h3>
                                </div>
                                <button onClick={() => setActiveView('transaktionen')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors">Details</button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                                            {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(financeData.spent)}
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium">investiert</span>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${financeData.totalBudget > 0 ? (financeData.spent / financeData.totalBudget) * 100 : 0}%` }}></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <div className="text-center">
                                        <span className="block text-[10px] uppercase tracking-wide text-slate-500 font-semibold">Offen</span>
                                        <span className="text-sm font-black text-red-600">{financeData.open} €</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-[10px] uppercase tracking-wide text-slate-500 font-semibold">Nächste Rg.</span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{financeData.nextInvoice}</span>
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
                        <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl p-5 text-white shadow-lg shadow-blue-500/20">
                            <div className="flex items-center gap-2 mb-3 text-white/80 text-sm">
                                <CalendarDaysIcon className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Nächster Meilenstein</span>
                            </div>
                            <h3 className="font-bold mb-1">{nextMilestone.title}</h3>
                            <p className="text-sm text-white/80 mb-3">{nextMilestone.description}</p>
                            <div className="flex items-center justify-between bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                <div className="text-center">
                                    <span className="block text-lg font-black">{nextMilestone.date.split('.')[0]}</span>
                                    <span className="text-[10px] uppercase text-white/60 font-semibold">Datum</span>
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
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <BellIcon className="w-4 h-4 text-slate-400" />
                            Aktivitäten
                        </h3>
                        <div className="relative pl-4 border-l border-slate-200 dark:border-slate-800 space-y-4">
                            {activities.length > 0 ? activities.map((act) => (
                                <div key={act.id} className="relative group">
                                    <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 transition-all duration-300 ${
                                        act.type === 'success' ? 'bg-green-500 group-hover:scale-125' :
                                        act.type === 'warning' ? 'bg-red-500 group-hover:scale-125' :
                                        act.type === 'system' ? 'bg-slate-400 group-hover:scale-125' : 'bg-blue-500 group-hover:scale-125'
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
                            <h4 className="font-bold text-yellow-800 dark:text-yellow-200 text-sm mb-1">Tipp des Tages</h4>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300 leading-relaxed">
                                {tipOfTheDay}
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Schnellzugriff</h4>
                         <button onClick={() => setActiveView('freunde-werben')} className="group w-full text-left p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 flex items-center justify-between hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-500/50 min-h-11">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Freunde werben</span>
                            <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-500 transition-all" />
                         </button>
                         <button onClick={() => setCurrentPage('contact')} className="group w-full text-left p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 flex items-center justify-between hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-500/50 min-h-11">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Rückruf anfordern</span>
                            <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-500 transition-all" />
                         </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Overview;
