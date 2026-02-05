import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import Link from 'next/link';

const ChatbotIcon = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Hide the icon on certain pages where chat wouldn't be needed
  React.useEffect(() => {
    const handleRouteChange = () => {
      // Show icon on dashboard and related pages, hide on auth pages
      const isAuthPage = window.location.pathname.includes('/auth') ||
                         window.location.pathname === '/' ||
                         window.location.pathname === '/login' ||
                         window.location.pathname === '/register';
      setIsVisible(!isAuthPage);
    };

    // Initial check
    handleRouteChange();

    // Listen for route changes if using a router
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link href="/dashboard/chat">
        <div className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-110 hover:shadow-xl flex items-center justify-center">
          <Bot size={24} />
        </div>
      </Link>
    </div>
  );
};

export default ChatbotIcon;