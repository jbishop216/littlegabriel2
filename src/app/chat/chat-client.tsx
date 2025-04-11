'use client';

import { motion } from 'framer-motion';
import ChatInterface from '@/components/chat/ChatInterface';
import { Card } from '@/components/ui/card';
import { Session } from 'next-auth';
import { FloatingIcon } from '@/components/ui/theme-icons';

export default function ChatClient({ session }: { session: Session }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Swirling gradient background: blue -> pink */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-pink-300 to-blue-500 mix-blend-multiply z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 1 }}
      />

      {/* Floating crosses at fixed positions */}
      {[
        { top: '15%', left: '5%' },
        { top: '30%', left: '85%' },
        { top: '60%', left: '10%' },
        { top: '80%', left: '75%' },
      ].map((position, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={position}
          animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 6 + index, repeatType: 'reverse' }}
        >
          <FloatingIcon className="w-8 h-8 opacity-80" />
        </motion.div>
      ))}

      <div className="relative z-10 container mx-auto flex flex-col px-4 py-4">
        <motion.div 
          className="mb-4 flex items-center justify-between"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
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
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white drop-shadow-md">Chat with Gabriel</h1>
              <p className="text-lg text-white text-opacity-90">
                Ask me anything about faith, scripture, or seek guidance
              </p>
            </div>
          </div>
          
          {session?.user && (
            <motion.div 
              className="hidden items-center space-x-2 text-sm text-white md:flex bg-white bg-opacity-20 backdrop-blur-sm px-3 py-2 rounded-full"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span>
                Connected as: <span className="font-medium">{session.user.email}</span>
              </span>
            </motion.div>
          )}
        </motion.div>
        
        {/* Enlarged Chat Interface - Taking up most of the screen */}
        <motion.div 
          className="flex-1"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Card className="overflow-hidden rounded-3xl border border-white border-opacity-20 bg-white bg-opacity-90 backdrop-blur-md shadow-2xl">
            <ChatInterface />
          </Card>
        </motion.div>
        
        <motion.div 
          className="mt-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-white text-opacity-90 text-sm drop-shadow-md">
            Gabriel is powered by GPT-4o-mini and aims to provide spiritual guidance from a faith perspective.
            Please note that this is an AI assistant and not a replacement for professional spiritual counseling.
          </p>
        </motion.div>
      </div>
    </div>
  );
}