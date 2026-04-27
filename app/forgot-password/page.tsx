'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ToastProvider'

export default function ForgotPasswordPage() {
  const supabase = useState(() => createClient())[0]
  const { pushToast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if (!email.trim()) {
      pushToast({ title: 'Email required', variant: 'error' })
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      pushToast({ title: 'Reset email failed', description: error.message, variant: 'error' })
      setLoading(false)
      return
    }

    pushToast({
      title: 'Reset link sent',
      description: 'Check your inbox for the password recovery link.',
      variant: 'success',
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <main className="taskflow-shell flex min-h-[calc(100vh-5rem)] items-center justify-center py-12">
      <div className="taskflow-card w-full max-w-lg p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-600">Recovery</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Reset your password</h1>
        <p className="mt-3 text-slate-600">
          {sent ? 'We have sent a recovery link to your email. Use it to set a new password.' : 'Enter your email and we will send a recovery link.'}
        </p>

        {!sent ? (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="taskflow-label" htmlFor="recovery-email">
                Email address
              </label>
              <input
                id="recovery-email"
                type="email"
                className="taskflow-input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <button className="taskflow-button taskflow-button-primary w-full" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        ) : null}
      </div>
    </main>
  )
}