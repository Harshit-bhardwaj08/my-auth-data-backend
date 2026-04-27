'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type ToastVariant = 'success' | 'error' | 'info'

type Toast = {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

type ToastInput = Omit<Toast, 'id'>

type ToastContextValue = {
  pushToast: (toast: ToastInput) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (toast: ToastInput) => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { ...toast, id }])

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id))
    }, 4000)
  }

  const value = useMemo(() => ({ pushToast }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'rounded-2xl border px-4 py-3 shadow-lg backdrop-blur',
              toast.variant === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-950',
              toast.variant === 'error' && 'border-red-200 bg-red-50 text-red-950',
              toast.variant === 'info' && 'border-slate-200 bg-white text-slate-950'
            )}
          >
            <p className="font-semibold">{toast.title}</p>
            {toast.description ? (
              <p className="mt-1 text-sm leading-6 opacity-90">{toast.description}</p>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider')
  }

  return context
}