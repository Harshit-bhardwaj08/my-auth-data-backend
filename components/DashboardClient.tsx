'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { DashboardStats, Profile, Task, TaskFormValues } from '@/lib/types'
import { isOverdue, sortTasksNewestFirst, taskMatchesFilter } from '@/lib/utils'
import { StatsBar } from './StatsBar'
import { TaskCard } from './TaskCard'
import { TaskModal } from './TaskModal'
import { useToast } from './ToastProvider'

type DashboardClientProps = {
  userId: string
  userName: string
  profile: Profile | null
  initialTasks: Task[]
}

type Filter = 'all' | 'active' | 'completed'

export function DashboardClient({ userId, userName, profile, initialTasks }: DashboardClientProps) {
  const router = useRouter()
  const supabase = useState(() => createClient())[0]
  const { pushToast } = useToast()
  const [tasks, setTasks] = useState<Task[]>(sortTasksNewestFirst(initialTasks))
  const [filter, setFilter] = useState<Filter>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(initialTasks.length === 0)

  const loadTasks = useCallback(async () => {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', {
      ascending: false,
    })

    if (error) {
      pushToast({ title: 'Could not load tasks', description: error.message, variant: 'error' })
      setLoading(false)
      return
    }

    setTasks(data ?? [])
    setLoading(false)
  }, [supabase, pushToast])

  useEffect(() => {
    loadTasks()

    const channel = supabase
      .channel(`tasks-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${userId}` },
        () => {
          loadTasks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadTasks, supabase, userId])

  const visibleTasks = useMemo(
    () => tasks.filter((task) => taskMatchesFilter(task, filter)),
    [filter, tasks]
  )

  const stats: DashboardStats = useMemo(() => {
    const overdue = tasks.filter((task) => isOverdue(task)).length

    return {
      total: tasks.length,
      completed: tasks.filter((task) => task.status === 'completed').length,
      active: tasks.filter((task) => task.status === 'active').length,
      overdue,
    }
  }, [tasks])

  const openCreateModal = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const submitTask = async (values: TaskFormValues) => {
    const payload = {
      title: values.title.trim(),
      description: values.description.trim() || null,
      priority: values.priority,
      due_date: values.due_date ? new Date(values.due_date).toISOString() : null,
      status: values.status,
      user_id: userId,
      updated_at: new Date().toISOString(),
    }

    const { error } = editingTask
      ? await supabase.from('tasks').update(payload).eq('id', editingTask.id)
      : await supabase.from('tasks').insert(payload)

    if (error) {
      pushToast({ title: 'Task not saved', description: error.message, variant: 'error' })
      return
    }

    pushToast({
      title: editingTask ? 'Task updated' : 'Task created',
      description: editingTask ? 'Your changes are live.' : 'A new task has been added.',
      variant: 'success',
    })

    await loadTasks()
    router.refresh()
  }

  const toggleTask = async (task: Task) => {
    const nextStatus = task.status === 'completed' ? 'active' : 'completed'
    const { error } = await supabase
      .from('tasks')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', task.id)

    if (error) {
      pushToast({ title: 'Could not update task', description: error.message, variant: 'error' })
      return
    }

    await loadTasks()
  }

  const deleteTask = async (task: Task) => {
    const confirmed = window.confirm(`Delete "${task.title}"? This cannot be undone.`)

    if (!confirmed) {
      return
    }

    const { error } = await supabase.from('tasks').delete().eq('id', task.id)

    if (error) {
      pushToast({ title: 'Task not deleted', description: error.message, variant: 'error' })
      return
    }

    pushToast({ title: 'Task deleted', description: 'The task has been removed.', variant: 'info' })
    await loadTasks()
  }

  return (
    <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-[280px_1fr]">
      <aside className="hidden bg-slate-950 px-6 py-8 text-white lg:block">
        <div className="sticky top-28 space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-400">Workspace</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">TaskFlow</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Keep track of your next move, measure progress, and stay focused.
            </p>
          </div>

          <nav className="space-y-2 text-sm font-medium text-slate-300">
            {['Dashboard', 'Profile', 'Settings'].map((item) => (
              <a
                key={item}
                href={item === 'Dashboard' ? '/dashboard' : `/${item.toLowerCase()}`}
                className="block rounded-2xl px-4 py-3 transition hover:bg-white/10 hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <main className="space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="taskflow-card flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-600">
                Welcome back
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {profile?.full_name || userName}, your tasks are ready.
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Stay on top of your work with a live dashboard, smart filters, and instant updates.
              </p>
            </div>

            <button className="taskflow-button taskflow-button-primary" onClick={openCreateModal}>
              Add Task
            </button>
          </div>

          <StatsBar stats={stats} />
        </section>

        <section className="taskflow-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Task list</h2>
              <p className="mt-1 text-slate-600">Manage tasks, toggle completion, or edit details.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(['all', 'active', 'completed'] as Filter[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={
                    filter === item
                      ? 'taskflow-button taskflow-button-primary px-4 py-2 text-sm capitalize'
                      : 'taskflow-button taskflow-button-secondary px-4 py-2 text-sm capitalize'
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="animate-pulse rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="h-4 w-1/2 rounded bg-slate-200" />
                    <div className="mt-4 h-3 w-3/4 rounded bg-slate-200" />
                    <div className="mt-6 h-8 w-1/3 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : visibleTasks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                <h3 className="text-xl font-bold text-slate-950">No tasks yet</h3>
                <p className="mx-auto mt-3 max-w-lg text-slate-600">
                  Create your first task to start building momentum. TaskFlow keeps everything in one place.
                </p>
                <button className="taskflow-button taskflow-button-primary mt-6" onClick={openCreateModal}>
                  Add your first task
                </button>
              </div>
            ) : (
              visibleTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEditModal}
                  onDelete={deleteTask}
                  onToggleComplete={toggleTask}
                />
              ))
            )}
          </div>
        </section>

        <TaskModal
          open={modalOpen}
          task={editingTask}
          onClose={() => setModalOpen(false)}
          onSubmit={submitTask}
        />
      </main>
    </div>
  )
}