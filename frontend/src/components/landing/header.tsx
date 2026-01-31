// frontend/src/components/landing/header.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-container py-2'
          : 'glass-container py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-500">
          Todo Pro
        </Link>

        <nav className="hidden md:flex space-x-8">
          <Link href="#features" className="text-slate-200 hover:text-indigo-400 transition-colors">
            Features
          </Link>
          <Link href="#about" className="text-slate-200 hover:text-indigo-400 transition-colors">
            About
          </Link>
          <Link href="#pricing" className="text-slate-200 hover:text-indigo-400 transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-slate-200">Welcome, {user.first_name || user.email}</span>
              <button
                onClick={() => logout()}
                className="text-slate-200 hover:text-indigo-400 transition-colors"
              >
                Logout
              </button>
              <Link
                href="/dashboard"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-slate-200 hover:text-indigo-400 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;