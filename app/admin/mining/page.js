'use client';

import { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

export default function MiningConfig() {
  const [config, setConfig] = useState({
    sessionDuration: 10800, // 3 hours in seconds
    claimCooldown: 28800,   // 8 hours in seconds
    baseRewardRate: 1.0,
    maxStorageLevel: 15,
    maxMiningSpeed: 15,
    levels: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/mining/config');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Error fetching config:', error);
      setMessage({ type: 'error', text: 'Failed to load configuration' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/mining/config', {
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

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
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
          <h1 className="text-2xl font-bold text-white">Mining Configuration</h1>
          <p className="text-slate-400 mt-1">Adjust mining parameters and rewards</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchConfig}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Configuration */}
        <div className="bg-slate-900 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Basic Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Mining Session Duration
              </label>
              <input
                type="number"
                value={config.sessionDuration}
                onChange={(e) => setConfig({ ...config, sessionDuration: Number(e.target.value) })}
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <p className="text-sm text-slate-500 mt-1">
                Current: {formatDuration(config.sessionDuration)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Claim Cooldown Period
              </label>
              <input
                type="number"
                value={config.claimCooldown}
                onChange={(e) => setConfig({ ...config, claimCooldown: Number(e.target.value) })}
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <p className="text-sm text-slate-500 mt-1">
                Current: {formatDuration(config.claimCooldown)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Base Reward Rate
              </label>
              <input
                type="number"
                step="0.1"
                value={config.baseRewardRate}
                onChange={(e) => setConfig({ ...config, baseRewardRate: Number(e.target.value) })}
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Level Limits */}
        <div className="bg-slate-900 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Level Limits</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Maximum Storage Level
              </label>
              <input
                type="number"
                value={config.maxStorageLevel}
                onChange={(e) => setConfig({ ...config, maxStorageLevel: Number(e.target.value) })}
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Maximum Mining Speed Level
              </label>
              <input
                type="number"
                value={config.maxMiningSpeed}
                onChange={(e) => setConfig({ ...config, maxMiningSpeed: Number(e.target.value) })}
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Level Configuration Table */}
      <div className="bg-slate-900 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white">Level Configuration</h2>
          <p className="text-slate-400 mt-1">Configure costs and benefits for each level</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-slate-400 font-medium">Level</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Storage Upgrade Cost</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Speed Upgrade Cost</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Storage Capacity</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Mining Speed Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[...Array(config.maxStorageLevel)].map((_, index) => (
                <tr key={index} className="text-white">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={config.levels[index]?.storageUpgradeCost || 0}
                      onChange={(e) => {
                        const newLevels = [...config.levels];
                        newLevels[index] = {
                          ...newLevels[index],
                          storageUpgradeCost: Number(e.target.value)
                        };
                        setConfig({ ...config, levels: newLevels });
                      }}
                      className="w-24 bg-slate-800 rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={config.levels[index]?.speedUpgradeCost || 0}
                      onChange={(e) => {
                        const newLevels = [...config.levels];
                        newLevels[index] = {
                          ...newLevels[index],
                          speedUpgradeCost: Number(e.target.value)
                        };
                        setConfig({ ...config, levels: newLevels });
                      }}
                      className="w-24 bg-slate-800 rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={config.levels[index]?.storageCapacity || 0}
                      onChange={(e) => {
                        const newLevels = [...config.levels];
                        newLevels[index] = {
                          ...newLevels[index],
                          storageCapacity: Number(e.target.value)
                        };
                        setConfig({ ...config, levels: newLevels });
                      }}
                      className="w-24 bg-slate-800 rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      step="0.1"
                      value={config.levels[index]?.miningSpeedRate || 1.0}
                      onChange={(e) => {
                        const newLevels = [...config.levels];
                        newLevels[index] = {
                          ...newLevels[index],
                          miningSpeedRate: Number(e.target.value)
                        };
                        setConfig({ ...config, levels: newLevels });
                      }}
                      className="w-24 bg-slate-800 rounded px-2 py-1"
                    />
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