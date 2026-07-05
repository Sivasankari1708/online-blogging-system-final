import { useState, useRef, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { format } from 'date-fns';
import { Heart, MessageSquare, Bookmark, Clock, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    createdDate: string;
    tags: string[];
    coverImage?: string;
    authorImage?: string;
    readingTime?: number;
    likesCount?: number;
    commentsCount?: number;
  };
}

export function FlipCard({ post }: BlogCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse hover 3D tilt calculations
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateXSpring = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 250, damping: 25 });
  const rotateYSpring = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 250, damping: 25 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Image fallback
  const coverImage = post.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
  const authorImage = post.authorImage || `https://ui-avatars.com/api/?name=${post.authorName}&background=7C3AED&color=fff`;
  
  // Stripped HTML text excerpt
  const excerpt = post.content.replace(/<[^>]*>?/gm, '').substring(0, 140) + '...';

  // Toggle card flip
  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="w-full relative cursor-pointer perspective-1000 select-none h-[420px] md:h-[450px]"
      onClick={handleCardClick}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isFlipped ? 0 : rotateXSpring,
          rotateY: isFlipped ? 180 : rotateYSpring,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }}
        className="w-full h-full relative duration-100 border border-white/5 bg-[#161616]/40 backdrop-blur-md rounded-2xl shadow-xl flex flex-col justify-between"
      >
        
        {/* CARD FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full rounded-2xl flex flex-col justify-between backface-hidden overflow-hidden z-10">
          
          {/* Card Media Header */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden">
            <img 
              src={coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-[800ms] hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
            
            {/* Tags floating */}
            <div className="absolute top-4 left-4 flex gap-1.5 z-20">
              {post.tags?.slice(0, 1).map((tag, i) => (
                <span key={i} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-accent text-white border border-white/10 shadow-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card Text Content */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-bold line-clamp-2 leading-tight tracking-tight text-white mb-2 font-display">
                {post.title}
              </h3>
              <p className="text-xs text-text-muted line-clamp-2 md:line-clamp-3 leading-relaxed mb-4">
                {excerpt}
              </p>
            </div>

            {/* Author Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <img src={authorImage} alt={post.authorName} className="h-6 w-6 rounded-full border border-white/10" />
                <span className="text-xs font-semibold text-white/80">{post.authorName}</span>
              </div>
              <span className="text-[10px] text-white/50 tracking-wider uppercase font-semibold">
                {post.createdDate ? format(new Date(post.createdDate), 'MMM d') : 'New'}
              </span>
            </div>
          </div>

        </div>

        {/* CARD BACK SIDE */}
        <div className="absolute inset-0 w-full h-full rounded-2xl glass-panel p-6 flex flex-col justify-between backface-hidden rotate-y-180 z-20">
          
          {/* Back Header: Author Detail & Read Time */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2.5">
              <img src={authorImage} alt={post.authorName} className="h-7 w-7 rounded-full border border-white/10" />
              <div>
                <h4 className="text-xs font-bold text-white leading-none">{post.authorName}</h4>
                <span className="text-[9px] text-text-muted">Creator</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] font-semibold text-white/70 bg-white/5 px-2.5 py-1 rounded-full">
              <Clock className="h-3 w-3" />
              <span>{post.readingTime || 4} Min Read</span>
            </div>
          </div>

          {/* Excerpt Summary */}
          <div className="flex-1 py-4 flex flex-col justify-center">
            <span className="text-[9px] uppercase font-bold tracking-wider text-accent mb-1.5 block">Summary</span>
            <p className="text-xs md:text-sm text-white/80 leading-relaxed font-light italic">
              "{excerpt}"
            </p>
            
            {/* Tag List */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {post.tags?.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-[9px] font-semibold px-2 py-0.5 rounded bg-white/5 text-white/60">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions & Read Full Link */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              
              {/* Like Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Stop card from flipping back
                }}
                className="flex items-center gap-1.5 text-white/50 hover:text-red-400 transition-colors text-xs cursor-pointer group/btn"
              >
                <Heart className="h-3.5 w-3.5 group-active/btn:scale-125 transition-transform" />
                <span>{post.likesCount || 0}</span>
              </button>

              {/* Comments count */}
              <div className="flex items-center gap-1.5 text-white/50 text-xs">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{post.commentsCount || 0}</span>
              </div>

              {/* Bookmark Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Stop card from flipping back
                }}
                className="p-1.5 rounded-full hover:bg-white/5 text-white/50 hover:text-white cursor-pointer"
              >
                <Bookmark className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Link to details */}
            <Link
              to={`/post/${post.id}`}
              onClick={(e) => e.stopPropagation()} // Stop flip
              className="flex items-center gap-1 text-[11px] font-bold text-white hover:text-accent transition-colors group/link"
            >
              <span>Read Full</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
