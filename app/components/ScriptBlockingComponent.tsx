'use client';

import { useEffect } from 'react';

// Declare global utility functions from inline script
declare global {
  interface Window {
    _cookieUtils?: {
      hasValidConsent: () => boolean;
      hasRejectionCookie: () => boolean;
      unblockScripts: () => void;
    };
  }
}

// CRITICAL FIX: Check rejection FIRST before checking acceptance
const fallbackHasRejectionCookie = (): boolean => {
  try {
    const rejectionCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('cv_rejection='));
    return !!rejectionCookie;
  } catch {
    return false;
  }
};

// UPDATED: Fallback function to check for valid consent - now checks for fullAcceptance flag
const fallbackHasValidConsent = (): boolean => {
  // CRITICAL: If rejection exists, NEVER return true for consent
  if (fallbackHasRejectionCookie()) {
    return false;
  }
  
  try {
    const cvCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('cv_cookie='));
    if (!cvCookie) return false;

    const cookieData = JSON.parse(decodeURIComponent(cvCookie.split('=')[1]));

    // UPDATED: Check for fullAcceptance flag (set when user clicks "Accept all")
    if (cookieData && cookieData.fullAcceptance === true) {
      return true;
    }

    // OLD LOGIC (for backward compatibility): Check for old structure
    if (cookieData && cookieData.categories) {
      if (typeof cookieData.categories === 'object' && cookieData.categories.necessary === true) {
        // This could be either "Accept all" (with fullAcceptance) or "Reject all" (without fullAcceptance)
        // Since we don't have fullAcceptance flag, be conservative and return false
        return false;
      }
      // Check for old array format
      if (Array.isArray(cookieData.categories) && cookieData.categories.includes('necessary')) {
        // This is the library's "accept necessary only" format (which we treat as rejection)
        return false;
      }
    }

    // Check for very old format or fallback
    if (cookieData && cookieData.consent === true) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking cookie consent:', error);
    return false;
  }
};

