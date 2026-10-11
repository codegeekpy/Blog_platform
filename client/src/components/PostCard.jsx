import { Link } from 'react-router-dom';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function PostCard({ post }) {
  return (
    <article className="py-6 border-b border-gray-200 last:border-0">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <span>{post.author?.username || 'Unknown'}</span>
        <span>·</span>
        <span>{formatDate(post.createdAt)}</span>
        {post.commentCount !== undefined && (
          <>
            <span>·</span>
            <span>{post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}</span>
          </>
        )}
      </div>

      <Link to={`/post/${post._id}`} className="block group">
        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors mb-1">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        )}
      </Link>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
