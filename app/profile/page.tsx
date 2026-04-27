import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/ProfileForm'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <main className="taskflow-shell py-8 sm:py-10">
      <ProfileForm
        userId={user.id}
        email={user.email ?? ''}
        initialFullName={user.user_metadata?.full_name ?? ''}
        initialProfile={(profile as Profile | null) ?? null}
      />
    </main>
  )
}