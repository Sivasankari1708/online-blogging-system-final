import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Settings, MapPin, Link as LinkIcon, 
  Calendar, Edit3, Loader2, Sparkles, Bookmark
} from 'lucide-react';
import api from '../services/api';
import { MasonryGrid } from '../components/MasonryGrid';

export function Profile() {
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'bookmarks' | 'network'>('posts');
  
  const currentUserId = localStorage.getItem('userId');
  const currentUserName = localStorage.getItem('username');

  // SVG network nodes simulation
  const [graphNodes, setGraphNodes] = useState<any[]>([]);

  useEffect(() => {
    // Generate random coordinates for follower graph
    const nodes = Array.from({ length: 8 }, (_, idx) => ({
      id: idx,
      x: 80 + Math.random() * 240,
      y: 60 + Math.random() * 120,
      name: `Follower ${idx + 1}`,
      size: 4 + Math.random() * 6
    }));
    setGraphNodes(nodes);
  }, []);

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        const [followersRes, followingRes, postsRes] = await Promise.all([
          api.get(`/social/followers/${currentUserId}/count`),
          api.get(`/social/following/${currentUserId}/count`),
          api.get('/posts/published').catch(() => ({ data: [] }))
        ]);
        
        setFollowers(followersRes.data.count);
        setFollowing(followingRes.data.count);

        // Filter posts owned by this user
        const myPosts = (postsRes.data || []).filter((post: any) => post.authorId === currentUserId).map((post: any, idx: number) => {
          const images = [
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
          ];
          return {
            ...post,
            coverImage: post.coverImage || images[idx % images.length],
            likesCount: post.likesCount || Math.floor(Math.random() * 40) + 5,
            readingTime: post.readingTime || 4
          };
        });
        setPosts(myPosts);
      } catch (err) {
        console.error('Failed to fetch profile stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col justify-center items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-sm text-text-muted">Assembling portfolio canvas...</p>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="max-w-md mx-auto py-20 text-center glass-panel p-8 mt-10 rounded-3xl border border-white/5">
        <User className="h-10 w-10 mx-auto text-white/20 mb-4" />
        <h2 className="text-xl font-bold mb-2 font-display">Not Logged In</h2>
        <p className="text-xs text-text-muted mb-6">Please sign in to view your profile.</p>
        <Link to="/login" className="btn-primary w-full py-2.5">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-12 animate-fade-in">
      
      {/* LAYERED COVER & STICKY PROFILE HEADER */}
      <div className="w-full rounded-3xl overflow-hidden relative border border-white/5 bg-[#161616]/30 shadow-2xl mb-12">
        
        {/* Dynamic Cover Image with parallax gradient */}
        <div className="h-56 md:h-72 w-full relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" 
            alt="Portfolio Cover" 
            className="w-full h-full object-cover scale-102 filter brightness-[0.8]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
          
          <button className="absolute top-4 right-4 bg-[#161616]/60 border border-white/10 hover:bg-[#161616]/95 hover:scale-105 text-white/80 hover:text-white p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer">
            <Settings className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Floating Stats Block & Avatar */}
        <div className="px-6 md:px-12 pb-10 relative">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-20 md:-mt-24 mb-6 gap-6">
            {/* Immersive Profile Avatar */}
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full p-[1px] bg-gradient-to-tr from-accent to-highlight-blue shadow-2xl relative z-10 overflow-hidden">
              <div className="h-full w-full rounded-full bg-[#161616] flex items-center justify-center text-white text-5xl font-extrabold font-display">
                {currentUserName?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Stats Capsule Dock */}
            <div className="glass-panel border border-white/10 px-6 py-3.5 rounded-full flex gap-8 shadow-xl">
              <div className="text-center">
                <div className="text-sm font-bold text-white leading-tight font-display">{followers}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Followers</div>
              </div>
              <div className="w-px h-8 bg-white/5"></div>
              <div className="text-center">
                <div className="text-sm font-bold text-white leading-tight font-display">{following}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Following</div>
              </div>
              <div className="w-px h-8 bg-white/5"></div>
              <div className="text-center">
                <div className="text-sm font-bold text-white leading-tight font-display">{posts.length}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Stories</div>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold text-white mb-2 font-display">{currentUserName}</h1>
            <p className="text-sm text-accent font-semibold mb-4 tracking-wide flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Editorial Creator & Technologist
            </p>
            <p className="text-xs text-text-muted leading-relaxed font-light mb-6">
              Exploring the intersections of decentralized platforms, scalable networks, and modular visual design. Sharing stories to challenge paradigms.
            </p>

            <div className="flex flex-wrap gap-4 text-[11px] font-semibold text-white/55">
              <div className="flex items-center gap-1 bg-white/3 border border-white/5 px-3 py-1 rounded-full">
                <MapPin className="h-3.5 w-3.5" /> San Francisco, CA
              </div>
              <div className="flex items-center gap-1 bg-white/3 border border-white/5 px-3 py-1 rounded-full cursor-pointer hover:text-white transition-colors">
                <LinkIcon className="h-3.5 w-3.5" /> <a href="#">github.com/{currentUserName?.toLowerCase()}</a>
              </div>
              <div className="flex items-center gap-1 bg-white/3 border border-white/5 px-3 py-1 rounded-full">
                <Calendar className="h-3.5 w-3.5" /> Joined July 2026
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* PORTFOLIO NAVIGATION TABS */}
      <div className="flex justify-center border-b border-white/5 mb-12 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === 'posts' ? 'border-accent text-white' : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          <Edit3 className="h-3.5 w-3.5 inline mr-1.5" /> Published Stories
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === 'bookmarks' ? 'border-accent text-white' : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          <Bookmark className="h-3.5 w-3.5 inline mr-1.5" /> Collections
        </button>
        <button
          onClick={() => setActiveTab('network')}
          className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === 'network' ? 'border-accent text-white' : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 inline mr-1.5" /> Follower Network
        </button>
      </div>

      {/* TAB CONTENT SPACES */}
      <div className="w-full min-h-[40vh]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: USER'S STORIES */}
          {activeTab === 'posts' && (
            <motion.div
              key="tab-posts"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full"
            >
              {posts.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-[#161616]/10">
                  <Edit3 className="h-10 w-10 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2 font-display">No stories published yet</h3>
                  <p className="text-xs text-text-muted mb-6">Start sharing your thoughts with the cosmos.</p>
                  <Link to="/create" className="btn-primary">Write a Story</Link>
                </div>
              ) : (
                <MasonryGrid posts={posts} />
              )}
            </motion.div>
          )}

          {/* TAB 2: COLLECTIONS / SAVED CARDS */}
          {activeTab === 'bookmarks' && (
            <motion.div
              key="tab-collections"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-[#161616]/10"
            >
              <Bookmark className="h-10 w-10 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2 font-display">No collections curated</h3>
              <p className="text-xs text-text-muted">Pin articles to your board to start curating.</p>
            </motion.div>
          )}

          {/* TAB 3: FOLLOWER NETWORK CHART */}
          {activeTab === 'network' && (
            <motion.div
              key="tab-network"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="w-full md:w-1/2 glass-panel border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-white mb-2 font-display">Dynamic Follower Network</h3>
                <p className="text-xs text-text-muted leading-relaxed mb-6 font-light">
                  A volumetric visual representation of your closest creator connections. Tap on a node to inspect profile graphs and follow channels.
                </p>
                <div className="flex gap-4">
                  <div className="text-center">
                    <span className="text-xs font-bold text-white block">Cluster Density</span>
                    <span className="text-[10px] text-accent uppercase tracking-wider font-semibold">92.4% Optimal</span>
                  </div>
                  <div className="w-px h-8 bg-white/5"></div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-white block">Interactions</span>
                    <span className="text-[10px] text-highlight-blue uppercase tracking-wider font-semibold">Stably Active</span>
                  </div>
                </div>
              </div>

              {/* Glowing SVG followers graph canvas */}
              <div className="w-full md:w-1/2 h-[260px] glass-panel border border-slate-900/5 rounded-3xl relative overflow-hidden shadow-xl bg-slate-500/5">
                <svg className="w-full h-full">
                  {/* Central Node links */}
                  {graphNodes.map((node) => (
                    <line
                      key={`line-${node.id}`}
                      x1="200"
                      y1="130"
                      x2={node.x}
                      y2={node.y}
                      stroke="rgba(30, 58, 138, 0.25)"
                      strokeWidth="1.2"
                      strokeDasharray="4, 4"
                    />
                  ))}
                  
                  {/* Outer connections link lines */}
                  {graphNodes.slice(0, -1).map((node, i) => (
                    <line
                      key={`link-${node.id}`}
                      x1={node.x}
                      y1={node.y}
                      x2={graphNodes[i + 1].x}
                      y2={graphNodes[i + 1].y}
                      stroke="rgba(37, 99, 235, 0.15)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Central User Node */}
                  <circle cx="200" cy="130" r="14" fill="url(#gradAccent)" className="animate-pulse" />
                  <text x="200" y="134" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">U</text>

                  {/* Follower nodes */}
                  {graphNodes.map((node) => (
                    <g key={node.id} className="cursor-pointer">
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.size}
                        fill="rgba(15, 23, 42, 0.08)"
                        stroke="rgba(15, 23, 42, 0.2)"
                        strokeWidth="1"
                      />
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.size - 2}
                        fill="url(#gradBlue)"
                      />
                    </g>
                  ))}

                  {/* SVG gradients */}
                  <defs>
                    <linearGradient id="gradAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E3A8A" />
                      <stop offset="100%" stopColor="#2563EB" />
                    </linearGradient>
                    <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#1E3A8A" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
