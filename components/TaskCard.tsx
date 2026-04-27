'use client'

import { formatDate, getPriorityLabel, getTaskDisplayStatus, isOverdue } from '@/lib/utils'
import type { Task } from '@/lib/types'

type TaskCardProps = {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onToggleComplete: (task: Task) => void
}

export function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  const displayStatus = getTaskDisplayStatus(task)
  const overdue = isOverdue(task)

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={() => onToggleComplete(task)}
            className="mt-1 h-5 w-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
          />
          <div>
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="text-left text-lg font-bold text-slate-950 transition hover:text-green-600"
            >
              {task.title}
            </button>
            {task.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p> : null}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-green-300 hover:text-green-700"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
        <span
          className={
            overdue
              ? 'taskflow-badge taskflow-badge-high'
              : displayStatus === 'completed'
                ? 'taskflow-badge bg-slate-100 text-slate-700'
                : 'taskflow-badge taskflow-badge-low'
          }
        >
          {overdue ? 'Overdue' : displayStatus}
        </span>
        <span
          className={
            task.priority === 'high'
              ? 'taskflow-badge taskflow-badge-high'
              : task.priority === 'medium'
                ? 'taskflow-badge taskflow-badge-medium'
                : 'taskflow-badge taskflow-badge-low'
          }
        >
          {getPriorityLabel(task.priority)} priority
        </span>
        <span className="text-slate-500">Due {formatDate(task.due_date)}</span>
      </div>
    </article>
  )
}