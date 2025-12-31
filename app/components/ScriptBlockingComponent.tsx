// app/components/ScriptBlockingComponent.tsx - FIXED VERSION
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

// Fallback functions in case inline script didn't load
const fallbackHasValidConsent = (): boolean => {
  try {
    const cvCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('cv_cookie='));
    if (!cvCookie) return false;

    const cookieData = JSON.parse(decodeURIComponent(cvCookie.split('=')[1]));

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
  } catch (error) {
    console.error('Error checking cookie consent:', error);
    return false;
  }
};

// Fallback check if user has rejected
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
    
    // Function to unblock all scripts (inline-blocked + cookieconsent-blocked)
    const unblockAllScripts = () => {
      if (!utils.hasValidConsent()) {
        console.log('⚠️ Scripts remain blocked - user has not consented');
        return;
      }

      console.log('✅ User has valid consent - unblocking all scripts');
      
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
      
      if (hasConsent && !hasRejected) {
        console.log('✅ Initial check: User has valid consent');
        // Small delay to ensure inline script is ready
        setTimeout(unblockAllScripts, 50);
      } else if (hasRejected) {
        console.log('❌ Initial check: User rejected - scripts remain blocked');
      } else {
        console.log('⏳ Initial check: User has not decided - scripts remain blocked');
      }
    };
    
    // 🟢 FIXED: Listen for consent acceptance with validation
    const handleConsentAccepted = () => {
      console.log('🔄 Consent acceptance handler triggered');
      
      // Validate before acting
      setTimeout(() => {
        const hasConsent = utils.hasValidConsent();
        const hasRejected = utils.hasRejectionCookie();
        
        if (hasConsent && !hasRejected) {
          console.log('✅ Validation passed - unblocking scripts');
          unblockAllScripts();
        } else {
          console.log(`❓ Validation failed: hasConsent=${hasConsent}, hasRejected=${hasRejected}`);
        }
      }, 50);
    };
    
    // Listen for consent rejection
    const handleConsentRejected = () => {
      console.log('🔄 Consent rejection event received - ensuring scripts remain blocked');
      // Double-check that scripts are blocked
      const hasRejected = utils.hasRejectionCookie();
      if (hasRejected) {
        console.log('✅ Confirmed: User rejected - all scripts blocked');
      }
    };
    
    // 🟢 FIXED: Safe wrapper for library events with validation
    const validateAndHandleLibraryConsent = () => {
      console.log('🔄 Library consent event received');
      
      // Wait 100ms for state to settle, then validate
      setTimeout(() => {
        const hasConsent = utils.hasValidConsent();
        const hasRejected = utils.hasRejectionCookie();
        
        console.log(`📊 Event validation: hasConsent=${hasConsent}, hasRejected=${hasRejected}`);
        
        if (hasConsent && !hasRejected) {
          console.log('✅ Valid consent confirmed - unblocking scripts');
          handleConsentAccepted();
        } else if (hasRejected) {
          console.log('🛑 Event ignored - user has rejected');
        } else {
          console.log('⚠️ Event received but state unclear - not unblocking');
        }
      }, 100);
    };
    
    // 🟢 FIXED: Safe wrapper for library change events
    const validateAndHandleLibraryChange = (e: any) => {
      console.log('🔄 Library change event:', e);
      
      setTimeout(() => {
        const hasConsent = utils.hasValidConsent();
        const hasRejected = utils.hasRejectionCookie();
        
        if (hasConsent && !hasRejected) {
          console.log('✅ Change resulted in valid consent');
          handleConsentAccepted();
        } else if (hasRejected) {
          console.log('🛑 Change resulted in rejection');
        } else {
          console.log('⚠️ Change event - state unclear');
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
    
    // 🟢 FIXED: Listen for library events but VALIDATE before acting
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