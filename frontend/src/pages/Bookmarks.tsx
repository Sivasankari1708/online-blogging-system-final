import { Bookmark } from 'lucide-react';

export function Bookmarks() {
  return (
    <div className="max-w-4xl mx-auto py-20 text-center animate-fade-in">
      <div className="card p-12 bg-surface/30 border-dashed border-2 border-border">
        <Bookmark className="h-16 w-16 mx-auto text-accent mb-6" />
        <h1 className="text-3xl font-bold mb-4">Your Bookmarks</h1>
        <p className="text-text-muted text-lg mb-8">
          Stories you've saved to read later will appear here.
        </p>
        <p className="text-sm text-text-muted">
          (Bookmarks functionality coming soon)
        </p>
      </div>
    </div>
  );
}
