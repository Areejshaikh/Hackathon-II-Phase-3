// frontend/src/components/dashboard/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Home, Calendar, Settings, Square,} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Todos', href: '/todo', icon: Square },
    { name: 'Tasks', href: '/dashboard/tasks', icon: Square },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 glass-container min-h-screen flex flex-col border-r-0 border-b-0 border-l-0 border-t-0">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold text-indigo-400">Todo Pro</h2>
      </div>

      <nav className="flex-1 mt-8">
        <ul>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;

            return (
              <motion.li
                key={item.name}
                whileHover={{ x: 4 }}
                className="transition-all duration-200"
              >
                <Link
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-sm ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400 border-r-2 border-indigo-500'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-3" />
                  {item.name}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-indigo-500/20 text-indigo-400 w-10 h-10 rounded-full flex items-center justify-center font-semibold">
              {user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="text-slate-400 hover:text-slate-200 transition-colors focus-outline"
            title="Log out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;