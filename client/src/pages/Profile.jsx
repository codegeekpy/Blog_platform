import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import api from '../api/axios';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [bio, setBio] = useState(user?.bio || '');
  const [editingBio, setEditingBio] = useState(false);
  const [savingBio, setSavingBio] = useState(false);
  const [bioError, setBioError] = useState('');
  const [bioSuccess, setBioSuccess] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchPosts = async () => {
      try {
        const { data } = await api.get(`/posts/user/${user._id}`);
        setPosts(data.posts);
      } catch {
        // ignore
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, [user]);

  const handleSaveBio = async () => {
    setBioError('');
    setBioSuccess('');
    setSavingBio(true);
    try {
      await updateProfile(bio);
      setBioSuccess('Bio updated.');
      setEditingBio(false);
    } catch {
      setBioError('Failed to update bio.');
    } finally {
      setSavingBio(false);
    }
  };

  if (!user) return null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-10">
        <h1 className="text-xl font-semibold text-gray-900 mb-0.5">{user.username}</h1>
        <p className="text-sm text-gray-500 mb-4">{user.email}</p>

        {/* Bio */}
        {editingBio ? (
          <div>
            <textarea
              id="bio-input"
              className="input text-sm resize-none"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
              placeholder="Tell us about yourself…"
            />
            <p className="text-xs text-gray-400">{bio.length}/200</p>
            {bioError && <p className="error-msg">{bioError}</p>}
            <div className="flex gap-3 mt-2">
              <button onClick={handleSaveBio} disabled={savingBio} className="btn-primary text-xs px-3 py-1">
                {savingBio ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={() => { setEditingBio(false); setBio(user?.bio || ''); }}
                className="text-xs text-gray-500 hover:text-gray-800 cursor-pointer bg-transparent border-0 p-0"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-700 mb-1">
              {user.bio || <span className="text-gray-400 italic">No bio yet.</span>}
            </p>
            {bioSuccess && <p className="success-msg mb-1">{bioSuccess}</p>}
            <button
              onClick={() => { setEditingBio(true); setBioSuccess(''); }}
              className="text-xs text-gray-500 underline cursor-pointer bg-transparent border-0 p-0"
            >
              {user.bio ? 'Edit bio' : 'Add bio'}
            </button>
          </div>
        )}
      </div>

      {/* Posts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Your posts ({posts.length})
          </h2>
          <Link to="/new-post" className="btn-primary text-xs px-3 py-1.5">
            Write new
          </Link>
        </div>

        {loadingPosts ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-4 border-b border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-sm text-gray-400">
            You haven&apos;t written any posts yet.{' '}
            <Link to="/new-post" className="text-gray-900 underline">
              Write your first post
            </Link>
          </p>
        ) : (
          <div>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
