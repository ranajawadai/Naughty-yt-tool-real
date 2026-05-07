export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-obsidian-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-obsidian-border border-t-obsidian-accent rounded-full animate-spin" />
        <p className="text-sm text-obsidian-muted">Loading YT Intelligence Suite...</p>
      </div>
    </div>
  );
}
