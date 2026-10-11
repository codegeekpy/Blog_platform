import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function CommentItem({ comment, onDelete, onEdit }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isOwner = user && user._id === comment.author?._id;

  const handleSave = async () => {
    if (!editContent.trim()) return;
    setSaving(true);
    setError('');
    try {
      await onEdit(comment._id, editContent.trim());
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update comment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-medium text-gray-800">{comment.author?.username}</span>
          <span>·</span>
          <span>{formatDate(comment.createdAt)}</span>
        </div>
        {isOwner && !editing && (
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setEditing(true)}
              className="text-gray-500 hover:text-gray-800 cursor-pointer bg-transparent border-0 p-0 text-xs"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(comment._id)}
              className="text-red-500 hover:text-red-700 cursor-pointer bg-transparent border-0 p-0 text-xs"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div>
          <textarea
            className="input resize-none text-sm"
            rows={3}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          {error && <p className="error-msg">{error}</p>}
          <div className="flex gap-3 mt-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary text-xs px-3 py-1">
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => { setEditing(false); setEditContent(comment.content); }}
              className="text-xs text-gray-500 hover:text-gray-800 cursor-pointer bg-transparent border-0 p-0"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
      )}
    </div>
  );
}

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch comments on mount
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/comments/post/${postId}`);
        setComments(data.comments);
      } catch {
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post(`/comments/post/${postId}`, {
        content: newComment.trim(),
      });
      setComments((prev) => [...prev, data.comment]);
      setNewComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      alert('Failed to delete comment');
    }
  };

  const handleEdit = async (commentId, content) => {
    const { data } = await api.put(`/comments/${commentId}`, { content });
    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? data.comment : c))
    );
  };

  return (
    <section className="mt-12">
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h2>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            id="new-comment"
            className="input resize-none text-sm"
            rows={3}
            placeholder="Write a comment…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          {error && <p className="error-msg">{error}</p>}
          <div className="mt-2 flex justify-end">
            <button type="submit" disabled={submitting || !newComment.trim()} className="btn-primary text-sm px-4 py-1.5">
              {submitting ? 'Posting…' : 'Post comment'}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-500 mb-6">
          <a href="/login" className="text-gray-900 underline">Log in</a> to leave a comment.
        </p>
      )}

      {/* Comments List */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-400">No comments yet. Be the first!</p>
      ) : (
        <div>
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </section>
  );
}
