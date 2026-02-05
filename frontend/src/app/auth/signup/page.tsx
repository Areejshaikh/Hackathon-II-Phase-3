'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

const SignUpPage = () => {
  const router = useRouter();
  const { register, user } = useAuth();

  // 1. Saari States hamesha component ke start mein honi chahiye
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 2. Handle Change function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Handle Submit (Ab ye register aur router ko access kar sakta hai)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Purana error clear karein

    try {
      console.log('Attempting registration with:', formData);

      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName, // Snake_case
        last_name: formData.lastName    // Snake_case
      });

      // SUCCESS: Dashboard ya Todo par bheinjein
      console.log("Registration successful! Redirecting...");
      router.push('/todo');

    } catch (err: any) {
      console.error('Registration error details:', err);
      // Agar backend se detail error aaye to wo dikhayein
      const errorMsg = err.response?.data?.detail || err.message || 'Registration failed. Please try again.';
      if (errorMsg.includes('already exists')) {
        setError('This email is already in use. Redirecting you to your Todo dashboard...');
        // Auto-redirect after showing message
        setTimeout(() => {
          router.push('/todo');
        }, 2000);
      } else {
        setError(errorMsg);
      }
    }
  };

  // 4. Redirect agar user pehle se logged in hai
  useEffect(() => {
    if (user && !isRedirecting) {
      setIsRedirecting(true);
      // Show success message and redirect after a brief delay
      setTimeout(() => {
        router.push('/todo');
      }, 500);
    }
  }, [user, router, isRedirecting]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
      <div className="glass-container p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-100 mb-8">Create Your Account</h1>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-slate-300 mb-2 text-sm">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="lastName" className="block text-slate-300 mb-2 text-sm">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-slate-300 mb-2 text-sm">Email Address</label>
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
            <label htmlFor="password" className="block text-slate-300 mb-2 text-sm">Password</label>
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
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-slate-400 text-sm">
          Already have an account?{' '}
          <Link href="/dashboard" className="text-indigo-400 hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;