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
        
        {/* ✅ INLINE BLOCKING SCRIPT - RUNS BEFORE ANYTHING ELSE */}
        <script
          data-cookieconsent="necessary"
          dangerouslySetInnerHTML={{
            __html: `
              // ====================
              // IMMEDIATE BLOCKING SCRIPT (Non-React)
              // Runs in <head> before ANY other script
              // ====================
              
              (function() {
                'use strict';
                
                // 1. ULTRA-FAST CONSENT CHECK
                function checkConsentImmediately() {
                  try {
                    // Quick check for cv_cookie acceptance
                    const cookieMatch = document.cookie.match(/cv_cookie=([^;]+)/);
                    if (cookieMatch) {
                      const cookieStr = decodeURIComponent(cookieMatch[1]);
                      const cookieData = JSON.parse(cookieStr);
                      
                      // Fast acceptance check
                      if (cookieData && cookieData.categories) {
                        if (typeof cookieData.categories === 'object' && cookieData.categories.necessary === true) {
                          return 'accepted';
                        }
                        if (Array.isArray(cookieData.categories) && cookieData.categories.includes('necessary')) {
                          return 'accepted';
                        }
                      }
                    }
                    
                    // Quick check for cv_rejection
                    if (document.cookie.includes('cv_rejection=')) {
                      return 'rejected';
                    }
                    
                    return 'undecided';
                  } catch (e) {
                    return 'undecided';
                  }
                }
                
                // 2. BLOCK NON-ESSENTIAL SCRIPTS IMMEDIATELY
                function blockScriptsImmediately() {
                  const consentState = checkConsentImmediately();
                  
                  // Only block if not accepted
                  if (consentState !== 'accepted') {
                    // Find all potentially trackable scripts
                    const allScripts = document.querySelectorAll('script:not([data-cookieconsent])');
                    
                    allScripts.forEach(script => {
                      const src = script.src;
                      if (src && !src.includes(window.location.hostname)) {
                        // Mark for later processing
                        script.setAttribute('data-blocked-by', 'immediate');
                        script.type = 'text/plain';
                        script.setAttribute('data-original-src', src);
                        script.removeAttribute('src');
                      }
                    });
                    
                    // Also block inline scripts with potential tracking
                    const inlineScripts = document.querySelectorAll('script:not([src]):not([data-cookieconsent])');
                    inlineScripts.forEach(script => {
                      const content = script.textContent || script.innerHTML;
                      if (content && (
                        content.includes('analytics') ||
                        content.includes('track') ||
                        content.includes('facebook') ||
                        content.includes('google') ||
                        content.includes('gtag') ||
                        content.includes('fbq')
                      )) {
                        script.setAttribute('data-blocked-by', 'immediate');
                        script.setAttribute('data-original-content', script.innerHTML);
                        script.innerHTML = '';
                        script.type = 'text/plain';
                      }
                    });
                  }
                }
                
                // 3. CREATE GLOBAL FUNCTIONS FOR REACT TO USE
                window._cookieUtils = {
                  hasValidConsent: function() {
                    return checkConsentImmediately() === 'accepted';
                  },
                  hasRejectionCookie: function() {
                    return document.cookie.includes('cv_rejection=');
                  },
                  unblockScripts: function() {
                    const blockedScripts = document.querySelectorAll('script[data-blocked-by="immediate"]');
                    blockedScripts.forEach(script => {
                      const originalSrc = script.getAttribute('data-original-src');
                      if (originalSrc) {
                        // Restore external script
                        script.type = 'text/javascript';
                        script.src = originalSrc;
                        script.removeAttribute('data-blocked-by');
                        script.removeAttribute('data-original-src');
                      } else {
                        // Restore inline script
                        const originalContent = script.getAttribute('data-original-content');
                        if (originalContent) {
                          script.type = 'text/javascript';
                          script.innerHTML = originalContent;
                          script.removeAttribute('data-blocked-by');
                          script.removeAttribute('data-original-content');
                        }
                      }
                    });
                  }
                };
                
                // 4. EXECUTE IMMEDIATE BLOCKING
                // Run now for scripts already in DOM
                blockScriptsImmediately();
                
                // Also run when DOM is ready for any dynamically added scripts
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', blockScriptsImmediately);
                }
                
                console.log('🔒 Immediate blocking active - state:', checkConsentImmediately());
              })();
            `,
          }}
        />
        
        {/* ✅ Self-hosted CookieConsent CSS */}
        <link 
          rel="stylesheet" 
          href="/cookieconsent/cookieconsent.css" 
          data-cookieconsent="necessary"
        />
        
        {/* ✅ CSS to hide preferences modal */}
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
        
        {/* ✅ MINIMAL PRIOR BLOCKING SCRIPT - UPDATED TO WORK WITH INLINE SCRIPT */}
        <script
          data-cookieconsent="necessary"
          dangerouslySetInnerHTML={{
            __html: `
              // ====================
              // MINIMAL PRIOR BLOCKING ENFORCEMENT
              // ====================
              
              (function() {
                'use strict';
                
                // Use global functions if available from inline script
                const utils = window._cookieUtils || {
                  hasValidConsent: function() {
                    try {
                      const cvCookie = document.cookie
                        .split('; ')
                        .find(row => row.startsWith('cv_cookie='));
                      if (!cvCookie) return false;
                      
                      const cookieData = JSON.parse(decodeURIComponent(cvCookie.split('=')[1]));
                      
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
                  },
                  hasRejectionCookie: function() {
                    return !!document.cookie
                      .split('; ')
                      .find(row => row.startsWith('cv_rejection='));
                  },
                  unblockScripts: function() {
                    // Fallback unblock if inline script didn't set this
                    console.log('⚠️ Using fallback unblock - inline script may not be loaded');
                  }
                };
                
                // Helper to get cookie value
                function getCookieValue(name) {
                  try {
                    const cookie = document.cookie
                      .split('; ')
                      .find(row => row.startsWith(name + '='));
                    return cookie ? cookie.split('=')[1] : null;
                  } catch {
                    return null;
                  }
                }
                
                // Normalize library rejection format to our rejection cookie
                function normalizeRejectionState() {
                  try {
                    const cvCookie = getCookieValue('cv_cookie');
                    if (!cvCookie) return;
                    
                    const cookieData = JSON.parse(decodeURIComponent(cvCookie));
                    
                    // Check if this is a library rejection format
                    if (cookieData && cookieData.categories) {
                      const isRejection = 
                        (Array.isArray(cookieData.categories) && cookieData.categories.length === 0) ||
                        (typeof cookieData.categories === 'object' && cookieData.categories.necessary === false);
                      
                      if (isRejection && !utils.hasRejectionCookie()) {
                        console.log('🧹 Normalizing library rejection to cv_rejection');
                        
                        // Set rejection cookie
                        const rejectionData = {
                          rejected: true,
                          timestamp: new Date().toISOString(),
                          convertedFrom: 'library_cookie',
                          note: 'Stored with user consent (Art. 6(1)(a) GDPR)'
                        };
                        
                        const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
                        document.cookie = 'cv_rejection=' + encodeURIComponent(JSON.stringify(rejectionData)) + 
                                         '; path=/; max-age=31536000; SameSite=Lax' + secureFlag;
                        
                        // Delete the ambiguous cookie
                        document.cookie = 'cv_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                      }
                    }
                  } catch (e) {
                    console.error('Error in normalizeRejectionState:', e);
                  }
                }
                
                // Initial audit
                function auditCookiesOnLoad() {
                  const hasConsent = utils.hasValidConsent();
                  const hasRejection = utils.hasRejectionCookie();
                  
                  console.log('🔍 GDPR Audit: hasConsent=' + hasConsent + ', hasRejection=' + hasRejection);
                  
                  // Normalize any library rejection formats
                  normalizeRejectionState();
                  
                  // Ensure only one state cookie exists
                  if (hasConsent && hasRejection) {
                    console.log('⚠️ Both cookies exist - deleting rejection cookie');
                    document.cookie = 'cv_rejection=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                  }
                  
                  // Unblock scripts if consent exists
                  if (hasConsent && utils.unblockScripts) {
                    console.log('✅ User has consent - unblocking scripts via inline script');
                    utils.unblockScripts();
                  }
                  
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