import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TalentVaults - Curated Remote Opportunities for Professionals',
  description: 'High-quality remote digital work for professionals',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        {/* Material Symbols Font - WE'LL FIX THIS LATER */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} bg-background-light text-text-light antialiased`}>
        {/* LOCALSTORAGE CLEANUP SCRIPT - SILENT VERSION */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (typeof window !== 'undefined') {
                    // Remove Cohere items
                    localStorage.removeItem('frontChat:store');
                    localStorage.removeItem('frontChat:status');
                    localStorage.removeItem('cohereLastSessionId');
                    localStorage.removeItem('cohereLastWsServerAddr');
                    localStorage.removeItem('cohere_session_storage_lock');
                    
                    // Remove Bugsnag item
                    localStorage.removeItem('bugsnag-anonymous-id');
                    
                    // Remove referrer tracking items
                    localStorage.removeItem('lastExternalReferrer');
                    localStorage.removeItem('lastExternalReferrerTime');
                  }
                } catch (e) {
                  // Silent fail - don't show errors to users
                }
              })();
            `,
          }}
        />
        
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
          <div className="layout-container flex h-full grow flex-col">
            <Header />
            <main className="w-full">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}