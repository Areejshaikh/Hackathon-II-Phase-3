// frontend/src/components/landing/onboarding.tsx
'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: "1",
    title: "Sign Up",
    description: "Create your free account in seconds with just your email."
  },
  {
    number: "2",
    title: "Add Tasks",
    description: "Quickly add tasks with our intuitive interface."
  },
  {
    number: "3",
    title: "Stay Productive",
    description: "Track your progress and achieve your goals."
  }
];

const Onboarding = () => {
  return (
    <section id="onboarding" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Get Started in 3 Simple Steps</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join thousands of users who have transformed their productivity
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              {/* Step card */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center min-w-[250px]">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
              
              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Onboarding;