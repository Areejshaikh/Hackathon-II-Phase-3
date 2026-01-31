// frontend/src/components/landing/hero.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-5xl text-center">
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-slate-100 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Organize Your Life with <span className="text-indigo-500">Todo Pro</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          The premium todo application that helps you stay organized, focused, and productive. 
          With AI-powered prioritization and cross-device sync.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/auth/signup"
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Get Started
          </Link>
          <Link
            href="/auth/signin"
            className="bg-slate-800 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-slate-700 transition-colors"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;