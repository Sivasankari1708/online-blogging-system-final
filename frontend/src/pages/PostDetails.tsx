import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart, Bookmark, Share2, MoreHorizontal, MessageSquare, Loader2 } from 'lucide-react';
import api from '../services/api';
import { CommentSection } from '../components/CommentSection';
import { ReportModal } from '../components/ReportModal';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdDate: string;
  tags: string[];
}

export function PostDetails() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${postId}`);
        setPost(response.data);
      } catch (err) {
        console.error('Failed to fetch post', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 flex justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center card">
        <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
        <p className="text-text-muted mb-6">The story you are looking for does not exist.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in py-8 px-4">
      <article className="mb-12">
        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-6">
            {post.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-surface text-primary rounded-full text-xs font-semibold tracking-wide uppercase">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y border-border py-4 gap-4">
            <div className="flex items-center gap-4">
              <img 
                src={`https://ui-avatars.com/api/?name=${post.authorName}&background=3B82F6&color=fff`} 
                alt={post.authorName} 
                className="h-12 w-12 rounded-full border-2 border-surface" 
              />
              <div>
                <div className="font-bold text-text-main text-lg hover:text-primary transition-colors cursor-pointer">
                  {post.authorName}
                </div>
                <div className="text-sm text-text-muted">
                  {post.createdDate ? format(new Date(post.createdDate), 'MMMM d, yyyy') : 'Unknown date'} • 5 min read
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-center sm:self-auto">
              <button className="btn-ghost text-text-muted hover:text-accent" title="Save Bookmark">
                <Bookmark className="h-5 w-5" />
              </button>
              <button className="btn-ghost text-text-muted hover:text-primary" title="Share Story">
                <Share2 className="h-5 w-5" />
              </button>
              <button onClick={() => setIsReportOpen(true)} className="btn-ghost text-text-muted hover:text-red-400" title="Report">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Cover Image Placeholder */}
        <div className="w-full h-64 sm:h-96 bg-surface rounded-2xl mb-12 overflow-hidden border border-border">
          <img 
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80" 
            alt="Cover" 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Content Body */}
        <div className="prose prose-invert prose-lg max-w-none text-text-muted leading-relaxed font-serif">
          {/* Mock formatting for demo since content might just be plain text */}
          {(post.content || '').split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-6 text-lg text-text-main/90">{paragraph}</p>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between border-y border-border py-6 mt-12">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-text-muted hover:text-red-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-red-500/10">
                <Heart className="h-6 w-6 group-active:scale-125 transition-transform" />
              </div>
              <span className="font-medium">124 Likes</span>
            </button>
            <button className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-primary/10">
                <MessageSquare className="h-6 w-6 group-active:scale-125 transition-transform" />
              </div>
              <span className="font-medium">42 Comments</span>
            </button>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="bg-surface/30 rounded-2xl p-6 sm:p-10 border border-border">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          Responses (42)
        </h2>
        <CommentSection postId={postId!} />
      </section>

      {/* Modals */}
      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} postId={postId!} />
    </div>
  );
}
