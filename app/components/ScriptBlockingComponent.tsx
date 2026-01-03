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

// ==========================================
// LOCAL HELPERS (Fallbacks & Consistency)
// ==========================================

// 1. Check for Rejection (Highest Priority)
const getRejectionStatus = (): boolean => {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some(row => row.startsWith('cv_rejection='));
};

// 2. Check for Valid Consent (Strict)
const getConsentStatus = (): boolean => {
  if (typeof document === 'undefined') return false;

  // CRITICAL: If rejection exists, strict blocking applies immediately.
  if (getRejectionStatus()) {
    return false;
  }

  try {
    const cvCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('cv_cookie='));

    if (!cvCookie) return false;

    // We must decode URI components to safely parse JSON (e.g. %7B -> {)
    const cookieValue = decodeURIComponent(cvCookie.split('=')[1]);
    const cookieData = JSON.parse(cookieValue);

    // STRICT: Only accept if the fullAcceptance flag is explicitly true
    return !!(cookieData && cookieData.fullAcceptance === true);
  } catch (error) {
    // If parsing fails, assume no consent
    return false;
  }
};

export default function ScriptBlockingComponent() {
  useEffect(() => {
    // ==========================================
    // 1. SETUP UTILITIES
    // ==========================================
    // Prefer global utils from Head script (to share state), fallback to local if needed
    const utils = window._cookieUtils || {
      hasValidConsent: getConsentStatus,
      hasRejectionCookie: getRejectionStatus,
      unblockScripts: () => {
        console.log('⚠️ Global utils missing - using local unblock fallback');
        
        // Find all scripts blocked by CookieConsent
        const blockedScripts = document.querySelectorAll(
          'script[data-cookieconsent="necessary"][type="text/plain"]'
        );

        blockedScripts.forEach(script => {
          const originalSrc = script.getAttribute('data-src');
          if (originalSrc) {
            // Re-create script element to trigger browser execution
            const newScript = document.createElement('script');
            newScript.src = originalSrc;
            
            // Copy attributes (async, defer, id, etc), skipping internal blocking attrs
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

    // ==========================================
    // 2. CORE LOGIC
    // ==========================================
    
    // The "Single Source of Truth" check
    const performStrictAudit = () => {
      const isRejected = utils.hasRejectionCookie();
      const hasConsent = utils.hasValidConsent(); // This internal check handles precedence too

      console.log(`🛡️ Audit: Rejected=${isRejected}, Accepted=${hasConsent}`);

      if (isRejected) {
        // 1. User Rejected
        console.log('❌ Blocking enforced: User rejected.');
        document.body.setAttribute('data-cookie-consent', 'rejected');
        // We do not unblock anything.
        return; 
      }

      if (hasConsent) {
        // 2. User Accepted (Strict)
        console.log('✅ Consent valid: Unblocking scripts.');
        document.body.setAttribute('data-cookie-consent', 'accepted');
        
        // Trigger unblock
        if (utils.unblockScripts) {
          utils.unblockScripts();
        }
        
        // Notify other components
        window.dispatchEvent(new CustomEvent('scripts-unblocked'));
      } else {
        // 3. Undecided / Partial
        console.log('⏳ Undecided: Scripts remain blocked.');
        document.body.setAttribute('data-cookie-consent', 'undecided');
      }
    };

    // ==========================================
    // 3. EVENT LISTENERS
    // ==========================================

    // Delay slighty to ensure cookie has been written to disk
    const handleEvent = () => setTimeout(performStrictAudit, 100);

    // Listen for our custom events
    window.addEventListener('cookie-consent-accepted', handleEvent);
    window.addEventListener('cookie-consent-rejected', handleEvent);

    // Listen for library events (External triggers)
    window.addEventListener('cc:onConsent', handleEvent);
    window.addEventListener('cc:onChange', handleEvent);
    window.addEventListener('cc:onReject', handleEvent);

    // Run immediately on mount to catch up if Head script finished early
    performStrictAudit();

    // Cleanup
    return () => {
      window.removeEventListener('cookie-consent-accepted', handleEvent);
      window.removeEventListener('cookie-consent-rejected', handleEvent);
      window.removeEventListener('cc:onConsent', handleEvent);
      window.removeEventListener('cc:onChange', handleEvent);
      window.removeEventListener('cc:onReject', handleEvent);
    };
  }, []);

  // Visual component only - renders nothing
  return null;
}