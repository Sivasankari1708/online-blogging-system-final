import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Loader2, Edit3, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../services/api';
import { MasonryGrid } from '../components/MasonryGrid';

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts/published');
        
        // Enrich posts with placeholders if cover images or details are missing
        const enriched = response.data.map((post: any, idx: number) => {
          const images = [
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80'
          ];
          return {
            ...post,
            coverImage: post.coverImage || images[idx % images.length],
            readingTime: post.readingTime || Math.floor(Math.random() * 5) + 3,
            likesCount: post.likesCount || Math.floor(Math.random() * 80) + 12,
            commentsCount: post.commentsCount || Math.floor(Math.random() * 15) + 2
          };
        });

        setPosts(enriched);
      } catch (err) {
        console.error('Failed to fetch posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // GSAP 3D Convergence Scroll Animation
  useEffect(() => {
    if (loading || posts.length === 0) return;

    // Create the pinned ScrollTrigger timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        pin: '.hero-pinned-container',
      }
    });

    // Convergence movement definitions for 5 scattered items
    tl.to('.converge-card-1', { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, filter: 'blur(0px)', opacity: 1, scale: 1 }, 0)
      .to('.converge-card-2', { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, filter: 'blur(0px)', opacity: 1, scale: 1 }, 0)
      .to('.converge-card-3', { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, filter: 'blur(0px)', opacity: 1, scale: 1 }, 0)
      .to('.converge-card-4', { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, filter: 'blur(0px)', opacity: 1, scale: 1 }, 0)
      .to('.converge-card-5', { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, filter: 'blur(0px)', opacity: 1, scale: 1 }, 0)
      // Fade out background details and morph titles
      .to('.hero-title-main', { scale: 0.9, opacity: 0.25, filter: 'blur(5px)' }, 0)
      .to('.scroll-indicator', { opacity: 0, y: -20 }, 0);

    return () => {
      // Clean up ScrollTrigger bindings on unmount to avoid ghost instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [loading, posts]);

  return (
    <div ref={containerRef} className="w-full relative">
      
      {/* SECTION 1: CINEMATIC 3D CONVERGENCE HERO */}
      <div ref={heroRef} className="relative h-[220vh] w-full z-20 select-none">
        <div className="hero-pinned-container sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
          
          {/* Centered Editorial Title */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center absolute z-20 pointer-events-none max-w-4xl px-6"
          >
            <h1 className="hero-title-main text-5xl sm:text-7xl lg:text-9xl font-extrabold uppercase tracking-tighter text-white font-display mb-6 leading-none">
              COSMOS
            </h1>
            <p className="text-sm md:text-base uppercase tracking-[0.2em] text-white/50 font-medium">
              A Living Journal of Thoughts, Tech, and Human Ideals
            </p>
          </motion.div>

          {/* 3D Scattered Canvas Cards */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none perspective-1000">
            {posts.slice(0, 5).map((post, idx) => {
              // Pre-calculated scattered coordinate styles
              const scatteredPositions = [
                { x: '-28vw', y: '-22vh', z: '-200px', rx: 12, ry: -15, rz: -10, b: '10px', op: 0.4 }, // Top-Left
                { x: '24vw', y: '-25vh', z: '-120px', rx: -10, ry: 12, rz: 8, b: '6px', op: 0.5 },    // Top-Right
                { x: '-25vw', y: '22vh', z: '-150px', rx: 15, ry: -8, rz: -12, b: '8px', op: 0.6 },    // Bottom-Left
                { x: '26vw', y: '20vh', z: '-250px', rx: -8, ry: 15, rz: 14, b: '12px', op: 0.4 },    // Bottom-Right
                { x: '0px', y: '-30vh', z: '-80px', rx: 5, ry: -5, rz: 5, b: '4px', op: 0.7 }         // Central elevated
              ];
              const pos = scatteredPositions[idx];

              return (
                <div
                  key={post.id}
                  className={`converge-card-${idx + 1} absolute w-[240px] md:w-[310px] h-[340px] md:h-[400px] border border-white/5 bg-[#161616]/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl pointer-events-auto`}
                  style={{
                    transform: `translate3d(${pos.x}, ${pos.y}, ${pos.z}) rotateX(${pos.rx}deg) rotateY(${pos.ry}deg) rotateZ(${pos.rz}deg)`,
                    filter: `blur(${pos.b})`,
                    opacity: pos.op,
                  }}
                >
                  <img src={post.coverImage} className="w-full h-44 object-cover" alt="" />
                  <div className="p-4 flex flex-col justify-between h-[calc(100%-11rem)]">
                    <h3 className="text-base font-bold text-white line-clamp-2 leading-snug tracking-tight font-display">
                      {post.title}
                    </h3>
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-[10px] font-semibold text-white/50">{post.authorName}</span>
                      <span className="text-[10px] text-accent font-bold">Read Full →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scrolling indicator */}
          <div className="scroll-indicator absolute bottom-12 flex flex-col items-center gap-2 pointer-events-none">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Scroll to Explore</span>
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <ArrowDown className="h-4 w-4 text-white/40" />
            </motion.div>
          </div>

        </div>
      </div>

      {/* SECTION 2: EDITORIAL MASONRY GALLERY */}
      <section className="relative z-30 pt-16 border-t border-white/5 bg-[#0A0A0A] w-full min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 max-w-2xl"
        >
          <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="h-4.5 w-4.5" />
            <span>Discover Cosmos</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none font-display">
            Stories that shape perspectives.
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-[#161616]/20">
            <Edit3 className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No publications yet</h3>
            <p className="text-text-muted mb-6">Be the first to publish a cinematic article.</p>
            <Link to="/create" className="btn-primary">Write a Story</Link>
          </div>
        ) : (
          <div className="w-full">
            <MasonryGrid posts={posts} />
          </div>
        )}
      </section>

    </div>
  );
}
