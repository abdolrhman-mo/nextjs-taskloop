import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TaskLoop',
  description: 'Share and manage tasks with friends',
}

// This script prevents theme flash by running before page render
const themeScript = `
  (function() {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === null) {
        // Set dark theme as default for new users
        localStorage.setItem('theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
