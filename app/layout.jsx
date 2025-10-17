import './globals.css'
import Providers from './providers'

export const metadata = {
  title: 'Notes App',
  description: 'Notes with Supabase and Tailwind',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
