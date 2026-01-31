'use client';

import { motion } from 'framer-motion';

const CartPage = () => {
  const cartItems = [
    {
      id: 1,
      name: 'Premium Productivity Bundle',
      description: 'Advanced tools and templates for maximum efficiency',
      price: '$49.99',
      image: '/api/placeholder/80/80',
    },
    {
      id: 2,
      name: 'AI Task Assistant',
      description: 'Intelligent task management with AI-powered suggestions',
      price: '$29.99',
      image: '/api/placeholder/80/80',
    },
    {
      id: 3,
      name: 'Team Collaboration Package',
      description: 'Enhanced features for team productivity',
      price: '$99.99',
      image: '/api/placeholder/80/80',
    },
  ];

  const subtotal = '$179.97';
  const shipping = '$9.99';
  const total = '$189.96';

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">Your Cart</h1>
          <p className="text-xl text-slate-400">
            Review and complete your purchase
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 flex items-center space-x-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg bg-indigo-600/20 flex items-center justify-center text-slate-400"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-100">{item.name}</h3>
                    <p className="text-slate-400 text-sm">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-100">{item.price}</p>
                    <button className="text-slate-500 hover:text-red-400 text-sm transition-colors">
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-slate-100 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Shipping</span>
                  <span>{shipping}</span>
                </div>
                <div className="border-t border-slate-700 pt-3">
                  <div className="flex justify-between text-slate-100 font-semibold">
                    <span>Total</span>
                    <span>{total}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium mb-3">
                Proceed to Checkout
              </button>

              <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors font-medium">
                Continue Shopping
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;