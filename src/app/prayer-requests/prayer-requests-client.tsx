'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Session } from 'next-auth';
import { FloatingIcon } from '@/components/ui/theme-icons';

export default function PrayerRequestsClient({ session }: { session: Session }) {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden">
      {/* Swirling gradient background: purple -> gold */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500 via-yellow-300 to-purple-500 mix-blend-multiply z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 1 }}
      />

      {/* Floating crosses at fixed positions */}
      {[
        { top: '10%', left: '10%' },
        { top: '25%', left: '80%' },
        { top: '50%', left: '15%' },
        { top: '75%', left: '70%' },
        { top: '20%', left: '40%' },
      ].map((position, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={position}
          animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 6 + index, repeatType: 'reverse' }}
        >
          <FloatingIcon className="w-10 h-10 opacity-80" />
        </motion.div>
      ))}

      <div className="relative z-10 container mx-auto flex flex-col px-4 py-8">
        <motion.div 
          className="mb-8"
          initial={{ scale: 0.9, y: -20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold text-white drop-shadow-md mb-2">Prayer Requests</h1>
          <p className="text-lg text-yellow-50 font-medium">
            Share your prayer needs and join others in prayer for spiritual support and guidance.
          </p>
        </motion.div>
        
        {/* Coming Soon Message */}
        <motion.div 
          className="mt-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Card className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
            <CardContent className="p-8 text-center flex flex-col items-center">
              <div className="mb-6 rounded-full bg-indigo-100 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 text-indigo-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-blue-900">Prayer Request Feature Coming Soon</h2>
              <p className="mb-6 max-w-lg text-gray-700 font-medium">
                We're working on building a prayer request system where you can share prayer needs and support others. This feature will be available soon with a colorful, encouraging interface that helps bring comfort and hope.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Link href="/chat" prefetch={true} passHref>
                  <Button className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 font-bold rounded-full shadow-lg transform transition-all px-6 py-3 text-lg">
                    Return to Chat
                  </Button>
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-white text-opacity-90 drop-shadow-md">
            Check back soon for updates as we continue to develop our prayer request system.
          </p>
        </motion.div>
      </div>
    </div>
  );
}