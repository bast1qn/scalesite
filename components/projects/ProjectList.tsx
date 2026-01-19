import { useState, useEffect, useCallback, useMemo, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { StatusTimeline } from './StatusTimeline';
import { api } from '../../lib/api';
import { useDebounce } from '../../lib/hooks/useDebounce';
import {
    DocumentMagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    ChevronDownIcon,
    BriefcaseIcon
} from '../Icons';
import { ProjectCardSkeleton } from '../skeleton';

export interface Project {
    id: string;
    name: string;
    description?: string;
    status: 'konzeption' | 'design' | 'entwicklung' | 'review' | 'launch' | 'active';
    progress: number;
    estimated_launch_date?: string;
    updated_at?: string;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'status' | 'progress' | 'date';
type FilterStatus = 'all' | 'konzeption' | 'design' | 'entwicklung' | 'review' | 'launch' | 'active';

interface ProjectListProps {
    onProjectClick?: (projectId: string) => void;
    limit?: number;
    showTimeline?: boolean;
    className?: string;
    setCurrentPage?: (page: string) => void;
}

const statusLabels: Record<FilterStatus, string> = {
    all: 'Alle Status',
    konzeption: 'Konzeption',
    design: 'Design',
    entwicklung: 'Entwicklung',
    review: 'Review',
    launch: 'Launch',
    active: 'Aktiv'
};

const sortOptions: Record<SortOption, string> = {
    name: 'Name (A-Z)',
    status: 'Status',
    progress: 'Fortschritt',
    date: 'Aktualisierung'
};

export const ProjectList: FC<ProjectListProps> = ({
    onProjectClick,
    limit,
    showTimeline = true,
    className = '',
    setCurrentPage
}) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('date');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [showFilters, setShowFilters] = useState(false);

    // Debounce search query to improve performance
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const result = await api.getProjects();

                if (!result.error && result.data) {
                    const projectData = Array.isArray(result.data) ? result.data : [];
                    setProjects(projectData as Project[]);
                } else {
                    setProjects([]);
                }
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error('Error fetching projects:', error);
                }
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Memoize filtered and sorted projects
    const filteredProjects = useMemo(() => {
        return projects
            .filter(project => {
                // Search filter (using debounced value)
                if (debouncedSearchQuery) {
                    const query = debouncedSearchQuery.toLowerCase();
                    if (
                        !project.name.toLowerCase().includes(query) &&
                        !project.description?.toLowerCase().includes(query)
                    ) {
                        return false;
                    }
                }

                // Status filter
                if (filterStatus !== 'all' && project.status !== filterStatus) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'status':
                        const statusOrder = ['konzeption', 'design', 'entwicklung', 'review', 'launch', 'active'];
                        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
                    case 'progress':
                        return b.progress - a.progress;
                    case 'date':
                        const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
                        const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
                        return dateB - dateA;
                    default:
                        return 0;
                }
            })
            .slice(0, limit || undefined);
    }, [projects, debouncedSearchQuery, filterStatus, sortBy, limit]);

    // Memoize container and item variants
    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }), []);

    const itemVariants = useMemo(() => ({
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }), []);

    // Stable callbacks for event handlers
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value as SortOption);
    }, []);

    const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterStatus(e.target.value as FilterStatus);
    }, []);

    const handleFilterToggle = useCallback(() => {
        setShowFilters(prev => !prev);
    }, []);

    const handleViewModeChange = useCallback((mode: ViewMode) => {
        return () => setViewMode(mode);
    }, []);

    // Stable callback for project click
    const handleProjectClick = useCallback((projectId: string) => {
        return () => {
            if (onProjectClick) {
                onProjectClick(projectId);
            } else if (setCurrentPage) {
                sessionStorage.setItem('selectedProjectId', projectId);
                setCurrentPage('project-detail');
            }
        };
    }, [onProjectClick, setCurrentPage]);

    return (
        <div className={`w-full ${className}`}>
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Projekte
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Verwalten und verfolgen Sie Ihre Projekte
                </p>
            </div>

            {/* Status Timeline */}
            {showTimeline && filteredProjects.length > 0 && (
                <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Projektübersicht
                    </h3>
                    <StatusTimeline
                        currentStatus={filteredProjects[0]?.status || 'konzeption'}
                    />
                </div>
            )}

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <DocumentMagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Projekte durchsuchen..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Filter Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleFilterToggle}
                            className={`
                                px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2
                                ${showFilters
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                                }
                            `}
                        >
                            <AdjustmentsHorizontalIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">Filter</span>
                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </motion.button>

                        {/* View Toggle */}
                        <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-1">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleViewModeChange('grid')}
                                className={`
                                    px-3 py-2 rounded-md transition-all
                                    ${viewMode === 'grid'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }
                                `}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleViewModeChange('list')}
                                className={`
                                    px-3 py-2 rounded-md transition-all
                                    ${viewMode === 'list'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }
                                `}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Expandable Filters */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Sort By */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Sortieren nach
                                        </label>
                                        <select
                                            value={sortBy}
                                            onChange={handleSortChange}
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            {Object.entries(sortOptions).map(([key, label]) => (
                                                <option key={key} value={key}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Filter By Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Status filtern
                                        </label>
                                        <select
                                            value={filterStatus}
                                            onChange={handleFilterChange}
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            {Object.entries(statusLabels).map(([key, label]) => (
                                                <option key={key} value={key}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Loading State - Skeleton */}
            {loading && (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {Array.from({ length: viewMode === 'grid' ? 6 : 5 }).map((_, i) => (
                        <ProjectCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredProjects.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <BriefcaseIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {debouncedSearchQuery || filterStatus !== 'all' ? 'Keine Ergebnisse' : 'Keine Projekte'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                        {debouncedSearchQuery || filterStatus !== 'all'
                            ? 'Es wurden keine Projekte gefunden, die Ihrer Suche entsprechen.'
                            : 'Sie haben noch keine Projekte erstellt.'}
                    </p>
                </div>
            )}

            {/* Projects Grid/List */}
            {!loading && filteredProjects.length > 0 && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'space-y-4'
                    }
                >
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            variants={itemVariants}
                        >
                            <ProjectCard
                                {...project}
                                variant={viewMode === 'list' ? 'compact' : 'default'}
                                onClick={handleProjectClick(project.id)}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Results Count */}
            {!loading && filteredProjects.length > 0 && (
                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    {filteredProjects.length} {filteredProjects.length === 1 ? 'Projekt' : 'Projekte'}
                    {limit && ` von ${projects.length} insgesamt`}
                </div>
            )}
        </div>
    );
};
