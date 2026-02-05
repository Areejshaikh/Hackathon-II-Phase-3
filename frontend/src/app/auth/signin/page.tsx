// frontend/src/app/auth/signin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const { login, user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Redirect when user state is updated after login
  useEffect(() => {
    if (user && !isRedirecting) {
      setError('Sign in successful ✅');
      setIsRedirecting(true);
      // Small delay to show success message before redirecting
      setTimeout(() => {
        router.push('/todo');
      }, 1000);
    }
  }, [user, router, isRedirecting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

     try {
      console.log('Attempting to sign in with:', formData);
      await login(formData.email, formData.password);
      setError('Sign in successful ✅'); // Show success message
      // Redirect will be handled by useEffect when user state updates
    } catch (err: any) {
      console.error('Sign in error:', err);
      if (err.message) {
        setError(err.message);
      } else {
        setError('Sign in failed. Please check your credentials and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
      <div className="glass-container p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-100 mb-8">Welcome Back</h1>

        {error && <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-slate-300 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-slate-300 mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-slate-400">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-indigo-400 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;