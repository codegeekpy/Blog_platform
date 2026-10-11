import { useState, useEffect, useCallback } from 'react';
import PostCard from '../components/PostCard';
import api from '../api/axios';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [page, setPage] = useState(1);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append('search', search);
      const { data } = await api.get(`/posts?${params}`);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">The Blog</h1>
        <p className="text-sm text-gray-500">
          {pagination.total > 0 ? `${pagination.total} posts published` : 'No posts yet'}
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <input
          id="search-input"
          type="text"
          className="input flex-1"
          placeholder="Search posts…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="btn-outline px-4">
          Search
        </button>
        {search && (
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer bg-transparent border-0"
            onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
          >
            Clear
          </button>
        )}
      </form>

      {search && (
        <p className="text-sm text-gray-500 mb-4">
          Results for <span className="font-medium text-gray-800">"{search}"</span> — {pagination.total} found
        </p>
      )}

      {/* Posts */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-6 border-b border-gray-200 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-full mb-1" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm">
            {search ? 'No posts match your search.' : 'No posts yet. Be the first to write!'}
          </p>
        </div>
      ) : (
        <>
          <div>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-between text-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-gray-600 hover:text-gray-900 disabled:text-gray-300 cursor-pointer bg-transparent border-0 text-sm p-0"
              >
                ← Previous
              </button>
              <span className="text-gray-500">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="text-gray-600 hover:text-gray-900 disabled:text-gray-300 cursor-pointer bg-transparent border-0 text-sm p-0"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
