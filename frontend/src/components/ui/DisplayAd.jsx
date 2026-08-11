import React, { useEffect, useRef } from 'react'

export default function DisplayAd({ slot = 'auto', className = '' }) {
  const adRef = useRef(null)

  useEffect(() => {
    // In a React SPA, the page doesn't reload, so AdSense needs to be triggered manually for new components
    try {
      if (adRef.current && !adRef.current.querySelector('iframe')) {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className={`w-full overflow-hidden flex justify-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '90px' }}
        data-ad-client="ca-pub-6677915215363701"
        data-ad-slot={slot !== 'auto' ? slot : undefined}
        data-ad-format={slot === 'auto' ? 'auto' : undefined}
        data-full-width-responsive="true"
        ref={adRef}
      />
    </div>
  )
}
