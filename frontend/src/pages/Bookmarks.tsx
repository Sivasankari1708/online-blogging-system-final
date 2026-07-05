import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Loader2, BookOpen } from 'lucide-react';
import api from '../services/api';
import { MasonryGrid } from '../components/MasonryGrid';

export function Bookmarks() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    const fetchBookmarks = async () => {
      try {
        // 1. Fetch bookmarks list from backend
        const bookmarksRes = await api.get(`/bookmarks/user/${currentUserId}`);
        const bookmarkList = bookmarksRes.data || [];

        if (bookmarkList.length === 0) {
          setPosts([]);
          setLoading(false);
          return;
        }

        // 2. Fetch full post details for each bookmarked post
        const postPromises = bookmarkList.map((bookmark: any) =>
          api.get(`/posts/${bookmark.postId}`)
            .then(res => res.data)
            .catch(err => {
              console.error(`Failed to fetch post ${bookmark.postId}`, err);
              return null; // Ignore deleted or unreachable posts
            })
        );

        const postsData = await Promise.all(postPromises);
        
        // Filter out nulls and enrich missing images/metrics for display
        const validPosts = postsData.filter(p => p !== null).map((post, idx) => {
          const images = [
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
          ];
          return {
            ...post,
            coverImage: post.coverImage || images[idx % images.length],
            likesCount: post.likesCount || Math.floor(Math.random() * 50) + 10,
            readingTime: post.readingTime || Math.floor(Math.random() * 6) + 4
          };
        });

        setPosts(validPosts);
      } catch (err: any) {
        console.error('Failed to load bookmarks', err);
        setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load saved posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-sm text-text-muted">Loading your saved collection...</p>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="max-w-md mx-auto py-20 text-center glass-panel p-8 mt-10 rounded-3xl border border-white/5">
        <Bookmark className="h-10 w-10 mx-auto text-slate-400 mb-4" />
        <h2 className="text-xl font-bold mb-2 font-display">Sign In Required</h2>
        <p className="text-xs text-text-muted mb-6">Please sign in to view your saved articles.</p>
        <Link to="/login" className="btn-primary w-full py-2.5">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-12 animate-fade-in">
      {/* Header */}
      <div className="mb-12 max-w-2xl">
        <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider mb-3">
          <Bookmark className="h-4.5 w-4.5" />
          <span>Curated Board</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none font-display">
          Your Saved Collection.
        </h1>
        <p className="text-sm text-text-muted mt-3">
          Insights and concepts you have bookmarked to read and explore later.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-600 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-900/10 rounded-3xl bg-slate-900/2">
          <BookOpen className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2 font-display">No saved stories yet</h3>
          <p className="text-xs text-text-muted mb-6">Start reading and curate your personal board of publications.</p>
          <Link to="/" className="btn-primary px-6 py-2.5">Explore Feed</Link>
        </div>
      ) : (
        <div className="w-full">
          <MasonryGrid posts={posts} />
        </div>
      )}
    </div>
  );
}
