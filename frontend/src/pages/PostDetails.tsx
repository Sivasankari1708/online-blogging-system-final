import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Heart, Bookmark, MoreHorizontal, 
  Loader2, Link as LinkIcon, Check 
} from 'lucide-react';
import api from '../services/api';
import { CommentSection } from '../components/CommentSection';
import { ReportModal } from '../components/ReportModal';

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdDate: string;
  tags: string[];
  coverImageURL?: string;
  likesCount?: number;
}

export function PostDetails() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);
  
  // Bookmarks & Social states
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPostAndBookmarkState = async () => {
      try {
        setLoading(true);
        // 1. Fetch post details
        const postRes = await api.get(`/posts/${postId}`);
        setPost(postRes.data);
        setLikesCount(postRes.data.likesCount || 0);
        
        // 2. Fetch bookmark status if user logged in
        if (currentUserId) {
          const checkRes = await api.get(`/bookmarks/check`, {
            params: { userId: currentUserId, postId }
          });
          setIsBookmarked(checkRes.data.bookmarked);
        }
      } catch (err) {
        console.error('Failed to fetch post/bookmark details', err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostAndBookmarkState();
    }
  }, [postId, currentUserId]);

  const handleBookmarkToggle = async () => {
    if (!currentUserId) {
      alert('Please log in to save stories.');
      return;
    }
    
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        // Remove bookmark
        await api.delete('/bookmarks', {
          params: { userId: currentUserId, postId }
        });
        setIsBookmarked(false);
      } else {
        // Add bookmark
        await api.post('/bookmarks', {
          userId: currentUserId,
          postId: postId
        });
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Failed to update bookmark status', err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLikeToggle = () => {
    if (liked) {
      setLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikesCount(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-32 flex justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center glass-panel p-12 mt-10 rounded-3xl border border-white/5">
        <h2 className="text-2xl font-bold mb-2 font-display text-slate-900">Post Not Found</h2>
        <p className="text-sm text-text-muted mb-6">The story you are looking for does not exist.</p>
        <Link to="/" className="btn-primary px-6 py-2">Back to Home</Link>
      </div>
    );
  }

  const category = post.tags && post.tags.length > 0 ? post.tags[0] : 'General';

  return (
    <div className="max-w-5xl mx-auto animate-fade-in py-6 px-4">
      {/* 1. LARGE HERO BANNER COVER IMAGE */}
      <div className="w-full h-[50vh] min-h-[320px] bg-slate-100 rounded-3xl mb-10 overflow-hidden border border-slate-900/5 relative shadow-xl">
        <img 
          src={post.coverImageURL || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'} 
          alt={post.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent"></div>
      </div>

      {/* 2. HEADER DETAILS INFO */}
      <header className="mb-10 text-left max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-3 items-center mb-5">
          <span className="px-3.5 py-1 bg-slate-900/5 text-slate-800 rounded-full text-xs font-semibold tracking-wide uppercase">
            {category}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            5 Min Read • {post.createdDate ? format(new Date(post.createdDate), 'MMMM d, yyyy') : 'Unknown date'}
          </span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-8 font-display tracking-tight">
          {post.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y border-slate-900/5 py-5 gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={`https://ui-avatars.com/api/?name=${post.authorName}&background=0F172A&color=fff`} 
              alt={post.authorName} 
              className="h-11 w-11 rounded-full border border-slate-900/10 shadow-sm" 
            />
            <div>
              <div className="font-bold text-slate-900 text-base leading-tight">
                {post.authorName}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Editorial Contributor & Writer
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 self-center sm:self-auto">
            <button 
              onClick={handleLikeToggle}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                liked 
                  ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                  : 'bg-transparent text-slate-500 border-slate-900/10 hover:text-red-500 hover:bg-red-500/5'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              <span>{likesCount} Likes</span>
            </button>
            <button 
              onClick={() => setIsReportOpen(true)}
              className="p-2 rounded-full border border-slate-900/10 hover:bg-red-500/5 hover:border-red-500/20 text-slate-400 hover:text-red-500 transition-colors"
              title="Report Post"
            >
              <MoreHorizontal className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. TWO-COLUMN SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6 max-w-4xl mx-auto items-start">
        
        {/* LEFT COLUMN: Share and Promotion Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-28">
          {/* Share Block */}
          <div className="flex flex-col gap-4 text-left border-b border-slate-900/5 pb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Share This Story</span>
            
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 text-xs text-slate-500 hover:text-slate-900 transition-colors py-1 cursor-pointer"
            >
              <TwitterIcon className="h-4 w-4" />
              <span>Twitter / X</span>
            </a>
            
            <button 
              onClick={handleCopyLink}
              className="flex items-center gap-2.5 text-xs text-slate-500 hover:text-slate-900 transition-colors py-1 cursor-pointer bg-transparent border-none outline-none text-left"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <LinkIcon className="h-4 w-4" />}
              <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
            </button>
            
            <button 
              onClick={handleBookmarkToggle}
              disabled={bookmarkLoading}
              className="flex items-center gap-2.5 text-xs text-slate-500 hover:text-slate-900 transition-colors py-1 cursor-pointer bg-transparent border-none outline-none text-left"
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-slate-900 text-slate-900' : ''}`} />
              <span>{isBookmarked ? 'Saved to collection' : 'Save for later'}</span>
            </button>
          </div>

          {/* Promotion Card */}
          <div className="glass-panel p-6 rounded-2xl text-left border border-slate-900/5">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">Support Independent Writing</span>
            <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1 font-display">Get unlimited access to the best stories.</h4>
            <p className="text-[11px] text-slate-500 leading-normal mb-4 font-light">Read all publications and support high fidelity visual design journals.</p>
            <button 
              onClick={() => setSubscribed(prev => !prev)}
              className={`w-full py-2.5 rounded-full text-xs font-bold transition-all ${
                subscribed 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {subscribed ? '✓ Subscribed' : 'Subscribe'}
            </button>
          </div>
        </aside>

        {/* RIGHT COLUMN: Article Content */}
        <div className="lg:col-span-8 text-left">
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-sans text-base space-y-6">
            {/* Formatting paragraph tags and styling quotes */}
            {(post.content || '').split('\n').map((paragraph, idx) => {
              if (paragraph.trim().startsWith('> ')) {
                return (
                  <blockquote 
                    key={idx} 
                    className="border-l-4 border-red-800 pl-4 py-1.5 italic text-slate-900 my-6 bg-slate-900/2 rounded-r-lg text-lg font-display"
                  >
                    {paragraph.substring(2)}
                  </blockquote>
                );
              }
              if (paragraph.trim().startsWith('## ')) {
                return (
                  <h3 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-4 font-display">
                    {paragraph.substring(3)}
                  </h3>
                );
              }
              return (
                <p key={idx} className="text-slate-600/90 font-light mb-4 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. COMMENTS SECTION */}
      <section className="max-w-4xl mx-auto bg-slate-950/2 rounded-3xl p-6 sm:p-10 border border-slate-900/5 mt-16 text-left">
        <CommentSection postId={postId!} />
      </section>

      {/* Modals */}
      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} postId={postId!} />
    </div>
  );
}
