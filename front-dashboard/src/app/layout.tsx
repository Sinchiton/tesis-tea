import './globals.css';
import type { ReactNode } from 'react';
import Providers from './providers';

export const metadata = {
  title: 'TEA Dashboard',
  description: 'Panel de control',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-zinc-50 text-zinc-900">
        <Providers>
          <div className="max-w-6xl mx-auto p-4">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
