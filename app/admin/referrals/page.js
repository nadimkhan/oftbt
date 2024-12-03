'use client';

import { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiAlertCircle, FiUsers, FiTrendingUp } from 'react-icons/fi';

export default function ReferralsConfig() {
  const [config, setConfig] = useState({
    normalUserReward: 100,
    premiumUserReward: 200,
    miningRewardPercent: 0.10,
  });

  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrers: 0,
    totalRewardsGiven: 0,
    topReferrers: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch config
      const configResponse = await fetch('/api/admin/referrals/config');
      const configData = await configResponse.json();
      setConfig(configData);

      // Fetch stats
      const statsResponse = await fetch('/api/admin/referrals/stats');
      const statsData = await statsResponse.json();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/referrals/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuration saved successfully' });
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Referral Configuration</h1>
          <p className="text-slate-400 mt-1">Manage referral rewards and settings</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 flex items-center space-x-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center space-x-2 disabled:opacity-50"
          >
            <FiSave className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 
          ${message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}
        >
          <FiAlertCircle className="w-5 h-5" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FiUsers className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Total Referrals</div>
              <div className="text-2xl font-bold text-white">{stats.totalReferrals}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <FiUsers className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Active Referrers</div>
              <div className="text-2xl font-bold text-white">{stats.activeReferrers}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Total Rewards Given</div>
              <div className="text-2xl font-bold text-white">
                {stats.totalRewardsGiven} 💧
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-slate-900 rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-white">Reward Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Normal User Referral Reward
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={config.normalUserReward}
                onChange={(e) => setConfig({ ...config, normalUserReward: Number(e.target.value) })}
                className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <span className="text-orange-500">💧</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Reward for referring a normal user
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Premium User Referral Reward
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={config.premiumUserReward}
                onChange={(e) => setConfig({ ...config, premiumUserReward: Number(e.target.value) })}
                className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <span className="text-orange-500">💧</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Reward for referring a premium user
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Mining Reward Percentage
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={config.miningRewardPercent}
                onChange={(e) => setConfig({ ...config, miningRewardPercent: Number(e.target.value) })}
                className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <span className="text-white">%</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Percentage of referred users' mining earnings given to referrer
            </p>
          </div>
        </div>
      </div>

      {/* Top Referrers */}
      <div className="bg-slate-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Top Referrers</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-slate-400 font-medium">User</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Referrals</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Total Rewards</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {stats.topReferrers.map((referrer) => (
                <tr key={referrer.id} className="text-white">
                  <td className="px-6 py-4">
                    <div className="font-medium">{referrer.username}</div>
                    <div className="text-sm text-slate-400">ID: {referrer.telegramId}</div>
                  </td>
                  <td className="px-6 py-4">{referrer.referralCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <span>{referrer.totalRewards}</span>
                      <span className="text-orange-500">💧</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs
                      ${referrer.isActive 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {referrer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}