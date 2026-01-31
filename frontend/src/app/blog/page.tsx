'use client';

import { motion } from 'framer-motion';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Mastering Productivity: 5 Tips to Boost Your Efficiency',
      excerpt: 'Learn how to maximize your productivity with these proven techniques and tools.',
      date: 'Jan 15, 2026',
      author: 'Sarah Johnson',
    },
    {
      id: 2,
      title: 'The Future of Task Management: Trends to Watch',
      excerpt: 'Discover the emerging trends that are shaping the future of personal and professional task management.',
      date: 'Jan 12, 2026',
      author: 'Michael Chen',
    },
    {
      id: 3,
      title: 'Building Better Habits: A Scientific Approach',
      excerpt: 'Understand the science behind habit formation and learn practical strategies for lasting change.',
      date: 'Jan 10, 2026',
      author: 'Dr. Emily Rodriguez',
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">Latest Articles</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Insights, tips, and stories to help you achieve more and work smarter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all duration-300 group"
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-indigo-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-400 mb-4">{post.excerpt}</p>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{post.date}</span>
                <span>by {post.author}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium">
            Load More Articles
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPage;