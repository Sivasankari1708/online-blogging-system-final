import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlipCard } from './FlipCard';

interface Post {
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
}

interface MasonryGridProps {
  posts: Post[];
}

export function MasonryGrid({ posts }: MasonryGridProps) {
  const [columnCount, setColumnCount] = useState(3);

  // Responsive column calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumnCount(1);
      } else if (window.innerWidth < 1024) {
        setColumnCount(2);
      } else {
        setColumnCount(3);
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Algorithmic column distribution
  const columns: Post[][] = Array.from({ length: columnCount }, () => []);
  posts.forEach((post, idx) => {
    columns[idx % columnCount].push(post);
  });

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.96 
    },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 140,
        damping: 18,
      }
    },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className="flex gap-6 w-full items-start"
    >
      {columns.map((column, colIdx) => (
        <motion.div 
          key={colIdx} 
          className="flex-1 flex flex-col gap-6"
        >
          {column.map((post) => (
            <motion.div 
              key={post.id}
              variants={itemVariants}
              className="w-full"
            >
              <FlipCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      ))}
    </motion.div>
  );
}
