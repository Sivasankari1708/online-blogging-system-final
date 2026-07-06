import { useEffect, useState } from 'react';
import { Compass, Search, ArrowRight, ArrowUpRight, Sparkles, Loader2, Quote } from 'lucide-react';
import api from '../services/api';
import { useSearchParams, Link } from 'react-router-dom';
import { BlogCard } from '../components/BlogCard';

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  const initialCategory = searchParams.get('c') || 'All';

  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);

  // Sync state to URL whenever it changes
  const updateFilters = (newSearch: string, newCategory: string) => {
    setSearch(newSearch);
    setActiveCategory(newCategory);
    setSearchParams({ q: newSearch, c: newCategory }, { replace: true });
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts/published');
        // Enrich posts with fallback metrics/images
        const enriched = (response.data || []).map((post: any, idx: number) => {
          const images = [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
          ];
          return {
            ...post,
            coverImage: post.coverImageURL || images[idx % images.length],
            likesCount: post.likesCount || 0,
            readingTime: post.readingTime || Math.floor(Math.random() * 6) + 4
          };
        });
        setPosts(enriched);
      } catch (err) {
        console.error('Failed to load explore posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const categories = ['All', 'Architecture', 'Design', 'Technology', 'Philosophy', 'Productivity', 'Lifestyle'];

  const filteredPosts = posts.filter(post => {
    const searchLower = search.toLowerCase();
    const tagsArray = Array.isArray(post.tags) ? post.tags : (typeof post.tags === 'string' ? [post.tags] : []);
    
    const matchesSearch = (post.title || '').toLowerCase().includes(searchLower) || 
                          (post.content || '').toLowerCase().includes(searchLower) ||
                          (post.categoryName || '').toLowerCase().includes(searchLower) ||
                          tagsArray.some((tag: any) => (tag || '').toLowerCase().includes(searchLower));
    
    const matchesCategory = activeCategory === 'All' || 
                            (post.categoryName || '').toLowerCase() === activeCategory.toLowerCase();
                            
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const remainingPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return (
    <div className="w-full pb-16 animate-fade-in text-left">
      
      {/* 1. CURATED DISCOVERY HEADER */}
      <header className="mb-12 max-w-4xl">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 leading-tight mb-4 font-display tracking-tight">
          Curated Discovery.
        </h1>
        <p className="text-base text-slate-500 font-medium leading-relaxed max-w-2xl">
          Sift through the noise. Explore hand-picked editorial excellence across technology, philosophy, and modern living.
        </p>
      </header>

      {/* 2. CATEGORY SELECTOR & SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-10 border-b border-slate-900/5 pb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilters(search, cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-900/5 text-slate-500 hover:bg-slate-900/10 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search keywords..."
            value={search}
            onChange={(e) => updateFilters(e.target.value, activeCategory)}
            className="w-full h-10 pl-10 pr-4 rounded-full bg-slate-900/5 border border-transparent focus:outline-none focus:bg-white focus:border-slate-900/10 text-sm font-medium transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-900/10 rounded-3xl bg-slate-900/2">
          <Sparkles className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2 font-display">No publications found</h3>
          <p className="text-xs text-slate-500">There are no articles available under this filter. Try a different search.</p>
          <button 
            onClick={() => updateFilters('', 'All')}
            className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-slate-800 hover:scale-105 transition-all cursor-pointer shadow-lg"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          
          {/* 3. TWO-COLUMN SPLIT GRID */}
          {featuredPost && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* LEFT SIDE: LARGE FEATURED SPOTLIGHT CARD */}
              <div className="lg:col-span-8 flex flex-col justify-between border border-slate-900/5 bg-[#FFFFFF] rounded-[24px] overflow-hidden group shadow-lg transition-transform duration-300">
                <Link to={`/post/${featuredPost.id}`} className="block relative aspect-video w-full overflow-hidden border-b border-slate-900/5">
                  <img 
                    src={featuredPost.coverImage} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  {/* Category Pill Overlay */}
                  <div className="absolute top-6 left-6">
                    <span className="px-3.5 py-1 bg-slate-950/70 backdrop-blur-md text-white rounded-full text-[10px] font-bold tracking-wider uppercase">
                      DEEP READ
                    </span>
                  </div>
                </Link>

                <div className="p-8 flex flex-col justify-between flex-grow text-left">
                  <div>
                    <Link to={`/post/${featuredPost.id}`}>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight group-hover:text-accent transition-colors font-display mb-4">
                        {featuredPost.title}
                      </h2>
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-6 border-t border-slate-900/5 mt-6">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-800 border border-slate-900/10">
                      {featuredPost.authorName.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-slate-900">
                      By {featuredPost.authorName}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {featuredPost.readingTime || 12} min read
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: TRENDING & PRODUCTIVITY CARDS */}
              <div className="lg:col-span-4 flex flex-col gap-8 justify-between">
                
                {/* Box 1: Trending Topics */}
                <div className="glass-panel p-6 rounded-[24px] border border-slate-900/5 flex flex-col gap-4 text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                    Trending Topics
                  </span>
                  
                  <div className="flex flex-col gap-3.5 mt-2">
                    <button onClick={() => updateFilters('GenerativeEthics', activeCategory)} className="flex items-center justify-between group/link py-1 border-b border-slate-900/5 pb-2 text-sm font-bold text-slate-800 hover:text-slate-950 transition-colors w-full cursor-pointer">
                      <span>#GenerativeEthics</span>
                      <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover/link:text-slate-900 transition-colors" />
                    </button>
                    <button onClick={() => updateFilters('SlowLiving', activeCategory)} className="flex items-center justify-between group/link py-1 border-b border-slate-900/5 pb-2 text-sm font-bold text-slate-800 hover:text-slate-950 transition-colors w-full cursor-pointer">
                      <span>#SlowLiving</span>
                      <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover/link:text-slate-900 transition-colors" />
                    </button>
                    <button onClick={() => updateFilters('BrutalistUI', activeCategory)} className="flex items-center justify-between group/link py-1 text-sm font-bold text-slate-800 hover:text-slate-950 transition-colors w-full cursor-pointer">
                      <span>#BrutalistUI</span>
                      <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover/link:text-slate-900 transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Box 2: Productivity Card */}
                <div className="border border-slate-900/5 bg-[#FFFFFF] rounded-[24px] overflow-hidden shadow-lg p-6 text-left flex flex-col justify-between flex-grow cursor-pointer group/card" onClick={() => updateFilters(search, 'Productivity')}>
                  <div className="w-full h-32 rounded-xl overflow-hidden mb-4 border border-slate-900/5">
                    <img 
                      src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80" 
                      alt="Productivity stacks" 
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      PRODUCTIVITY
                    </span>
                    <h4 className="text-base font-bold text-slate-900 leading-snug mb-1 font-display group-hover/card:text-accent transition-colors">
                      Tools for the Intentional Writer.
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-normal mb-4 font-light">
                      Curating the digital stack that favors clarity over clutter.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-950 group-hover/card:text-accent transition-colors pt-2 border-t border-slate-900/5 w-full">
                    <span>EXPLORE CATEGORY</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 4. SUBSEQUENT POSTS GRID WITH WEEKLY QUOTE */}
          {remainingPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 items-stretch">
              
              {/* Place Quote Card as the first card in the grid to match spacing */}
              <div className="border border-slate-900/5 bg-slate-900/2 rounded-[24px] p-6 text-left flex flex-col justify-between relative shadow-sm min-h-[300px]">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                    Weekly Quote
                  </span>
                  <Quote className="h-6 w-6 text-slate-900/10 rotate-180" />
                </div>
                
                <p className="text-base italic font-display text-slate-900 leading-relaxed my-6">
                  "Design is not just what it looks like and feels like. Design is how it works when there is nothing left to take away."
                </p>
                
                <div className="text-xs text-slate-500 font-semibold pt-4 border-t border-slate-900/5">
                  &mdash; Editorial Board
                </div>
              </div>

              {/* Render rest of the posts */}
              {remainingPosts.slice(0, 8).map((post) => (
                <div key={post.id} className="h-full">
                  <BlogCard post={post} />
                </div>
              ))}

            </div>
          )}

        </div>
      )}

    </div>
  );
}
