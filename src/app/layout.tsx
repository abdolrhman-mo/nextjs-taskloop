import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ClientLayout from './client-layout';
import { metadata } from './metadata';
import { Inter, Lora } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={lora.variable}>
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
