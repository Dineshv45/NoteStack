'use client'

export default function NoteCard({ note, onDelete }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 shadow-md">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold">{note.title}</h2>
        <button
          onClick={() => onDelete(note.id)}
          className="text-sm bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
      <p className="text-gray-300 mt-2 whitespace-pre-wrap">{note.content}</p>
      <p className="text-xs text-gray-500 mt-2">
        {new Date(note.created_at).toLocaleString()}
      </p>
    </div>
  )
}
