'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { data: session, status } = useSession();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    if (session && status === 'authenticated') {
      console.log('User already authenticated:', session.user);
      window.location.href = callbackUrl;
    }
  }, [session, status, callbackUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoginStatus('Attempting to sign in...');
    setLoading(true);

    try {
      console.log('Attempting login with email:', formData.email);
      
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl,
      });

      console.log('Sign in response:', res);

      if (res?.error) {
        console.error('Login error response:', res.error);
        setError('Invalid email or password. Please check your credentials and try again.');
        setLoginStatus('Login failed');
      } else if (res?.url) {
        setLoginStatus('Login successful, redirecting...');
        console.log('Login successful, redirecting to:', res.url);
        
        // Small delay to ensure session is fully established
        setTimeout(() => {
          window.location.href = res.url || callbackUrl;
        }, 500);
      } else {
        setLoginStatus('Login successful but no redirect URL received');
        console.log('Login successful but no redirect URL');
        window.location.href = callbackUrl;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred during login. Please try again.');
      setLoginStatus('Login process failed with an exception');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Log in to continue your faith journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Your password"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          {loginStatus && !error && (
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {loginStatus}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Logging in...' : 'Log in'}
          </Button>

          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}