'use client'

import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) setMessage(error.message)
    else router.push('/') // redirect to home/notes
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
       <h1 className="flex items-center justify-center gap-2 text-3xl font-bold mb-6">
        <img
          src="/icon.svg"
          alt="NoteStack Logo"
          className="w-8 h-8"
        />
        <span>
          <span style={{ color: '#00eaff' }}>Note</span>
          <span style={{ color: '#3b82f6' }}>Stack</span>
        </span>
      </h1>
      <h2 className="text-2xl font-semibold text-center text-indigo-400 mb-4">🔐 Login to NoteStack</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {message && <p className="text-center text-sm text-gray-300 mt-2">{message}</p>}
    </form>
  )
}
