import Link from 'next/link'

const features = [
  {
    title: 'Task Management',
    description: 'Capture work quickly, organize it by priority, and keep every deadline in view.',
  },
  {
    title: 'Team Collaboration',
    description: 'Keep everyone aligned with shared profiles, avatars, and real-time task updates.',
  },
  {
    title: 'Analytics',
    description: 'Monitor active, completed, and overdue work with live dashboard stats.',
  },
]

export default function Home() {
  return (
    <main className="pb-24 pt-10 sm:pt-16">
      <section className="taskflow-shell">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
              Built for focused teams and solo creators
            </div>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                TaskFlow keeps your day moving.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                A clean productivity platform for managing tasks, tracking priorities, and staying on
                top of deadlines with a polished Supabase-powered workflow.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link className="taskflow-button taskflow-button-primary" href="/signup">
                Get Started
              </Link>
              <Link className="taskflow-button taskflow-button-secondary" href="/login">
                Login
              </Link>
            </div>
          </div>
          <div className="taskflow-card overflow-hidden border-slate-200 bg-white p-6">
            <div className="rounded-2xl bg-slate-950 p-6 text-white">
              <div className="text-sm uppercase tracking-[0.3em] text-green-400">Today</div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span>Launch onboarding flow</span>
                  <span className="taskflow-badge taskflow-badge-low">Low</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span>Review sprint board</span>
                  <span className="taskflow-badge taskflow-badge-medium">Medium</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span>Ship release notes</span>
                  <span className="taskflow-badge taskflow-badge-high">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="taskflow-shell mt-20 grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="taskflow-card p-6">
            <h2 className="text-xl font-bold text-slate-950">{feature.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
          </article>
        ))}
      </section>

      <footer className="taskflow-shell mt-24 border-t border-slate-200 pt-8 text-sm text-slate-500">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-slate-800">TaskFlow</p>
          <div className="flex gap-6">
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign up</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
