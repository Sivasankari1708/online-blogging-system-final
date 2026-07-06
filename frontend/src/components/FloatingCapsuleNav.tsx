import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Compass, Edit3, Bookmark, 
  Bell, LogOut, User
} from 'lucide-react';

export function FloatingCapsuleNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '/create', icon: Edit3, label: 'Write' },
    { to: '/bookmarks', icon: Bookmark, label: 'Saved' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  // Magnetic cursor hover helper state
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [showToast, setShowToast] = useState(false);



  const isNavCollapsed = isScrolled && !isHovered;

  const handleSubscribe = () => {
    setSubscribed(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="fixed top-0 md:top-6 left-0 right-0 z-50 flex flex-col items-center gap-4 pointer-events-none">
      {/* Dynamic Translucent Floating Capsule Nav */}
      <motion.nav 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredIdx(null);
        }}
        animate={{
          width: isNavCollapsed ? 'fit-content' : '90%',
          maxWidth: isNavCollapsed ? '340px' : '920px',
          height: isNavCollapsed ? '52px' : '64px',
          borderRadius: '999px',
          y: isScrolled ? 10 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 24
        }}
        className="pointer-events-auto glass-nav-dock flex items-center justify-between px-4 md:px-6 w-full text-slate-800 transition-shadow duration-300"
        style={{
          boxShadow: isScrolled 
            ? '0 20px 40px -15px rgba(0,0,0,0.06), 0 0 0 1px rgba(15,23,42,0.04)' 
            : '0 8px 30px rgba(0,0,0,0.03)',
        }}
      >
        {/* LOGO */}
        <AnimatePresence>
          {!isNavCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -15, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 'auto' }}
              exit={{ opacity: 0, x: -15, width: 0 }}
              className="flex items-center gap-2 group mr-4"
            >
              <Link to="/" className="flex items-center gap-2">
                <span className="text-xl logo-font">
                  Blog.it
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CORE LINKS */}
        <div className="flex items-center space-x-1 relative">
          {isAuthenticated ? (
            navLinks.map((link, idx) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              const showText = !isNavCollapsed;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  className="relative flex flex-col items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  {/* Hover glow capsule background */}
                  {hoveredIdx === idx && (
                    <motion.div
                      layoutId="hoverGlow"
                      className="absolute inset-0 bg-slate-900/5 rounded-full z-0 border border-slate-900/5"
                      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-2">
                    <Icon className={`h-4 w-4 transition-colors duration-300 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
                    <AnimatePresence>
                      {showText && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className={`text-sm font-medium overflow-hidden tracking-wide transition-colors duration-300 whitespace-nowrap ${
                            isActive ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {link.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Active dot indicator beneath the text (as in mockup) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute bottom-0 w-1 h-1 bg-slate-900 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                </Link>
              );
            })
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/" className="text-xs font-semibold hover:text-slate-900 text-slate-500 px-3 py-2">Home</Link>
              <Link to="/explore" className="text-xs font-semibold hover:text-slate-900 text-slate-500 px-3 py-2">Explore</Link>
            </div>
          )}
        </div>

        {/* RIGHT SECTION (Subscribe Capsule Button, Profile, Notifications, Logout) */}
        <div className="flex items-center gap-3.5 ml-4">
          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <AnimatePresence>
                {!isNavCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Link 
                      to="/notifications" 
                      className={`relative p-2 rounded-full hover:bg-slate-900/5 block ${location.pathname === '/notifications' ? 'text-slate-900' : 'text-slate-500'}`}
                      title="Notifications"
                    >
                      <Bell className="h-4.5 w-4.5" />
                      <span className="absolute top-2 right-2 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
                      </span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Subscribe button (mock capsule as in screenshot) */}
              <AnimatePresence>
                {!isNavCollapsed && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={handleSubscribe}
                    className={`px-5 py-2 text-xs font-bold rounded-full cursor-pointer transition-all ${
                      subscribed 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : 'bg-slate-900 text-black hover:bg-slate-800'
                    }`}
                  >
                    {subscribed ? 'Subscribed' : 'Subscribe'}
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Logout Button */}
              <AnimatePresence>
                {!isNavCollapsed && (
                  <motion.button 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    onClick={handleLogout}
                    className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-500/10 cursor-pointer overflow-hidden"
                    title="Logout"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-slate-950 px-2 py-1 whitespace-nowrap">
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-slate-900 text-black text-xs font-semibold px-4 py-2 rounded-full hover:bg-slate-800 hover:scale-102 active:scale-97 shadow-sm transition-all whitespace-nowrap"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Floating Subscribe Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-500 text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold pointer-events-auto border border-emerald-400/20"
          >
            ✓ Thank you for subscribing to Blog.it!
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM FLOAT NAV (Rendered inside the capsule system logic for simple adaptivity) */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-sm glass-nav-dock h-14 rounded-full flex items-center justify-around px-4 shadow-2xl">
          {isAuthenticated ? (
            <>
              <Link to="/" className={`p-2 rounded-full ${location.pathname === '/' ? 'text-slate-900 bg-slate-900/5' : 'text-slate-500'}`}>
                <Home className="h-5 w-5" />
              </Link>
              <Link to="/explore" className={`p-2 rounded-full ${location.pathname === '/explore' ? 'text-slate-900 bg-slate-900/5' : 'text-slate-500'}`}>
                <Compass className="h-5 w-5" />
              </Link>
              <Link to="/create" className={`p-2 rounded-full ${location.pathname === '/create' ? 'text-slate-900 bg-slate-900/5' : 'text-slate-500'}`}>
                <Edit3 className="h-5 w-5" />
              </Link>
              <Link to="/bookmarks" className={`p-2 rounded-full ${location.pathname === '/bookmarks' ? 'text-slate-900 bg-slate-900/5' : 'text-slate-500'}`}>
                <Bookmark className="h-5 w-5" />
              </Link>
              <Link to="/profile" className={`p-2 rounded-full ${location.pathname === '/profile' ? 'text-slate-900 bg-slate-900/5' : 'text-slate-500'}`}>
                <User className="h-5 w-5" />
              </Link>
            </>
          ) : (
            <div className="flex w-full justify-between items-center px-4">
              <span className="text-sm font-bold text-slate-800 tracking-wider logo-font">Blog.it</span>
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-xs font-bold text-slate-500 hover:text-slate-800">Sign In</Link>
                <Link to="/register" className="bg-slate-900 text-black text-xs font-bold px-3 py-1.5 rounded-full">Register</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
