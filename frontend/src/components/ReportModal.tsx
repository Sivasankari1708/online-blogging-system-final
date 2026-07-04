import { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../services/api';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

export function ReportModal({ isOpen, onClose, postId }: ReportModalProps) {
  const [reason, setReason] = useState('SPAM');
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('You must be logged in to report a post.');
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/reports', {
        reporterId: userId,
        reportedPostId: postId,
        reason,
        additionalDetails: details,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setDetails('');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/10 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">Report Post</h2>
        </div>

        {success ? (
          <div className="text-center py-8 text-green-400">
            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mx-auto mb-3">
              ✓
            </div>
            Report submitted successfully.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Reason</label>
              <select
                className="input-field appearance-none"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="SPAM">Spam</option>
                <option value="HARASSMENT">Harassment</option>
                <option value="FAKE_INFORMATION">Fake Information</option>
                <option value="VIOLENCE">Violence</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Additional Details</label>
              <textarea
                className="input-field"
                rows={4}
                placeholder="Please provide more details..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={onClose} className="btn-secondary px-4 py-2 text-sm">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary px-4 py-2 text-sm bg-red-500 hover:bg-red-600 border-none flex items-center gap-2"
                style={{ background: 'rgba(239, 68, 68, 0.9)' }}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
