import { useState, useEffect } from 'react';
import { getPosts } from '../api/blogAPI';
import PostCard from '../components/PostCard';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      console.log('HomePage gelen veri:', data);
      
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setPosts([]);
      }
      
    } catch (err) {
      console.error('Hata:', err);
      setError('Yazılar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Yazılar yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={loadPosts} className="retry-button">
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <h1>Blog Yazıları</h1>
      
      {posts.length === 0 ? (
        <p className="no-posts">Henüz hiç blog yazısı yok.</p>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;