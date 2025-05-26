import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ClientLayout from './client-layout';
import { metadata } from './metadata';

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ThemeProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
