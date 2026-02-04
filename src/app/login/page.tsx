'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  async function handleLogin(formData: FormData) {
    const email = formData.get('email') as string
    
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      window.location.href = redirect
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-[#484848] mb-8">Log in to OfferBnb</h1>
      
      <form action={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#484848] mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue="guest@example.com"
            className="w-full px-4 py-3 border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-[#FF5A5F] text-white py-3 rounded-lg font-semibold hover:bg-[#E04E52] transition-colors"
        >
          Continue
        </button>
      </form>
      
      <p className="mt-4 text-sm text-[#767676] text-center">
        Demo: Use guest@example.com to log in
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-16">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
