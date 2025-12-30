// app/components/CookieConsentClient.tsx - MINIMAL "GOT IT" VERSION
'use client';

import Script from 'next/script';
import { useEffect } from 'react';

declare global {
  interface Window {
    CookieConsent: any;
  }
}

export default function CookieConsentClient() {
  useEffect(() => {
    const initCookieConsent = () => {
      if (typeof window !== 'undefined' && window.CookieConsent) {
        try {
          console.log('🔧 Initializing CookieConsent...');
          
          window.CookieConsent.run({
            // ✅ SIMPLE INFORMATIONAL BANNER
            mode: 'info',  // Just inform, no consent needed
            autoShow: true,
            hideFromBots: false,
            
            // ✅ MINIMAL LANGUAGE CONFIG
            language: {
              default: 'en',
              translations: {
                en: {
                  consentModal: {
                    title: '🍪 Cookies on TalentVaults',
                    description: `We use only essential cookies from Cloudflare for site security and performance.
                    
No tracking or analytics cookies are used. <strong>These cookies are required for the site to work.</strong>`,
                    acceptAllBtn: 'Got it',
                    // Only "Got it" button - no other options needed
                  },
                  preferencesModal: {
                    title: 'Cookie Info',
                    savePreferencesBtn: 'Got it',
                    sections: [
                      {
                        title: 'Essential Cookies (Always Active)',
                        description: 'Cloudflare security cookies required for site functionality:',
                        linkedCategory: 'necessary',
                        cookieTable: {
                          headers: {
                            name: 'Name',
                            purpose: 'Purpose',
                            duration: 'Duration'
                          },
                          body: [
                            {
                              name: '__cf_bm',
                              purpose: 'Bot protection & security',
                              duration: '30 minutes'
                            },
                            {
                              name: '__cflb',
                              purpose: 'Load balancing & security',
                              duration: '1 day'
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              }
            },
            
            // ✅ ONLY ESSENTIAL COOKIES
            categories: {
              necessary: {
                enabled: true,
                readOnly: true  // Cannot be disabled
              }
              // No analytics or marketing categories
            },
            
            // ✅ SIMPLE COOKIE SETTINGS
            cookie: {
              name: 'cv_cookie',
              expiresAfterDays: 365,
              domain: window.location.hostname,
              path: '/',
              sameSite: 'Lax'
            }
          });
          
          console.log('✅ CookieConsent initialized successfully');
        } catch (error) {
          console.error('❌ CookieConsent initialization error:', error);
        }
      } else {
        console.log('⚠️ CookieConsent not available yet, will retry...');
      }
    };

    // Initial attempt
    initCookieConsent();
    
    // Set up retry in case script loads after component
    const retryInterval = setInterval(() => {
      if (window.CookieConsent) {
        clearInterval(retryInterval);
        initCookieConsent();
      }
    }, 100);
    
    // Cleanup
    return () => clearInterval(retryInterval);
  }, []);

  return (
    <Script
      id="cookie-consent-script"
      src="/cookieconsent/cookieconsent.umd.js"
      strategy="afterInteractive"
      onLoad={() => console.log('✅ CookieConsent script loaded')}
      onError={(e) => console.error('❌ CookieConsent script failed to load:', e)}
    />
  );
}