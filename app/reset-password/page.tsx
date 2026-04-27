'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ToastProvider'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = useState(() => createClient())[0]
  const { pushToast } = useToast()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if (password.length < 8) {
      pushToast({ title: 'Password too short', description: 'Use at least 8 characters.', variant: 'error' })
      return
    }

    if (password !== confirmPassword) {
      pushToast({ title: 'Passwords do not match', variant: 'error' })
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      pushToast({ title: 'Password update failed', description: error.message, variant: 'error' })
      setLoading(false)
      return
    }

    pushToast({ title: 'Password updated', description: 'You can now log in with your new password.', variant: 'success' })
    router.push('/login')
  }

  return (
    <main className="taskflow-shell flex min-h-[calc(100vh-5rem)] items-center justify-center py-12">
      <div className="taskflow-card w-full max-w-lg p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-600">Recovery</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Choose a new password</h1>
        <p className="mt-3 text-slate-600">Use the recovery session from your email link to set a new password.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="taskflow-label" htmlFor="new-password">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              className="taskflow-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className="taskflow-label" htmlFor="confirm-new-password">
              Confirm password
            </label>
            <input
              id="confirm-new-password"
              type="password"
              className="taskflow-input"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat your new password"
            />
          </div>

          <button className="taskflow-button taskflow-button-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </main>
  )
}