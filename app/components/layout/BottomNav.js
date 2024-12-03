'use client';

import { FiList, FiTrendingUp, FiUsers, FiZap } from 'react-icons/fi';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { name: 'Tasks', icon: FiList, path: '/tasks' },
  { name: 'Leaderboard', icon: FiTrendingUp, path: '/leaderboard' },
  { name: 'Referrals', icon: FiUsers, path: '/referrals' },
  { name: 'Upgrades', icon: FiZap, path: '/upgrades' }
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors
                  ${isActive ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}