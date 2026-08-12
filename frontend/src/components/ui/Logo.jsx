import React from 'react'

export default function Logo({ size = 'md', className = '' }) {
  const dimensions = {
    sm: { cls: 'h-10', px: 40 },
    md: { cls: 'h-16', px: 64 },
    lg: { cls: 'h-28', px: 112 },
    xl: { cls: 'h-48', px: 192 }
  }

  const dim = dimensions[size] || dimensions.md

  return (
    <div className={`relative flex items-center justify-center p-2 group ${className}`} style={{ perspective: '800px' }}>
      {/* Saturn Ring 1 - Vibrant Blue */}
      <div 
        className="absolute inset-[-14px] border-[2px] border-blue-500/50 rounded-[100%] transition-all duration-700 group-hover:scale-110"
        style={{ 
          transform: 'rotateX(65deg) rotateY(15deg)',
          animation: 'ring-spin 12s linear infinite, logo-fade-in 0.6s ease-out both'
        }}
      ></div>
      
      {/* Saturn Ring 2 - Vibrant Orange Accent */}
      <div 
        className="absolute inset-[-8px] border-[1.5px] border-orange-500/40 rounded-[100%]"
        style={{ 
          transform: 'rotateX(75deg) rotateY(-20deg)',
          animation: 'ring-spin-reverse 18s linear infinite, logo-fade-in 0.6s ease-out 0.1s both'
        }}
      ></div>

      <style>{`
        @keyframes ring-spin {
          from { transform: rotateX(65deg) rotateY(15deg) rotateZ(0deg); }
          to { transform: rotateX(65deg) rotateY(15deg) rotateZ(360deg); }
        }
        @keyframes ring-spin-reverse {
          from { transform: rotateX(75deg) rotateY(-20deg) rotateZ(360deg); }
          to { transform: rotateX(75deg) rotateY(-20deg) rotateZ(0deg); }
        }
        @keyframes logo-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Main Logo Container */}
      <div className="relative z-10 bg-white dark:bg-white rounded-full border-2 border-gray-100 dark:border-white/20 flex items-center justify-center overflow-hidden shadow-md">
        <img 
          src="/logo.png" 
          alt="MyTenant Logo" 
          width={dim.px}
          height={dim.px}
          className={`${dim.cls} object-contain transition-transform duration-500 group-hover:scale-105`}
        />
      </div>
    </div>
  )
}
