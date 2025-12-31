// app/components/ScriptBlockingComponent.tsx - WITH IMMEDIATE UNBLOCKING
'use client';

import { useEffect } from 'react';

// Consistent consent checking function (matches CookieConsentClient)
const hasValidConsent = (): boolean => {
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

// Check if user has rejected (for logging purposes)
const hasRejectionCookie = (): boolean => {
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
    // Function to unblock scripts after consent
    const unblockScripts = () => {
      if (!hasValidConsent()) {
        console.log('⚠️ Scripts remain blocked - user has not consented');
        return;
      }

      // Find all blocked scripts
      const blockedScripts = document.querySelectorAll(
        'script[data-cookieconsent][type="text/plain"]'
      );

      blockedScripts.forEach(script => {
        const consentCategory = script.getAttribute('data-cookieconsent');
        const originalSrc = script.getAttribute('data-src');
        const scriptName = script.getAttribute('data-name');

        // Only unblock "necessary" category scripts
        if (consentCategory === 'necessary' && originalSrc) {
          console.log(`✅ Unblocking script: ${scriptName || originalSrc}`);

          const newScript = document.createElement('script');
          newScript.src = originalSrc;

          // Copy all attributes except the blocking ones
          Array.from(script.attributes).forEach(attr => {
            if (
              ![
                'type',
                'data-cookieconsent',
                'data-src',
                'data-name'
              ].includes(attr.name)
            ) {
              newScript.setAttribute(attr.name, attr.value);
            }
          });

          script.parentNode?.insertBefore(newScript, script);
          script.remove();
        }
      });
    };

    // Check if consent has already been given
    const checkConsent = () => {
      const hasConsent = hasValidConsent();
      const hasRejected = hasRejectionCookie();
      
      if (hasConsent) {
        console.log('✅ User has valid consent - unblocking scripts');
        unblockScripts();
      } else if (hasRejected) {
        console.log('❌ User rejected - scripts remain blocked');
      } else {
        console.log('⏳ User has not decided - scripts remain blocked');
      }
    };

    // Run initial check
    checkConsent();

    // Listen for consent changes
    const handleConsentChange = () => {
      console.log('🔄 Consent change detected - checking scripts');
      checkConsent();
    };

    // FIX: Listen for custom acceptance event for immediate unblocking
    window.addEventListener('cookie-consent-accepted', handleConsentChange);
    
    // Listen for library events
    window.addEventListener('cc:onConsent', handleConsentChange);
    window.addEventListener('cc:onChange', handleConsentChange);
    
    // Listen for rejection events
    const handleRejectChange = () => {
      console.log('🔄 Rejection detected - scripts remain blocked');
      checkConsent();
    };
    
    window.addEventListener('cc:onReject', handleRejectChange);
    window.addEventListener('cookie-consent-rejected', handleRejectChange);

    return () => {
      window.removeEventListener('cookie-consent-accepted', handleConsentChange);
      window.removeEventListener('cc:onConsent', handleConsentChange);
      window.removeEventListener('cc:onChange', handleConsentChange);
      window.removeEventListener('cc:onReject', handleRejectChange);
      window.removeEventListener('cookie-consent-rejected', handleRejectChange);
    };
  }, []);

  return null;
}