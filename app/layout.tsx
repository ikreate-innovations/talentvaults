import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsentClient from './components/CookieConsentClient';
import ScriptBlockingComponent from './components/ScriptBlockingComponent';

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
        
        {/* ✅ GDPR Compliance Meta Tags */}
        <meta name="cookie-policy" content="essential-only" />
        <meta name="data-protection" content="gdpr-ccpa-compliant" />
        <meta name="robots" content="noindex, nofollow" data-cookieconsent="necessary" />
        
        {/* ✅ Self-hosted CookieConsent CSS */}
        <link 
          rel="stylesheet" 
          href="/cookieconsent/cookieconsent.css" 
          data-cookieconsent="necessary"
        />
        
        {/* ✅ CSS to hide preferences modal - FIXED hydration issue */}
        <style
          data-cookieconsent="necessary"
          dangerouslySetInnerHTML={{
            __html: `/* Immediate hide for preferences modal after acceptance */
body[data-cookie-consent="accepted"] .cc-pref-modal,
body[data-cookie-consent="accepted"] .cc-backdrop {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* Prevent modal from being focusable */
.cc-pref-modal[aria-hidden="true"] {
  display: none !important;
}

/* Hide preferences button in consent modal */
.cc-btn.cc-show-preferences {
  display: none !important;
}

/* Quick hide animation */
.cc-pref-modal.cc-hiding {
  animation: cc-fade-out 0.1s forwards !important;
}

@keyframes cc-fade-out {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
    display: none;
  }
}`,
          }}
        />
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
        
        {/* ✅ Script Blocking Component */}
        <ScriptBlockingComponent />
        
        {/* ✅ MINIMAL PRIOR BLOCKING SCRIPT */}
        <script
          data-cookieconsent="necessary"
          dangerouslySetInnerHTML={{
            __html: `
              // ====================
              // MINIMAL PRIOR BLOCKING ENFORCEMENT
              // ====================
              
              (function() {
                'use strict';
                
                // Essential cookies only
                const ESSENTIAL_COOKIES = [
                  'cv_cookie', 'cv_rejection',
                  'cconsent', 'cookieconsent_status',
                  '__cf_bm', '__cfwaitingroom', '__cflb', '__cfruid',
                  'cf_clearance', 'cf_use_ob', '_cfduid'
                ];
                
                // Simple cookie check
                function hasValidConsent() {
                  try {
                    const cvCookie = document.cookie.split('; ').find(row => row.startsWith('cv_cookie='));
                    if (!cvCookie) return false;
                    
                    const cookieData = JSON.parse(decodeURIComponent(cvCookie.split('=')[1]));
                    
                    // Check for acceptance
                    if (cookieData && cookieData.categories) {
                      if (typeof cookieData.categories === 'object' && cookieData.categories.necessary === true) {
                        return true;
                      }
                      if (Array.isArray(cookieData.categories) && cookieData.categories.includes('necessary')) {
                        return true;
                      }
                    }
                    
                    return false;
                  } catch (e) {
                    return false;
                  }
                }
                
                // Check for rejection
                function hasRejected() {
                  try {
                    const rejectionCookie = document.cookie
                      .split('; ')
                      .find(row => row.startsWith('cv_rejection='));
                    return !!rejectionCookie;
                  } catch {
                    return false;
                  }
                }
                
                // Clean up ambiguous states AND set rejection cookie
                function cleanAmbiguousStates() {
                  try {
                    const cvCookie = document.cookie.split('; ').find(row => row.startsWith('cv_cookie='));
                    if (cvCookie) {
                      const cookieData = JSON.parse(decodeURIComponent(cvCookie.split('=')[1]));
                      
                      // Check if this represents a rejection
                      if (cookieData && cookieData.categories) {
                        const isAccepted = 
                          (typeof cookieData.categories === 'object' && cookieData.categories.necessary === true) ||
                          (Array.isArray(cookieData.categories) && cookieData.categories.includes('necessary'));
                        
                        const isRejection = 
                          (Array.isArray(cookieData.categories) && cookieData.categories.length === 0) ||
                          (typeof cookieData.categories === 'object' && cookieData.categories.necessary === false);
                        
                        if (!isAccepted && isRejection) {
                          console.log('🧹 Converting library rejection to cv_rejection cookie');
                          
                          // Set rejection cookie BEFORE deleting cv_cookie
                          const rejectionData = {
                            rejected: true,
                            timestamp: new Date().toISOString(),
                            convertedFrom: 'library_cookie',
                            note: 'Stored with user consent (Art. 6(1)(a) GDPR) to remember preference'
                          };
                          
                          const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
                          document.cookie = 'cv_rejection=' + encodeURIComponent(JSON.stringify(rejectionData)) + 
                                           '; path=/; max-age=31536000; SameSite=Lax' + secureFlag;
                          
                          // Delete the library cookie
                          document.cookie = 'cv_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        } else if (!isAccepted && !isRejection) {
                          // This is an ambiguous state (not acceptance and not rejection) - delete it
                          console.log('🧹 Cleaning up ambiguous cookie state');
                          document.cookie = 'cv_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        }
                      }
                    }
                  } catch (e) {
                    console.error('Error in cleanAmbiguousStates:', e);
                  }
                }
                
                // Initial audit
                function auditCookiesOnLoad() {
                  const hasConsent = hasValidConsent();
                  const hasRejection = hasRejected();
                  
                  console.log('🔍 GDPR Audit: hasConsent=' + hasConsent + ', hasRejection=' + hasRejection);
                  
                  // Clean up any ambiguous states and convert rejections
                  cleanAmbiguousStates();
                  
                  console.log('✅ GDPR COMPLIANT: Cookie audit passed');
                }
                
                // Wait for DOM to be ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', auditCookiesOnLoad);
                } else {
                  auditCookiesOnLoad();
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}