import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import api from '../api/axios';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Minimal markdown-like renderer for plain text
function renderContent(content) {
  return content;
}

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data.post);
      } catch (err) {
        setError(err.response?.data?.message || (err.response?.status === 404 ? 'Post not found.' : 'Failed to load post.'));
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This action cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch {
      alert('Failed to delete post.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-6" />
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-3 bg-gray-200 rounded w-40 mb-8" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-3 bg-gray-200 rounded w-full" />
          ))}
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-sm text-red-500">{error || 'Post not found.'}</p>
        <Link to="/" className="text-sm text-gray-500 underline mt-2 inline-block">
          Back to home
        </Link>
      </main>
    );
  }

  const isAuthor = user && user._id === post.author?._id;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link to="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
        ← All posts
      </Link>

      <article className="mt-6">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight mb-3">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium text-gray-800">{post.author?.username}</span>
            <span>·</span>
            <span>{formatDate(post.createdAt)}</span>
            {post.updatedAt !== post.createdAt && (
              <>
                <span>·</span>
                <span>Updated {formatDate(post.updatedAt)}</span>
              </>
            )}
          </div>

          {isAuthor && (
            <div className="flex items-center gap-4 text-sm">
              <Link
                to={`/edit-post/${post._id}`}
                className="text-gray-600 hover:text-gray-900 underline"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-500 hover:text-red-700 underline cursor-pointer bg-transparent border-0 text-sm p-0"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="post-content">
          {renderContent(post.content).split('\n').map((line, i) => (
            line === '' ? <br key={i} /> : <p key={i}>{line}</p>
          ))}
        </div>
      </article>

      <div className="divider mt-12" />

      {/* Comments */}
      <CommentSection postId={id} />
    </main>
  );
}
