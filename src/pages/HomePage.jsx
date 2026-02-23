import { useState, useEffect } from 'react';
import { getPosts } from '../api/blogService';
import PostCard from '../components/PostCard';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);   // ✅ EKLENDİ

  useEffect(() => {
    loadPosts({ pageNumber: 1, pageSize: 12 });
  }, []);

  const loadPosts = async (params = { pageNumber: 1, pageSize: 12 }) => {
    try {
      setLoading(true);
      setError(null);                          // ✅ EKLENDİ
      const data = await getPosts(params);
      setPosts(data);
    } catch (err) {
      console.error('Hata:', err);
      setError("Veriler yüklenemedi.");        // ✅ EKLENDİ
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
        <button
          onClick={() => loadPosts({ pageNumber: 1, pageSize: 12 })}
          className="retry-button"
        >
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
