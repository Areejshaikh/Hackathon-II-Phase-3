'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
// Dashboard icon ke liye LayoutDashboard import kiya
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800/50 py-2'
          : 'bg-[#020617]/70 backdrop-blur-lg py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-indigo-400 tracking-tight">
            TodoProMax
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">
              Home
            </Link>
            
            {/* Conditional Links for Authenticated Users */}
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1 text-slate-300 hover:text-indigo-400 transition-colors font-medium"
                >
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/todo"
                  className="flex items-center space-x-1 text-slate-300 hover:text-indigo-400 transition-colors font-medium"
                >
                  <span>Tasks</span>
                </Link>
              </>
            )}

            <Link href="/blog" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">
              Blog
            </Link>

            {user ? (
              <div className="relative group ml-4">
                <button className="flex items-center space-x-2 bg-slate-800/50 p-1 pr-3 rounded-full border border-slate-700 hover:border-indigo-500 transition-all">
                  <span className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                    {user.first_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                  <span className="text-sm text-slate-200 font-medium">Account</span>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-800 bg-slate-800/30">
                    <p className="text-xs text-slate-500 font-semibold uppercase">Signed in as</p>
                    <p className="text-sm text-white font-medium truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/dashboard" className="flex items-center space-x-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors">
                      <span>My Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20 font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-6 space-y-2 border-t border-slate-800/50 pt-4">
            <Link href="/" className="block py-2 text-slate-300" onClick={() => setIsMenuOpen(false)}>Home</Link>
            {user && (
              <>
                <Link href="/dashboard" className="flex items-center space-x-2 py-2 text-indigo-400" onClick={() => setIsMenuOpen(false)}>
                  <span>Dashboard</span>
                </Link>
                <Link href="/todo" className="flex items-center space-x-2 py-2 text-indigo-400" onClick={() => setIsMenuOpen(false)}>
                  <span>Tasks</span>
                </Link>
              </>
            )}
            <Link href="/blog" className="block py-2 text-slate-300" onClick={() => setIsMenuOpen(false)}>Blog</Link>
            <div className="pt-4 border-t border-slate-800/50">
              {user ? (
                <button onClick={handleLogout} className="text-red-400 font-medium">Logout</button>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link href="/auth/signin" className="text-slate-300">Sign In</Link>
                  <Link href="/auth/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-lg w-full text-center">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;