'use client'

import { ReactNode } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

type SubmitButtonProps = {
  children: ReactNode
  isPending: boolean
  disabled?: boolean
  className?: string
  type?: 'submit' | 'button'
  onClick?: () => void
}

export function SubmitButton({
  children,
  isPending,
  disabled = false,
  className = '',
  type = 'submit',
  onClick,
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      disabled={isPending || disabled}
      onClick={onClick}
      className={`relative flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {isPending && <LoadingSpinner size="sm" className="absolute left-4" />}
      <span className={isPending ? 'opacity-0' : ''}>{children}</span>
      {isPending && <span>Processing...</span>}
    </button>
  )
}
