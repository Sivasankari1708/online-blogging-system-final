import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Hash, Users, Compass, 
  ChevronRight, Loader2 
} from 'lucide-react';
import api from '../services/api';
import { BlogCard } from '../components/BlogCard';

export function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserName = localStorage.getItem('username');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts/published');
        setPosts(response.data);
      } catch (err) {
        console.error('Failed to fetch posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto flex gap-8 animate-fade-in relative items-start">
      
      {/* Left Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
        {currentUserName && (
          <div className="card p-5 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-black font-bold text-lg">
                {currentUserName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-text-main">{currentUserName}</div>
                <Link to="/profile" className="text-xs text-primary hover:underline">View Profile</Link>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
            <Compass className="h-4 w-4" /> Discover
          </h3>
          <ul className="space-y-2">
            {['Technology', 'Programming', 'Design', 'Productivity'].map(cat => (
              <li key={cat}>
                <a href="#" className="flex items-center justify-between p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-surface transition-colors">
                  <span>{cat}</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Center Feed */}
      <main className="flex-1 min-w-0 pb-12">
        {/* Mobile Discover Header */}
        <div className="lg:hidden flex overflow-x-auto gap-3 pb-4 mb-6 no-scrollbar border-b border-border">
          <button className="px-4 py-1.5 rounded-full bg-surface text-text-main text-sm font-medium whitespace-nowrap">For You</button>
          <button className="px-4 py-1.5 rounded-full text-text-muted hover:bg-surface text-sm font-medium whitespace-nowrap transition-colors">Following</button>
          <button className="px-4 py-1.5 rounded-full text-text-muted hover:bg-surface text-sm font-medium whitespace-nowrap transition-colors">Technology</button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 card border-dashed">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-xl font-bold mb-2">No posts yet</h3>
            <p className="text-text-muted mb-6">Be the first to share your thoughts with the community.</p>
            <Link to="/create" className="btn-primary">Write a Post</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
            
            {/* Infinite Scroll Loader Placeholder */}
            <div className="py-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
            </div>
          </div>
        )}
      </main>

      {/* Right Sidebar */}
      <aside className="hidden xl:block w-80 shrink-0 sticky top-24">
        {/* Trending Tags */}
        <div className="card p-6 mb-6">
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Trending Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {['reactjs', 'webdev', 'typescript', 'javascript', 'frontend', 'coding'].map(tag => (
              <a key={tag} href="#" className="px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-text-muted hover:text-text-main hover:border-primary transition-colors flex items-center gap-1">
                <Hash className="h-3 w-3" /> {tag}
              </a>
            ))}
          </div>
        </div>

        {/* Suggested Users */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-accent" /> Who to follow
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <img src={`https://ui-avatars.com/api/?name=User+${i}&background=333333&color=fff`} alt="User" className="h-10 w-10 rounded-full border border-border" />
                  <div>
                    <div className="text-sm font-bold text-text-main group-hover:text-primary transition-colors cursor-pointer">Awesome Writer {i}</div>
                    <div className="text-xs text-text-muted">@awesomewriter{i}</div>
                  </div>
                </div>
                <button className="btn-secondary py-1 px-3 text-xs">Follow</button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-xs text-text-muted text-center space-x-3">
          <a href="#" className="hover:text-text-main transition-colors">Help</a>
          <a href="#" className="hover:text-text-main transition-colors">Privacy</a>
          <a href="#" className="hover:text-text-main transition-colors">Terms</a>
          <a href="#" className="hover:text-text-main transition-colors">About</a>
        </div>
      </aside>
    </div>
  );
}
