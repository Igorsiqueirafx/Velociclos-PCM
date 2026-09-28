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
  const base = 'bg-surface border border-border rounded-xl transition-all duration-300 ease-apple--smooth'
  const hoverClasses = hover
    ? 'hover:border-white/20 hover:shadow-lg hover:shadow-black/30 hover:-translate-y-1'
    : ''
  const interactive = onClick ? 'cursor-pointer' : ''

  return (
    <div className={`${base} ${hoverClasses} ${interactive} ${className}`} onClick={onClick} style={style}>
      {children}
    </div>
  )
}
