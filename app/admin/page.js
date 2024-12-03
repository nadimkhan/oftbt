'use client';

import { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiZap, 
  FiDollarSign, 
  FiActivity,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeMiners: 0,
    totalOilDrops: 0,
    dailyActive: 0,
    userGrowth: 0,
    minerGrowth: 0,
    dropGrowth: 0,
    activeGrowth: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, growth, prefix = '' }) => (
    <div className="bg-slate-900 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold mt-2">
            {prefix}{loading ? '-' : value.toLocaleString()}
          </h3>
        </div>
        <div className="p-3 bg-slate-800 rounded-lg">
          <Icon className="w-6 h-6 text-orange-500" />
        </div>
      </div>
      {growth !== undefined && (
        <div className="mt-4 flex items-center">
          {growth >= 0 ? (
            <FiArrowUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <FiArrowDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={growth >= 0 ? 'text-green-500' : 'text-red-500'}>
            {Math.abs(growth)}%
          </span>
          <span className="text-slate-400 ml-2">vs last week</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of your mining application</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FiUsers}
          growth={stats.userGrowth}
        />
        <StatCard
          title="Active Miners"
          value={stats.activeMiners}
          icon={FiZap}
          growth={stats.minerGrowth}
        />
        <StatCard
          title="Total Oil Drops"
          value={stats.totalOilDrops}
          icon={FiDollarSign}
          growth={stats.dropGrowth}
          prefix="💧 "
        />
        <StatCard
          title="Daily Active Users"
          value={stats.dailyActive}
          icon={FiActivity}
          growth={stats.activeGrowth}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-800 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 text-center py-8">
              Activity log will be implemented in the next update
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-slate-800 rounded-lg text-left hover:bg-slate-700 transition-colors">
            <FiUsers className="w-6 h-6 text-orange-500 mb-2" />
            <h3 className="font-medium text-white">Manage Users</h3>
            <p className="text-sm text-slate-400 mt-1">View and manage user accounts</p>
          </button>
          <button className="p-4 bg-slate-800 rounded-lg text-left hover:bg-slate-700 transition-colors">
            <FiZap className="w-6 h-6 text-orange-500 mb-2" />
            <h3 className="font-medium text-white">Mining Settings</h3>
            <p className="text-sm text-slate-400 mt-1">Adjust mining parameters</p>
          </button>
          <button className="p-4 bg-slate-800 rounded-lg text-left hover:bg-slate-700 transition-colors">
            <FiDollarSign className="w-6 h-6 text-orange-500 mb-2" />
            <h3 className="font-medium text-white">Rewards Config</h3>
            <p className="text-sm text-slate-400 mt-1">Modify reward rates</p>
          </button>
        </div>
      </div>
    </div>
  );
}