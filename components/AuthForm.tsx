'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from './ToastProvider'

type AuthMode = 'login' | 'signup'

type AuthFormProps = {
  mode: AuthMode
}

type FormErrors = Partial<Record<'name' | 'email' | 'password' | 'confirmPassword', string>>

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const supabase = useState(() => createClient())[0]
  const { pushToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const isSignup = mode === 'signup'

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (isSignup && !values.name.trim()) {
      nextErrors.name = 'Full name is required.'
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (values.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }

    if (isSignup && values.password !== values.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        pushToast({ title: 'Login failed', description: error.message, variant: 'error' })
        setLoading(false)
        return
      }

      pushToast({ title: 'Welcome back', description: 'You are now signed in.', variant: 'success' })
      router.push('/dashboard')
      router.refresh()
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })

    if (error) {
      pushToast({ title: 'Signup failed', description: error.message, variant: 'error' })
      setLoading(false)
      return
    }

    if (data.session) {
      pushToast({ title: 'Account created', description: 'Your dashboard is ready.', variant: 'success' })
      router.push('/dashboard')
      router.refresh()
      return
    }

    pushToast({
      title: 'Check your email',
      description: 'Confirm your account using the link we sent you, then continue to TaskFlow.',
      variant: 'info',
    })
    router.push('/login')
    setLoading(false)
  }

  return (
    <div className="taskflow-card mx-auto w-full max-w-lg p-6 sm:p-8">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-600">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </p>
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          {isSignup ? 'Start using TaskFlow' : 'Sign in to TaskFlow'}
        </h1>
        <p className="text-slate-600">
          {isSignup
            ? 'Create your workspace and start tracking tasks in minutes.'
            : 'Continue to your dashboard and pick up where you left off.'}
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {isSignup ? (
          <div>
            <label className="taskflow-label" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              className="taskflow-input"
              value={values.name}
              onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
              placeholder="Jane Doe"
            />
            {errors.name ? <p className="mt-2 text-sm text-red-600">{errors.name}</p> : null}
          </div>
        ) : null}

        <div>
          <label className="taskflow-label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            className="taskflow-input"
            value={values.email}
            onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
            placeholder="you@example.com"
          />
          {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email}</p> : null}
        </div>

        <div>
          <label className="taskflow-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="taskflow-input"
            value={values.password}
            onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
            placeholder="At least 8 characters"
          />
          {errors.password ? <p className="mt-2 text-sm text-red-600">{errors.password}</p> : null}
        </div>

        {isSignup ? (
          <div>
            <label className="taskflow-label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="taskflow-input"
              value={values.confirmPassword}
              onChange={(event) =>
                setValues((current) => ({ ...current, confirmPassword: event.target.value }))
              }
              placeholder="Repeat your password"
            />
            {errors.confirmPassword ? (
              <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
            ) : null}
          </div>
        ) : null}

        {!isSignup ? (
          <div className="flex justify-end text-sm">
            <Link href="/forgot-password" className="font-semibold text-green-600 hover:text-green-700">
              Forgot password?
            </Link>
          </div>
        ) : null}

        <button className="taskflow-button taskflow-button-primary w-full" type="submit" disabled={loading}>
          {loading ? 'Working...' : isSignup ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        {isSignup ? 'Already have an account?' : "Need an account?"}{' '}
        <Link href={isSignup ? '/login' : '/signup'} className="font-semibold text-green-600 hover:text-green-700">
          {isSignup ? 'Log in' : 'Sign up'}
        </Link>
      </p>
    </div>
  )
}