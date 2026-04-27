'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from './ToastProvider'
import { deleteAccount } from '@/app/settings/actions'

type SettingsPanelProps = {
  email: string
}

export function SettingsPanel({ email }: SettingsPanelProps) {
  const router = useRouter()
  const supabase = useState(() => createClient())[0]
  const { pushToast } = useToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const handlePasswordUpdate: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if (!currentPassword) {
      pushToast({ title: 'Current password required', description: 'Enter your old password first.', variant: 'error' })
      return
    }

    if (password.length < 8) {
      pushToast({ title: 'Password too short', description: 'Use at least 8 characters.', variant: 'error' })
      return
    }

    if (password !== confirmPassword) {
      pushToast({ title: 'Passwords do not match', variant: 'error' })
      return
    }

    setSaving(true)

    const { data: userData } = await supabase.auth.getUser()
    const userEmail = userData.user?.email

    if (!userEmail) {
      pushToast({ title: 'Could not verify account', description: 'Please sign in again.', variant: 'error' })
      setSaving(false)
      return
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: currentPassword,
    })

    if (loginError) {
      pushToast({ title: 'Current password incorrect', description: loginError.message, variant: 'error' })
      setSaving(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      pushToast({ title: 'Password update failed', description: error.message, variant: 'error' })
      setSaving(false)
      return
    }

    pushToast({ title: 'Password updated', description: 'Your credentials have been changed.', variant: 'success' })
    setCurrentPassword('')
    setPassword('')
    setConfirmPassword('')
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <section className="taskflow-card space-y-6 p-6 sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-600">Settings</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Account security</h1>
          <p className="mt-3 text-slate-600">Update your password, remove your account, or sign out.</p>
        </div>

        <div>
          <label className="taskflow-label" htmlFor="settings-email">
            Email
          </label>
          <input id="settings-email" className="taskflow-input" value={email} disabled />
        </div>

        <form className="grid gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-5" onSubmit={handlePasswordUpdate}>
          <div>
            <label className="taskflow-label" htmlFor="current-password">
              Current password
            </label>
            <input
              id="current-password"
              type="password"
              className="taskflow-input"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Enter your old password"
            />
            <div className="mt-2 flex justify-end">
              <Link href="/forgot-password" className="text-sm font-semibold text-green-600 hover:text-green-700">
                Forgot password?
              </Link>
            </div>
          </div>

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
            />
          </div>
          <div>
            <label className="taskflow-label" htmlFor="confirm-password">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type="password"
              className="taskflow-input"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button className="taskflow-button taskflow-button-primary" type="submit" disabled={saving}>
              {saving ? 'Updating...' : 'Change password'}
            </button>
          </div>
        </form>
      </section>

      <section className="taskflow-card space-y-4 p-6 sm:p-8">
        <h2 className="text-2xl font-black text-slate-950">Danger zone</h2>
        <p className="text-slate-600">
          Deleting your account removes your authentication record and profile data.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <form action={deleteAccount}>
            <button className="taskflow-button rounded-full border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-700 transition hover:bg-red-100" type="submit">
              Delete account
            </button>
          </form>

          <form action="/auth/signout" method="post">
            <button className="taskflow-button taskflow-button-secondary" type="submit">
              Logout
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}