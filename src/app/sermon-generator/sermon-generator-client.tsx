'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SermonForm, { SermonFormData } from '@/components/sermon/SermonForm';
import SermonResult from '@/components/sermon/SermonResult';
import { FloatingIcon } from '@/components/ui/theme-icons';

interface SermonData {
  title: string;
  introduction: string;
  mainPoints: { title: string; content: string }[];
  conclusion: string;
  scriptureReferences: string[];
  illustrations?: string[];
}

export default function SermonGeneratorClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sermonData, setSermonData] = useState<SermonData | null>(null);

  const handleGenerate = async (formData: SermonFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/sermon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate sermon');
      }
      
      // Validate the sermon data structure
      if (!data.title || !data.introduction || !Array.isArray(data.mainPoints) || !data.conclusion || !Array.isArray(data.scriptureReferences)) {
        throw new Error('The sermon data is incomplete or in an unexpected format.');
      }
      
      // Ensure mainPoints have the correct structure
      if (data.mainPoints.some((point: any) => !point.title || !point.content)) {
        throw new Error('Some sermon points are missing required properties.');
      }
      
      // Ensure illustrations is an array if present
      if (data.illustrations && !Array.isArray(data.illustrations)) {
        data.illustrations = [];
      }
      
      setSermonData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Sermon generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSermonData(null);
    setError(null);
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden">
      {/* Swirling gradient background: green -> blue */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-400 to-green-500 mix-blend-multiply z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 1 }}
      />

      {/* Floating crosses at fixed positions */}
      {[
        { top: '5%', left: '20%' },
        { top: '20%', left: '75%' },
        { top: '55%', left: '5%' },
        { top: '70%', left: '80%' },
        { top: '35%', left: '45%' },
      ].map((position, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={position}
          animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 6 + index, repeatType: 'reverse' }}
        >
          <FloatingIcon className="w-9 h-9 opacity-80" />
        </motion.div>
      ))}

      <div className="relative z-10 container mx-auto flex flex-col px-4 py-8">
        <motion.div 
          className="mb-8"
          initial={{ scale: 0.9, y: -20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white bg-opacity-30 backdrop-blur-sm text-white shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-7 w-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-md">Sermon Generator</h1>
          </div>
          <p className="mt-2 text-lg text-white text-opacity-90 ml-14">
            Create inspiring sermon outlines and content based on Biblical texts and themes.
          </p>
        </motion.div>
        
        {/* Sermon Generator Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-white border-opacity-20"
        >
          <div className="flex-1">
            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-200">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!sermonData ? (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Generate Your Sermon</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  Fill in the details below to generate a customized sermon outline. Our AI will create
                  a structured sermon based on your specifications, including Biblical passages, key points,
                  and practical applications.
                </p>
                <SermonForm onGenerate={handleGenerate} isLoading={isLoading} />
              </div>
            ) : (
              <SermonResult sermonData={sermonData} onReset={handleReset} />
            )}
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-white text-opacity-90 text-md drop-shadow-md">
            You can also ask Gabriel for sermon ideas and inspiration in the chat section.
          </p>
          <Link href="/chat" className="mt-2 inline-block text-white font-bold hover:text-yellow-300 transition-colors">
            Return to Chat →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}