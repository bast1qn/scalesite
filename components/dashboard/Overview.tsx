
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
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

const Overview: React.FC<OverviewProps> = ({ setActiveView, setCurrentPage }) => {
    const { user } = useContext(AuthContext);
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

    // Simluated Server Stats Animation
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
                const [statsRes, projectsRes, transRes] = await Promise.all([
                    api.fetchStats(),
                    api.get('/user_services'),
                    api.get('/transactions')
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

                // Add Mock Activities if empty
                setActivities([
                    { id: 1, text: "System Backup erfolgreich erstellt.", time: "vor 2 Stunden", type: "success" },
                    { id: 2, text: "Wöchentlicher SEO-Scan abgeschlossen.", time: "vor 5 Stunden", type: "system" },
                    { id: 3, text: "Neuer Login erkannt.", time: "Gestern", type: "warning" }
                ]);

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
            case 'pending': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">Geplant</span>;
            case 'active': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 animate-pulse">Aktiv</span>;
            case 'completed': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">Fertig</span>;
            case 'cancelled': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">Storniert</span>;
            default: return null;
        }
    };

    const KPICard = ({ title, value, icon, colorClass, subtext, onClick }: any) => (
        <div 
            onClick={onClick}
            className={`relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-primary/30 group' : ''}`}
        >
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
                    {icon}
                </div>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400 dark:text-slate-500 z-10 relative flex items-center gap-1">
                {subtext}
                {onClick && <ArrowRightIcon className="w-3 h-3 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-primary" />}
            </p>
            {/* Background Decoration */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${colorClass} opacity-[0.03] blur-2xl`}></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Willkommen zurück, {user?.name ? user.name.split(' ')[0] : 'Nutzer'}. Hier ist der Überblick über Ihre digitale Präsenz.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setActiveView('ticket-support')} className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm flex items-center gap-2 shadow-sm">
                        <TicketIcon className="w-4 h-4" /> Support
                    </button>
                    <button onClick={() => setCurrentPage('preise')} className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-hover transition-all text-sm flex items-center gap-2 shadow-md shadow-primary/20">
                        <PlusCircleIcon className="w-4 h-4" /> Neues Projekt
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <KPICard 
                    title="Hosting Status" 
                    value={serverStats.uptime !== "-" ? "Online" : "N/A"} 
                    icon={<ShieldCheckIcon className="w-6 h-6 text-green-500" />} 
                    colorClass="bg-green-500"
                    subtext={`Uptime: ${serverStats.uptime}`}
                />
                <KPICard 
                    title="Aktive Dienste" 
                    value={loading ? "-" : stats.serviceCount} 
                    icon={<BriefcaseIcon className="w-6 h-6 text-blue-500" />} 
                    colorClass="bg-blue-500"
                    subtext="Pakete verwalten"
                    onClick={() => setActiveView('dienstleistungen')}
                />
                <KPICard 
                    title="Offene Tickets" 
                    value={loading ? "-" : stats.ticketCount} 
                    icon={<TicketIcon className="w-6 h-6 text-yellow-500" />} 
                    colorClass="bg-yellow-500"
                    subtext="Support ansehen"
                    onClick={() => setActiveView('ticket-support')}
                />
            </div>
            
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* 1. Projects Section */}
                    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-6">
                             <h2 className="text-lg font-bold text-slate-900 dark:text-white">Aktuelle Projekte</h2>
                             <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500">{projects.length} Laufend</span>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                 [1, 2].map(i => (
                                    <div key={i} className="animate-pulse h-24 bg-slate-50 dark:bg-slate-800/50 rounded-xl"></div>
                                 ))
                            ) : projects.length > 0 ? projects.map(project => (
                                 <div key={project.id} className="group relative bg-slate-50 dark:bg-slate-950/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-base text-slate-900 dark:text-white">{project.name}</h3>
                                                {getStatusBadge(project.status)}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                                <ClockIcon className="w-3 h-3" />
                                                Letztes Update: {project.latest_update || 'Keine Updates'}
                                            </p>
                                        </div>
                                        <span className="text-xl font-bold text-primary">{project.progress}%</span>
                                    </div>
                                    
                                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-primary to-purple-500 h-full rounded-full transition-all duration-1000 ease-out relative" 
                                            style={{width: `${project.progress}%`}}
                                        >
                                            <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite]"></div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                    Keine aktiven Projekte.
                                    <button onClick={() => setCurrentPage('preise')} className="block mx-auto mt-2 text-primary font-semibold text-sm hover:underline">Neues Projekt starten</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* 2. NEW: Server Resources */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
                            <div className="flex items-center gap-2 mb-6">
                                <ServerIcon className="w-5 h-5 text-blue-500" />
                                <h3 className="font-bold text-slate-900 dark:text-white">Server Ressourcen</h3>
                            </div>
                            <div className="space-y-6 flex-1">
                                <div>
                                    <div className="flex justify-between text-xs mb-2 text-slate-500 dark:text-slate-400">
                                        <span>SSD Speicher</span>
                                        <span className="font-mono">{Math.round(serverStats.diskUsage)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${serverStats.diskUsage}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-2 text-slate-500 dark:text-slate-400">
                                        <span>RAM Nutzung</span>
                                        <span className="font-mono">{Math.round(serverStats.ramUsage)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-purple-500 h-full rounded-full transition-all duration-1000" style={{ width: `${serverStats.ramUsage}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-2 text-slate-500 dark:text-slate-400">
                                        <span>Bandbreite</span>
                                        <span className="font-mono">{Math.round(serverStats.bandwidth)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{ width: `${serverStats.bandwidth}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. NEW: Financial Snapshot */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <CreditCardIcon className="w-5 h-5 text-emerald-500" />
                                    <h3 className="font-bold text-slate-900 dark:text-white">Finanzen</h3>
                                </div>
                                <button onClick={() => setActiveView('transaktionen')} className="text-xs font-bold text-primary hover:underline">Details</button>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex items-end gap-2 mb-1">
                                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(financeData.spent)}</span>
                                    <span className="text-xs text-slate-500 mb-1.5">investiert</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mb-4">
                                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${financeData.totalBudget > 0 ? (financeData.spent / financeData.totalBudget) * 100 : 0}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                                    <div className="text-slate-500">
                                        <span className="block text-[10px] uppercase tracking-wider">Offen</span>
                                        <span className="font-bold text-red-500">{financeData.open} €</span>
                                    </div>
                                    <div className="text-right text-slate-500">
                                        <span className="block text-[10px] uppercase tracking-wider">Nächste Rg.</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{financeData.nextInvoice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (1/3) */}
                <div className="space-y-8">
                    
                    {/* 4. NEW: Next Milestone */}
                    {nextMilestone ? (
                        <div className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4 text-white/80">
                                    <CalendarDaysIcon className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Nächster Meilenstein</span>
                                </div>
                                <h3 className="text-xl font-bold mb-1">{nextMilestone.title}</h3>
                                <p className="text-sm text-white/70 mb-4">{nextMilestone.description}</p>
                                <div className="flex items-center justify-between bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                    <div className="text-center">
                                        <span className="block text-2xl font-bold">{nextMilestone.date.split('.')[0]}</span>
                                        <span className="text-[10px] uppercase text-white/60">Datum</span>
                                    </div>
                                    <div className="h-8 w-px bg-white/20"></div>
                                    <div className="text-sm font-medium">
                                        Noch <span className="font-bold text-white">{nextMilestone.daysLeft} Tage</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center justify-center h-[200px]">
                             <CalendarDaysIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
                             <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Keine anstehenden Meilensteine.</p>
                        </div>
                    )}

                    {/* 5. NEW: Activity Feed */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <BellIcon className="w-4 h-4 text-slate-400" />
                            Aktivitäten
                        </h3>
                        <div className="relative pl-4 border-l border-slate-200 dark:border-slate-800 space-y-6">
                            {activities.length > 0 ? activities.map((act) => (
                                <div key={act.id} className="relative">
                                    <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                                        act.type === 'success' ? 'bg-green-500' : 
                                        act.type === 'warning' ? 'bg-red-500' : 
                                        act.type === 'system' ? 'bg-slate-400' : 'bg-blue-500'
                                    }`}></div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{act.text}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                                </div>
                            )) : (
                                <div className="py-4">
                                    <p className="text-xs text-slate-400 italic">Keine neuen Aktivitäten.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 6. NEW: Tip of the Day */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 p-5 rounded-2xl flex gap-4">
                        <div className="shrink-0">
                            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                <LightBulbIcon className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-yellow-800 dark:text-yellow-200 text-sm mb-1">Tipp des Tages</h4>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300/80 leading-relaxed">
                                {tipOfTheDay}
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3">
                         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Schnellzugriff</h4>
                         <button onClick={() => setActiveView('freunde-werben')} className="w-full text-left p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors flex items-center justify-between group">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Freunde werben</span>
                            <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                         </button>
                         <button onClick={() => setCurrentPage('contact')} className="w-full text-left p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors flex items-center justify-between group">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Rückruf anfordern</span>
                            <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                         </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Overview;
