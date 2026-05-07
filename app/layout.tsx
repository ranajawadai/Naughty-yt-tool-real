import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YT Intelligence Suite',
  description: 'Professional YouTube intelligence and analysis tools. Search, analyze, compare, and export YouTube data.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-obsidian-bg text-obsidian-text antialiased">
        {children}
      </body>
    </html>
  );
}
