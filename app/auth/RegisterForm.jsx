'use client'

import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const supabase = useSupabaseClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      })

      if (signUpError) {
        setMessage(signUpError.message.includes('User already registered') ? 'Email already registered. Please login.' : signUpError.message)
        setLoading(false)
        return
      }

      // Immediately login
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) {
        setMessage('Registration succeeded, but login failed. Please login manually.')
        setLoading(false)
        return
      }

      router.push('/') // redirect to notes page
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
     <h1 className="flex items-center justify-center gap-2 text-3xl font-bold mb-2">
  <img
    src="/icon.svg"
    alt="NoteStack Logo"
    className="w-8 h-8"
  />
  <span>
    <span style={{ color: "#00eaff" }}>Note</span>
    <span style={{ color: "#3b82f6" }}>Stack</span>
  </span>
</h1>
      <h2 className="text-2xl font-semibold text-center text-indigo-400 mb-4">✨ Create your NoteStack Account</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500" />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500" />
      <button type="submit" disabled={loading} className={`w-full py-2 rounded-md text-white ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'}`}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      {message && <p className="text-center text-sm text-gray-300 mt-2">{message}</p>}
    </form>
  )
}
