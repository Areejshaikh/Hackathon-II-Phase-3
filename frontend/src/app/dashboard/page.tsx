'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/sidebar';
import TaskSummaryCards from '@/components/dashboard/task-summary-cards';
import TaskTabs from '@/components/dashboard/task-tabs';
import TaskList from '@/components/dashboard/task-list';
import TaskForm from '@/components/dashboard/task-form';
import ChatbotIcon from '@/components/ChatbotIcon';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/context/auth-context';

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

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'In-Progress' | 'Completed'>('All');

  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();

  // Fix 1: Wrap fetchTasks in useCallback to prevent infinite re-renders
  const fetchTasks = useCallback(async () => {
    try {
      const response: any = await apiClient.getTasks();
      // Flexible check to handle different backend response structures
      if (response && response.tasks) {
        setTasks(response.tasks);
      } else if (Array.isArray(response)) {
        setTasks(response);
      } else if (response?.data?.tasks) {
        setTasks(response.data.tasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  }, []);

  // Fix 2: Auth and User Data Loading logic
  useEffect(() => {
    if (!authLoading) {
      if (!authUser) {
        // Agar login page sirf '/' par hai toh router.push('/') karein
        router.push('/auth/signin');
      } else {
        const fetchUserAndTasks = async () => {
          try {
            // FIX 3: Type casting 'any' to solve the "Type unknown" error on line 59
            const userData: any = await apiClient.getCurrentUser();
            
            // Handle cases where data might be nested or direct
            const finalUser = userData?.data || userData;
            setUser(finalUser);
            
            await fetchTasks();
          } catch (error) {
            console.error("Auth initialization failed:", error);
            router.push('/auth/signin');
          } finally {
            setLoading(false);
          }
        };
        fetchUserAndTasks();
      }
    }
  }, [authUser, authLoading, router, fetchTasks]);

  // Fix 4: Fetch tasks on tab change ONLY if authenticated
  useEffect(() => {
    if (authUser && !loading) {
      fetchTasks();
    }
  }, [activeTab, authUser, loading, fetchTasks]);

  const handleTaskAdded = async () => await fetchTasks();
  const handleTaskUpdated = async () => await fetchTasks();
const handleTaskDeleted = async () => {
  console.log("Task deleted, refreshing list...");
  await fetchTasks();
};

  const filteredTasks = activeTab === 'All'
    ? tasks
    : tasks.filter(task => task.status === activeTab);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <motion.div className="mb-8" variants={containerVariants} initial="hidden" animate="visible">
            <motion.h1 className="text-3xl font-bold text-slate-100" variants={itemVariants}>
              Dashboard
            </motion.h1>
            <motion.p className="text-slate-400" variants={itemVariants}>
              Welcome back, {user?.first_name || user?.email || 'User'}!
            </motion.p>
          </motion.div>

          <motion.div className="mb-8" variants={itemVariants} initial="hidden" animate="visible">
            <TaskSummaryCards tasks={tasks} />
          </motion.div>

          <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" animate="visible">
            <div className="lg:col-span-2">
              <motion.div variants={itemVariants}>
                <TaskTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <TaskList
                  tasks={filteredTasks}
                  onTaskUpdated={handleTaskUpdated}
                  onTaskDeleted={handleTaskDeleted}
                />
              </motion.div>
            </div>
            <div>
              <motion.div variants={itemVariants}>
                <TaskForm onTaskCreated={handleTaskAdded} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
      <ChatbotIcon />
    </div>
  );
};

export default DashboardPage;