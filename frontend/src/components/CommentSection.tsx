import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import api from '../services/api';

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentUserId = localStorage.getItem('userId');
  const currentUserName = localStorage.getItem('username');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/post/${postId}`);
        setComments(res.data);
      } catch (err) {
        console.error('Failed to fetch comments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    if (!currentUserId) {
      setError('You must be logged in to comment.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/comments', {
        postId,
        authorId: currentUserId,
        authorName: currentUserName,
        content: newComment,
      });
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500 animate-pulse">Loading comments...</div>;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-blue-400" />
        <h3 className="text-2xl font-bold">Comments ({comments.length})</h3>
      </div>

      {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-10 relative">
        <textarea
          className="input-field pr-16"
          rows={3}
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className="absolute right-3 bottom-3 p-2 rounded-full bg-blue-500 text-white disabled:opacity-50 hover:bg-blue-600 transition-colors"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="glass p-5 rounded-xl border border-white/5 animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gray-600 to-gray-400 flex items-center justify-center text-white font-bold text-sm">
                {comment.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-sm text-gray-200">{comment.authorName}</div>
                <div className="text-xs text-gray-500">{format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap pl-11">
              {comment.content}
            </p>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-10 text-gray-500 glass rounded-xl border-dashed border-2 border-white/10">
            No comments yet. Start the conversation!
          </div>
        )}
      </div>
    </div>
  );
}
