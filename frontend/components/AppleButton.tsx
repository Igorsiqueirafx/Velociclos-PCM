'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'

interface AppleButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
}

export default function AppleButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}: AppleButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2 focus:ring-offset-[#121212] disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-[#0071e3] text-white hover:bg-[#0062cc] active:scale-[0.98] shadow-lg shadow-[#0071e3]/20',
    secondary:
      'bg-white/5 text-white border border-white/10 hover:bg-white/10 active:scale-[0.98]',
    ghost:
      'bg-transparent text-[#b0b0b0] hover:text-white hover:bg-white/5 active:scale-[0.98]',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const content = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </>
  )

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {content}
    </button>
  )
}
