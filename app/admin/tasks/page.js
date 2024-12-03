'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';

export default function TasksManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: 0,
    isDaily: true
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/admin/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        reward: task.reward,
        isDaily: task.isDaily
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        reward: 0,
        isDaily: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      reward: 0,
      isDaily: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingTask 
        ? `/api/admin/tasks/${editingTask.id}`
        : '/api/admin/tasks';
      
      const response = await fetch(url, {
        method: editingTask ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchTasks();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`/api/admin/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Tasks Management</h1>
          <p className="text-slate-400 mt-1">Create and manage daily tasks</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center space-x-2"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Tasks List */}
      <div className="bg-slate-900 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-slate-400 font-medium">Task</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Type</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Reward</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="px-6 py-4">
                      <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                    </td>
                  </tr>
                ))
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="text-white">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-slate-400">{task.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs
                        ${task.isDaily 
                          ? 'bg-blue-500/20 text-blue-500' 
                          : 'bg-purple-500/20 text-purple-500'
                        }`}
                      >
                        {task.isDaily ? 'Daily' : 'One-time'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{task.reward}</span>
                        <span className="text-orange-500">💧</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleOpenModal(task)}
                          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <FiEdit2 className="w-4 h-4 text-slate-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
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
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                {editingTask ? 'Edit Task' : 'New Task'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-800 rounded-lg"
              >
                <FiX className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none h-24"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Reward (Oil Drops)
                </label>
                <input
                  type="number"
                  value={formData.reward}
                  onChange={(e) => setFormData({ ...formData, reward: Number(e.target.value) })}
                  className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                  min="0"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isDaily"
                  checked={formData.isDaily}
                  onChange={(e) => setFormData({ ...formData, isDaily: e.target.checked })}
                  className="w-4 h-4 text-orange-500 bg-slate-800 border-slate-700 rounded focus:ring-orange-500"
                />
                <label htmlFor="isDaily" className="text-sm font-medium text-slate-400">
                  Daily Task
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center space-x-2"
                >
                  <FiCheck className="w-4 h-4" />
                  <span>{editingTask ? 'Update' : 'Create'} Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}