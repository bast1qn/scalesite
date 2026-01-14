import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, AlertTriangle, TrendingUp, TrendingDown, Clock, CheckCircle2 } from 'lucide-react';
import { ActivityIcon } from '../Icons';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'amber' | 'red';
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, color, trend = 'neutral' }) => {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const trendIcon = trend === 'up' ? <TrendingUp className="w-4 h-4 text-green-400" /> :
                   trend === 'down' ? <TrendingDown className="w-4 h-4 text-red-400" /> : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${colorClasses[color]} rounded-xl p-6 border`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trendIcon && (
          <div className="flex items-center gap-1 text-sm">
            {trendIcon}
            {change !== undefined && (
              <span className={trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                {Math.abs(change)}%
              </span>
            )}
          </div>
        )}
      </div>
      <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </motion.div>
  );
};

interface PerformanceAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
}

const PostLaunchMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    pageViews: 0,
    avgSessionDuration: '0m 0s',
    conversionRate: 0,
    errorRate: 0,
    avgResponseTime: 0
  });

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    loadMonitoringData();
    const interval = setInterval(() => loadMonitoringData(), 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const loadMonitoringData = async () => {
    setIsLoading(true);
    try {
      // ✅ BUG FIX: Added try-catch for localStorage access (SSR safety)
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      // Load metrics from localStorage or API
      const savedMetrics = localStorage.getItem('monitoringMetrics');
      const savedAlerts = localStorage.getItem('monitoringAlerts');

      if (savedMetrics) {
        try {
          const parsedMetrics = JSON.parse(savedMetrics);
          // Validate metrics structure
          if (parsedMetrics && typeof parsedMetrics === 'object') {
            setMetrics(parsedMetrics);
          }
        } catch (parseError) {
          if (import.meta.env.DEV) {
            console.error('Error parsing metrics:', parseError);
          }
        }
      }

      if (savedAlerts) {
        try {
          const parsedAlerts = JSON.parse(savedAlerts);
          // ✅ BUG FIX: Validate alerts array before mapping
          if (Array.isArray(parsedAlerts)) {
            setAlerts(parsedAlerts.map((alert): PerformanceAlert => ({
              id: alert.id || '',
              type: alert.type || 'info',
              title: alert.title || '',
              message: alert.message || '',
              timestamp: alert.timestamp ? new Date(alert.timestamp) : new Date()
            })));
          }
        } catch (parseError) {
          if (import.meta.env.DEV) {
            console.error('Error parsing alerts:', parseError);
          }
          setAlerts([]);
        }
      }
    } catch (error) {
      // Error loading monitoring data - show empty state
      if (import.meta.env.DEV) {
        console.error('Error loading monitoring data:', error);
      }
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAlertIcon = (type: PerformanceAlert['type']) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'info': return <CheckCircle2 className="w-5 h-5 text-blue-400" />;
    }
  };

  const getAlertColor = (type: PerformanceAlert['type']) => {
    switch (type) {
      case 'critical': return 'border-red-500/50 bg-red-500/10';
      case 'warning': return 'border-amber-500/50 bg-amber-500/10';
      case 'info': return 'border-blue-500/50 bg-blue-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Post-Launch Monitoring</h1>
          <p className="text-gray-400">Real-time application performance and user metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-sm text-gray-400">
            {isLoading ? 'Loading...' : 'Live'}
          </span>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {[
          { value: '24h', label: '24 Hours' },
          { value: '7d', label: '7 Days' },
          { value: '30d', label: '30 Days' }
        ].map((range) => (
          <button
            key={range.value}
            onClick={() => setSelectedTimeRange(range.value as '24h' | '7d' | '30d')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedTimeRange === range.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Active Users"
          value={metrics.activeUsers}
          change={12}
          icon={Users}
          color="blue"
          trend="up"
        />
        <MetricCard
          title="Page Views"
          value={metrics.pageViews.toLocaleString()}
          change={8}
          icon={ActivityIcon}
          color="purple"
          trend="up"
        />
        <MetricCard
          title="Avg Session Duration"
          value={metrics.avgSessionDuration}
          change={-5}
          icon={Clock}
          color="green"
          trend="down"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          change={2}
          icon={TrendingUp}
          color="green"
          trend="up"
        />
        <MetricCard
          title="Error Rate"
          value={`${metrics.errorRate}%`}
          change={-15}
          icon={AlertTriangle}
          color={metrics.errorRate > 5 ? 'red' : metrics.errorRate > 2 ? 'amber' : 'green'}
          trend={metrics.errorRate > 2 ? 'up' : 'down'}
        />
        <MetricCard
          title="Avg Response Time"
          value={`${metrics.avgResponseTime}ms`}
          change={-10}
          icon={Zap}
          color={metrics.avgResponseTime > 500 ? 'red' : metrics.avgResponseTime > 300 ? 'amber' : 'blue'}
          trend="down"
        />
      </div>

      {/* Performance Alerts */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Performance Alerts</h2>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-gray-400">No alerts - System running smoothly!</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-xl border ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{alert.title}</h4>
                    <p className="text-sm text-gray-400">{alert.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">CPU Usage</span>
                <span className="text-white font-medium">45%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Memory Usage</span>
                <span className="text-white font-medium">62%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Database Connections</span>
                <span className="text-white font-medium">23/100</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">API Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <span className="text-gray-400">GET /api/projects</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-white font-medium">120ms</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <span className="text-gray-400">POST /api/content</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-white font-medium">340ms</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <span className="text-gray-400">GET /api/analytics</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-white font-medium">180ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="flex items-center justify-center gap-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-colors">
            <ActivityIcon className="w-5 h-5" />
            <span>Run Health Check</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg border border-purple-500/30 transition-colors">
            <Zap className="w-5 h-5" />
            <span>Optimize Database</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg border border-green-500/30 transition-colors">
            <CheckCircle2 className="w-5 h-5" />
            <span>Clear Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostLaunchMonitoring;
