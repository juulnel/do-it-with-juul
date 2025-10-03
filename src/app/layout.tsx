import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Do it with Juul!',
  description: 'Jouw persoonlijke wekelijkse todo app met punten en beloningen',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
          {children}
        </div>
      </body>
    </html>
  );
}
