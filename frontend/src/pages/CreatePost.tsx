import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, FileText, Loader2, Image as ImageIcon, 
  Eye, Edit, Bold, Italic, Link as LinkIcon, Quote, 
  Maximize2, Minimize2, Sparkles
} from 'lucide-react';
import api from '../services/api';

export function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [category, setCategory] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [focusMode, setFocusMode] = useState(false);
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
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create post.');
    } finally {
      setIsLoading(false);
    }
  };

  // Custom simple parser for live markdown preview
  const renderMarkdown = (text: string) => {
    if (!text) return <p className="text-white/30 italic text-sm">Write something first to see live preview...</p>;
    
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-3xl font-extrabold text-white mt-6 mb-3 font-display">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-2xl font-bold text-white mt-5 mb-2 font-display">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-xl font-bold text-white mt-4 mb-2 font-display">{line.substring(4)}</h3>;
      }
      if (line.startsWith('> ')) {
        return <blockquote key={idx} className="border-l-4 border-accent pl-4 italic text-white/80 my-4 bg-white/2 p-2 rounded-r-lg">{line.substring(2)}</blockquote>;
      }
      return <p key={idx} className="text-white/70 leading-relaxed mb-4 text-sm font-light">{line}</p>;
    });
  };

  return (
    <div className="w-full min-h-[85vh] py-6 animate-fade-in relative flex items-center justify-center">
      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-md bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl z-50 flex items-center justify-between shadow-2xl backdrop-blur-md">
          <span className="text-xs font-semibold">{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* CENTERED FLOATING PAPER CANVAS */}
      <motion.div
        animate={{
          maxWidth: focusMode ? '900px' : '760px',
          padding: focusMode ? '3rem' : '2.5rem',
        }}
        className="w-full glass-panel border border-white/10 rounded-3xl shadow-2xl relative z-10 flex flex-col justify-between"
        style={{
          boxShadow: '0 30px 60px -15px rgba(0,0,0,0.9)',
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Header Action row (collapses or dims in focus mode) */}
          <motion.div 
            animate={{ opacity: focusMode ? 0.35 : 1 }}
            className="flex items-center justify-between pb-5 border-b border-white/5"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-accent" />
              <span className="text-xs uppercase font-bold tracking-widest text-white/50 font-display">Drafting studio</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Tab selector */}
              <div className="bg-white/5 p-1 rounded-full flex gap-1 border border-white/5">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase transition-all cursor-pointer ${
                    activeTab === 'write' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Edit className="h-3 w-3 inline mr-1" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase transition-all cursor-pointer ${
                    activeTab === 'preview' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Eye className="h-3 w-3 inline mr-1" /> Preview
                </button>
              </div>

              {/* Focus mode toggle */}
              <button
                type="button"
                onClick={() => setFocusMode(!focusMode)}
                className="p-2 rounded-full hover:bg-white/5 text-white/50 hover:text-white cursor-pointer border border-white/5"
                title={focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
              >
                {focusMode ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === 'write' ? (
              <motion.div
                key="write-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Drag-and-drop cover upload placeholder */}
                <div className="border border-dashed border-white/10 rounded-2xl h-36 flex flex-col items-center justify-center text-white/30 hover:border-white/20 hover:text-white transition-all cursor-pointer group bg-white/2">
                  <div className="p-2.5 bg-white/5 rounded-full mb-1 group-hover:scale-105 transition-transform border border-white/5">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wide uppercase">Assign Cover Image</span>
                </div>

                {/* Big Title text area */}
                <div>
                  <textarea
                    rows={1}
                    required
                    placeholder="Untitled Publication"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    className="w-full bg-transparent border-none text-3xl sm:text-5xl font-extrabold text-white placeholder:text-white/10 focus:outline-none focus:ring-0 resize-none font-display leading-tight"
                  />
                </div>

                {/* Categories & Tags row */}
                <div className="flex flex-col md:flex-row gap-4 py-2 border-y border-white/5">
                  <div className="flex-1">
                    <select 
                      className="input-field appearance-none"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="" disabled>Choose Category...</option>
                      <option value="technology">Technology</option>
                      <option value="science">Science</option>
                      <option value="design">Design</option>
                      <option value="culture">Culture</option>
                      <option value="ai">Artificial Intelligence</option>
                    </select>
                  </div>
                  <div className="flex-[2]">
                    <input
                      type="text"
                      className="input-field"
                      placeholder="comma separated tags (e.g. react, design, ai)"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                    />
                  </div>
                </div>

                {/* Text Area Writing Canvas */}
                <div className="relative">
                  <textarea
                    required
                    rows={12}
                    className="w-full bg-transparent border-none text-white/80 placeholder:text-white/15 focus:outline-none focus:ring-0 resize-y text-base leading-relaxed font-light"
                    placeholder="Begin your story..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-[40vh] py-4"
              >
                {/* Title Preview */}
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 font-display leading-tight">
                  {title || <span className="text-white/10 italic">Untitled Story</span>}
                </h1>
                
                {/* Content Preview */}
                <div className="prose prose-invert max-w-none">
                  {renderMarkdown(content)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BOTTOM FLOATING FORMATTING & ACTION TOOLBAR */}
          <motion.div 
            animate={{
              y: focusMode ? 40 : 0,
              opacity: focusMode ? 0.2 : 1
            }}
            whileHover={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between pt-6 border-t border-white/5"
          >
            {/* Formatting shortcuts */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2 rounded-full">
              <button type="button" className="text-white/60 hover:text-white p-1" title="Bold"><Bold className="h-3.5 w-3.5" /></button>
              <button type="button" className="text-white/60 hover:text-white p-1" title="Italic"><Italic className="h-3.5 w-3.5" /></button>
              <button type="button" className="text-white/60 hover:text-white p-1" title="Link"><LinkIcon className="h-3.5 w-3.5" /></button>
              <button type="button" className="text-white/60 hover:text-white p-1" title="Blockquote"><Quote className="h-3.5 w-3.5" /></button>
            </div>

            {/* Submit & Draft buttons */}
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => setIsDraft(!isDraft)} 
                className={`text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-full border transition-all cursor-pointer ${
                  isDraft 
                    ? 'bg-[#161616] text-accent border-accent/30' 
                    : 'bg-transparent text-white/60 border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="h-3.5 w-3.5 inline mr-1" />
                {isDraft ? 'Draft Status' : 'Save as Draft'}
              </button>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-white text-black text-xs font-bold px-6 py-2.5 rounded-full hover:bg-white/90 hover:scale-102 transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-white/5"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Publish Story</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

        </form>
      </motion.div>
    </div>
  );
}
