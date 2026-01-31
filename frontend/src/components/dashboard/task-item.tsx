// frontend/src/components/dashboard/task-item.tsx
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Calendar, Clock, Trash2 } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  category: string;
  due_date?: string;
  priority: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface TaskItemProps {
  task: Task
  onTaskUpdated?: () => void;
  onTaskDeleted?: () => void;
}

const TaskItem = ({ task, onTaskUpdated, onTaskDeleted }: TaskItemProps) => {
  const statusColors = {
    'Pending': 'bg-slate-700/50 text-slate-300 border-slate-600',
    'In-Progress': 'bg-blue-900/30 text-blue-300 border-blue-700/50',
    'Completed': 'bg-green-900/30 text-green-300 border-green-700/50'
  };

  const categoryColors = {
    'Personal': 'bg-purple-900/30 text-purple-300 border-purple-700/50',
    'Work': 'bg-indigo-900/30 text-indigo-300 border-indigo-700/50',
    'Urgent': 'bg-red-900/30 text-red-300 border-red-700/50'
  };

  const statusIcons = {
    'Pending': <Circle className="w-4 h-4" />,
    'In-Progress': <Clock className="w-4 h-4" />,
    'Completed': <CheckCircle className="w-4 h-4" />
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const isCompleted = e.target.value === 'Completed';
      apiClient.updateTaskStatus(task.id, isCompleted);
      if (onTaskUpdated) {
        onTaskUpdated(); // Notify parent to refresh tasks
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // TaskItem.tsx ke handleDeleteTask function ko update karein
const handleDeleteTask = async () => {
  // Console mein check karein ke asli ID kya aa rahi hai
  console.log("Full Task Object:", task); 
  
  // Agar task.id undefined hai, toh shayad ye task._id ya task.task_id ho
  const actualId = task.id || (task as any)._id || (task as any).task_id;
  
  console.log("Extracted ID:", actualId);

  if (!actualId) {
    alert("Error: Task ID nahi mili!");
    return;
  }

  if (window.confirm('Are you sure?')) {
    try {
      await apiClient.deleteTask(actualId);
      if (onTaskDeleted) onTaskDeleted();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
};

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="glass-container p-4 rounded-xl" // Using standardized glass container with hover transitions
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {statusIcons[task.status as keyof typeof statusIcons]}
            <h3 className="font-medium text-slate-100 truncate">{task.title}</h3>
          </div>

          {task.description && (
            <p className="text-sm text-slate-400 mt-1 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded-full border ${
              statusColors[task.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-300'
            }`}>
              {task.status}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full border ${
              categoryColors[task.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800 border-gray-300'
            }`}>
              {task.category}
            </span>
            {task.due_date && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Calendar className="w-3 h-3" />
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="ml-4 flex items-center space-x-2">
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="text-sm bg-transparent border border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-200"
          >
            <option value="Pending">Pending</option>
            <option value="In-Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button
            onClick={handleDeleteTask}
            className="text-slate-500 hover:text-red-500 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;