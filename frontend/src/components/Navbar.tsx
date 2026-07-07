import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Compass, Edit3, Bookmark, 
  Bell, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { isAuthenticated, logout, username } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '/create', icon: Edit3, label: 'Write' },
    { to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl logo-font">
            Blog.it
          </span>
        </Link>
        
        {/* Navigation Links - Center (Desktop) */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link 
                  key={link.to} 
                  to={link.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-surface text-primary' 
                      : 'text-text-muted hover:text-text-main hover:bg-surface/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Link 
                to="/notifications" 
                className="btn-ghost relative p-2"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </Link>
              
              <div className="w-px h-6 bg-border mx-2 hidden sm:block"></div>
              
              {/* Profile */}
              <Link 
                to="/profile" 
                className="btn-ghost flex items-center gap-2"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-xs font-bold text-black border border-border">
                  {username ? username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-medium hidden sm:block">Profile</span>
              </Link>

              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="btn-ghost text-red-400 hover:text-red-300 hover:bg-red-500/10"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
