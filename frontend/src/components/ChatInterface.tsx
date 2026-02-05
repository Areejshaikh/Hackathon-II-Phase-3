'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface ToolResult {
  action: string;
  result: any;
}

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolResults?: ToolResult[];
}

interface ChatInterfaceProps {
  userId: string;
  onClose?: () => void;
  onTaskAdded?: () => void;  // Callback to notify parent when a task is added
  onTaskUpdated?: () => void; // Callback to notify parent when a task is updated
  onTaskDeleted?: () => void; // Callback to notify parent when a task is deleted
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId, onClose, onTaskAdded, onTaskUpdated, onTaskDeleted }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get personalized greeting from backend
  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const data = await apiClient.sendChatMessage(userId, 'greeting') as { response: string };

        // If the response contains a greeting-like message, use it
        if (data.response && (data.response.startsWith('Hi ') || data.response.includes('Welcome'))) {
          setMessages([
            {
              id: 1,
              role: 'assistant',
              content: data.response,
              timestamp: new Date().toISOString(),
            }
          ]);
        } else {
          // Fallback to default message
          setMessages([
            {
              id: 1,
              role: 'assistant',
              content: `Hi there! I'm your AI assistant. You can ask me to add, list, complete, or delete tasks.`,
              timestamp: new Date().toISOString(),
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching greeting:', error);
        // Fallback to default message if API call fails
        setMessages([
          {
            id: 1,
            role: 'assistant',
            content: `Hi there! I'm your AI assistant. You can ask me to add, list, complete, or delete tasks.`,
            timestamp: new Date().toISOString(),
          }
        ]);
      }
    };

    if (userId) {
      fetchGreeting();
    }
  }, [userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message to the chat
    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call the backend chat API with user ID using the API client
      const data = await apiClient.sendChatMessage(userId, inputValue) as { response: string; tool_results?: ToolResult[] };

      // Add assistant response to the chat
      const assistantMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        toolResults: data.tool_results || [],
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Check if any tool results indicate a task operation and notify parent
      if (data.tool_results) {
        const hasAddTask = data.tool_results.some(result => result.action === 'add_task');
        const hasUpdateTask = data.tool_results.some(result => result.action === 'update_task' || result.action === 'complete_task');
        const hasDeleteTask = data.tool_results.some(result => result.action === 'delete_task');

        // Small delay to ensure the message is added before calling the callback
        setTimeout(() => {
          if (hasAddTask && onTaskAdded) {
            onTaskAdded();
          } else if (hasUpdateTask && onTaskUpdated) {
            onTaskUpdated();
          } else if (hasDeleteTask && onTaskDeleted) {
            onTaskDeleted();
          } else if ((hasUpdateTask || hasDeleteTask) && onTaskAdded) {
            // Fallback to onTaskAdded if specific callbacks aren't provided
            onTaskAdded();
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to the chat
      const errorMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (onClose && !isOpen) {
      onClose();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-50"
      >
        <Bot size={24} />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 bg-indigo-600  text-white p-3 rounded-xl shadow-lg cursor-pointer z-50 flex items-center justify-between w-64" onClick={toggleMinimize}>
        <div className="flex items-center space-x-2">
          <Bot size={16} />
          <span className="font-semibold text-sm">AI Assistant</span>
        </div>
        <span className="text-white">↑</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20  top-16 right-6 w-96 h-[560px] bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col z-50">
      {/* Chat header */}
      <div className="bg-indigo-600 text-white p-4 rounded-t-xl flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bot size={20} />
          <span className="font-semibold">AI Task Assistant</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleMinimize}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            −
          </button>
          <button
            onClick={toggleChat}
            className="text-white hover:text-gray-200 focus:outline-none ml-2"
          >
            ×
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl p-3 ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === 'assistant' && <Bot size={16} className="mt-0.5 flex-shrink-0" />}
                <div className="whitespace-pre-wrap">
                  {message.content}

                  {/* Render tool results if available */}
                  {message.toolResults && message.toolResults.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      {message.toolResults.map((toolResult, idx) => (
                        <div key={idx} className="mt-2">
                          {toolResult.action === 'list_tasks' && toolResult.result.tasks && (
                            <div className="grid grid-cols-1 gap-2">
                              {toolResult.result.tasks.map((task: any) => (
                                <div key={task.id} className="bg-white bg-opacity-20 p-2 rounded-md">
                                  <div className="font-medium">Task {task.id}: {task.title}</div>
                                  <div className="text-xs opacity-80">Status: {task.status}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {toolResult.action === 'add_task' && (
                            <div className="text-green-100 text-sm">
                              ✓ Added: {toolResult.result.title}
                            </div>
                          )}

                          {toolResult.action === 'complete_task' && (
                            <div className="text-yellow-100 text-sm">
                              ✓ Completed: {toolResult.result.title}
                            </div>
                          )}

                          {toolResult.action === 'delete_task' && (
                            <div className="text-red-100 text-sm">
                              ✓ Deleted: {toolResult.result.title}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {message.role === 'user' && <User size={16} className="mt-0.5 flex-shrink-0" />}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex mb-4 justify-start">
            <div className="bg-gray-200 text-gray-800 rounded-xl rounded-bl-none p-3 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <Bot size={16} className="mt-0.5 flex-shrink-0" />
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="border-t border-gray-200 p-3 bg-white rounded-b-xl">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me to add, list, complete, or delete tasks..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className={`bg-indigo-600 text-white rounded-full p-2 ${
              isLoading || !inputValue.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
            }`}
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Powered by Cohere AI • Natural language task management
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;