'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type Toast = {
  id: string
  message: string
  onUndo?: () => void
}

type ToastContextType = {
  showToast: (message: string, onUndo?: () => void) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, onUndo?: () => void) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, onUndo }])
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-[#484848] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up"
          >
            <span>{toast.message}</span>
            {toast.onUndo && (
              <button
                onClick={() => {
                  toast.onUndo?.()
                  hideToast(toast.id)
                }}
                className="text-[#FF5A5F] font-medium hover:underline"
              >
                Undo
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
