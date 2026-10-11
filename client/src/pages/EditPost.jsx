import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function EditPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        const post = data.post;

        if (user && user._id !== post.author?._id) {
          navigate(`/post/${id}`);
          return;
        }

        setForm({
          title: post.title,
          content: post.content,
          tags: post.tags ? post.tags.join(', ') : '',
        });
      } catch {
        setError('Failed to load post.');
      } finally {
        setFetching(false);
      }
    };
    fetchPost();
  }, [id, user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.put(`/posts/${id}`, {
        title: form.title.trim(),
        content: form.content.trim(),
        tags: form.tags,
      });
      navigate(`/post/${data.post._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-6" />
        <div className="h-10 bg-gray-200 rounded mb-4" />
        <div className="h-64 bg-gray-200 rounded" />
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Edit post</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="form-group">
          <label htmlFor="title" className="label">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            className="input text-lg font-medium"
            placeholder="Post title…"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="label">Content</label>
          <textarea
            id="content"
            name="content"
            className="input resize-y font-mono text-sm"
            rows={18}
            placeholder="Write your post here…"
            value={form.content}
            onChange={handleChange}
            required
          />
          <p className="text-xs text-gray-400 mt-1">{form.content.length} characters</p>
        </div>

        <div className="form-group">
          <label htmlFor="tags" className="label">Tags</label>
          <input
            id="tags"
            name="tags"
            type="text"
            className="input"
            placeholder="javascript, react, web (comma-separated)"
            value={form.tags}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" id="edit-post-submit" disabled={loading} className="btn-primary px-6 py-2">
            {loading ? 'Saving…' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/post/${id}`)}
            className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer bg-transparent border-0 p-0"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
