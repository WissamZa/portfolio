'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    // Only track once per session logic by storing a flag in sessionStorage
    const isDev = window.location.hostname === 'localhost';
    const hasTracked = sessionStorage.getItem('hasTrackedVisitor');
    
    if (!hasTracked || isDev) {
      console.log('Tracking visitor...');
      fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: window.location.pathname,
          referrer: document.referrer || 'Direct',
        }),
      }).then((res) => {
        if (!res.ok) throw new Error('Status ' + res.status);
        console.log('Visitor tracked successfully');
        sessionStorage.setItem('hasTrackedVisitor', 'true');
      }).catch(err => {
        console.error('Visitor tracking failed:', err);
      });
    }
  }, []);

  return null;
}
