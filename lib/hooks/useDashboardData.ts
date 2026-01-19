/**
 * useDashboardData Hook
 *
 * Single Responsibility: Fetch dashboard data from multiple sources
 * Part of Overview component SRP refactoring
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '../api-modules';
import type { Project } from '../../types';

export interface DashboardStats {
  ticketCount: number;
  serviceCount: number;
}

export interface FinanceData {
  totalBudget: number;
  spent: number;
  open: number;
  nextInvoice: string;
}

export interface ServerStats {
  diskUsage: number;
  ramUsage: number;
  bandwidth: number;
  uptime: string;
}

export interface Activity {
  id: string;
  text: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'system';
}

export interface Milestone {
  title: string;
  description: string;
  date: string;
  daysLeft: number;
}

export interface UseDashboardDataReturn {
  stats: DashboardStats;
  projects: Project[];
  activities: Activity[];
  financeData: FinanceData;
  serverStats: ServerStats;
  nextMilestone: Milestone | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Custom hook for fetching all dashboard data
 * Separates data fetching from UI rendering
 */
export function useDashboardData(): UseDashboardDataReturn {
  const [stats, setStats] = useState<DashboardStats>({ ticketCount: 0, serviceCount: 0 });
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [financeData, setFinanceData] = useState<FinanceData>({
    totalBudget: 0,
    spent: 0,
    open: 0,
    nextInvoice: '-'
  });
  const [serverStats, setServerStats] = useState<ServerStats>({
    diskUsage: 24,
    ramUsage: 42,
    bandwidth: 12,
    uptime: '99.9%'
  });
  const [nextMilestone, setNextMilestone] = useState<Milestone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all dashboard data
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Parallel fetch for better performance
      const [statsRes, projectsRes, transRes, ticketsRes] = await Promise.all([
        api.getStats(),
        api.getUserServices(),
        api.getTransactions(),
        api.getTickets()
      ]);

      if (statsRes.error) {
        throw new Error(statsRes.error.message);
      }

      if (projectsRes.error) {
        throw new Error(projectsRes.error.message);
      }

      // Update stats
      setStats({
        ticketCount: ticketsRes.data?.length || 0,
        serviceCount: projectsRes.data?.length || 0
      });

      // Update projects
      setProjects(projectsRes.data || []);

      // Update finance data
      if (transRes.data && Array.isArray(transRes.data)) {
        const total = transRes.data.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
        setFinanceData({
          totalBudget: total,
          spent: Math.round(total * 0.6),
          open: total - Math.round(total * 0.6),
          nextInvoice: '-'
        });
      }

      // Generate mock activities (would come from API in production)
      setActivities([
        {
          id: '1',
          text: 'Dashboard aufgerufen',
          time: 'Gerade eben',
          type: 'info'
        }
      ]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh all data
   */
  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stats,
    projects,
    activities,
    financeData,
    serverStats,
    nextMilestone,
    loading,
    error,
    refresh
  };
}
