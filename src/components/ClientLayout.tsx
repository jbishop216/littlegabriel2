'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { PasswordProvider } from '@/context/PasswordContext';
import { SessionProvider } from '@/components/SessionProvider';
import { SiteProtectionWrapper } from './SiteProtectionWrapper';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <PasswordProvider>
          <SiteProtectionWrapper>
            <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SiteProtectionWrapper>
        </PasswordProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}