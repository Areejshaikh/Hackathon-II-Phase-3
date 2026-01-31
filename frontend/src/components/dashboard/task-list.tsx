// frontend/src/components/dashboard/task-list.tsx
'use client';

import { useState } from 'react';
import TaskItem from './task-item';
import { Plus } from 'lucide-react';

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

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated?: () => void;
  onTaskDeleted?: () => void;
}

const TaskList = ({ tasks, onTaskUpdated, onTaskDeleted }: TaskListProps) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="glass-container rounded-xl">
        <div className="divide-y divide-slate-800/50">
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-6">
              {/* Dashed border circle */}
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-indigo-500/50 flex items-center justify-center">
                {/* Vibrant indigo icon */}
              </div>
              {/* Floating plus icon */}
              <div className="absolute -top-2 -right-2 bg-indigo-500 rounded-full w-8 h-8 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </div>

            <h3 className="text-lg font-medium text-slate-200 mb-2">No tasks yet</h3>
            <p className="text-slate-500 mb-4">Create your first task to get started</p>
            <button
              className="inline-flex items-center px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-indigo-300 text-sm hover:bg-indigo-600/30 transition-colors"
              onClick={() => {
                // Scroll to the task form when clicked
                const formElement = document.querySelector('#task-form-section');
                if (formElement) {
                  formElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Add your first task</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-container rounded-xl">
      <div className="divide-y divide-slate-800/50">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onTaskUpdated={onTaskUpdated}
            onTaskDeleted={onTaskDeleted}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;