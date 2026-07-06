import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    createdDate: string;
    tags: string[];
    coverImageURL?: string;
    readingTime?: number;
  };
}

export function BlogCard({ post }: BlogCardProps) {
  // Placeholder images for design purposes if not provided by backend
  const coverImage = post.coverImageURL || (post.tags?.includes('architecture') 
    ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80');

  const readingTime = post.readingTime || Math.floor(Math.random() * 6) + 4;
  
  return (
    <article className="border border-slate-900/5 bg-[#FFFFFF] rounded-[24px] overflow-hidden group shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
      <Link to={`/post/${post.id}`} className="block relative aspect-video overflow-hidden border-b border-slate-900/5">
        <img 
          src={coverImage} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="p-6 flex flex-col flex-grow justify-between text-left">
        <div>
          {/* Category Tag */}
          {post.tags && post.tags.length > 0 && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              {post.tags[0]}
            </span>
          )}

          {/* Title */}
          <Link to={`/post/${post.id}`}>
            <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-accent transition-colors font-display mb-2 line-clamp-2">
              {post.title}
            </h3>
          </Link>

          {/* Author Sub-label */}
          <div className="text-xs text-slate-500 mb-6 font-medium">
            By {post.authorName}
          </div>
        </div>

        {/* Card Footer: Metadata and Arrow Indicator */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-900/5 mt-auto">
          <span className="text-xs font-semibold text-slate-900">
            {readingTime} Min Read
          </span>
          <Link 
            to={`/post/${post.id}`} 
            className="text-slate-400 group-hover:text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            title="Read Story"
          >
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
