import type { DashboardStats } from '@/lib/types'

export function StatsBar({ stats }: { stats: DashboardStats }) {
  const items = [
    { label: 'Total Tasks', value: stats.total },
    { label: 'Completed', value: stats.completed },
    { label: 'In Progress', value: stats.active },
    { label: 'Overdue', value: stats.overdue },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="taskflow-card p-5">
          <p className="text-sm font-medium text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{item.value}</p>
        </div>
      ))}
    </div>
  )
}