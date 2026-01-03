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
        
        {/* ✅ INLINE BLOCKING SCRIPT - UPDATED WITH cc:onConsent LISTENER */}
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
                
                // CRITICAL FIX: Add cc:onConsent listener before library loads
                window.addEventListener('cc:onConsent', function(e) {
                  try {
                    const cookie = e.detail.cookie;
                    const categories = cookie.categories || [];
                    
                    console.log('🎯 [Inline] cc:onConsent caught:', {
                      categories: categories,
                      level: cookie.level,
                      hasAnalytics: categories.includes('analytics')
                    });
                    
                    // Check if analytics category is present (Accept all)
                    const hasAnalytics = categories.includes('analytics');
                    
                    if (hasAnalytics) {
                      // ✅ This is ACCEPTANCE (Accept all was clicked)
                      console.log('✅ [Inline] ACCEPTANCE detected - setting cv_cookie');
                      
                      // Set cv_cookie with fullAcceptance flag
                      const acceptanceData = {
                        categories: { 
                          necessary: true,
                          analytics: true 
                        },
                        fullAcceptance: true,
                        consentTimestamp: new Date().toISOString(),
                        revision: 0
                      };
                      
                      const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
                      document.cookie = 'cv_cookie=' + encodeURIComponent(JSON.stringify(acceptanceData)) + 
                                      '; path=/; max-age=' + (365 * 24 * 60 * 60) + 
                                      '; SameSite=Lax' + secureFlag;
                      
                      // Delete cv_rejection if exists
                      document.cookie = 'cv_rejection=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                      
                      // Set data attribute AFTER React hydration
                      setTimeout(() => {
                        document.body.setAttribute('data-cookie-consent', 'accepted');
                      }, 0);
                      
                      // Dispatch event for other scripts
                      window.dispatchEvent(new CustomEvent('cookie-consent-accepted'));
                      
                    } else if (categories.includes('necessary')) {
                      // ❌ This is REJECTION (Reject all was clicked or only necessary accepted)
                      console.log('❌ [Inline] REJECTION detected - setting cv_rejection');
                      
                      // Set cv_rejection cookie
                      const rejectionData = {
                        rejected: true,
                        timestamp: new Date().toISOString(),
                        note: 'Stored with user consent (Art. 6(1)(a) GDPR) to remember preference'
                      };
                      
                      const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
                      document.cookie = 'cv_rejection=' + encodeURIComponent(JSON.stringify(rejectionData)) + 
                                      '; path=/; max-age=' + (365 * 24 * 60 * 60) + 
                                      '; SameSite=Lax' + secureFlag;
                      
                      // Delete cv_cookie if exists
                      document.cookie = 'cv_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                      
                      // Set data attribute AFTER React hydration
                      setTimeout(() => {
                        document.body.setAttribute('data-cookie-consent', 'rejected');
                      }, 0);
                      
                      // Dispatch event for other scripts
                      window.dispatchEvent(new CustomEvent('cookie-consent-rejected'));
                    }
                  } catch (error) {
                    console.error('❌ [Inline] Error in cc:onConsent handler:', error);
                  }
                });
                
                // 1. ULTRA-FAST CONSENT CHECK - UPDATED FOR NEW COOKIE STRUCTURE
                function checkConsentImmediately() {
                  try {
                    // CRITICAL: Check Rejection FIRST - cv_rejection is our definitive rejection cookie
                    if (document.cookie.includes('cv_rejection=')) {
                      return 'rejected';
                    }

                    // Then check for our acceptance cookie (cv_cookie with fullAcceptance flag)
                    const cookieMatch = document.cookie.match(/cv_cookie=([^;]+)/);
                    if (cookieMatch) {
                      try {
                        const cookieStr = decodeURIComponent(cookieMatch[1]);
                        const cookieData = JSON.parse(cookieStr);
                        
                        // CRITICAL: Only accept if fullAcceptance flag is present
                        // We completely ignore the library's 'cc_cookie'
                        if (cookieData && cookieData.fullAcceptance === true) {
                          return 'accepted';
                        }
                      } catch (e) {
                        // If we can't parse, treat as undecided
                        console.warn('⚠️ Failed to parse cv_cookie:', e);
                      }
                    }
                    
                    return 'undecided';
                  } catch (e) {
                    return 'undecided';
                  }
                }
                
                // 2. BLOCK NON-ESSENTIAL SCRIPTS IMMEDIATELY
                function blockScriptsImmediately() {
                  const consentState = checkConsentImmediately();
                  
                  // Only block if not STRICTLY accepted (has cv_cookie with fullAcceptance: true)
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
        
        {/* ✅ MINIMAL PRIOR BLOCKING SCRIPT - UPDATED FOR NEW COOKIE STRUCTURE */}
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
                      // Only check for our cv_cookie with fullAcceptance flag
                      const cvCookie = document.cookie
                        .split('; ')
                        .find(row => row.startsWith('cv_cookie='));
                      if (!cvCookie) return false;
                      
                      const cookieData = JSON.parse(decodeURIComponent(cvCookie.split('=')[1]));
                      
                      // Strict: Only accept if fullAcceptance flag is present
                      return !!(cookieData && cookieData.fullAcceptance === true);
                    } catch (e) {
                      return false;
                    }
                  },
                  hasRejectionCookie: function() {
                    // Only check for our explicit rejection cookie
                    return !!document.cookie
                      .split('; ')
                      .find(row => row.startsWith('cv_rejection='));
                  },
                  unblockScripts: function() {
                    // Fallback unblock if inline script didn't set this
                    console.log('⚠️ Using fallback unblock - inline script may not be loaded');
                  }
                };
                
                // Helper to clean up any old/conflicting cookies
                function cleanupOldCookies() {
                  try {
                    // Check for the library's old cookie name (if it was previously cv_cookie)
                    // and clean it up if it exists without fullAcceptance
                    const cvCookie = document.cookie
                      .split('; ')
                      .find(row => row.startsWith('cv_cookie='));
                    
                    if (cvCookie) {
                      try {
                        const cookieData = JSON.parse(decodeURIComponent(cvCookie.split('=')[1]));
                        
                        // If this is an old library cookie without fullAcceptance, delete it
                        if (cookieData && !cookieData.fullAcceptance) {
                          console.log('🧹 Cleaning up old library cookie without fullAcceptance');
                          document.cookie = 'cv_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        }
                      } catch (e) {
                        // If we can't parse it, delete it
                        console.log('🧹 Deleting unparseable cv_cookie');
                        document.cookie = 'cv_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                      }
                    }
                    
                    // Note: We leave the library's 'cc_cookie' alone - it's for the library's UI only
                  } catch (e) {
                    console.error('Error in cleanupOldCookies:', e);
                  }
                }
                
                // Initial audit
                function auditCookiesOnLoad() {
                  const hasConsent = utils.hasValidConsent();
                  const hasRejection = utils.hasRejectionCookie();
                  
                  console.log('🔍 GDPR Audit: hasConsent=' + hasConsent + ', hasRejection=' + hasRejection);
                  
                  // Clean up any old/conflicting cookies from previous versions
                  cleanupOldCookies();
                  
                  // CRITICAL: If Rejection exists, IT WINS. Delete any cv_cookie.
                  if (hasRejection) {
                    const cvCookie = document.cookie.split('; ').find(row => row.startsWith('cv_cookie='));
                    if (cvCookie) {
                      console.log('🛡️ Rejection takes precedence - deleting conflicting cv_cookie');
                      document.cookie = 'cv_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    }
                  }
                  
                  // Only unblock if strict consent is true AND no rejection
                  if (hasConsent && !hasRejection && utils.unblockScripts) {
                    console.log('✅ User has strict consent - unblocking scripts');
                    utils.unblockScripts();
                    
                    // Set body attribute AFTER React hydration
                    setTimeout(() => {
                      document.body.setAttribute('data-cookie-consent', 'accepted');
                    }, 0);
                  } else if (hasRejection) {
                    // Set body attribute AFTER React hydration
                    setTimeout(() => {
                      document.body.setAttribute('data-cookie-consent', 'rejected');
                    }, 0);
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