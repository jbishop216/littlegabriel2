'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from './ui/button';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const userIsAdmin = session?.user?.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                LittleGabriel
              </span>
            </Link>
          </div>
            
          {/* Navigation Links - Desktop */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link 
              href="/chat" 
              className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-indigo-500 hover:text-gray-900 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:text-white"
              prefetch={true}
              passHref
            >
              <span>Chat</span>
            </Link>
            <Link 
              href="/prayer-requests" 
              className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-indigo-500 hover:text-gray-900 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:text-white"
              prefetch={true}
              passHref
            >
              <span>Prayer Requests</span>
            </Link>
            <Link 
              href="/sermon-generator" 
              className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-indigo-500 hover:text-gray-900 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:text-white"
              prefetch={true}
              passHref
            >
              <span>Sermon Generator</span>
            </Link>
            <Link 
              href="/bible-reader" 
              className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-indigo-500 hover:text-gray-900 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:text-white"
              prefetch={true}
              passHref
            >
              <span>Bible Reader</span>
            </Link>
            {userIsAdmin && (
              <Link 
                href="/admin" 
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-indigo-500 hover:text-gray-900 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:text-white"
                prefetch={true}
                passHref
              >
                <span className="flex items-center">
                  <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
                  Admin Console
                </span>
              </Link>
            )}
          </div>

          {/* Right side elements */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <button
              onClick={toggleTheme}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {session ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {session.user.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" prefetch={true} passHref>
                  <button className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                    Log in
                  </button>
                </Link>
                <Link href="/register" prefetch={true} passHref>
                  <button className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}
        id="mobile-menu"
      >
        <div className="space-y-1 pb-3 pt-2">
          <Link 
            href="/chat" 
            className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-indigo-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:bg-gray-700 dark:hover:text-white"
            prefetch={true}
            passHref
          >
            <span>Chat</span>
          </Link>
          <Link 
            href="/prayer-requests" 
            className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-indigo-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:bg-gray-700 dark:hover:text-white"
            prefetch={true}
            passHref
          >
            <span>Prayer Requests</span>
          </Link>
          <Link 
            href="/sermon-generator" 
            className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-indigo-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:bg-gray-700 dark:hover:text-white"
            prefetch={true}
            passHref
          >
            <span>Sermon Generator</span>
          </Link>
          <Link 
            href="/bible-reader" 
            className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-indigo-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:bg-gray-700 dark:hover:text-white"
            prefetch={true}
            passHref
          >
            <span>Bible Reader</span>
          </Link>
          {userIsAdmin && (
            <Link 
              href="/admin" 
              className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-indigo-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:bg-gray-700 dark:hover:text-white"
              prefetch={true}
              passHref
            >
              <span className="flex items-center">
                <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
                Admin Console
              </span>
            </Link>
          )}
        </div>
        <div className="border-t border-gray-200 pb-3 pt-4 dark:border-gray-700">
          <div className="flex items-center px-4">
            {session ? (
              <div className="w-full">
                <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {session.user.email}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {session.user.role}
                </div>
                <div className="mt-3 flex flex-col space-y-3">
                  <button
                    onClick={toggleTheme}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block rounded-md border border-gray-300 bg-white px-3 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <button
                  onClick={toggleTheme}
                  className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                <div className="mt-3 flex space-x-2">
                  <Link href="/login" className="flex-1" prefetch={true} passHref>
                    <button className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                      Log in
                    </button>
                  </Link>
                  <Link href="/register" className="flex-1" prefetch={true} passHref>
                    <button className="w-full rounded-md bg-indigo-600 px-4 py-2 text-center text-base font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                      Register
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}