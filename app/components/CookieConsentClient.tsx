'use client';

import { useEffect, useState } from 'react';
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

const deleteCookie = (name: string) => {
  const domain = window.location.hostname;
  const path = '/';
  
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=.${domain};`;
  
  console.log(`🗑️ Deleted cookie: ${name}`);
};

// CRITICAL FIX: Only treat explicit full acceptance as consent
// "necessary only" is NOT acceptance for our purposes
const hasAcceptanceCookie = (): boolean => {
  try {
    const cvCookie = getCookieValue('cv_cookie');
    if (!cvCookie) return false;

    const cookieData = JSON.parse(cvCookie);

    // NEW: Check if this is an explicit acceptance (not just "necessary only")
    // We'll look for a custom flag we set ourselves
    if (cookieData && cookieData.explicitAcceptance === true) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

const hasRejectionCookie = (): boolean => {
  try {
    return !!getCookieValue('cv_rejection');
  } catch {
    return false;
  }
};

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

const triggerImmediateUnblocking = () => {
  if (window._cookieUtils && window._cookieUtils.unblockScripts) {
    console.log('🚀 Triggering immediate unblocking via inline script');
    window._cookieUtils.unblockScripts();
  } else {
    console.log('⚠️ Inline script utilities not available for immediate unblocking');
  }
  
  window.dispatchEvent(new CustomEvent('cookie-consent-accepted'));
};

const logConsentToServer = (data: any) => {
  try {
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

let preferencesModalWasOpened = false;

const shouldInitializeLibrary = (): boolean => {
  try {
    if (hasRejectionCookie()) {
      console.log('🛑 Library initialization BLOCKED - cv_rejection exists');
      return false;
    }
    return true;
  } catch {
    return true;
  }
};

const getLibraryConfiguration = (userDecision: string) => {
  return {
    mode: 'opt-in',
    autoShow: userDecision === 'undecided',
    delay: 0,
    hideFromBots: false,
    revision: 0,
    autoClear: true,
    autoShowPreferences: false,

    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
        autoClear: {
          name: 'cv_cookie',
          domain: window.location.hostname,
          path: '/'
        }
      }
    },

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

    language: {
      default: 'en',
      translations: {
        en: {
          consentModal: {
            title: 'Cookie Consent',
            description: 'We use essential cookies to remember your preferences and to demonstrate compliance with data protection law. No tracking, analytics, or marketing cookies are used. Learn more in our <a href="/legal/privacy" class="text-primary hover:underline" target="_blank">Privacy Policy</a>.',
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

    cookie: {
      name: 'cv_cookie',
      expiresAfterDays: 365,
      domain: window.location.hostname,
      path: '/',
      sameSite: 'Lax',
      secure: window.location.protocol === 'https:'
    }
  };
};

export default function CookieConsentClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (!shouldInitializeLibrary()) {
      console.log('🛑 SKIPPING LIBRARY INITIALIZATION - cv_rejection cookie detected');
      document.body.setAttribute('data-cookie-consent', 'rejected');
      if (hasAcceptanceCookie() && hasRejectionCookie()) {
        console.log('🛑 Conflict: Both cookies exist, deleting cv_cookie');
        deleteCookie('cv_cookie');
      }
      return;
    }

    // CRITICAL FIX: Track which button was clicked
    let lastButtonClicked: 'accept' | 'reject' | null = null;

    const handleRejection = () => {
      if (hasRejectionCookie()) {
        console.log('🔁 Rejection cookie already exists');
        return;
      }

      console.log('❌ Handling rejection - setting cv_rejection, deleting cv_cookie');
      
      // Delete any cv_cookie that might have been set by the library
      deleteCookie('cv_cookie');
      
      // Set our rejection cookie
      setRejectionCookie();
      
      document.body.setAttribute('data-cookie-consent', 'rejected');

      if (window.CookieConsent) {
        window.CookieConsent.hide();
      }

      window.dispatchEvent(new CustomEvent('cookie-consent-rejected'));

      logConsentToServer({
        event: 'consent_rejected',
        button_clicked: 'Reject all',
        note: 'User rejected - cv_rejection cookie set, cv_cookie deleted'
      });
    };

    const determineUserDecision = (): 'undecided' | 'accepted' | 'rejected' => {
      if (hasRejectionCookie()) {
        console.log('🎯 Decision: rejected (cv_rejection present)');
        return 'rejected';
      }
      
      if (hasAcceptanceCookie()) {
        console.log('🎯 Decision: accepted (cv_cookie with explicit acceptance)');
        return 'accepted';
      }
      
      console.log('🎯 Decision: undecided (no cookies present)');
      return 'undecided';
    };

    const userDecision = determineUserDecision();
    console.log(`🎯 Initial user decision: ${userDecision}`);

    if (userDecision === 'rejected') {
      console.log('🛑 User rejected - NOT initializing library');
      document.body.setAttribute('data-cookie-consent', 'rejected');
      if (hasAcceptanceCookie()) {
        console.log('🛑 Found stray cv_cookie - deleting');
        deleteCookie('cv_cookie');
      }
      return;
    }

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

    // CRITICAL FIX: Intercept button clicks to track which button was pressed
    const setupButtonInterceptors = () => {
      // Wait for modal to be rendered
      setTimeout(() => {
        const modal = document.querySelector('.cc-consent-modal');
        if (modal) {
          modal.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const button = target.closest('button');
            
            if (button) {
              const buttonText = button.textContent?.trim().toLowerCase();
              
              if (buttonText === 'accept all') {
                console.log('🟢 ACCEPT button clicked');
                lastButtonClicked = 'accept';
              } else if (buttonText === 'reject all') {
                console.log('🔴 REJECT button clicked');
                lastButtonClicked = 'reject';
              }
            }
          });
        }
      }, 100);
    };

    const initializeWhenReady = () => {
      if (!window.CookieConsent) {
        setTimeout(initializeWhenReady, 50);
        return;
      }

      console.log(`✅ Initializing CookieConsent (autoShow: ${userDecision === 'undecided'})`);
      
      const config = getLibraryConfiguration(userDecision);
      
      window.CookieConsent.run({
        ...config,
        
        onFirstAction: ({ cookie }: any) => {
          console.log('✅ First action recorded:', cookie);
        },

        // CRITICAL FIX: Check which button was clicked
        onAccept: ({ cookie }: any) => {
          console.log('📝 onAccept fired with cookie:', cookie);
          console.log(`📝 Last button clicked: ${lastButtonClicked}`);
          
          // CRITICAL: If "Reject all" was clicked, treat this as rejection
          if (lastButtonClicked === 'reject') {
            console.log('🔴 REJECT detected - handling as rejection despite onAccept firing');
            handleRejection();
            lastButtonClicked = null;
            return;
          }
          
          // Otherwise, this is a real acceptance
          console.log('🟢 ACCEPT confirmed - setting acceptance cookie');
          
          preferencesModalWasOpened = false;
          
          if (hasRejectionCookie()) {
            console.log('🔄 User changing mind - deleting rejection cookie');
            deleteCookie('cv_rejection');
          }
          
          // Set acceptance cookie with explicit flag
          const acceptanceData = {
            categories: { necessary: true },
            explicitAcceptance: true, // NEW: Our flag to distinguish from "necessary only"
            consentTimestamp: new Date().toISOString(),
            revision: 0
          };
          
          const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
          document.cookie = `cv_cookie=${encodeURIComponent(JSON.stringify(acceptanceData))}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax${secureFlag}`;
          
          logConsentToServer({
            event: 'consent_accepted',
            button_clicked: 'Accept all',
            note: 'User accepted - cv_cookie set with explicit acceptance flag'
          });

          document.body.setAttribute('data-cookie-consent', 'accepted');
          
          hidePreferencesModalIfVisible();
          
          setTimeout(() => {
            triggerImmediateUnblocking();
          }, 20);
          
          if (window.CookieConsent) {
            setTimeout(() => {
              window.CookieConsent.hide();
            }, 50);
          }
          
          lastButtonClicked = null;
        },

        onReject: ({ cookie }: any) => {
          console.log('❌ onReject fired (this should rarely happen with current config)');
          handleRejection();
          lastButtonClicked = null;
        },

        onChange: ({ changedCategories, cookie }: any) => {
          console.log('🔄 onChange fired with:', { changedCategories, cookie });
          
          if (changedCategories === 'showPreferences') {
            preferencesModalWasOpened = true;
            return;
          }
          
          // If categories is empty array, treat as rejection
          if (cookie && Array.isArray(cookie.categories) && cookie.categories.length === 0) {
            console.log('✅ onChange detected empty categories - handling rejection');
            handleRejection();
          }
        },
        
        onShowPreferences: () => {
          console.log('⚙️ Preferences modal shown');
          preferencesModalWasOpened = true;
        },
        
        onHidePreferences: () => {
          console.log('⚙️ Preferences modal hidden');
        }
      });
      
      // Setup button interceptors after initialization
      setupButtonInterceptors();
      
      if (userDecision === 'accepted') {
        setTimeout(() => {
          console.log('✅ User already consented - triggering immediate unblocking');
          triggerImmediateUnblocking();
        }, 100);
      }
      
      setTimeout(() => {
        setupPreferencesObserver();
      }, 100);
      
      window.showCookiePreferences = () => {
        if (window.CookieConsent) {
          preferencesModalWasOpened = true;
          window.CookieConsent.showPreferences();
        }
      };
    };

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
            <div id="gdpr-fallback" style="position: fixed; bottom: 0; left: 0; right: 0; background: #1e293b; color: white; padding: 20px; z-index: 9999; text-align: center; font-family: sans-serif; box-shadow: 0 -4px 20px rgba(0,0,0,0.3);">
              <div style="max-width: 800px; margin: 0 auto;">
                <p style="margin: 0 0 15px 0; font-size: 16px;">We use essential cookies to remember your preferences and to demonstrate compliance with data protection law. No tracking, analytics, or marketing cookies are used. <a href="/legal/privacy" style="color: #60a5fa; text-decoration: underline; margin-left: 5px;">Privacy Policy</a></p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                  <button onclick="document.cookie='cv_cookie='+encodeURIComponent(JSON.stringify({categories:{necessary:true},explicitAcceptance:true,consentTimestamp:new Date().toISOString()}))+ '; path=/; max-age=31536000; SameSite=Lax${secureFlag}';document.cookie='cv_rejection=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';document.getElementById('gdpr-fallback').style.display='none';location.reload();" style="background: #10b981; color: white; border: none; padding: 10px 25px; border-radius: 6px; cursor: pointer; font-weight: bold;">Accept all</button>
                  <button onclick="document.cookie='cv_rejection='+encodeURIComponent(JSON.stringify({rejected:true,timestamp:new Date().toISOString(),note:'Stored with user consent (Art. 6(1)(a) GDPR) to remember preference'}))+ '; path=/; max-age=31536000; SameSite=Lax${secureFlag}';document.cookie='cv_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';document.getElementById('gdpr-fallback').style.display='none';location.reload();" style="background: #64748b; color: white; border: none; padding: 10px 25px; border-radius: 6px; cursor: pointer; font-weight: bold;">Reject all</button>
                </div>
              </div>
            </div>
          `;
          document.body.insertAdjacentHTML('beforeend', fallbackHTML);
        }}
      />
      
      <noscript>
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', color: 'white', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
          <div>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>JavaScript Required for Privacy Compliance</h2>
            <p style={{ marginBottom: '20px' }}>We use essential cookies to remember your preferences and to demonstrate compliance with data protection law. No tracking, analytics, or marketing cookies are used.<br />To manage your cookie preferences, please enable JavaScript.</p>
            <p>Alternatively, you can view our <a href="/legal/privacy" style={{ color: '#4CAF50', textDecoration: 'underline' }}>Privacy Policy</a> or contact us at info@talentvaults.com</p>
          </div>
        </div>
      </noscript>
    </>
  );
}