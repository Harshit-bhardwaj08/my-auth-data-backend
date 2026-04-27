import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getInitials } from '@/lib/utils'

export async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile: { full_name: string | null } | null = null

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()

    profile = data ?? null
  }

  const displayName = profile?.full_name ?? user?.user_metadata?.full_name ?? profile?.username ?? 'Account'
  const initials = getInitials(displayName)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="taskflow-shell flex min-h-20 items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
            TF
          </span>
          <div>
            <p className="text-base font-black tracking-tight text-slate-950">TaskFlow</p>
            <p className="text-sm text-slate-500">Productivity that keeps pace</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/dashboard" className="transition hover:text-slate-950">
            Dashboard
          </Link>
          <Link href="/profile" className="transition hover:text-slate-950">
            Profile
          </Link>
          <Link href="/settings" className="transition hover:text-slate-950">
            Settings
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/profile" className="flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-slate-100">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                  {initials}
                </span>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-slate-950">
                    {displayName}
                  </p>
                </div>
              </Link>
              <form action="/auth/signout" method="post">
                <button className="taskflow-button taskflow-button-secondary px-4 py-2 text-sm" type="submit">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="taskflow-button taskflow-button-secondary px-4 py-2 text-sm">
                Login
              </Link>
              <Link href="/signup" className="taskflow-button taskflow-button-primary px-4 py-2 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}