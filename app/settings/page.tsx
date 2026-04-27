import { redirect } from 'next/navigation'
import { SettingsPanel } from '@/components/SettingsPanel'
import { createClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="taskflow-shell py-8 sm:py-10">
      <SettingsPanel email={user.email ?? ''} />
    </main>
  )
}