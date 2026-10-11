import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function NewPost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/posts', {
        title: form.title.trim(),
        content: form.content.trim(),
        tags: form.tags,
      });
      navigate(`/post/${data.post._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">New post</h1>

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
            autoFocus
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
          <p className="text-xs text-gray-400 mt-1">
            {form.content.length} characters
          </p>
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
          <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" id="create-post-submit" disabled={loading} className="btn-primary px-6 py-2">
            {loading ? 'Publishing…' : 'Publish post'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer bg-transparent border-0 p-0"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
