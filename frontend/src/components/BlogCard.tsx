import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart, MessageSquare, Bookmark, Share2, Clock } from 'lucide-react';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    content: string; // Excerpt
    authorId: string;
    authorName: string;
    createdDate: string;
    tags: string[];
    // New fields for the redesign
    coverImage?: string;
    authorImage?: string;
    readingTime?: number;
    likesCount?: number;
    commentsCount?: number;
  };
}

export function BlogCard({ post }: BlogCardProps) {
  // Placeholder images for design purposes if not provided by backend
  const coverImage = post.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
  const authorImage = post.authorImage || `https://ui-avatars.com/api/?name=${post.authorName}&background=3B82F6&color=fff`;
  
  // Strip HTML for excerpt
  const excerpt = post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
  
  return (
    <article className="card overflow-hidden group">
      {/* Cover Image */}
      <Link to={`/post/${post.id}`} className="block relative h-48 overflow-hidden">
        <img 
          src={coverImage} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </Link>

      <div className="p-5">
        {/* Author & Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={authorImage} alt={post.authorName} className="h-8 w-8 rounded-full border border-border" />
            <div>
              <div className="font-medium text-sm text-text-main hover:text-primary transition-colors cursor-pointer">
                {post.authorName}
              </div>
              <div className="text-xs text-text-muted flex items-center gap-2">
                <span>{post.createdDate ? format(new Date(post.createdDate), 'MMM d, yyyy') : 'Unknown date'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {post.readingTime || 5} min read
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <Link to={`/post/${post.id}`}>
          <h2 className="text-xl font-bold mb-2 text-text-main group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-text-muted text-sm line-clamp-3 mb-4 leading-relaxed">
            {excerpt}
          </p>
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags?.slice(0, 3).map((tag, i) => (
            <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-md bg-surface border border-border text-text-muted hover:text-text-main hover:border-text-muted cursor-pointer transition-colors">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-text-muted hover:text-red-400 transition-colors text-sm group/btn">
              <Heart className="h-4 w-4 group-active/btn:scale-125 transition-transform" /> 
              <span>{post.likesCount || 0}</span>
            </button>
            <button className="flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors text-sm group/btn">
              <MessageSquare className="h-4 w-4 group-active/btn:scale-125 transition-transform" /> 
              <span>{post.commentsCount || 0}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-ghost p-1.5 hover:text-accent" title="Bookmark">
              <Bookmark className="h-4 w-4" />
            </button>
            <button className="btn-ghost p-1.5 hover:text-primary" title="Share">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
