'use client';

import { useState, useEffect } from 'react';
import { FiBox, FiZap, FiDroplet } from 'react-icons/fi';

export default function UpgradesPage() {
  const [upgrades, setUpgrades] = useState({
    storage: {
      currentLevel: 0,
      nextLevelCost: 0,
      currentCapacity: 0,
      nextLevelCapacity: 0,
    },
    miningSpeed: {
      currentLevel: 0,
      nextLevelCost: 0,
      currentRate: 0,
      nextLevelRate: 0,
    },
    oilDrops: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpgrades = async () => {
      try {
        const response = await fetch('/api/upgrades');
        const data = await response.json();
        setUpgrades(data);
      } catch (error) {
        console.error('Error fetching upgrades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpgrades();
  }, []);

  const handleUpgrade = async (type) => {
    try {
      const response = await fetch('/api/upgrades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });
      
      const data = await response.json();
      setUpgrades(data);
    } catch (error) {
      console.error('Error upgrading:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header with Oil Drops Balance */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Upgrades</h1>
        <div className="flex items-center space-x-2 bg-slate-900 rounded-lg px-4 py-2">
          <FiDroplet className="text-orange-500" />
          <span className="font-medium">{upgrades.oilDrops}</span>
        </div>
      </div>

      {/* Storage Level Upgrade */}
      <div className="bg-slate-900 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <FiBox className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="font-semibold">Storage Level</h2>
              <p className="text-sm text-slate-400">Level {upgrades.storage.currentLevel}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Current Capacity</div>
            <div className="font-medium">{upgrades.storage.currentCapacity} Oil Drops</div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-slate-400">Next Level Benefits</div>
            <div className="text-sm font-medium text-orange-500">
              +{upgrades.storage.nextLevelCapacity - upgrades.storage.currentCapacity} Capacity
            </div>
          </div>
          <button
            onClick={() => handleUpgrade('storage')}
            disabled={upgrades.oilDrops < upgrades.storage.nextLevelCost}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2
              ${upgrades.oilDrops >= upgrades.storage.nextLevelCost
                ? 'bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}
          >
            <span>Upgrade • {upgrades.storage.nextLevelCost}</span>
            <FiDroplet />
          </button>
        </div>
      </div>

      {/* Mining Speed Upgrade */}
      <div className="bg-slate-900 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <FiZap className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h2 className="font-semibold">Mining Speed</h2>
              <p className="text-sm text-slate-400">Level {upgrades.miningSpeed.currentLevel}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Current Rate</div>
            <div className="font-medium">{upgrades.miningSpeed.currentRate}x Speed</div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-slate-400">Next Level Benefits</div>
            <div className="text-sm font-medium text-purple-500">
              +{(upgrades.miningSpeed.nextLevelRate - upgrades.miningSpeed.currentRate).toFixed(1)}x Speed
            </div>
          </div>
          <button
            onClick={() => handleUpgrade('miningSpeed')}
            disabled={upgrades.oilDrops < upgrades.miningSpeed.nextLevelCost}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2
              ${upgrades.oilDrops >= upgrades.miningSpeed.nextLevelCost
                ? 'bg-gradient-to-r from-purple-500 to-orange-600 hover:from-purple-600 hover:to-orange-700'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}
          >
            <span>Upgrade • {upgrades.miningSpeed.nextLevelCost}</span>
            <FiDroplet />
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-slate-900/50 rounded-lg p-4 text-sm text-slate-400">
        <h3 className="font-medium text-white mb-2">Upgrade Info</h3>
        <ul className="space-y-2">
          <li>• Storage Level increases your maximum mining capacity</li>
          <li>• Mining Speed increases your Oil Drops earning rate</li>
          <li>• Maximum level for both upgrades is 15</li>
        </ul>
      </div>
    </div>
  );
}