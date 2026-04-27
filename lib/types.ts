export type TaskStatus = 'active' | 'completed' | 'overdue'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Profile {
  id: string
  updated_at: string | null
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  website: string | null
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  total: number
  completed: number
  active: number
  overdue: number
}

export interface TaskFormValues {
  title: string
  description: string
  priority: TaskPriority
  due_date: string
  status: TaskStatus
}