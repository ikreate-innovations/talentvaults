// app/layout.tsx - UPDATED (Remove Inter font for GDPR)
import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

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
        {/* GDPR compliant - no external fonts */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-background-light text-text-light antialiased">
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