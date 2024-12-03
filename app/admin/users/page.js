'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, premium, active
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page, filter]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `/api/admin/users?page=${page}&filter=${filter}&search=${searchTerm}`
      );
      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Users Management</h1>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          Export Data
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <FiSearch className="absolute left-3 top-3 text-slate-400" />
          </form>
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-900 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option value="all">All Users</option>
            <option value="premium">Premium Only</option>
            <option value="active">Active Miners</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-slate-400 font-medium">User</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Status</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Mining Level</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Referrals</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-4">
                      <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                    </td>
                  </tr>
                ))
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="text-white">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="font-medium flex items-center">
                            {user.username || 'Anonymous'}
                            {user.isPremium && (
                              <FiStar className="w-4 h-4 text-yellow-500 ml-2" />
                            )}
                          </div>
                          <div className="text-sm text-slate-400">
                            ID: {user.telegramId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs
                        ${user.isActive 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-slate-500/20 text-slate-400'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">Level {user.storageLevel}</div>
                        <div className="text-sm text-slate-400">
                          Speed: {user.miningSpeed}x
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{user.referralCount}</div>
                      <div className="text-sm text-slate-400">referrals</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <FiEdit2 className="w-4 h-4 text-slate-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <FiTrash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Showing page {page} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}