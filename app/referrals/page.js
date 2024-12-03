'use client';

import { useState, useEffect } from 'react';
import { FiCopy, FiUsers, FiGift, FiTrendingUp } from 'react-icons/fi';

export default function ReferralsPage() {
  const [referralData, setReferralData] = useState({
    referralLink: '',
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarned: 0,
    referralList: []
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const response = await fetch('/api/referrals');
        const data = await response.json();
        setReferralData(data);
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
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
      <h1 className="text-2xl font-bold">Referrals</h1>

      {/* Referral Link Card */}
      <div className="bg-slate-900 rounded-xl p-4 space-y-4">
        <h2 className="text-lg font-semibold">Your Referral Link</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={referralData.referralLink}
            readOnly
            className="flex-1 bg-slate-800 rounded-lg px-4 py-2 text-sm font-mono"
          />
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FiCopy className={copied ? 'text-green-300' : 'text-white'} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-orange-500 mb-2">
            <FiUsers className="w-5 h-5" />
            <span className="text-sm font-medium">Total</span>
          </div>
          <div className="text-2xl font-bold">{referralData.totalReferrals}</div>
          <div className="text-sm text-slate-400">Referrals</div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-purple-500 mb-2">
            <FiTrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Active</span>
          </div>
          <div className="text-2xl font-bold">{referralData.activeReferrals}</div>
          <div className="text-sm text-slate-400">Mining Now</div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-green-500 mb-2">
            <FiGift className="w-5 h-5" />
            <span className="text-sm font-medium">Earned</span>
          </div>
          <div className="text-2xl font-bold">{referralData.totalEarned}</div>
          <div className="text-sm text-slate-400">Oil Drops</div>
        </div>
      </div>

      {/* Referral List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Referrals</h2>
        <div className="space-y-3">
          {referralData.referralList.map((referral) => (
            <div key={referral.id} className="bg-slate-900 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {referral.username || 'Anonymous'}
                    {referral.isPremium && (
                      <span className="ml-2 text-yellow-500">⭐️</span>
                    )}
                  </div>
                  <div className="text-sm text-slate-400">
                    Joined {new Date(referral.joinedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-orange-500">
                    +{referral.earnings} 💧
                  </div>
                  <div className="text-xs text-slate-400">
                    {referral.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Info */}
      <div className="bg-slate-900/50 rounded-lg p-4 text-sm text-slate-400">
        <h3 className="font-medium text-white mb-2">Rewards Info</h3>
        <ul className="space-y-2">
          <li>• Earn 100 Oil Drops for each normal user referral</li>
          <li>• Earn 200 Oil Drops for each premium user referral</li>
          <li>• Get 10% of your referrals' daily mining earnings</li>
        </ul>
      </div>
    </div>
  );
}