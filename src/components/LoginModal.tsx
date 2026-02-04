'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { login } from '@/actions/auth'

export function LoginModal() {
  const { isLoginModalOpen, hideLoginModal, setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isLoginModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email)
    
    if (result.success) {
      // Reload to get the user from the server
      window.location.reload()
    } else {
      setError(result.error || 'Login failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#484848]">Log in</h2>
          <button
            onClick={hideLoginModal}
            className="text-[#767676] hover:text-[#484848]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-[#767676] mb-4">
          Enter your email to log in. Try: alice@example.com, bob@example.com, or carol@example.com
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 border border-[#EBEBEB] rounded-lg mb-3 focus:outline-none focus:border-[#484848]"
            required
          />
          
          {error && (
            <p className="text-[#C13515] text-sm mb-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FF5A5F] text-white py-3 rounded-lg font-medium hover:bg-[#FF5A5F]/90 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
