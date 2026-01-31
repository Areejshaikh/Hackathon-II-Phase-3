
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

export default function HomePage() {
  const { user, loading } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-slate-100 mb-6"
            variants={itemVariants}
          >
            Welcome to <span className="text-indigo-400">Todo Pro</span>
          </motion.h1>

          <motion.p
            className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Professional task management with AI-powered features and premium design
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
            ) : user ? (
              <Link
                href="/todo"
                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Go to My Todos
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-8 py-3 bg-slate-800 text-slate-200 font-medium rounded-lg hover:bg-slate-700 transition-colors border border-slate-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-20 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {[
              { title: 'Smart Organization', desc: 'AI-powered task categorization' },
              { title: 'Real-time Sync', desc: 'Never lose your progress' },
              { title: 'Premium Design', desc: 'Beautiful, intuitive interface' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">{feature.title}</h3>
                <p className="text-slate-300">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}