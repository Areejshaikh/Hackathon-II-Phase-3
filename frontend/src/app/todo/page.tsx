'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import TaskSummaryCards from '@/components/dashboard/task-summary-cards';
import TaskTabs from '@/components/dashboard/task-tabs';
import TaskList from '@/components/dashboard/task-list';
import TaskForm from '@/components/dashboard/task-form';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import ChatInterface from '@/components/ChatInterface';

const TodoPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'In-Progress' | 'Completed'>('All');
  const [pageLoading, setPageLoading] = useState(true);

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // 1. Fetch Tasks with proper data extraction
  const fetchTasks = useCallback(async () => {
    try {
      const response: any = await apiClient.getTasks();
      console.log("API Response Tasks:", response); // Debugging ke liye

      // Backend format check: response.data.tasks ya response.tasks ya direct array
      let fetchedTasks = [];
      if (Array.isArray(response)) {
        fetchedTasks = response;
      } else if (response?.data?.tasks) {
        fetchedTasks = response.data.tasks;
      } else if (response?.tasks) {
        fetchedTasks = response.tasks;
      } else if (response?.data && Array.isArray(response.data)) {
        fetchedTasks = response.data;
      }

      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setPageLoading(false);
    }
  }, [setTasks]);

  // 2. Initial load and Auth check
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/auth/signin'); 
      } else {
        fetchTasks();
      }
    }
  }, [user, authLoading, router, fetchTasks]);

  // 3. Tab filtering logic (Client side)
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'All') return true;
    // Status match check (handling case sensitivity)
    return task.status?.toLowerCase() === activeTab.toLowerCase();
  });

  // 4. Action Handlers (Refresh data after every action)
  const handleAction = async () => {
    console.log("Action performed, refreshing list...");
    await fetchTasks();
  };

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-100">My Task Manager</h1>
            <p className="text-slate-400 mt-2">
              Welcome, {user?.first_name || user?.email}
            </p>
          </header>

          {/* Summary Cards: Inme 'tasks' array ja raha hai counts ke liye */}
          <div className="mb-8">
            <TaskSummaryCards tasks={tasks} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TaskTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              <TaskList
                tasks={filteredTasks}
                onTaskUpdated={handleAction}
                onTaskDeleted={handleAction}
              />
            </div>
            <div>
              <aside className="sticky top-8">
                <TaskForm onTaskCreated={handleAction} />
              </aside>
            </div>
          </div>
        </div>
      </main>
      <ChatInterface
        userId={user?.id || ''}
        onClose={() => console.log('Chat closed in todo page')}
        onTaskAdded={handleAction}  // Refresh tasks when a new task is added via chat
        onTaskUpdated={handleAction} // Refresh tasks when a task is updated via chat
        onTaskDeleted={handleAction} // Refresh tasks when a task is deleted via chat
      />
    </div>
  );
};

export default TodoPage;