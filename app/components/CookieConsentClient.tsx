'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    CookieConsent: any;
    gdprCompliance?: {
      auditCookies: () => void;
      getLogs: () => any[];
      clearLogs: () => void;
    };
  }
}

// Helper function to get cookie value
const getCookieValue = (name: string) => {
  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='));
    return cookie ? cookie.split('=')[1] : null;
  } catch {
    return null;
  }
};

// Helper function to check if user has valid consent (acceptance)
const hasAcceptanceCookie = (): boolean => {
  try {
    const cvCookie = getCookieValue('cv_cookie');
    if (!cvCookie) return false;

    const cookieData = JSON.parse(decodeURIComponent(cvCookie));

    // Check for new structure: categories as object with necessary: true
    if (cookieData && cookieData.categories) {
      if (typeof cookieData.categories === 'object' && cookieData.categories.necessary === true) {
        return true;
      }
      // Check for old array format
      if (Array.isArray(cookieData.categories) && cookieData.categories.includes('necessary')) {
        return true;
      }
    }

    // Check for very old format or fallback
    if (cookieData && cookieData.consent === true) {
      return true;
    }

    return false;
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

// Helper function to check for ANY rejection format
const hasAnyRejection = (): boolean => {
  try {
    // Check our explicit rejection cookie
    if (hasRejectionCookie()) return true;
    
    // Check library's empty categories format
    const cvCookie = getCookieValue('cv_cookie');
    if (!cvCookie) return false;

    const cookieData = JSON.parse(decodeURIComponent(cvCookie));
    
    // Library rejection formats:
    // 1. Empty array: categories: []
    // 2. False value: categories: { necessary: false }
    // 3. Missing necessary category
    if (cookieData && cookieData.categories) {
      if (typeof cookieData.categories === 'object') {
        return cookieData.categories.necessary === false;
      }
      if (Array.isArray(cookieData.categories)) {
        return cookieData.categories.length === 0;
      }
    }
    
    return false;
  } catch {
    return false;
  }
};

// Track preferences modal state
let preferencesModalWasOpened = false;

export default function CookieConsentClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Function to delete cookies with all domain variations
    const deleteCookie = (name: string) => {
      const domain = window.location.hostname;
      const path = '/';
      
      // Delete with all possible combinations
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=.${domain};`;
      
      console.log(`🗑️ Deleted cookie: ${name}`);
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
      console.log('✅ Essential rejection cookie set with user consent (Art. 6(1)(a) GDPR)');
    };

    // Determine user's previous decision - FIXED LOGIC
    const determineUserDecision = (): 'undecided' | 'accepted' | 'rejected' => {
      // Check explicit rejection cookie first
      if (hasRejectionCookie()) return 'rejected';
      
      // Check for acceptance
      if (hasAcceptanceCookie()) return 'accepted';
      
      // Check if library cookie represents rejection (IMPORTANT!)
      if (hasAnyRejection()) return 'rejected';
      
      return 'undecided';
    };

    const userDecision = determineUserDecision();
    console.log(`🎯 Initial user decision: ${userDecision}`);

    // Function to forcefully hide preferences modal if it appears after acceptance
    const hidePreferencesModalIfVisible = () => {
      try {
        const preferencesModal = document.querySelector('.cc-pref-modal');
        const backdrop = document.querySelector('.cc-backdrop');
        
        if (preferencesModal) {
          // Add hidden class
          preferencesModal.classList.add('cc-hidden');
          preferencesModal.setAttribute('aria-hidden', 'true');
          
          // Remove from DOM entirely if needed
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

    // Mutation Observer to watch for preferences modal appearance
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
      
      // Observe body for modal additions
      if (document.body) {
        preferencesObserver.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    };

    // Initialize CookieConsent library
    const initializeWhenReady = () => {
      if (!window.CookieConsent) {
        setTimeout(initializeWhenReady, 50);
        return;
      }

      window.CookieConsent.run({
        // ====================
        // GDPR COMPLIANCE SETTINGS
        // ====================
        mode: 'opt-in',
        autoShow: userDecision === 'undecided',
        delay: 0,
        hideFromBots: false,
        revision: 0,
        autoClear: true,
        
        // Prevent auto-opening preferences modal
        autoShowPreferences: false,

        // ====================
        // CATEGORIES: Only essential allowed
        // ====================
        categories: {
          necessary: {
            enabled: userDecision === 'accepted',
            readOnly: false,
            autoClear: {
              name: 'cv_cookie',
              domain: window.location.hostname,
              path: '/'
            }
          }
        },

        // ====================
        // GUI: Equal button prominence
        // ====================
        guiOptions: {
          consentModal: {
            layout: 'cloud',
            position: 'bottom center',
            equalWeightButtons: true,
            flipButtons: false,
            // Don't show preferences button in initial modal
            showPreferencesButton: false
          },
          preferencesModal: {
            layout: 'box',
            equalWeightButtons: true,
            position: 'middle',
            // Animation settings to prevent flicker
            transition: 'none'
          }
        },

        // ====================
        // LANGUAGE: Clear, non-manipulative
        // ====================
        language: {
          default: 'en',
          translations: {
            en: {
              consentModal: {
                title: 'Cookie Consent',
                description: 'We use essential cookies to remember your preferences and to demonstrate compliance with data protection law. No tracking, analytics, or marketing cookies are used. Learn more in our <a href="/legal/privacy" class="text-primary hover:underline" target="_blank">Privacy Policy</a>.',
                acceptAllBtn: 'Accept all',
                acceptNecessaryBtn: 'Reject all',
                // Removed: showPreferencesBtn
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
          name: 'cv_cookie',
          expiresAfterDays: 365,
          domain: window.location.hostname,
          path: '/',
          sameSite: 'Lax',
          secure: window.location.protocol === 'https:'
        },

        // ====================
        // COMPLIANCE CALLBACKS
        // ====================
        
        onFirstAction: ({ cookie }: any) => {
          console.log('✅ First action recorded:', cookie);
        },

        onAccept: ({ cookie }: any) => {
          console.log('📝 Consent accepted - setting cv_cookie');
          
          // Reset preferences flag
          preferencesModalWasOpened = false;
          
          // Delete rejection cookie if it exists (user changing mind)
          deleteCookie('cv_rejection');
          // Delete audit cookie if it exists
          deleteCookie('cv_cookie_audit');
          
          // Set correct cookie structure IMMEDIATELY
          const acceptanceData = {
            categories: { necessary: true },
            consentTimestamp: new Date().toISOString(),
            revision: 0
          };
          
          const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
          document.cookie = `cv_cookie=${encodeURIComponent(JSON.stringify(acceptanceData))}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax${secureFlag}`;
          
          // Log the acceptance
          logConsentToServer({
            event: 'consent_accepted',
            button_clicked: 'Accept all',
            legal_basis: 'Art. 6(1)(a) GDPR',
            timestamp: new Date().toISOString(),
            note: 'User accepted - cv_cookie set, cv_rejection and cv_cookie_audit deleted'
          });

          document.body.setAttribute('data-cookie-consent', 'accepted');
          
          // Immediately hide any preferences modal
          hidePreferencesModalIfVisible();
          
          // Dispatch event for IMMEDIATE script unblocking
          window.dispatchEvent(new CustomEvent('cookie-consent-accepted'));
          
          // Hide banner immediately
          if (window.CookieConsent) {
            setTimeout(() => {
              window.CookieConsent.hide();
            }, 10);
          }
        },

        onReject: ({ cookie }: any) => {
          console.log('❌ Consent rejected via onReject');
          handleRejection();
        },

        onChange: ({ changedCategories, cookie }: any) => {
          console.log('🔄 onChange fired with:', { changedCategories, cookie });
          
          // Track if user opened preferences manually
          if (changedCategories === 'showPreferences') {
            preferencesModalWasOpened = true;
            console.log('📱 User manually opened preferences modal');
          }
          
          // Detect rejection in onChange (library uses this for acceptNecessaryBtn)
          if (changedCategories && 'necessary' in changedCategories) {
            if (changedCategories.necessary === false) {
              console.log('🔄 Detected rejection via onChange (necessary: false)');
              handleRejection();
            } else if (changedCategories.necessary === true) {
              console.log('🔄 Detected acceptance via onChange');
              // Hide preferences modal if it appears
              hidePreferencesModalIfVisible();
            }
          }
          
          // Also check cookie structure for empty categories
          if (cookie && cookie.categories) {
            // Empty array means rejection
            if (Array.isArray(cookie.categories) && cookie.categories.length === 0) {
              console.log('✅ onChange detected rejection via categories: []');
              handleRejection();
            }
            // Object with necessary: false means rejection
            if (typeof cookie.categories === 'object' && cookie.categories.necessary === false) {
              console.log('✅ onChange detected rejection via necessary: false');
              handleRejection();
            }
          }
        },
        
        // Callback when preferences modal is shown
        onShowPreferences: () => {
          console.log('⚙️ Preferences modal shown');
          preferencesModalWasOpened = true;
        },
        
        // Callback when preferences modal is hidden
        onHidePreferences: () => {
          console.log('⚙️ Preferences modal hidden');
        }
      });

      console.log(`✅ CookieConsent initialized (autoShow: ${userDecision === 'undecided'})`);
      
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
    };

    // Unified rejection handler - FIXED: Preserve cv_cookie as audit trail
    const handleRejection = () => {
      console.log('❌ Handling rejection - setting rejection cookie');
      
      // Get the library cookie value before modifying
      const libraryCookieValue = getCookieValue('cv_cookie');
      
      // Rename cv_cookie to cv_cookie_audit for audit trail (instead of deleting)
      if (libraryCookieValue) {
        const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `cv_cookie_audit=${libraryCookieValue}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax${secureFlag}`;
        console.log('📝 Preserved library cookie as cv_cookie_audit for audit trail');
      }
      
      // Delete the original cv_cookie (now we have audit trail)
      deleteCookie('cv_cookie');
      
      // Set our minimal essential rejection cookie
      setRejectionCookie();
      
      // Log the rejection
      logConsentToServer({
        event: 'consent_rejected',
        button_clicked: 'Reject all',
        legal_basis: 'Art. 6(1)(a) GDPR',
        timestamp: new Date().toISOString(),
        note: 'User rejected - cv_rejection cookie set, cv_cookie preserved as cv_cookie_audit'
      });

      document.body.setAttribute('data-cookie-consent', 'rejected');
      
      // Dispatch event for ScriptBlockingComponent
      window.dispatchEvent(new CustomEvent('cookie-consent-rejected'));
      
      // Hide banner immediately
      if (window.CookieConsent) {
        window.CookieConsent.hide();
      }
    };

    // Always initialize the library
    if (window.CookieConsent) {
      initializeWhenReady();
    } else {
      window.addEventListener('cc:init', initializeWhenReady);
    }

    return () => {
      window.removeEventListener('cc:init', initializeWhenReady);
      if (preferencesObserver) {
        preferencesObserver.disconnect();
      }
    };
  }, [isClient]);

  const logConsentToServer = (data: any) => {
    try {
      fetch('/api/compliance/consent-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    } catch (error) {
      console.error('Failed to log consent:', error);
    }
  };

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
                    document.cookie = 'cv_cookie=' + encodeURIComponent(JSON.stringify({
                      categories: { necessary: true },
                      consentTimestamp: new Date().toISOString()
                    })) + '; path=/; max-age=31536000; SameSite=Lax${secureFlag}';
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
                    document.cookie = 'cv_rejection=' + encodeURIComponent(JSON.stringify({
                      rejected: true,
                      timestamp: new Date().toISOString(),
                      note: 'Stored with user consent (Art. 6(1)(a) GDPR) to remember preference'
                    })) + '; path=/; max-age=31536000; SameSite=Lax${secureFlag}';
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

// Extend Window interface
declare global {
  interface Window {
    showCookiePreferences: () => void;
  }
}