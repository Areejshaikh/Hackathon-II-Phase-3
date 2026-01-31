// frontend/src/components/landing/features-grid.tsx
'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Cloud, Brain, Lock, Clock } from 'lucide-react';

const features = [
  {
    icon: <Shield className="h-8 w-8 text-indigo-500" />,
    title: "Bank-Level Security",
    description: "Your data is encrypted and secured with enterprise-grade security protocols."
  },
  {
    icon: <Brain className="h-8 w-8 text-indigo-500" />,
    title: "AI Prioritization",
    description: "Our intelligent system learns your habits to prioritize tasks effectively."
  },
  {
    icon: <Cloud className="h-8 w-8 text-indigo-500" />,
    title: "Cloud Sync",
    description: "Access your tasks from any device, anywhere, anytime."
  },
  {
    icon: <Zap className="h-8 w-8 text-indigo-500" />,
    title: "Lightning Fast",
    description: "Optimized for speed and performance to keep you productive."
  },
  {
    icon: <Lock className="h-8 w-8 text-indigo-500" />,
    title: "Privacy Focused",
    description: "Your data stays yours. We don't sell or share your information."
  },
  {
    icon: <Clock className="h-8 w-8 text-indigo-500" />,
    title: "Time Management",
    description: "Built-in tools to help you manage your time more effectively."
  }
];

const FeaturesGrid = () => {
  return (
    <section id="features" className="py-20 bg-dark-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-100 mb-4">Powerful Features</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Everything you need to stay organized and boost productivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass-container p-8 rounded-xl transition-transform"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">{feature.title}</h3>
              <p className="text-slate-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;