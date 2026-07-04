import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, FileText, Loader2, Image as ImageIcon, Tags, List } from 'lucide-react';
import api from '../services/api';

export function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [category, setCategory] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const userId = localStorage.getItem('userId');
    const authorName = localStorage.getItem('username');

    if (!userId) {
      setError('You must be logged in to create a post.');
      setIsLoading(false);
      return;
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');

    try {
      const response = await api.post('/posts', {
        title,
        content,
        authorId: userId,
        authorName: authorName,
        tags,
        isDraft
      });
      navigate(`/post/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in py-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex items-center justify-between shadow-lg">
          {error}
          <button onClick={() => setError('')} className="text-red-400 hover:text-white transition-colors">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-8 sm:p-10 shadow-2xl">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl font-bold text-text-main">Create a New Post</h1>
            <p className="text-text-muted mt-1">Share your knowledge with the developer community.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button type="button" className="btn-secondary">Preview</button>
            <button type="button" onClick={() => setIsDraft(!isDraft)} className={`btn-secondary ${isDraft ? 'border-primary text-primary bg-primary/10' : ''}`}>
              <FileText className="h-4 w-4" /> Save as Draft
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary px-6">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-4 w-4" /> Publish</>}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Cover Image Upload (UI Only) */}
          <div className="border-2 border-dashed border-border rounded-2xl h-40 flex flex-col items-center justify-center text-text-muted hover:border-primary hover:bg-surface/50 hover:text-primary transition-colors cursor-pointer group">
            <div className="p-3 bg-surface rounded-full mb-2 group-hover:scale-110 transition-transform">
              <ImageIcon className="h-6 w-6" />
            </div>
            <span className="font-medium">Add a cover image</span>
          </div>

          {/* Title */}
          <div>
            <input
              type="text"
              required
              className="w-full bg-transparent border-none text-4xl sm:text-5xl font-extrabold text-text-main placeholder:text-border focus:outline-none focus:ring-0"
              placeholder="Post Title here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Meta Details Row */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-bold text-text-muted mb-2 flex items-center gap-2">
                <List className="h-4 w-4" /> Category
              </label>
              <select 
                className="input-field appearance-none bg-surface/50"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>Select a category...</option>
                <option value="technology">Technology</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="career">Career</option>
              </select>
            </div>
            <div className="flex-[2]">
              <label className="block text-sm font-bold text-text-muted mb-2 flex items-center gap-2">
                <Tags className="h-4 w-4" /> Tags
              </label>
              <input
                type="text"
                className="input-field bg-surface/50"
                placeholder="react, typescript, webdev (comma separated)"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          {/* Editor */}
          <div>
            <label className="block text-sm font-bold text-text-muted mb-2">Content</label>
            <div className="relative">
              {/* Minimal Formatting Toolbar */}
              <div className="absolute top-0 left-0 w-full h-12 bg-surface/80 backdrop-blur-sm border-b border-border rounded-t-xl flex items-center px-4 gap-4">
                <button type="button" className="text-text-muted hover:text-white font-bold">B</button>
                <button type="button" className="text-text-muted hover:text-white italic font-serif">I</button>
                <div className="w-px h-4 bg-border"></div>
                <button type="button" className="text-text-muted hover:text-white text-sm hover:underline">Link</button>
                <button type="button" className="text-text-muted hover:text-white text-sm">Quote</button>
              </div>
              <textarea
                required
                rows={16}
                className="w-full bg-surface/30 border border-border rounded-xl p-6 pt-16 text-text-main placeholder:text-border/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y font-mono text-sm leading-relaxed"
                placeholder="Write your amazing story here... (Markdown is supported)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="sm:hidden flex flex-col gap-3 pt-4 border-t border-border">
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Publish Post'}
            </button>
            <button type="button" onClick={() => setIsDraft(!isDraft)} className="btn-secondary w-full py-3">
              Save as Draft
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
