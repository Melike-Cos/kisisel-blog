import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  // Post ID'sini kontrol et
  const postId = post?.id;
  
  console.log('PostCard render:', { postId, post });

  if (!postId) {
    console.warn('Post ID bulunamadı:', post);
    return null; // ID yoksa kartı gösterme
  }

  const title = post.name || post.title || 'Başlıksız Yazı';
  const summary = post.description || post.summary || 'İçerik bulunamadı...';
  const author = 'Admin';
  const imageUrl = post.imageUrl || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800';
  
  const shortSummary = summary.length > 150 
    ? summary.substring(0, 150) + '...' 
    : summary;

  return (
    <div className="post-card">
      <img src={imageUrl} alt={title} className="post-image" />
      <div className="post-content">
        <h3 className="post-title">{title}</h3>
        <p className="post-summary">{shortSummary}</p>
        <div className="post-meta">
          <span className="post-author">Yazar: {author}</span>
        </div>
        {/* Link'te ID'nin olduğundan emin ol */}
        <Link to={`/posts/${postId}`} className="read-more">
          Devamını Oku →
        </Link>
      </div>
    </div>
  );
};

export default PostCard;