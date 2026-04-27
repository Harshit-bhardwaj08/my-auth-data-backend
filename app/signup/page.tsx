import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/AuthForm'
import { createClient } from '@/lib/supabase/server'

export default async function SignupPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="taskflow-shell flex min-h-[calc(100vh-5rem)] items-center justify-center py-12">
      <AuthForm mode="signup" />
    </main>
  )
}