import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/DashboardClient'
import { createClient } from '@/lib/supabase/server'
import type { Profile, Task } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [{ data: profile }, { data: tasks }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('tasks').select('*').order('created_at', { ascending: false }),
  ])

  const displayName =
    (profile as Profile | null)?.full_name || user.user_metadata?.full_name || user.email || 'TaskFlow user'

  return (
    <DashboardClient
      userId={user.id}
      userName={displayName}
      profile={(profile as Profile | null) ?? null}
      initialTasks={(tasks as Task[] | null) ?? []}
    />
  )
}