'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiList, 
  FiUserPlus,
  FiZap,
  FiMenu,
  FiX
} from 'react-icons/fi';

const navItems = [
  { name: 'Dashboard', icon: FiHome, path: '/admin' },
  { name: 'Users', icon: FiUsers, path: '/admin/users' },
  { name: 'Mining Config', icon: FiZap, path: '/admin/mining' },
  { name: 'Tasks', icon: FiList, path: '/admin/tasks' },
  { name: 'Referrals', icon: FiUserPlus, path: '/admin/referrals' },
  { name: 'Settings', icon: FiSettings, path: '/admin/settings' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button onClick={toggleSidebar} className="p-2">
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed lg:static lg:translate-x-0 z-30
          w-64 h-[calc(100vh-64px)] lg:h-screen
          bg-slate-900 text-white
          transition-transform duration-300 ease-in-out
        `}>
          {/* Logo Area */}
          <div className="hidden lg:flex h-16 items-center justify-center border-b border-slate-800">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.path);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-colors duration-200
                    ${isActive 
                      ? 'bg-orange-500 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:p-8 p-4">
          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          {/* Content Area */}
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}