import './globals.css'
import Providers from './providers'

export const metadata = {
  title: "NoteStack – Collaborative Note-Taking Platform",
  description: "A real-time note-taking and collaboration tool built with Next.js, Supabase, and Tailwind CSS.",
  icons: {
    icon: "icon.svg", // place your icon inside /public
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
