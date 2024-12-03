'use client';

import { useState, useEffect } from 'react';
import { FiClock, FiZap, FiBox } from 'react-icons/fi';

export default function TasksPage() {
  const [miningStatus, setMiningStatus] = useState({
    isActive: false,
    progress: 0,
    timeLeft: 0,
    canClaim: false,
    storageLevel: 0,
    miningSpeed: 0,
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch mining status
        const miningResponse = await fetch('/api/mining/status');
        const miningData = await miningResponse.json();
        setMiningStatus(miningData);

        // Fetch tasks
        const tasksResponse = await fetch('/api/tasks');
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStartMining = async () => {
    try {
      const response = await fetch('/api/mining/start', { method: 'POST' });
      const data = await response.json();
      setMiningStatus(prev => ({ ...prev, isActive: true, timeLeft: data.sessionDuration }));
    } catch (error) {
      console.error('Error starting mining:', error);
    }
  };

  const handleClaimRewards = async () => {
    try {
      const response = await fetch('/api/mining/claim', { method: 'POST' });
      const data = await response.json();
      setMiningStatus(prev => ({ ...prev, canClaim: false }));
    } catch (error) {
      console.error('Error claiming rewards:', error);
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
      {/* Mining Status Card */}
      <div className="bg-slate-900 rounded-xl p-4 space-y-4">
        <h2 className="text-xl font-semibold">Mining Status</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <FiBox className="text-orange-500" />
            <div>
              <div className="text-sm text-slate-400">Storage Level</div>
              <div className="font-medium">{miningStatus.storageLevel}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <FiZap className="text-orange-500" />
            <div>
              <div className="text-sm text-slate-400">Mining Speed</div>
              <div className="font-medium">{miningStatus.miningSpeed}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-purple-600 transition-all duration-300"
              style={{ width: `${miningStatus.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-slate-400">
            <span>{miningStatus.progress}%</span>
            <span className="flex items-center">
              <FiClock className="mr-1" />
              {Math.floor(miningStatus.timeLeft / 60)} min left
            </span>
          </div>
        </div>

        {/* Action Button */}
        {miningStatus.canClaim ? (
          <button
            onClick={handleClaimRewards}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg font-medium"
          >
            Claim Rewards
          </button>
        ) : !miningStatus.isActive && (
          <button
            onClick={handleStartMining}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg font-medium"
          >
            Start Mining
          </button>
        )}
      </div>

      {/* Daily Tasks */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Daily Tasks</h2>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-slate-900 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                </div>
                <div className="flex items-center space-x-1 text-orange-500">
                  <span className="font-medium">+{task.reward}</span>
                  <span className="text-sm">💧</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}