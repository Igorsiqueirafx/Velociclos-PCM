'use client'

import type { ReactNode } from 'react'

interface AppleCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  style?: React.CSSProperties
}

export default function AppleCard({ children, className = '', hover = true, onClick, style }: AppleCardProps) {
  const base = 'bg-[#1e1e1e] border border-[#3a3a3c] rounded-2xl transition-all duration-300'
  const hoverClasses = hover
    ? 'hover:border-white/10 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1'
    : ''
  const interactive = onClick ? 'cursor-pointer' : ''

  return (
    <div className={`${base} ${hoverClasses} ${interactive} ${className}`} onClick={onClick} style={style}>
      {children}
    </div>
  )
}
