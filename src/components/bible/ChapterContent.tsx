'use client';

import { useEffect, useState } from 'react';
import { Verse, getChapterContent } from '@/lib/services/bibleService';
import { motion } from 'framer-motion';

interface ChapterContentProps {
  bibleId: string;
  chapterId: string;
}

function parseVerses(content: string): { number: string; text: string }[] {
  // Regular expression to match verse numbers followed by text
  // Example: "1 In the beginning God created the heavens and the earth. 2 Now the earth..."
  const versePattern = /(\d+)\s+([^0-9]+)(?=\s+\d+\s+|$)/g;
  const verses: { number: string; text: string }[] = [];
  
  let match;
  while ((match = versePattern.exec(content)) !== null) {
    verses.push({
      number: match[1],
      text: match[2].trim(),
    });
  }
  
  return verses;
}

export default function ChapterContent({
  bibleId,
  chapterId,
}: ChapterContentProps) {
  const [chapter, setChapter] = useState<Verse | null>(null);
  const [verses, setVerses] = useState<{ number: string; text: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChapterContent() {
      if (!bibleId || !chapterId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await getChapterContent(bibleId, chapterId);
        setChapter(data);
        
        // Parse verse content into an array of verse objects
        if (data.content) {
          const parsedVerses = parseVerses(data.content);
          setVerses(parsedVerses);
        }
      } catch (err) {
        console.error(`Failed to fetch chapter content for ${chapterId}:`, err);
        setError('Failed to load chapter content. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    setChapter(null);
    setVerses([]);
    fetchChapterContent();
  }, [bibleId, chapterId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="mx-auto h-12 w-12 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-blue-800">Loading Scripture...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-red-500 bg-opacity-80 backdrop-blur-md p-4 text-white m-6"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-white font-medium">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!chapter) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-blue-800 font-medium text-lg">No chapter content available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-2"
    >
      <motion.h2 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-4 text-2xl font-bold text-blue-900 border-b border-blue-200 pb-2"
      >
        {chapter.reference}
      </motion.h2>
      
      {chapter.copyright && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-4 text-xs text-blue-800 bg-blue-50 p-2 rounded-lg"
        >
          {chapter.copyright}
        </motion.div>
      )}
      
      <motion.div 
        className="space-y-3 text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {verses.length > 0 ? (
          <div className="scripture-text">
            {verses.map((verse, index) => (
              <motion.p 
                key={index} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.01 }}
                className="leading-relaxed mb-2 verse-text"
              >
                <sup className="mr-1 font-bold text-blue-600 verse-number">{verse.number}</sup>
                <span className="text-gray-800">{verse.text}</span>
              </motion.p>
            ))}
          </div>
        ) : (
          <motion.div 
            className="prose prose-lg prose-blue max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div dangerouslySetInnerHTML={{ __html: chapter.content.replace(/\n/g, '<br />') }} />
          </motion.div>
        )}
      </motion.div>

      <style jsx global>{`
        .scripture-text .verse-text:hover {
          background-color: rgba(59, 130, 246, 0.05);
          border-radius: 0.25rem;
        }
        .scripture-text .verse-text {
          padding: 0.25rem;
          transition: background-color 0.2s ease;
        }
        .verse-number {
          font-size: 0.75rem;
          vertical-align: super;
        }
      `}</style>
    </motion.div>
  );
}