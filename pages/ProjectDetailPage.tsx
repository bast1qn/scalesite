import { useState, useEffect, useContext, type FC } from 'react';
import { motion } from '@/lib/motion';
import { AuthContext } from '../contexts';
import { api, getSafeURL } from '../lib';
import { MilestoneTracker } from '../components/projects/MilestoneTracker';
import { StatusTimeline } from '../components/projects/StatusTimeline';
import type { Project, ProjectMilestone, TeamMember } from '../lib/supabase';
import {
    ArrowLeftIcon,
    BriefcaseIcon,
    CalendarDaysIcon,
    UserGroupIcon,
    DocumentTextIcon,
    CogIcon,
    BellIcon,
    ChartBarIcon
} from '../components/Icons';

interface PageProps {
    setCurrentPage: (page: string) => void;
}

const ProjectDetailPage: FC<PageProps> = ({ setCurrentPage }) => {
    // Get project ID from sessionStorage (set by ProjectList navigation)
    const id = typeof window !== 'undefined' ? sessionStorage.getItem('selectedProjectId') : null;
    const { user } = useContext(AuthContext);

    const [project, setProject] = useState<Project | null>(null);
    const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [activities, setActivities] = useState<Array<{
        id: string;
        text: string;
        time: string;
        type: 'info' | 'success' | 'warning';
    }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'team' | 'activity'>('overview');

    useEffect(() => {
        if (!id) return;

        const fetchProjectData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [projectRes, milestonesRes, teamRes] = await Promise.all([
                    api.getProjectById(id),
                    api.getMilestones(id),
                    api.getProjectTeam(id)
                ]);

                if (projectRes.error || !projectRes.data) {
                    setError('Projekt konnte nicht geladen werden');
                    return;
                }

                setProject(projectRes.data as Project);

                if (!milestonesRes.error) {
                    const milestoneData = Array.isArray(milestonesRes.data) ? milestonesRes.data : [];
                    setMilestones(milestoneData.sort((a: ProjectMilestone, b: ProjectMilestone) =>
                        a.order_index - b.order_index
                    ));
                }

                if (!teamRes.error) {
                    setTeamMembers(Array.isArray(teamRes.data) ? teamRes.data : []);
                }

                // Generate activities from data
                const generatedActivities: Array<{
                    id: string;
                    text: string;
                    time: string;
                    type: 'info' | 'success' | 'warning';
                }> = [];

                if (projectRes.data) {
                    const proj = projectRes.data as Project;
                    generatedActivities.push({
                        id: 'created',
                        text: `Projekt "${proj.name}" erstellt`,
                        time: getTimeAgo(new Date(proj.created_at)),
                        type: 'success'
                    });
                }

                if (milestonesRes.data && Array.isArray(milestonesRes.data)) {
                    milestonesRes.data
                        .filter((m: ProjectMilestone) => m.status === 'completed')
                        .slice(0, 3)
                        .forEach((m: ProjectMilestone) => {
                            generatedActivities.push({
                                id: `milestone-${m.id}`,
                                text: `Meilenstein "${m.title}" abgeschlossen`,
                                time: m.completed_at ? getTimeAgo(new Date(m.completed_at)) : '-',
                                type: 'success'
                            });
                        });
                }

                setActivities(generatedActivities.slice(0, 5));

            } catch (err) {
                console.error('Error fetching project data:', err);
                setError('Ein Fehler ist aufgetreten');
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [id]);

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
        return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
    };

    const handleMilestoneUpdate = (milestone: ProjectMilestone) => {
        setMilestones(prev =>
            prev.map(m => m.id === milestone.id ? milestone : m)
        );
    };

    const getStatusLabel = (status: Project['status']) => {
        const labels: Record<Project['status'], string> = {
            konzeption: 'Konzeption',
            design: 'Design',
            entwicklung: 'Entwicklung',
            review: 'Review',
            launch: 'Launch',
            active: 'Aktiv'
        };
        return labels[status];
    };

    const getStatusColor = (status: Project['status']) => {
        const colors: Record<Project['status'], string> = {
            konzeption: 'from-amber-500 to-yellow-500',
            design: 'from-purple-500 to-violet-500',
            entwicklung: 'from-blue-500 to-indigo-500',
            review: 'from-cyan-500 to-teal-500',
            launch: 'from-orange-500 to-amber-500',
            active: 'from-emerald-500 to-green-500'
        };
        return colors[status];
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-600 dark:text-slate-400">Projekt wird geladen...</p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Projekt nicht gefunden
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        {error || 'Das Projekt konnte nicht geladen werden.'}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage('dashboard')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                    >
                        Zurück
                    </motion.button>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'overview' as const, label: 'Übersicht', icon: ChartBarIcon },
        { id: 'milestones' as const, label: 'Meilensteine', icon: CalendarDaysIcon },
        { id: 'team' as const, label: 'Team', icon: UserGroupIcon },
        { id: 'activity' as const, label: 'Aktivität', icon: BellIcon }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <motion.button
                        whileHover={{ x: -4 }}
                        onClick={() => setCurrentPage('dashboard')}
                        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Zurück
                    </motion.button>

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                                    {project.name}
                                </h1>
                                <span className={`
                                    inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                                    bg-gradient-to-r ${getStatusColor(project.status)}
                                    text-white
                                `}>
                                    {getStatusLabel(project.status)}
                                </span>
                            </div>
                            {project.description && (
                                <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                                    {project.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
                            >
                                <CogIcon className="w-4 h-4" />
                                Einstellungen
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
                            >
                                <DocumentTextIcon className="w-4 h-4" />
                                Bericht
                            </motion.button>
                        </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="mt-8">
                        <StatusTimeline currentStatus={project.status} />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Fortschritt</span>
                            <BriefcaseIcon className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">
                            {project.progress}%
                        </div>
                        <div className="mt-3 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${project.progress}%` }}
                                transition={{ duration: 0.6 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Meilensteine</span>
                            <CalendarDaysIcon className="w-5 h-5 text-violet-500" />
                        </div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">
                            {milestones.filter(m => m.status === 'completed').length}/{milestones.length}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                            {milestones.filter(m => m.status === 'completed').length} von {milestones.length} abgeschlossen
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Team</span>
                            <UserGroupIcon className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">
                            {teamMembers.length}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                            Mitglieder im Projekt
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Launch</span>
                            <CalendarDaysIcon className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="text-lg font-black text-slate-900 dark:text-white">
                            {project.estimated_launch_date
                                ? new Date(project.estimated_launch_date).toLocaleDateString('de-DE', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })
                                : 'Nicht geplant'}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                            Geplantes Launch-Datum
                        </p>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="border-b border-slate-200 dark:border-slate-800">
                        <nav className="flex overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap
                                            ${activeTab === tab.id
                                                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                            }
                                        `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                        Projektübersicht
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Branche</h4>
                                            <p className="text-slate-900 dark:text-white font-medium">
                                                {project.industry || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Status</h4>
                                            <p className="text-slate-900 dark:text-white font-medium">
                                                {getStatusLabel(project.status)}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Erstellt am</h4>
                                            <p className="text-slate-900 dark:text-white font-medium">
                                                {new Date(project.created_at).toLocaleDateString('de-DE', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Letztes Update</h4>
                                            <p className="text-slate-900 dark:text-white font-medium">
                                                {getTimeAgo(new Date(project.updated_at))}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {project.preview_url && (
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Vorschau-URL</h4>
                                        <a
                                            href={getSafeURL(project.preview_url)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            {project.preview_url}
                                        </a>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'milestones' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <MilestoneTracker
                                    projectId={project.id}
                                    onMilestoneUpdate={handleMilestoneUpdate}
                                />
                            </motion.div>
                        )}

                        {activeTab === 'team' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {teamMembers.length > 0 ? (
                                    <div className="space-y-4">
                                        {teamMembers.map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold">
                                                        {member.member_id.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {member.member_id}
                                                        </p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                                                            {member.role}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`
                                                    inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                                                    ${member.status === 'active'
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                                    }
                                                `}>
                                                    {member.status === 'active' ? 'Aktiv' : 'Ausstehend'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <UserGroupIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                        <p className="text-slate-600 dark:text-slate-400">Keine Teammitglieder</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                                            Laden Sie Teammitglieder ein, um gemeinsam am Projekt zu arbeiten
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'activity' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {activities.length > 0 ? (
                                    <div className="relative pl-4 border-l border-slate-200 dark:border-slate-700 space-y-6">
                                        {activities.map((activity) => (
                                            <div key={activity.id} className="relative">
                                                <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                                                    activity.type === 'success' ? 'bg-emerald-500' :
                                                    activity.type === 'warning' ? 'bg-red-500' :
                                                    'bg-blue-500'
                                                }`} />
                                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                                    {activity.text}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <BellIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                        <p className="text-slate-600 dark:text-slate-400">Keine Aktivitäten</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailPage;
