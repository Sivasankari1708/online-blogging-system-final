import { useEffect, useState } from 'react';
import { 
  User, Settings, 
  MapPin, Link as LinkIcon, Calendar, Edit3
} from 'lucide-react';
import api from '../services/api';

export function Profile() {
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  
  const currentUserId = localStorage.getItem('userId');
  const currentUserName = localStorage.getItem('username');

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        const [followersRes, followingRes] = await Promise.all([
          api.get(`/social/followers/${currentUserId}/count`),
          api.get(`/social/following/${currentUserId}/count`)
        ]);
        setFollowers(followersRes.data.count);
        setFollowing(followingRes.data.count);
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
      <div className="max-w-4xl mx-auto py-20 flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-muted">Loading profile...</p>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="max-w-md mx-auto py-20 text-center card p-8 mt-10">
        <User className="h-12 w-12 mx-auto text-text-muted mb-4" />
        <h2 className="text-2xl font-bold mb-2">Not Logged In</h2>
        <p className="text-text-muted mb-6">Please sign in to view your profile.</p>
        <a href="/login" className="btn-primary w-full">Sign In</a>
      </div>
    );
  }

  const tabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'drafts', label: 'Drafts' },
    { id: 'bookmarks', label: 'Bookmarks' },
    { id: 'liked', label: 'Liked Posts' },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Profile Header (Cover & Info) */}
      <div className="card overflow-hidden mb-8 border-none bg-surface/50">
        {/* Cover Banner */}
        <div className="h-48 md:h-64 w-full bg-gradient-to-r from-primary to-accent relative">
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Edit Cover Button (Decorative) */}
          <button className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-lg backdrop-blur-sm transition-colors text-sm flex items-center gap-2">
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {/* Profile Info Section */}
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 sm:-mt-20 mb-6 gap-4">
            {/* Avatar */}
            <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-surface border-4 border-background flex items-center justify-center shadow-xl relative z-10 overflow-hidden">
              <div className="h-full w-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-black text-6xl font-bold">
                {currentUserName?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full sm:w-auto">
              <button className="btn-secondary flex-1 sm:flex-none">
                <Settings className="h-4 w-4" /> Edit Profile
              </button>
            </div>
          </div>

          {/* User Details */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-text-main mb-1">{currentUserName}</h1>
            <p className="text-text-muted text-lg mb-4">Tech Enthusiast & Software Developer</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-6">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> San Francisco, CA
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" /> <a href="#" className="text-primary hover:underline">github.com/{currentUserName?.toLowerCase()}</a>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Joined July 2026
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-text-main">{followers}</span>
                <span className="text-sm text-text-muted">Followers</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-text-main">{following}</span>
                <span className="text-sm text-text-muted">Following</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-text-main">0</span>
                <span className="text-sm text-text-muted">Posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border mb-8 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-main hover:border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Grid / Empty State */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Responsive Card Grid would go here. Showing empty state for now. */}
        <div className="col-span-full py-20 flex flex-col items-center justify-center card bg-surface/30 border-dashed border-2 border-border text-center">
          <div className="h-16 w-16 bg-surface rounded-2xl flex items-center justify-center text-text-muted mb-4 shadow-sm border border-border">
            <Edit3 className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-text-main mb-2">No {tabs.find(t => t.id === activeTab)?.label?.toLowerCase()} yet</h3>
          <p className="text-text-muted mb-6 max-w-md">
            When you publish {tabs.find(t => t.id === activeTab)?.label?.toLowerCase()}, they will appear here on your profile.
          </p>
          <a href="/create" className="btn-primary">
            Write a Post
          </a>
        </div>
      </div>
    </div>
  );
}
