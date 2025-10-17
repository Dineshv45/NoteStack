'use client'

import { useState, useEffect } from 'react'
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { saveAs } from 'file-saver'
import LoginForm from './auth/LoginForm'
import RegisterForm from './auth/RegisterForm'
import NoteList from './components/Notes/NoteList'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

// Dynamic imports
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })
const Markdown = dynamic(() => import('@uiw/react-markdown-preview').then((mod) => mod.default), { ssr: false })

export default function Page() {
  const supabase = useSupabaseClient()
  const session = useSession()
  const router = useRouter()

  const [isLogin, setIsLogin] = useState(true)
  const [notes, setNotes] = useState([])
  const [noteToEdit, setNoteToEdit] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [sharedWith, setSharedWith] = useState('')

  // Fetch notes and set up realtime subscription
  useEffect(() => {
    if (!session?.user) return

    fetchNotes()

    const channel = supabase
      .channel('notes-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
        },
        () => fetchNotes()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [session])

  async function fetchNotes() {
    if (!session?.user?.email) return

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .or(`user_id.eq.${session.user.id},shared_with.cs.{${session.user.email}}`)
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setNotes(data || [])
  }

  async function handleSaveNote() {
    if (!title.trim()) return
    const sharedArray = sharedWith ? sharedWith.split(',').map((e) => e.trim()) : []

    try {
      if (noteToEdit) {
        const { data, error } = await supabase
          .from('notes')
          .update({ title, content, shared_with: sharedArray })
          .eq('id', noteToEdit.id)
          .select()
        if (error) throw error
        setNotes(notes.map((n) => (n.id === data[0].id ? data[0] : n)))
        setNoteToEdit(null)
      } else {
        const { data, error } = await supabase
          .from('notes')
          .insert([{ title, content, user_id: session.user.id, shared_with: sharedArray }])
          .select()
        if (error) throw error
        setNotes([data[0], ...notes])
      }

      setTitle('')
      setContent('')
      setSharedWith('')
    } catch (err) {
      console.error('Error saving note:', err.message)
    }
  }

  async function handleDeleteNote(id) {
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (error) console.error(error)
    else setNotes(notes.filter((n) => n.id !== id))
  }

  function handleEditNote(note) {
    setNoteToEdit(note)
    setTitle(note.title || '')
    setContent(note.content || '')
    setSharedWith(note.shared_with?.join(', ') || '')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  function exportNotes() {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' })
    saveAs(blob, 'noteStack_notes.json')
  }

  function importNotes(file) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const data = JSON.parse(e.target.result)
      for (const note of data) {
        await supabase.from('notes').insert([{ ...note, user_id: session.user.id }])
      }
      fetchNotes()
    }
    reader.readAsText(file)
  }

  // Login/Register screen
  if (!session)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <motion.div
          className="relative w-full max-w-4xl h-[500px] flex rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            className={`flex-1 text-white flex flex-col justify-center items-center p-10 transition-colors duration-500 ${
              isLogin ? 'bg-indigo-800' : 'bg-gray-700'
            }`}
          >
            <h1 className="text-4xl font-bold mb-4">{isLogin ? 'Welcome Back!' : 'Hello, Friend!'}</h1>
            <p className="text-center max-w-xs">
              {isLogin
                ? 'Login to manage your notes in NoteStack.'
                : 'Register to start collaborating in NoteStack.'}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="mt-6 px-6 py-2 bg-gray-900 hover:bg-gray-800 rounded-md"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </div>

          <div className="flex-1 bg-gray-800 p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-center text-white mb-4">
              {/* {isLogin ? '🔐 Login to NoteStack' : '✨ Create your NoteStack Account'} */}
            </h2>
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        </motion.div>
      </div>
    )

  // Notes dashboard
  return (
    <main className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-400 flex items-center gap-2">
            <img
    src="icon.svg"
    alt="NoteStack Logo"
    className="w-7 h-7"
  /> <span><span style={{ color: "#00eaff" }}>Note</span>
  <span style={{ color: "#3b82f6" }}>Stack</span></span>
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
          >
            Logout
          </button>
        </div>

        {/* Note Form */}
        <div className="bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-700">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="w-full p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 mb-2 focus:ring-2 focus:ring-indigo-500"
          />
          <MDEditor
            value={content}
            onChange={setContent}
            height={200}
            className="bg-gray-700 rounded-lg mb-3"
            previewOptions={{ disallowedElements: ['script'] }}
          />
          <input
            value={sharedWith}
            onChange={(e) => setSharedWith(e.target.value)}
            placeholder="Invite collaborators (comma-separated emails)"
            className="w-full p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 mb-3 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSaveNote}
            className={`w-full py-2 rounded-md text-white ${
              noteToEdit ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            {noteToEdit ? 'Update Note' : 'Add Note'}
          </button>
        </div>

        {/* Export/Import */}
        <div className="flex space-x-4">
          <button
            onClick={exportNotes}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Export Notes
          </button>
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer">
            Import Notes
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => importNotes(e.target.files[0])}
            />
          </label>
        </div>

        {/* Notes List */}
        <NoteList notes={notes} onEdit={handleEditNote} onDelete={handleDeleteNote} />
      </div>
    </main>
  )
}
