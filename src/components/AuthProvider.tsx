'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User } from '@/db/schema'

type AuthContextType = {
  user: User | null
  setUser: (user: User | null) => void
  showLoginModal: () => void
  hideLoginModal: () => void
  isLoginModalOpen: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children, initialUser }: { children: ReactNode; initialUser: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const showLoginModal = () => setIsLoginModalOpen(true)
  const hideLoginModal = () => setIsLoginModalOpen(false)

  return (
    <AuthContext.Provider value={{ user, setUser, showLoginModal, hideLoginModal, isLoginModalOpen }}>
      {children}
    </AuthContext.Provider>
  )
}
