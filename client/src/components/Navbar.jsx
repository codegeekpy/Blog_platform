import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-gray-900 tracking-tight">
          The Blog
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {user ? (
            <>
              <Link
                to="/new-post"
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                Write
              </Link>
              <Link
                to={`/profile`}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                {user.username}
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-900 transition-colors cursor-pointer bg-transparent border-0 text-sm p-0"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-gray-900 transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm px-3 py-1.5 rounded"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
