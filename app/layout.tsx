// app/layout.tsx - COMPLETE CORRECTED VERSION
import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsentClient from './components/CookieConsentClient';

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* ✅ Self-hosted CookieConsent CSS for GDPR compliance */}
        <link rel="stylesheet" href="/cookieconsent/cookieconsent.css" />
      </head>
      <body className="bg-background-light text-text-light antialiased">
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
          <div className="layout-container flex h-full grow flex-col">
            <Header />
            <main className="w-full">
              {children}
            </main>
            <Footer />
          </div>
        </div>
        
        {/* ✅ Client Component for Cookie Consent */}
        <CookieConsentClient />
      </body>
    </html>
  );
}