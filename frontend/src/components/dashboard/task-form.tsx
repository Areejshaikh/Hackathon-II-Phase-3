// frontend/src/components/dashboard/task-form.tsx
'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';

interface TaskFormProps {
  onTaskCreated?: () => void;
  onSuccess?: () => void;  // For backward compatibility
}

const TaskForm = ({ onTaskCreated, onSuccess }: TaskFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal',
    priority: 3,
    due_date: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.createTask({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: parseInt(formData.priority.toString()),
        due_date: formData.due_date
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Personal',
        priority: 3,
        due_date: ''
      });

      // Call callbacks if provided to refresh the task list
      if (onTaskCreated) {
        onTaskCreated();
      }

      if (onSuccess) {
        onSuccess();  // For backward compatibility
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="task-form-section" className="glass-container p-6">
      <h2 className="text-xl font-semibold text-slate-100 mb-4">Create New Task</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm text-slate-400 mb-1">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-transparent border-b border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-0 text-slate-200 placeholder-slate-600 transition-all duration-300"
            placeholder="Enter task title..."
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm text-slate-400 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 bg-transparent border-b border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-0 text-slate-200 placeholder-slate-600 transition-all duration-300"
            placeholder="Enter task description..."
          />
        </div>

        <div className="grid grid-cols-1gap-4 mb-4">
          <div>
            <label htmlFor="category" className="block text-sm text-slate-400 mb-1">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-transparent border-b border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-0 text-slate-200 transition-all duration-300"
            >
              <option value="Personal" className="bg-slate-800">Personal</option>
              <option value="Work" className="bg-slate-800">Work</option>
              <option value="Urgent" className="bg-slate-800">Urgent</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm text-slate-400 mb-1">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-transparent border-b border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-0 text-slate-200 transition-all duration-300"
            >
              <option value={1} className="bg-slate-800">1 (Low)</option>
              <option value={2} className="bg-slate-800">2</option>
              <option value={3} className="bg-slate-800">3 (Medium)</option>
              <option value={4} className="bg-slate-800">4</option>
              <option value={5} className="bg-slate-800">5 (High)</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="due_date" className="block text-sm text-slate-400 mb-1">Due Date</label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-transparent border-b border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-0 text-slate-200 transition-all duration-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] ${
            loading
              ? 'bg-slate-700 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;