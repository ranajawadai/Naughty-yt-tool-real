'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Youtube } from 'lucide-react';

const navLinks = [
  { label: 'Tools', href: '#tools' },
  { label: 'Vault', href: '#vault' },
  { label: 'History', href: '#history' },
  { label: 'Settings', href: '#settings' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-obsidian-border bg-obsidian-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-obsidian-text hover:text-obsidian-accent transition-colors">
            <Youtube className="w-6 h-6 text-obsidian-accent" />
            <span className="font-semibold text-sm tracking-tight">YT Intelligence Suite</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 text-sm text-obsidian-muted hover:text-obsidian-text hover:bg-obsidian-hover rounded-md transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          <button
            className="md:hidden p-2 text-obsidian-muted hover:text-obsidian-text"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-obsidian-border bg-obsidian-bg px-4 pb-3">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-obsidian-muted hover:text-obsidian-text hover:bg-obsidian-hover rounded-md mt-1"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
