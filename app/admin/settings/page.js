'use client';

import { useState, useEffect } from 'react';
import { 
  FiSave, 
  FiShield, 
  FiDatabase, 
  FiAlertCircle,
  FiDownload,
  FiUpload
} from 'react-icons/fi';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    adminEmails: [],
    backupFrequency: 'daily',
    maintenanceMode: false,
    notificationEmail: '',
    systemEmail: '',
    telegramBotToken: '',
    maxUsersPerPage: 50,
  });

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newAdmin, setNewAdmin] = useState({ email: '', role: 'admin' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      setSettings(data.settings);
      setAdmins(data.admins);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully' });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/settings/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdmin),
      });

      if (response.ok) {
        const data = await response.json();
        setAdmins([...admins, data]);
        setNewAdmin({ email: '', role: 'admin' });
        setMessage({ type: 'success', text: 'Admin added successfully' });
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to remove this admin?')) return;

    try {
      const response = await fetch(`/api/admin/settings/admins/${adminId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAdmins(admins.filter(admin => admin.id !== adminId));
        setMessage({ type: 'success', text: 'Admin removed successfully' });
      }
    } catch (error) {
      console.error('Error removing admin:', error);
      setMessage({ type: 'error', text: error.message });
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
          <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
          <p className="text-slate-400 mt-1">Configure system settings and admin access</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center space-x-2 disabled:opacity-50"
        >
          <FiSave className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
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
        {/* System Settings */}
        <div className="bg-slate-900 rounded-xl p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <FiDatabase className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-white">System Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                System Email
              </label>
              <input
                type="email"
                value={settings.systemEmail}
                onChange={(e) => setSettings({ ...settings, systemEmail: e.target.value })}
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Notification Email
              </label>
              <input
                type="email"
                value={settings.notificationEmail}
                onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Telegram Bot Token
              </label>
              <input
                type="password"
                value={settings.telegramBotToken}
                onChange={(e) => setSettings({ ...settings, telegramBotToken: e.target.value })}
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Users Per Page
              </label>
              <input
                type="number"
                value={settings.maxUsersPerPage}
                onChange={(e) => setSettings({ ...settings, maxUsersPerPage: Number(e.target.value) })}
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-4 h-4 text-orange-500 bg-slate-800 border-slate-700 rounded focus:ring-orange-500"
              />
              <label htmlFor="maintenanceMode" className="text-sm font-medium text-slate-400">
                Maintenance Mode
              </label>
            </div>
          </div>
        </div>

        {/* Admin Management */}
        <div className="bg-slate-900 rounded-xl p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <FiShield className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-white">Admin Management</h2>
          </div>

          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Add New Admin
              </label>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Email address"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Add
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-3">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between bg-slate-800 rounded-lg p-3">
                <div>
                  <div className="font-medium text-white">{admin.email}</div>
                  <div className="text-sm text-slate-400">{admin.role}</div>
                </div>
                <button
                  onClick={() => handleRemoveAdmin(admin.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="bg-slate-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FiDatabase className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-white">Backup & Restore</h2>
          </div>
          <select
            value={settings.backupFrequency}
            onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
            className="bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option value="daily">Daily Backup</option>
            <option value="weekly">Weekly Backup</option>
            <option value="monthly">Monthly Backup</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            <FiDownload className="w-5 h-5 text-orange-500" />
            <span className="text-white">Download Backup</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            <FiUpload className="w-5 h-5 text-orange-500" />
            <span className="text-white">Restore from Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
}