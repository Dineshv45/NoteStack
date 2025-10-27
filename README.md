NoteStack

NoteStack is a modern, collaborative note-taking app built with Next.js, Supabase and Markdown support.  
It allows users to create, edit, share, and export notes in an elegant and secure interface.

---

## 🚀 Features

- 📝 Rich Markdown Editor – Write formatted text, code blocks, and more using `@uiw/react-md-editor`.
- 👥 Shared Notes – Invite others via email and collaborate using Supabase Row-Level Security (RLS).
- 💾 Import & Export Notes – Save all your notes as JSON or import them anytime.
- 🔐 Secure Authentication – Powered by Supabase Auth (email & password).
- 🎨 Beautiful Animated UI – Smooth transitions for login/register using Framer Motion.
- 🌙 Dark Mode Design – Minimal, modern interface with consistent theme.

---

## 🛠️ Tech Stack

- Next.js 14 (App Router)
- Supabase (Auth + Database)
- Framer Motion (Animations)
- Tailwind CSS (Styling)
- @uiw/react-md-editor (Rich Text Markdown Editor)
- File Saver (Export notes)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```
git clone https://github.com/yourusername/noteStack.git
```

2️⃣ Install Dependencies

cd noteStack
npm install

3️⃣ Setup Supabase
Go to Supabase
Create a new project.
Add a notes table with the following fields:
id: UUID (Primary Key)
title: Text
content: Text
user_id: UUID (Foreign Key referencing auth.users)
shared_with: text[] (Array)
created_at: Timestamp (Default: now())
Enable Row Level Security (RLS) and configure policies for shared access.

4️⃣ Configure Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

5️⃣ Run the App
npm run dev


🧑‍💻 Author
Dinesh Vattipally
Built with using Next.js & Supabase
