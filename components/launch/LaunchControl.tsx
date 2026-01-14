import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Rocket from 'lucide-react/dist/esm/icons/rocket';
import Users from 'lucide-react/dist/esm/icons/users';
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3';
import MessageSquare from 'lucide-react/dist/esm/icons/message-square';
import Settings from 'lucide-react/dist/esm/icons/settings';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import XCircle from 'lucide-react/dist/esm/icons/x-circle';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';

interface LaunchStats {
  activeUsers: number;
  totalProjects: number;
  feedbackCount: number;
  criticalIssues: number;
}

interface LaunchPhase {
  id: 'soft' | 'full';
  name: string;
  status: 'pending' | 'active' | 'completed';
  startDate?: string;
  endDate?: string;
}

const LaunchControl: React.FC = () => {
  const [launchPhase, setLaunchPhase] = useState<'soft' | 'full'>('soft');
  const [stats, setStats] = useState<LaunchStats>({
    activeUsers: 0,
    totalProjects: 0,
    feedbackCount: 0,
    criticalIssues: 0
  });
  const [phases, setPhases] = useState<LaunchPhase[]>([
    { id: 'soft', name: 'Soft Launch (Beta)', status: 'pending' },
    { id: 'full', name: 'Full Launch', status: 'pending' }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'monitoring' | 'feedback' | 'settings'>('overview');

  useEffect(() => {
    const loadLaunchData = async () => {
      setIsLoading(true);
      try {
        // ✅ BUG FIX: Added SSR check for localStorage access
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        // Load launch configuration from localStorage
        const savedPhase = localStorage.getItem('launchPhase');
        const savedPhases = localStorage.getItem('launchPhases');
        const savedStats = localStorage.getItem('launchStats');

        // ✅ BUG FIX: Validate savedPhase value before casting
        if (savedPhase === 'soft' || savedPhase === 'full') {
          setLaunchPhase(savedPhase);
        }

        if (savedPhases) {
          try {
            const parsedPhases = JSON.parse(savedPhases);
            if (Array.isArray(parsedPhases)) {
              setPhases(parsedPhases);
            }
          } catch (parseError) {
            if (import.meta.env.DEV) {
              console.error('Error parsing phases:', parseError);
            }
          }
        }

        if (savedStats) {
          try {
            const parsedStats = JSON.parse(savedStats);
            if (parsedStats && typeof parsedStats === 'object') {
              setStats(parsedStats);
            }
          } catch (parseError) {
            if (import.meta.env.DEV) {
              console.error('Error parsing stats:', parseError);
            }
          }
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error loading launch data:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadLaunchData();
  }, []); // ✅ FIXED: Function moved inside useEffect

  const startSoftLaunch = async () => {
    const updatedPhases = phases.map(p =>
      p.id === 'soft' ? { ...p, status: 'active' as const, startDate: new Date().toISOString() } : p
    );
    setPhases(updatedPhases);
    localStorage.setItem('launchPhases', JSON.stringify(updatedPhases));
    localStorage.setItem('launchPhase', 'soft');
  };

  const startFullLaunch = async () => {
    const updatedPhases = phases.map(p => {
      if (p.id === 'soft') {
        return { ...p, status: 'completed' as const, endDate: new Date().toISOString() };
      } else if (p.id === 'full') {
        return { ...p, status: 'active' as const, startDate: new Date().toISOString() };
      }
      return p;
    });
    setPhases(updatedPhases);
    localStorage.setItem('launchPhases', JSON.stringify(updatedPhases));
    localStorage.setItem('launchPhase', 'full');
    setLaunchPhase('full');
  };

  const getStatusColor = (status: LaunchPhase['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'active': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getStatusIcon = (status: LaunchPhase['status']) => {
    switch (status) {
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      case 'active': return <Rocket className="w-4 h-4 animate-pulse" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading launch data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Launch Control</h1>
          <p className="text-gray-400">Manage application launch and post-launch monitoring</p>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30"
        >
          <Rocket className="w-6 h-6 text-blue-400" />
        </motion.div>
      </div>

      {/* Launch Phases */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Launch Phases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phases.map((phase) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-xl border-2 transition-all ${
                phase.status === 'active' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-900/50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(phase.status)}
                  <h3 className="text-lg font-semibold text-white">{phase.name}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(phase.status)}`}>
                  {phase.status.toUpperCase()}
                </span>
              </div>

              {phase.startDate && (
                <div className="mb-2">
                  <p className="text-sm text-gray-400">Started: {new Date(phase.startDate).toLocaleDateString()}</p>
                </div>
              )}

              {phase.endDate && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400">Ended: {new Date(phase.endDate).toLocaleDateString()}</p>
                </div>
              )}

              {phase.id === 'soft' && phase.status === 'pending' && (
                <button
                  onClick={startSoftLaunch}
                  className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                >
                  Start Soft Launch
                </button>
              )}

              {phase.id === 'full' && phases.find(p => p.id === 'soft')?.status === 'completed' && phase.status === 'pending' && (
                <button
                  onClick={startFullLaunch}
                  className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                >
                  Start Full Launch
                </button>
              )}

              {phase.status === 'active' && (
                <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <p className="text-sm text-blue-400 font-medium">
                    {phase.id === 'soft' ? 'Beta access enabled' : 'Live in production'}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border border-blue-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.activeUsers}</p>
            </div>
            <Users className="w-10 h-10 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Total Projects</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalProjects}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Feedback</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.feedbackCount}</p>
            </div>
            <MessageSquare className="w-10 h-10 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`rounded-xl p-6 border ${
            stats.criticalIssues > 0
              ? 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30'
              : 'bg-gradient-to-br from-gray-500/20 to-gray-600/20 border-gray-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${stats.criticalIssues > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                Critical Issues
              </p>
              <p className="text-3xl font-bold text-white mt-2">{stats.criticalIssues}</p>
            </div>
            {stats.criticalIssues > 0 ? (
              <XCircle className="w-10 h-10 text-red-400" />
            ) : (
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            )}
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-2 flex gap-2">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'monitoring', label: 'Monitoring', icon: AlertTriangle },
          { id: 'feedback', label: 'Feedback', icon: MessageSquare },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedView(tab.id as 'overview' | 'monitoring' | 'feedback' | 'settings')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all font-medium ${
              selectedView === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
        <AnimatePresence mode="wait">
          {selectedView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">Launch Overview</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                  <p className="text-gray-300">
                    Current Phase: <span className="font-semibold text-white">{launchPhase === 'soft' ? 'Soft Launch (Beta)' : 'Full Launch'}</span>
                  </p>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                  <p className="text-gray-300">
                    Launch Status: <span className="font-semibold text-white">{phases.find(p => p.id === launchPhase)?.status.toUpperCase()}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {selectedView === 'monitoring' && (
            <motion.div
              key="monitoring"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">System Monitoring</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                  <p className="text-sm text-gray-400 mb-2">System Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-white font-medium">Operational</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                  <p className="text-sm text-gray-400 mb-2">Uptime</p>
                  <p className="text-2xl font-bold text-white">99.9%</p>
                </div>
              </div>
            </motion.div>
          )}

          {selectedView === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">User Feedback</h3>
              <p className="text-gray-400">Feedback collection system will be available after launch.</p>
            </motion.div>
          )}

          {selectedView === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">Launch Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                  <div>
                    <p className="text-white font-medium">Enable Beta Access</p>
                    <p className="text-sm text-gray-400">Allow beta users to access the application</p>
                  </div>
                  <button
                    onClick={() => {
                      if (launchPhase === 'soft' && phases.find(p => p.id === 'soft')?.status === 'active') {
                        // Toggle functionality
                      }
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      phases.find(p => p.id === 'soft')?.status === 'active'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={phases.find(p => p.id === 'soft')?.status !== 'active'}
                  >
                    {phases.find(p => p.id === 'soft')?.status === 'active' ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                  <div>
                    <p className="text-white font-medium">Maintenance Mode</p>
                    <p className="text-sm text-gray-400">Temporarily disable access for maintenance</p>
                  </div>
                  <button className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                    Disabled
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LaunchControl;
