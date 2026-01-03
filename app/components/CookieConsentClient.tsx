'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    CookieConsent: any;
    _cookieUtils?: {
      hasValidConsent: () => boolean;
      hasRejectionCookie: () => boolean;
      unblockScripts: () => void;
    };
    gdprCompliance?: {
      auditCookies: () => void;
      getLogs: () => any[];
      clearLogs: () => void;
    };
    showCookiePreferences: () => void;
  }
}

// ====================
// HELPER FUNCTIONS
// ====================

// Helper function to get cookie value
const getCookieValue = (name: string): string | null => {
  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
  } catch {
    return null;
  }
};

// Helper function to delete cookies
const deleteCookie = (name: string) => {
  const domain = window.location.hostname;
  const path = '/';
  
  // Delete with all possible combinations
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=.${domain};`;
  
  console.log(`🗑️ Deleted cookie: ${name}`);
};

// Fix C: Update hasAcceptanceCookie to ONLY check for fullAcceptance flag
const hasAcceptanceCookie = (): boolean => {
  try {
    const raw = getCookieValue('cv_cookie');
    if (!raw) return false;
    const cookieData = JSON.parse(raw);
    return !!(cookieData && cookieData.fullAcceptance === true);
  } catch {
    return false;
  }
};

// Helper function to check if user has rejected
const hasRejectionCookie = (): boolean => {
  try {
    return !!getCookieValue('cv_rejection');
  } catch {
    return false;
  }
};

// Fix C: Update hasAnyRejection to ONLY check our cv_rejection cookie
const hasAnyRejection = (): boolean => {
  return hasRejectionCookie();
};

// Function to set minimal essential rejection cookie
const setRejectionCookie = () => {
  const rejectionData = {
    rejected: true,
    timestamp: new Date().toISOString(),
    note: 'Stored with user consent (Art. 6(1)(a) GDPR) to remember preference'
  };

  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
  const cookieValue = `cv_rejection=${encodeURIComponent(
    JSON.stringify(rejectionData)
  )}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax${secureFlag}`;
  
  document.cookie = cookieValue;
  console.log('✅ cv_rejection cookie set (Art. 6(1)(a) GDPR)');
};

// Function to trigger immediate script unblocking
const triggerImmediateUnblocking = () => {
  // Use global utility from inline script if available
  if (window._cookieUtils && window._cookieUtils.unblockScripts) {
    console.log('🚀 Triggering immediate unblocking via inline script');
    window._cookieUtils.unblockScripts();
  } else {
    console.log('⚠️ Inline script utilities not available for immediate unblocking');
  }
  
  // Also dispatch event for ScriptBlockingComponent
  window.dispatchEvent(new CustomEvent('cookie-consent-accepted'));
};

// CORRECTED CONSENT LOGGING FUNCTION - GDPR COMPLIANT
const logConsentToServer = (data: any) => {
  try {
    // Prepare GDPR-compliant log payload
    const logPayload = {
      event: data.event,
      user_consent_choice: data.button_clicked,
      legal_basis: 'Art. 6(1)(a) GDPR',
      timestamp: new Date().toISOString(),
      anonymized_ip_placeholder: 'server_extracted_and_anonymized',
      user_agent: navigator.userAgent,
      banner_version: '1.0',
      retention_note: 'Logs auto-deleted after 90 days per GDPR data minimization (Art. 5(1)(c))',
      note: data.note || 'Consent decision logged for compliance audit trail'
    };

    // Send to server-side logging endpoint
    fetch('/api/compliance/consent-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logPayload)
    }).then(response => {
      if (response.ok) {
        console.log('📝 Consent event logged (90-day retention, Art. 6(1)(a) GDPR basis)');
      } else {
        console.warn('⚠️ Consent logged, but server response was not OK');
      }
    }).catch((error) => { 
      console.debug('Consent logging failed (non-critical):', error);
    });
  } catch (error) {
    console.error('Failed to construct consent log:', error);
  }
};

// Track preferences modal state
let preferencesModalWasOpened = false;

// ====================
// CRITICAL FIX #1: Should we initialize the library? (REINFORCED)
// ====================
const shouldInitializeLibrary = (): boolean => {
  try {
    // CRITICAL FIX: If cv_rejection exists, NEVER initialize library
    if (hasRejectionCookie()) {
      console.log('🛑 Library initialization BLOCKED - cv_rejection exists');
      return false;
    }
    return true;
  } catch {
    return true;
  }
};

// ====================
// Get library configuration
// ====================
const getLibraryConfiguration = (userDecision: string) => {
  return {
    // ====================
    // GDPR COMPLIANCE SETTINGS
    // ====================
    mode: 'opt-in',
    autoShow: userDecision === 'undecided',
    delay: 0,
    hideFromBots: false,
    revision: 0,
    autoClear: true,
    autoShowPreferences: false,

    // ====================
    // CRITICAL FIX #2: ADD ANALYTICS CATEGORY (DUMMY)
    // ====================
    categories: {
      necessary: {
        enabled: true,      // 🟢 ALWAYS TRUE - never false
        readOnly: true,     // 🟢 Users CANNOT toggle this
        autoClear: {
          name: 'cc_cookie', // Library manages its own cookie
          domain: window.location.hostname,
          path: '/'
        }
      },
      analytics: {
        enabled: false,     // 🔴 Disabled by default - DUMMY CATEGORY
        readOnly: false     // 🟡 User can toggle but we don't use analytics
      }
    },

    // ====================
    // GUI OPTIONS
    // ====================
    guiOptions: {
      consentModal: {
        layout: 'cloud',
        position: 'bottom center',
        equalWeightButtons: true,
        flipButtons: false,
        showPreferencesButton: false
      },
      preferencesModal: {
        layout: 'box',
        equalWeightButtons: true,
        position: 'middle',
        transition: 'none'
      }
    },

    // ====================
    // LANGUAGE - Updated to clarify no analytics are used
    // ====================
    language: {
      default: 'en',
      translations: {
        en: {
          consentModal: {
            title: 'Cookie Consent',
            description: 'We use essential cookies to remember your preferences and to demonstrate compliance with data protection law. We do NOT use analytics or tracking cookies. The "analytics" category is shown only for technical reasons to distinguish between acceptance and rejection. <a href="/legal/privacy" class="text-primary hover:underline" target="_blank">Learn more in our Privacy Policy</a>.',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
          },
          preferencesModal: {
            title: 'Cookie Preferences',
            savePreferencesBtn: 'Save preferences',
            acceptAllBtn: 'Accept all',
            rejectAllBtn: 'Reject all',
            closeIconLabel: 'Close',
            sections: [
              {
                title: 'Essential Cookies',
                description: 'We use essential cookies to store your consent preferences. If you accept, we set a cookie to remember your choice. If you reject, we set a minimal cookie to record your rejection decision (GDPR requirement).',
                linkedCategory: 'necessary',
                cookieTable: {
                  headers: {
                    name: 'Cookie',
                    purpose: 'Purpose',
                    duration: 'Duration'
                  },
                  body: [
                    {
                      name: 'cv_cookie',
                      purpose: 'Stores your consent preferences (acceptance) to demonstrate GDPR compliance and avoid showing the banner repeatedly.',
                      duration: '1 year'
                    },
                    {
                      name: 'cv_rejection',
                      purpose: 'Records your rejection decision with your consent (Art. 6(1)(a) GDPR) to remember your choice and prevent the banner from reappearing. Contains only timestamp and rejection status—no behavioral data.',
                      duration: '1 year'
                    },
                    {
                      name: 'cc_cookie',
                      purpose: 'Internal library cookie used to manage the consent modal interface. Does not affect your consent choice.',
                      duration: '1 year'
                    }
                  ]
                }
              },
              {
                title: 'Analytics Cookies (Information Only)',
                description: 'We DO NOT use any analytics, tracking, or marketing cookies. The analytics category is included only for technical reasons to properly distinguish between "Accept all" and "Reject all" choices. Enabling this category does nothing—we do not collect any analytics data.',
                linkedCategory: 'analytics',
                cookieTable: {
                  headers: {
                    name: 'Cookie',
                    purpose: 'Purpose',
                    duration: 'Duration'
                  },
                  body: [
                    {
                      name: 'No cookies used',
                      purpose: 'We do not use any analytics cookies. This category exists only for technical implementation.',
                      duration: 'N/A'
                    }
                  ]
                }
              },
              {
                title: 'More Information',
                description: 'For any questions regarding our cookie usage, please contact us at <a href="mailto:info@talentvaults.com">info@talentvaults.com</a>. You can withdraw consent at any time by clearing your browser cookies.'
              }
            ]
          }
        }
      }
    },

    // ====================
    // COOKIE SETTINGS
    // ====================
    cookie: {
      name: 'cc_cookie', // Library manages its own cookie separately
      expiresAfterDays: 365,
      domain: window.location.hostname,
      path: '/',
      sameSite: 'Lax',
      secure: window.location.protocol === 'https:'
    }
  };
};

// ====================
// MAIN COMPONENT
// ====================

export default function CookieConsentClient() {
  const [isClient, setIsClient] = useState(false);
  const skipInitialConsentEvent = useRef(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // ====================
    // CRITICAL FIX #3: Early Exit for Rejection (REINFORCED)
    // ====================
    if (!shouldInitializeLibrary()) {
      console.log('🛑 SKIPPING LIBRARY INITIALIZATION - cv_rejection cookie detected');
      document.body.setAttribute('data-cookie-consent', 'rejected');
      // Make sure cv_cookie doesn't exist if we have rejection
      if (hasAcceptanceCookie() && hasRejectionCookie()) {
        console.log('🛑 Conflict: Both cookies exist, deleting cv_cookie');
        deleteCookie('cv_cookie');
      }
      return;
    }

    // ====================
    // CRITICAL FIX #4: Add cc:onConsent event handler as fallback
    // ====================
    const handleConsentEvent = (e: any) => {
      try {
        // Skip the initial event (fires on library initialization)
        if (skipInitialConsentEvent.current) {
          skipInitialConsentEvent.current = false;
          return;
        }

        const cookie = e.detail.cookie;
        const categories = cookie.categories || [];
        
        console.log('🎯 [React] cc:onConsent caught:', {
          categories: categories,
          level: cookie.level,
          hasAnalytics: categories.includes('analytics')
        });
        
        // Check if analytics category is present (Accept all)
        const hasAnalytics = categories.includes('analytics');
        
        if (hasAnalytics) {
          // ✅ This is ACCEPTANCE (Accept all was clicked)
          console.log('✅ [React] ACCEPTANCE detected - setting cv_cookie');
          
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
          
          // Log to server
          logConsentToServer({
            event: 'consent_accepted',
            button_clicked: 'Accept all',
            note: 'User accepted via cc:onConsent event - cv_cookie set with fullAcceptance flag'
          });

          document.body.setAttribute('data-cookie-consent', 'accepted');
          
          // Trigger immediate unblocking
          setTimeout(() => {
            triggerImmediateUnblocking();
          }, 20);
          
        } else if (categories.includes('necessary')) {
          // ❌ This is REJECTION (Reject all was clicked or only necessary accepted)
          console.log('❌ [React] REJECTION detected - setting cv_rejection');
          
          // Set rejection cookie
          setRejectionCookie();
          
          // Delete cv_cookie if exists
          deleteCookie('cv_cookie');
          
          // Log to server
          logConsentToServer({
            event: 'consent_rejected',
            button_clicked: 'Reject all',
            note: 'User rejected via cc:onConsent event - cv_rejection set'
          });

          document.body.setAttribute('data-cookie-consent', 'rejected');
          
          // Dispatch event for ScriptBlockingComponent
          window.dispatchEvent(new CustomEvent('cookie-consent-rejected'));
        }
      } catch (error) {
        console.error('❌ [React] Error in cc:onConsent handler:', error);
      }
    };

    // Add event listener for cc:onConsent
    window.addEventListener('cc:onConsent', handleConsentEvent);

    // ====================
    // SIMPLIFIED REJECTION HANDLER
    // ====================
    const handleRejection = () => {
      // If we already have a rejection cookie, do nothing (idempotent)
      if (hasRejectionCookie()) {
        console.log('🔁 Rejection cookie already exists');
        return;
      }

      console.log('❌ Setting rejection cookie only');
      setRejectionCookie();
      document.body.setAttribute('data-cookie-consent', 'rejected');

      // Hide banner
      if (window.CookieConsent) {
        window.CookieConsent.hide();
      }

      // Notify blocking component
      window.dispatchEvent(new CustomEvent('cookie-consent-rejected'));

      // Log to server
      logConsentToServer({
        event: 'consent_rejected',
        button_clicked: 'Reject all',
        note: 'User rejected - cv_rejection cookie set'
      });
    };

    // ====================
    // CRITICAL FIX #5: SIMPLIFIED DECISION DETERMINATION (Fix C)
    // ====================
    const determineUserDecision = (): 'undecided' | 'accepted' | 'rejected' => {
      // CRITICAL: Rejection cookie takes ABSOLUTE precedence
      if (hasRejectionCookie()) {
        console.log('🎯 Decision: rejected (cv_rejection present)');
        return 'rejected';
      }
      
      // Check for acceptance
      if (hasAcceptanceCookie()) {
        console.log('🎯 Decision: accepted (cv_cookie present and valid)');
        return 'accepted';
      }
      
      console.log('🎯 Decision: undecided (no cookies present)');
      return 'undecided';
    };

    const userDecision = determineUserDecision();
    console.log(`🎯 Initial user decision: ${userDecision}`);

    // ====================
    // Early exit if rejected (DOUBLE CHECK)
    // ====================
    if (userDecision === 'rejected') {
      console.log('🛑 User rejected - NOT initializing library');
      document.body.setAttribute('data-cookie-consent', 'rejected');
      // Make absolutely sure cv_cookie doesn't exist
      if (hasAcceptanceCookie()) {
        console.log('🛑 Found stray cv_cookie - deleting');
        deleteCookie('cv_cookie');
      }
      return;
    }

    // ====================
    // UTILITY FUNCTIONS
    // ====================
    const hidePreferencesModalIfVisible = () => {
      try {
        const preferencesModal = document.querySelector('.cc-pref-modal');
        const backdrop = document.querySelector('.cc-backdrop');
        
        if (preferencesModal) {
          preferencesModal.classList.add('cc-hidden');
          preferencesModal.setAttribute('aria-hidden', 'true');
          
          setTimeout(() => {
            if (preferencesModal && preferencesModal.parentNode) {
              preferencesModal.parentNode.removeChild(preferencesModal);
            }
            if (backdrop && backdrop.parentNode) {
              backdrop.parentNode.removeChild(backdrop);
            }
          }, 100);
          
          console.log('🔒 Force-hid preferences modal after acceptance');
        }
      } catch (error) {
        console.error('Error hiding preferences modal:', error);
      }
    };

    // Mutation Observer for preferences modal
    let preferencesObserver: MutationObserver | null = null;
    
    const setupPreferencesObserver = () => {
      if (preferencesObserver) preferencesObserver.disconnect();
      
      preferencesObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            const preferencesModal = document.querySelector('.cc-pref-modal');
            if (preferencesModal && hasAcceptanceCookie() && !preferencesModalWasOpened) {
              console.log('🚫 Blocking preferences modal auto-show after acceptance');
              hidePreferencesModalIfVisible();
            }
          }
        });
      });
      
      if (document.body) {
        preferencesObserver.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    };

    // ====================
    // LIBRARY INITIALIZATION (Only if needed)
    // ====================
    const initializeWhenReady = () => {
      if (!window.CookieConsent) {
        setTimeout(initializeWhenReady, 50);
        return;
      }

      console.log(`✅ Initializing CookieConsent (autoShow: ${userDecision === 'undecided'})`);
      
      const config = getLibraryConfiguration(userDecision);
      
      window.CookieConsent.run({
        ...config,
        
        // ====================
        // SIMPLIFIED CALLBACKS (Dead code removed)
        // ====================
        onFirstAction: ({ cookie }: any) => {
          console.log('✅ First action recorded:', cookie);
        },

        onShowPreferences: () => {
          console.log('⚙️ Preferences modal shown');
          preferencesModalWasOpened = true;
        },
        
        onHidePreferences: () => {
          console.log('⚙️ Preferences modal hidden');
        },
        
        // REMOVED: onAccept, onReject, onChange callbacks - handled by cc:onConsent
        // REMOVED: setupManualRejectButtonHandler - handled by cc:onConsent
      });
      
      // If user already has consent, trigger unblocking immediately
      if (userDecision === 'accepted') {
        setTimeout(() => {
          console.log('✅ User already consented - triggering immediate unblocking');
          triggerImmediateUnblocking();
        }, 100);
      }
      
      // Set up observer after initialization
      setTimeout(() => {
        setupPreferencesObserver();
      }, 100);
      
      // Expose showPreferences globally for manual triggering
      window.showCookiePreferences = () => {
        if (window.CookieConsent) {
          preferencesModalWasOpened = true;
          window.CookieConsent.showPreferences();
        }
      };
      
      // Return cleanup for observers
      return () => {
        if (preferencesObserver) {
          preferencesObserver.disconnect();
        }
      };
    };

    // Initialize library if needed
    if (window.CookieConsent) {
      const cleanup = initializeWhenReady();
      
      // Cleanup function
      return () => {
        if (cleanup) cleanup();
        window.removeEventListener('cc:init', initializeWhenReady);
        if (preferencesObserver) {
          preferencesObserver.disconnect();
        }
        // Remove event listener
        window.removeEventListener('cc:onConsent', handleConsentEvent);
      };
    } else {
      window.addEventListener('cc:init', initializeWhenReady);
      
      return () => {
        window.removeEventListener('cc:init', initializeWhenReady);
        if (preferencesObserver) {
          preferencesObserver.disconnect();
        }
        // Remove event listener
        window.removeEventListener('cc:onConsent', handleConsentEvent);
      };
    }
  }, [isClient]);

  if (!isClient) return null;

  return (
    <>
      <Script
        id="cookie-consent-library"
        src="/cookieconsent/cookieconsent.umd.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ CookieConsent library loaded');
          window.dispatchEvent(new Event('cc:init'));
        }}
        onError={(e) => {
          console.error('❌ Failed to load CookieConsent:', e);
          const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
          const fallbackHTML = `
            <div id="gdpr-fallback" style="
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              background: #1e293b;
              color: white;
              padding: 20px;
              z-index: 9999;
              text-align: center;
              font-family: sans-serif;
              box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
            ">
              <div style="max-width: 800px; margin: 0 auto;">
                <p style="margin: 0 0 15px 0; font-size: 16px;">
                  We use essential cookies to remember your preferences and to demonstrate compliance with data protection law. No tracking, analytics, or marketing cookies are used. 
                  <a href="/legal/privacy" style="color: #60a5fa; text-decoration: underline; margin-left: 5px;">
                    Privacy Policy
                  </a>
                </p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                  <button onclick="
                    const acceptanceData = {
                      categories: { necessary: true, analytics: true },
                      fullAcceptance: true,
                      consentTimestamp: new Date().toISOString()
                    };
                    document.cookie = 'cv_cookie=' + encodeURIComponent(JSON.stringify(acceptanceData)) + '; path=/; max-age=31536000; SameSite=Lax${secureFlag}';
                    document.cookie = 'cv_rejection=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.getElementById('gdpr-fallback').style.display='none';
                    location.reload();
                  " style="
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 10px 25px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                  ">
                    Accept all
                  </button>
                  <button onclick="
                    const rejectionData = {
                      rejected: true,
                      timestamp: new Date().toISOString(),
                      note: 'Stored with user consent (Art. 6(1)(a) GDPR) to remember preference'
                    };
                    document.cookie = 'cv_rejection=' + encodeURIComponent(JSON.stringify(rejectionData)) + '; path=/; max-age=31536000; SameSite=Lax${secureFlag}';
                    document.cookie = 'cv_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.getElementById('gdpr-fallback').style.display='none';
                    location.reload();
                  " style="
                    background: #64748b;
                    color: white;
                    border: none;
                    padding: 10px 25px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                  ">
                    Reject all
                  </button>
                </div>
                <div style="margin-top: 15px;">
                  <button onclick="
                    const details = document.getElementById('fallback-details');
                    details.style.display = details.style.display === 'block' ? 'none' : 'block';
                  " style="
                    background: transparent;
                    color: #cbd5e1;
                    border: 1px solid rgba(255,255,255,0.2);
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                  ">
                    More Information
                  </button>
                  <div id="fallback-details" style="
                    display: none;
                    background: rgba(0,0,0,0.2);
                    padding: 15px;
                    border-radius: 8px;
                    margin-top: 15px;
                    text-align: left;
                    font-size: 14px;
                  ">
                    <p><strong>Essential Cookies Used:</strong></p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                      <li><strong>cv_cookie:</strong> Set only if you accept. Stores consent preferences to demonstrate GDPR compliance.</li>
                      <li><strong>cv_rejection:</strong> Set only if you reject. Records your decision with your consent (Art. 6(1)(a) GDPR) to remember your choice and prevent the banner from reappearing.</li>
                    </ul>
                    <p style="margin-top: 10px;"><strong>Contact</strong></p>
                    <p>For any questions regarding our cookie usage, please contact us at info@talentvaults.com. You can withdraw consent at any time by clearing your browser cookies.</p>
                  </div>
                </div>
              </div>
            </div>
          `;
          document.body.insertAdjacentHTML('beforeend', fallbackHTML);
        }}
      />
      
      <noscript>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.9)',
          color: 'white',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>
              JavaScript Required for Privacy Compliance
            </h2>
            <p style={{ marginBottom: '20px' }}>
              We use essential cookies to remember your preferences and to demonstrate compliance with data protection law. No tracking, analytics, or marketing cookies are used.<br />
              To manage your cookie preferences, please enable JavaScript.
            </p>
            <p>
              Alternatively, you can view our{' '}
              <a href="/legal/privacy" style={{ color: '#4CAF50', textDecoration: 'underline' }}>
                Privacy Policy
              </a>
              {' '}or contact us at info@talentvaults.com
            </p>
          </div>
        </div>
      </noscript>
    </>
  );
}