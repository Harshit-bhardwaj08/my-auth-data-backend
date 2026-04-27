'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'
import { useToast } from './ToastProvider'

type ProfileFormProps = {
  userId: string
  email: string
  initialFullName: string
  initialProfile: Profile | null
}

export function ProfileForm({ userId, email, initialFullName, initialProfile }: ProfileFormProps) {
  const router = useRouter()
  const supabase = useState(() => createClient())[0]
  const { pushToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    full_name: initialProfile?.full_name ?? initialFullName ?? '',
    bio: initialProfile?.bio ?? '',
    website: initialProfile?.website ?? '',
  })

  useEffect(() => {
    setProfile({
      full_name: initialProfile?.full_name ?? initialFullName ?? '',
      bio: initialProfile?.bio ?? '',
      website: initialProfile?.website ?? '',
    })
  }, [initialFullName, initialProfile])

  const handleSave: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      full_name: profile.full_name,
      bio: profile.bio || null,
      website: profile.website || null,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      pushToast({ title: 'Profile update failed', description: error.message, variant: 'error' })
      setLoading(false)
      return
    }

    pushToast({ title: 'Profile saved', description: 'Your profile is now up to date.', variant: 'success' })
    router.refresh()
    setLoading(false)
  }

  return (
    <form className="taskflow-card space-y-6 p-6 sm:p-8" onSubmit={handleSave}>
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-600">Profile</p>
        <h1 className="text-3xl font-black text-slate-950">Personalize your workspace</h1>
        <p className="text-slate-600">Update your details so your teammates know it is you.</p>
      </div>

      <div>
        <label className="taskflow-label" htmlFor="profile-email">
          Email
        </label>
        <input id="profile-email" className="taskflow-input" value={email} disabled />
      </div>

      <div>
        <label className="taskflow-label" htmlFor="full-name">
          Full name
        </label>
        <input
          id="full-name"
          className="taskflow-input"
          value={profile.full_name}
          onChange={(event) => setProfile((current) => ({ ...current, full_name: event.target.value }))}
          placeholder="Jane Doe"
        />
      </div>

      <div>
        <label className="taskflow-label" htmlFor="bio">
          Bio
        </label>
        <textarea
          id="bio"
          rows={4}
          className="taskflow-input"
          value={profile.bio}
          onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))}
          placeholder="Tell people a little about yourself"
        />
      </div>

      <div>
        <label className="taskflow-label" htmlFor="website">
          Website
        </label>
        <input
          id="website"
          type="url"
          className="taskflow-input"
          value={profile.website}
          onChange={(event) => setProfile((current) => ({ ...current, website: event.target.value }))}
          placeholder="https://example.com"
        />
      </div>

      <div className="flex justify-end">
        <button className="taskflow-button taskflow-button-primary" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}