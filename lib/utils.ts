import type { Task, TaskPriority, TaskStatus } from './types'

export function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ')
}

export function getInitials(name: string | null | undefined) {
  if (!name) {
    return 'TF'
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return 'No due date'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function isOverdue(task: Pick<Task, 'status' | 'due_date'>) {
  if (task.status === 'completed' || !task.due_date) {
    return false
  }

  return new Date(task.due_date).getTime() < Date.now()
}

export function getTaskDisplayStatus(task: Pick<Task, 'status' | 'due_date'>): TaskStatus {
  return isOverdue(task) ? 'overdue' : task.status
}

export function getPriorityLabel(priority: TaskPriority) {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

export function sortTasksNewestFirst(tasks: Task[]) {
  return [...tasks].sort(
    (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
  )
}

export function taskMatchesFilter(task: Task, filter: 'all' | 'active' | 'completed') {
  if (filter === 'all') {
    return true
  }

  if (filter === 'completed') {
    return task.status === 'completed'
  }

  return task.status !== 'completed'
}