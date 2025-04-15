import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LittleGabriel - Faith-Based AI Counseling',
  description: 'A faith-based AI counseling application providing spiritual guidance and support.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add nonce to script to make it more CSP compliant */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Enhanced chunk loading error handling
              window.addEventListener('error', function(event) {
                // Check for chunk load errors (including timeout errors)
                if ((event.message && (
                    event.message.includes('ChunkLoadError') || 
                    event.message.includes('Loading chunk') || 
                    event.message.includes('timeout')
                  ))) {
                  console.error('Chunk loading error detected, refreshing...');
                  // Clear any caches that might be causing issues
                  if (window.caches) {
                    caches.keys().then(function(names) {
                      for (let name of names) {
                        caches.delete(name);
                      }
                    });
                  }
                  // Reload after a short delay
                  setTimeout(() => window.location.reload(), 800);
                }
              });
              
              // Unhandled promise rejection handler (often related to chunk loading)
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && (
                  event.reason.message && (
                    event.reason.message.includes('ChunkLoadError') ||
                    event.reason.message.includes('Loading chunk') ||
                    event.reason.message.includes('timeout')
                  )
                )) {
                  console.error('Chunk loading rejection detected, refreshing...');
                  setTimeout(() => window.location.reload(), 800);
                }
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}