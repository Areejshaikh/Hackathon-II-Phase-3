'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import ChatInterface from '@/components/ChatInterface';

const ChatPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/login');
      } else {
        // Set the user ID for the chat interface
        setUserId(user.id);
      }
    }
  }, [user, loading, router]);

  if (loading || !userId) {
    // Show a loading state while checking auth
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Task Assistant</h1>
          <p className="text-gray-600">Manage your tasks with natural language commands</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
          <ChatInterface userId={userId} />
        </div>

        <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-lg p-4 max-w-2xl mx-auto">
          <h3 className="font-medium text-indigo-800 mb-2">How to use:</h3>
          <ul className="text-indigo-700 list-disc pl-5 space-y-1">
            <li>Add tasks: "Add a task to buy groceries"</li>
            <li>List tasks: "Show me my tasks"</li>
            <li>Complete tasks: "Mark task 1 as complete"</li>
            <li>Delete tasks: "Delete the meeting task"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;