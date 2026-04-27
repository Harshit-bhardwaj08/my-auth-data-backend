'use client'

import { useEffect, useState } from 'react'
import type { Task, TaskFormValues } from '@/lib/types'

type TaskModalProps = {
  open: boolean
  task: Task | null
  onClose: () => void
  onSubmit: (values: TaskFormValues) => Promise<void>
}

const emptyValues: TaskFormValues = {
  title: '',
  description: '',
  priority: 'medium',
  due_date: '',
  status: 'active',
}

export function TaskModal({ open, task, onClose, onSubmit }: TaskModalProps) {
  const [values, setValues] = useState<TaskFormValues>(emptyValues)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (task) {
      setValues({
        title: task.title,
        description: task.description ?? '',
        priority: task.priority,
        due_date: task.due_date ? task.due_date.slice(0, 16) : '',
        status: task.status === 'overdue' ? 'active' : task.status,
      })
      return
    }

    setValues(emptyValues)
  }, [task, open])

  if (!open) {
    return null
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setSaving(true)

    try {
      await onSubmit(values)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="taskflow-card w-full max-w-2xl p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-600">
              {task ? 'Edit task' : 'New task'}
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              {task ? 'Update task details' : 'Create a new task'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div>
            <label className="taskflow-label" htmlFor="task-title">
              Title
            </label>
            <input
              id="task-title"
              required
              className="taskflow-input"
              value={values.title}
              onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
              placeholder="Plan product launch"
            />
          </div>

          <div>
            <label className="taskflow-label" htmlFor="task-description">
              Description
            </label>
            <textarea
              id="task-description"
              rows={4}
              className="taskflow-input"
              value={values.description}
              onChange={(event) =>
                setValues((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Add key details, links, or meeting notes"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="taskflow-label" htmlFor="task-priority">
                Priority
              </label>
              <select
                id="task-priority"
                className="taskflow-input"
                value={values.priority}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    priority: event.target.value as TaskFormValues['priority'],
                  }))
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="taskflow-label" htmlFor="task-status">
                Status
              </label>
              <select
                id="task-status"
                className="taskflow-input"
                value={values.status}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    status: event.target.value as TaskFormValues['status'],
                  }))
                }
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="taskflow-label" htmlFor="task-due-date">
              Due date
            </label>
            <input
              id="task-due-date"
              type="datetime-local"
              className="taskflow-input"
              value={values.due_date}
              onChange={(event) => setValues((current) => ({ ...current, due_date: event.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="taskflow-button taskflow-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !values.title.trim()}
              className="taskflow-button taskflow-button-primary"
            >
              {saving ? 'Saving...' : task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}