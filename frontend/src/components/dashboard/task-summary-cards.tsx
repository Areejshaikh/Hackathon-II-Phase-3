// frontend/src/components/dashboard/task-summary-cards.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';

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

interface TaskSummaryCardsProps {
  tasks: Task[];
}

const TaskSummaryCards = ({ tasks }: TaskSummaryCardsProps) => {
  const taskStats = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) {
      return {
        total_tasks: 0,
        pending_tasks: 0,
        in_progress_tasks: 0,
        completed_tasks: 0
      };
    }

    const total_tasks = tasks.length;
    const pending_tasks = tasks.filter(task => task.status === 'Pending').length;
    const in_progress_tasks = tasks.filter(task => task.status === 'In-Progress').length;
    const completed_tasks = tasks.filter(task => task.status === 'Completed').length;

    return {
      total_tasks,
      pending_tasks,
      in_progress_tasks,
      completed_tasks
    };
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="glass-container p-6 rounded-xl">
        <h3 className="text-slate-400 text-sm font-medium">Total Tasks</h3>
        <p className="text-3xl font-bold text-slate-100 mt-2">{taskStats.total_tasks}</p>
      </div>

      <div className="glass-container p-6 rounded-xl">
        <h3 className="text-slate-400 text-sm font-medium">Pending</h3>
        <p className="text-3xl font-bold text-yellow-400 mt-2">{taskStats.pending_tasks}</p>
      </div>

      <div className="glass-container p-6 rounded-xl">
        <h3 className="text-slate-400 text-sm font-medium">In Progress</h3>
        <p className="text-3xl font-bold text-blue-400 mt-2">{taskStats.in_progress_tasks}</p>
      </div>

      <div className="glass-container p-6 rounded-xl">
        <h3 className="text-slate-400 text-sm font-medium">Completed</h3>
        <p className="text-3xl font-bold text-green-400 mt-2">{taskStats.completed_tasks}</p>
      </div>
    </div>
  );
};

export default TaskSummaryCards;