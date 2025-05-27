import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ClientLayout from './client-layout';
import { metadata } from './metadata';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
