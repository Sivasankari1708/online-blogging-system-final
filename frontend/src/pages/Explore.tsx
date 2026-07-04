import { Compass } from 'lucide-react';

export function Explore() {
  return (
    <div className="max-w-4xl mx-auto py-20 text-center animate-fade-in">
      <div className="card p-12 bg-surface/30 border-dashed border-2 border-border">
        <Compass className="h-16 w-16 mx-auto text-primary mb-6" />
        <h1 className="text-3xl font-bold mb-4">Explore</h1>
        <p className="text-text-muted text-lg mb-8">
          Discover new stories, ideas, and expertise from writers around the globe.
        </p>
        <p className="text-sm text-text-muted">
          (Explore functionality coming soon)
        </p>
      </div>
    </div>
  );
}
