'use client'

export default function NoteList({ notes, onDelete, onEdit }) {
  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-gray-800 rounded-2xl p-4 border border-gray-700 shadow-md hover:scale-[1.01] transition-transform duration-150"
        >
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold text-white">{note.title}</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(note)}
                className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
          <p className="text-gray-300 mt-2 whitespace-pre-wrap">{note.content}</p>
          {note.shared_with?.length > 0 && (
            <p className="text-xs text-indigo-400 mt-1">
              👥 Shared with: {note.shared_with.join(', ')}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2">{new Date(note.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
