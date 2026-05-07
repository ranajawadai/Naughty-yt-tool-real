import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-obsidian-bg px-4">
      <div className="max-w-md w-full bg-obsidian-panel border border-obsidian-border rounded-lg p-6 text-center">
        <h2 className="text-4xl font-bold text-obsidian-muted mb-2">404</h2>
        <p className="text-sm text-obsidian-muted mb-6">Page not found.</p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-obsidian-accent text-white text-sm font-medium rounded-md hover:bg-blue-500 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
