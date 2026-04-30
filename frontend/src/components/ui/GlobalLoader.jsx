export default function GlobalLoader() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0f172a' }}>
      <style>{`
        @keyframes ld-shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        .ld-pulse{position:relative;overflow:hidden;border-radius:8px;background:#1e293b}
        .ld-pulse::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent);animation:ld-shimmer 1.5s infinite}
        @media(max-width:1023px){.ld-hide-mobile{display:none!important}}
      `}</style>
      {/* Left branding skeleton */}
      <div style={{ width: '40%', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="ld-hide-mobile">
        <div className="ld-pulse" style={{ width: '64px', height: '64px', borderRadius: '50%' }}></div>
        <div>
          <div className="ld-pulse" style={{ height: '40px', width: '80%', marginBottom: '16px' }}></div>
          <div className="ld-pulse" style={{ height: '40px', width: '60%', marginBottom: '16px' }}></div>
          <div className="ld-pulse" style={{ height: '20px', width: '70%', marginBottom: '32px' }}></div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="ld-pulse" style={{ height: '48px', width: '140px', borderRadius: '12px' }}></div>
            <div className="ld-pulse" style={{ height: '48px', width: '160px', borderRadius: '12px' }}></div>
          </div>
        </div>
        <div className="ld-pulse" style={{ height: '14px', width: '50%' }}></div>
      </div>
      {/* Right carousel skeleton */}
      <div style={{ flex: 1, background: '#f8fafc', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="ld-pulse" style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#e2e8f0' }}></div>
          <div className="ld-pulse" style={{ height: '20px', width: '100px', background: '#e2e8f0' }}></div>
        </div>
        <div className="ld-pulse" style={{ flex: 1, borderRadius: '16px', background: '#e2e8f0' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div className="ld-pulse" style={{ width: '32px', height: '8px', borderRadius: '4px', background: '#cbd5e1' }}></div>
            <div className="ld-pulse" style={{ width: '8px', height: '8px', borderRadius: '4px', background: '#cbd5e1' }}></div>
            <div className="ld-pulse" style={{ width: '8px', height: '8px', borderRadius: '4px', background: '#cbd5e1' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="ld-pulse" style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#e2e8f0' }}></div>
            <div className="ld-pulse" style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#e2e8f0' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