export default function ScriptBlockingComponent() {
  useEffect(() => {
    // Use global functions or fallbacks
    const utils = window._cookieUtils || {
      hasValidConsent: fallbackHasValidConsent,
      hasRejectionCookie: fallbackHasRejectionCookie,
      unblockScripts: () => {
        console.log('⚠️ No unblock function available - using fallback');
        // Fallback: unblock cookieconsent-blocked scripts
        const blockedScripts = document.querySelectorAll(
          'script[data-cookieconsent][type="text/plain"]'
        );
        
        blockedScripts.forEach(script => {
          const consentCategory = script.getAttribute('data-cookieconsent');
          const originalSrc = script.getAttribute('data-src');
          
          if (consentCategory === 'necessary' && originalSrc) {
            const newScript = document.createElement('script');
            newScript.src = originalSrc;
            
            // Copy all attributes except blocking ones
            Array.from(script.attributes).forEach(attr => {
              if (!['type', 'data-cookieconsent', 'data-src', 'data-name'].includes(attr.name)) {
                newScript.setAttribute(attr.name, attr.value);
              }
            });
            
            script.parentNode?.insertBefore(newScript, script);
            script.remove();
          }
        });
      }
    };
    
    // CRITICAL FIX: Always check rejection first
    const shouldUnblockScripts = (): boolean => {
      // If user rejected, NEVER unblock
      if (utils.hasRejectionCookie()) {
        return false;
      }
      
      // Only unblock if user accepted with fullAcceptance flag
      return utils.hasValidConsent();
    };
    
    // Function to unblock all scripts (inline-blocked + cookieconsent-blocked)
    const unblockAllScripts = () => {
      if (!shouldUnblockScripts()) {
        console.log('⚠️ Scripts remain blocked - user rejected or no consent');
        return;
      }

      console.log('✅ User has valid consent (fullAcceptance) - unblocking all scripts');
      
      // 1. Unblock scripts blocked by inline script (highest priority)
      if (utils.unblockScripts) {
        utils.unblockScripts();
      }
      
      // 2. Also unblock scripts blocked by cookieconsent library
      const cookieconsentBlockedScripts = document.querySelectorAll(
        'script[data-cookieconsent][type="text/plain"]'
      );
      
      cookieconsentBlockedScripts.forEach(script => {
        const consentCategory = script.getAttribute('data-cookieconsent');
        const originalSrc = script.getAttribute('data-src');
        
        if (consentCategory === 'necessary' && originalSrc) {
          console.log(`✅ Unblocking cookieconsent script: ${originalSrc}`);
          
          const newScript = document.createElement('script');
          newScript.src = originalSrc;
          
          // Copy all attributes except blocking ones
          Array.from(script.attributes).forEach(attr => {
            if (!['type', 'data-cookieconsent', 'data-src', 'data-name'].includes(attr.name)) {
              newScript.setAttribute(attr.name, attr.value);
            }
          });
          
          script.parentNode?.insertBefore(newScript, script);
          script.remove();
        }
      });
      
      // 3. Dispatch event for any other components that need to know
      window.dispatchEvent(new CustomEvent('scripts-unblocked'));
    };
    
    // Check initial consent state
    const checkInitialConsent = () => {
      const hasConsent = utils.hasValidConsent();
      const hasRejected = utils.hasRejectionCookie();
      
      console.log(`📊 Initial check: hasConsent=${hasConsent}, hasRejected=${hasRejected}`);
      
      if (hasRejected) {
        console.log('❌ Initial check: User rejected - scripts remain blocked');
        document.body.setAttribute('data-cookie-consent', 'rejected');
      } else if (hasConsent) {
        console.log('✅ Initial check: User has valid consent (fullAcceptance)');
        // Small delay to ensure inline script is ready
        setTimeout(unblockAllScripts, 50);
      } else {
        console.log('⏳ Initial check: User has not decided OR only accepted necessary (no fullAcceptance) - scripts remain blocked');
        document.body.setAttribute('data-cookie-consent', 'undecided');
      }
    };
    
    // Listen for consent acceptance
    const handleConsentAccepted = () => {
      console.log('🔄 Consent acceptance handler triggered');
      
      // Validate before acting
      setTimeout(() => {
        const hasConsent = utils.hasValidConsent();
        const hasRejected = utils.hasRejectionCookie();
        
        console.log(`📊 Validation: hasConsent=${hasConsent}, hasRejected=${hasRejected}`);
        
        if (hasRejected) {
          console.log('🛑 Cannot accept - user already rejected');
          return;
        }
        
        if (hasConsent) {
          console.log('✅ Validation passed - user has fullAcceptance, unblocking scripts');
          unblockAllScripts();
        } else {
          console.log('⚠️ Validation failed - no valid consent (missing fullAcceptance flag)');
        }
      }, 50);
    };
    
    // Listen for consent rejection
    const handleConsentRejected = () => {
      console.log('🔄 Consent rejection event received - ensuring scripts remain blocked');
      const hasRejected = utils.hasRejectionCookie();
      if (hasRejected) {
        console.log('✅ Confirmed: User rejected - all scripts blocked');
        document.body.setAttribute('data-cookie-consent', 'rejected');
      }
    };
    
    // Safe wrapper for library events with validation
    const validateAndHandleLibraryConsent = () => {
      console.log('🔄 Library consent event received');
      
      setTimeout(() => {
        const hasConsent = utils.hasValidConsent();
        const hasRejected = utils.hasRejectionCookie();
        
        console.log(`📊 Event validation: hasConsent=${hasConsent}, hasRejected=${hasRejected}`);
        
        if (hasRejected) {
          console.log('🛑 Event ignored - user has rejected');
          return;
        }
        
        if (hasConsent) {
          console.log('✅ Valid consent confirmed (fullAcceptance) - unblocking scripts');
          handleConsentAccepted();
        } else {
          console.log('⚠️ Event received but no valid consent (missing fullAcceptance flag)');
        }
      }, 100);
    };
    
    // Safe wrapper for library change events
    const validateAndHandleLibraryChange = (e: any) => {
      console.log('🔄 Library change event:', e);
      
      setTimeout(() => {
        const hasConsent = utils.hasValidConsent();
        const hasRejected = utils.hasRejectionCookie();
        
        if (hasRejected) {
          console.log('🛑 Change ignored - user rejected');
          return;
        }
        
        if (hasConsent) {
          console.log('✅ Change resulted in valid consent (fullAcceptance)');
          handleConsentAccepted();
        } else {
          console.log('⚠️ Change event - no valid consent (missing fullAcceptance flag)');
        }
      }, 100);
    };
    
    // Initial check
    checkInitialConsent();
    
    // ====================
    // SAFE EVENT LISTENERS
    // ====================
    
    // Listen for OUR custom events (trust these)
    window.addEventListener('cookie-consent-accepted', handleConsentAccepted);
    window.addEventListener('cookie-consent-rejected', handleConsentRejected);
    
    // Listen for library events but VALIDATE before acting
    window.addEventListener('cc:onConsent', validateAndHandleLibraryConsent);
    window.addEventListener('cc:onChange', validateAndHandleLibraryChange);
    window.addEventListener('cc:onReject', handleConsentRejected);
    
    // Cleanup function
    return () => {
      window.removeEventListener('cookie-consent-accepted', handleConsentAccepted);
      window.removeEventListener('cookie-consent-rejected', handleConsentRejected);
      window.removeEventListener('cc:onConsent', validateAndHandleLibraryConsent);
      window.removeEventListener('cc:onChange', validateAndHandleLibraryChange);
      window.removeEventListener('cc:onReject', handleConsentRejected);
    };
  }, []);
  
  // This component doesn't render anything
  return null;
}