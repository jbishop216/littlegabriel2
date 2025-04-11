'use client';

import { useState } from 'react';
import { SiteProtectionWrapper } from '@/components/SiteProtectionWrapper';
import BibleSelector from '@/components/bible/BibleSelector';
import BookSelector from '@/components/bible/BookSelector';
import ChapterSelector from '@/components/bible/ChapterSelector';
import ChapterContent from '@/components/bible/ChapterContent';
import BibleSearch from '@/components/bible/BibleSearch';
import { motion } from 'framer-motion';

enum TabType {
  READ = 'read',
  SEARCH = 'search',
}

import { FloatingIcon } from '@/components/ui/theme-icons';

export default function BibleReaderPage() {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.READ);
  const [selectedBible, setSelectedBible] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');

  const handleBibleSelect = (bibleId: string) => {
    setSelectedBible(bibleId);
    setSelectedBook('');
    setSelectedChapter('');
  };

  const handleBookSelect = (bookId: string) => {
    setSelectedBook(bookId);
    setSelectedChapter('');
  };

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapter(chapterId);
  };

  const handleVerseSelect = (bibleId: string, chapterId: string) => {
    setSelectedBible(bibleId);
    setSelectedChapter(chapterId);
    setActiveTab(TabType.READ);
  };

  return (
    <SiteProtectionWrapper>
      <div className="relative min-h-screen overflow-hidden">
        {/* Swirling gradient background: blue -> gold */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600 mix-blend-multiply z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1 }}
        />

        {/* Floating crosses at fixed positions */}
        {[
          { top: '8%', left: '12%' },
          { top: '22%', left: '85%' },
          { top: '45%', left: '8%' },
          { top: '65%', left: '92%' },
          { top: '80%', left: '35%' },
          { top: '15%', left: '65%' },
        ].map((position, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={position}
            animate={{ y: [0, -25, 0], x: [0, 15, 0], rotate: [0, 25, 0] }}
            transition={{ repeat: Infinity, duration: 6 + index, repeatType: 'reverse' }}
          >
            <FloatingIcon className="w-8 h-8 opacity-70" />
          </motion.div>
        ))}

        <div className="relative z-10 container mx-auto px-4 py-8">
          <motion.h1 
            className="mb-6 text-4xl font-extrabold text-white drop-shadow-md md:text-5xl"
            initial={{ scale: 0.9, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Bible Reader
          </motion.h1>
          
          <motion.div 
            className="mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <BibleSelector
              selectedBible={selectedBible}
              onBibleSelect={handleBibleSelect}
            />
          </motion.div>
          
          {selectedBible && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 flex border-b border-white border-opacity-30">
                <button
                  className={`px-5 py-3 text-md font-bold transition-all ${
                    activeTab === TabType.READ
                      ? 'border-b-2 border-white text-white'
                      : 'text-white text-opacity-70 hover:text-opacity-100'
                  }`}
                  onClick={() => setActiveTab(TabType.READ)}
                >
                  Read Scripture
                </button>
                <button
                  className={`px-5 py-3 text-md font-bold transition-all ${
                    activeTab === TabType.SEARCH
                      ? 'border-b-2 border-white text-white'
                      : 'text-white text-opacity-70 hover:text-opacity-100'
                  }`}
                  onClick={() => setActiveTab(TabType.SEARCH)}
                >
                  Search Verses
                </button>
              </div>
              
              {activeTab === TabType.READ ? (
                <div className="grid gap-8 md:grid-cols-5">
                  <div className="space-y-6 md:col-span-2">
                    {selectedBible && (
                      <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <BookSelector
                          bibleId={selectedBible}
                          selectedBook={selectedBook}
                          onBookSelect={handleBookSelect}
                        />
                      </motion.div>
                    )}
                    
                    {selectedBible && selectedBook && (
                      <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <ChapterSelector
                          bibleId={selectedBible}
                          bookId={selectedBook}
                          selectedChapter={selectedChapter}
                          onChapterSelect={handleChapterSelect}
                        />
                      </motion.div>
                    )}
                  </div>
                  
                  <motion.div 
                    className="bg-white bg-opacity-95 backdrop-blur-md p-6 shadow-lg rounded-xl md:col-span-3"
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {selectedBible && selectedChapter ? (
                      <ChapterContent
                        bibleId={selectedBible}
                        chapterId={selectedChapter}
                      />
                    ) : (
                      <div className="flex h-64 items-center justify-center text-center text-gray-500">
                        <p>
                          {selectedBible && selectedBook
                            ? 'Select a chapter to start reading'
                            : selectedBible
                            ? 'Select a book to continue'
                            : 'Select a Bible version to get started'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-5">
                  <motion.div 
                    className="md:col-span-2"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BibleSearch
                      bibleId={selectedBible}
                      onVerseSelect={handleVerseSelect}
                    />
                  </motion.div>
                  <motion.div 
                    className="bg-white bg-opacity-95 backdrop-blur-md p-6 shadow-lg rounded-xl md:col-span-3"
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {selectedBible && selectedChapter ? (
                      <ChapterContent
                        bibleId={selectedBible}
                        chapterId={selectedChapter}
                      />
                    ) : (
                      <div className="flex h-64 items-center justify-center text-center text-gray-500">
                        <p>
                          Search for a verse and click on a result to view the chapter
                        </p>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </SiteProtectionWrapper>
  );
}