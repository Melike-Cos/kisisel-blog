import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById, deletePost } from '../api/blogAPI';
import { useAuth } from '../context/AuthContext';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    console.log('PostDetailPage - ID:', id);
    
    if (!id) {
      setError('Geçersiz yazı ID\'si');
      setLoading(false);
      return;
    }

    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      console.log('Yazı getiriliyor, ID:', id);
      
      const data = await getPostById(id);
      console.log('Gelen veri:', data);
      
      setPost(data);
      setError(null);
    } catch (err) {
      console.error('Hata:', err);
      setError('Yazı yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;

    try {
      setDeleteLoading(true);
      await deletePost(id);
      navigate('/');
    } catch (err) {
      alert('Yazı silinirken bir hata oluştu');
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Yazı yükleniyor...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="error-container">
        <p className="error-message">{error || 'Yazı bulunamadı'}</p>
        <Link to="/" className="back-home">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  const title = post.name || post.title || 'Başlıksız Yazı';
  const content = post.description || post.content || 'İçerik bulunamadı...';
  const imageUrl = post.imageUrl || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800';
  const publishDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR');

  return (
    <div className="post-detail">
      {isAdmin() && (
        <div className="admin-actions">
          <Link to={`/edit-post/${id}`} className="edit-button">
            ✏️ Düzenle
          </Link>
          <button 
            onClick={handleDelete} 
            className="delete-button"
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Siliniyor...' : '🗑️ Sil'}
          </button>
        </div>
      )}

      <article className="post-article">
        <h1>{title}</h1>
        
        <div className="post-meta">
          <span>✍️ Admin</span>
          <span>📅 {publishDate}</span>
          <span>🏷️ Yazılım</span>
        </div>

        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={title} 
            className="post-image-large"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800';
            }}
          />
        )}

        <div className="post-content-text">
          {content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph || <br />}</p>
          ))}
        </div>
      </article>
    </div>
  );
};

// *** BU SATIR ÇOK ÖNEMLİ!  Olmayınca***
export default PostDetailPage;