import { Outlet, Link } from 'react-router-dom';
import { FloatingCapsuleNav } from './FloatingCapsuleNav';
import { SmoothScroll } from './SmoothScroll';

export function MainLayout() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#0A0A0A] text-[#D1D5DB] font-sans antialiased relative selection:bg-white selection:text-black flex flex-col">
        {/* Cinematic Film-Grain Texture Overlay */}
        <div className="grain-overlay" />

        {/* Ambient volumetric background glow gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-highlight-blue/5 rounded-full blur-[140px] pointer-events-none z-0" />

        {/* Dynamic Translucent Floating Capsule Nav */}
        <FloatingCapsuleNav />

        {/* Primary Page Outlet Container */}
        <main className="pt-24 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 w-full flex-grow">
          <Outlet />
        </main>

        {/* Brand Footer (Mockup 3) */}
        <footer className="w-full border-t border-slate-900/5 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 mt-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl logo-font">Blog.it</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 font-medium">
              <Link to="#" className="hover:text-slate-900 transition-colors">About</Link>
              <Link to="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
              <Link to="#" className="hover:text-slate-900 transition-colors">Terms</Link>
              <Link to="#" className="hover:text-slate-900 transition-colors">Contact</Link>
              <Link to="#" className="hover:text-slate-900 transition-colors">RSS</Link>
            </div>
            
            <div className="text-xs text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} Blog.it &mdash; Editorial Excellence.
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
