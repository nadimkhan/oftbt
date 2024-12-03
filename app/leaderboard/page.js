'use client';

import { useState, useEffect } from 'react';
import { FiUsers, FiAward } from 'react-icons/fi';

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        setUsers(data.users);
        setCurrentUser(data.currentUser);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500';
      case 2:
        return 'bg-slate-400';
      case 3:
        return 'bg-orange-600';
      default:
        return 'bg-slate-700';
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <div className="flex items-center space-x-2 text-slate-400">
          <FiUsers />
          <span className="text-sm">Top 100</span>
        </div>
      </div>

      {/* Current User Stats */}
      {currentUser && (
        <div className="bg-slate-900 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankStyle(currentUser.rank)}`}>
                <span className="text-sm font-medium">#{currentUser.rank}</span>
              </div>
              <div>
                <div className="font-medium">{currentUser.username || 'Anonymous'}</div>
                <div className="text-sm text-slate-400">{currentUser.referrals} referrals</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Your Position</div>
              <div className="font-medium text-orange-500">Top {Math.round((currentUser.rank / users.length) * 100)}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-3">
        {users.map((user, index) => (
          <div key={user.id} className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankStyle(index + 1)}`}>
                {index < 3 ? (
                  <FiAward className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">#{index + 1}</span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="font-medium">{user.username || 'Anonymous'}</div>
                <div className="text-sm text-slate-400">
                  {user.referrals} referrals
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-orange-500">
                  {user.isPremium && '⭐️ Premium'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}