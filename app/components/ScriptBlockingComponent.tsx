'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    _cookieUtils?: {
      hasValidConsent: () => boolean;
      hasRejectionCookie: () => boolean;
      unblockScripts: () => void;
    };
  }
}

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

// CRITICAL FIX: Only accept cookies with explicitAcceptance flag
const fallbackHasValidConsent = (): boolean => {
  if (fallbackHasRejectionCookie()) {
    return false;
  }
  
  try {
    const cvCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('cv_cookie='));
    if (!cvCookie) return false;

    const cookieData = JSON.parse(decodeURIComponent(cvCookie.split('=')[1]));

    // NEW: Only accept if explicitAcceptance flag is present
    if (cookieData && cookieData.explicitAcceptance === true) {
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
    const utils = window._cookieUtils || {
      hasValidConsent: fallbackHasValidConsent,
      hasRejectionCookie: fallbackHasRejectionCookie,
      unblockScripts: () => {
        console.log('⚠️ No unblock function available - using fallback');
        const blockedScripts = document.querySelectorAll(
          'script[data-cookieconsent][type="text/plain"]'
        );
        
        blockedScripts.forEach(script => {
          const consentCategory = script.getAttribute('data-cookieconsent');
          const originalSrc = script.getAttribute('data-src');
          
          if (consentCategory === 'necessary' && originalSrc) {
            const newScript = document.createElement('script');
            newScript.src = originalSrc;
            
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
    
    const shouldUnblockScripts = (): boolean => {
      if (utils.hasRejectionCookie()) {
        return false;
      }
      
      return utils.hasValidConsent();
    };
    
    const unblockAllScripts = () => {
      if (!shouldUnblockScripts()) {
        console.log('⚠️ Scripts remain blocked - user rejected or no explicit consent');
        return;
      }

      console.log('✅ User has valid explicit consent - unblocking all scripts');
      
      if (utils.unblockScripts) {
        utils.unblockScripts();
      }
      
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
          
          Array.from(script.attributes).forEach(attr => {
            if (!['type', 'data-cookieconsent', 'data-src', 'data-name'].includes(attr.name)) {
              newScript.setAttribute(attr.name, attr.value);
            }
          });
          
          script.parentNode?.insertBefore(newScript, script);
          script.remove();
        }
      });
      
      window.dispatchEvent(new CustomEvent('scripts-unblocked'));
    };
    
    const checkInitialConsent = () => {
      const hasConsent = utils.hasValidConsent();
      const hasRejected = utils.hasRejectionCookie();
      
      if (hasRejected) {
        console.log('❌ Initial check: User rejected - scripts remain blocked');
        document.body.setAttribute('data-cookie-consent', 'rejected');
      } else if (hasConsent) {
        console.log('✅ Initial check: User has valid explicit consent');
        setTimeout(unblockAllScripts, 50);
      } else {
        console.log('⏳ Initial check: User has not decided - scripts remain blocked');
        document.body.setAttribute('data-cookie-consent', 'undecided');
      }
    };
    
    const handleConsentAccepted = () => {
      console.log('🔄 Consent acceptance handler triggered');
      
      setTimeout(() => {
        const hasConsent = utils.hasValidConsent();
        const hasRejected = utils.hasRejectionCookie();
        
        if (hasRejected) {
          console.log('🛑 Cannot accept - user already rejected');
          return;
        }
        
        if (hasConsent) {
          console.log('✅ Validation passed - unblocking scripts');
          unblockAllScripts();
        } else {
          console.log('⚠️ Validation failed - no explicit consent flag');
        }
      }, 50);
    };
    
    const handleConsentRejected = () => {
      console.log('🔄 Consent rejection event received - ensuring scripts remain blocked');
      const hasRejected = utils.hasRejectionCookie();
      if (hasRejected) {
        console.log('✅ Confirmed: User rejected - all scripts blocked');
        document.body.setAttribute('data-cookie-consent', 'rejected');
      }
    };
    
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
          console.log('✅ Valid explicit consent confirmed - unblocking scripts');
          handleConsentAccepted();
        } else {
          console.log('⚠️ Event received but no explicit consent flag');
        }
      }, 100);
    };
    
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
          console.log('✅ Change resulted in valid explicit consent');
          handleConsentAccepted();
        } else {
          console.log('⚠️ Change event - no explicit consent flag');
        }
      }, 100);
    };
    
    checkInitialConsent();
    
    window.addEventListener('cookie-consent-accepted', handleConsentAccepted);
    window.addEventListener('cookie-consent-rejected', handleConsentRejected);
    window.addEventListener('cc:onConsent', validateAndHandleLibraryConsent);
    window.addEventListener('cc:onChange', validateAndHandleLibraryChange);
    window.addEventListener('cc:onReject', handleConsentRejected);
    
    return () => {
      window.removeEventListener('cookie-consent-accepted', handleConsentAccepted);
      window.removeEventListener('cookie-consent-rejected', handleConsentRejected);
      window.removeEventListener('cc:onConsent', validateAndHandleLibraryConsent);
      window.removeEventListener('cc:onChange', validateAndHandleLibraryChange);
      window.removeEventListener('cc:onReject', handleConsentRejected);
    };
  }, []);
  
  return null;
}